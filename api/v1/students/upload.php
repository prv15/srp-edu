<?php

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../middleware/authenticate.php';
require_once __DIR__ . '/../../middleware/authorize.php';

try {
    $user = authenticatedUser($db);
    requireCsrf();
    requirePermission($db, $user, "students.import");

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    if (!isset($_FILES['file'])) {
        throw new Exception('Please select an Excel file.');
    }

    if (!isset($_POST['institute_id']) || empty($_POST['institute_id'])) {
        throw new Exception('Institute is required.');
    }

    if (!isset($_POST['session_id']) || empty($_POST['session_id'])) {
        throw new Exception('Academic session is required.');
    }
    $instituteId = (int)$_POST["institute_id"];
    $sessionId = (int)$_POST["session_id"];
    requireInstituteAccess($db, $user, $instituteId);

    $sessionStatement = $db->prepare(
        "SELECT 1 FROM academic_sessions
         WHERE id = :session_id AND institute_id = :institute_id LIMIT 1"
    );
    $sessionStatement->execute([
        ":session_id" => $sessionId,
        ":institute_id" => $instituteId,
    ]);
    if (!$sessionStatement->fetchColumn()) {
        throw new Exception("Academic session does not belong to this institute.");
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('File upload failed.');
    }

    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($extension, ['xls', 'xlsx'], true)) {
        throw new Exception('Only Excel files are allowed.');
    }
    if ($file["size"] <= 0 || $file["size"] > 10 * 1024 * 1024) {
        throw new Exception("The spreadsheet must be smaller than 10 MB.");
    }

    $uploadDir = __DIR__ . '/../../uploads/excel/temp/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $pdo->beginTransaction();

    /*
    |--------------------------------------------------------------------------
    | Create Batch Record
    |--------------------------------------------------------------------------
    */

    $batchName = 'IMPORT-' . date('YmdHis');

    $stmt = $pdo->prepare("
        INSERT INTO import_batches
        (
            institute_id,
            session_id,
            batch_name,
            file_name,
            total_records,
            imported_records,
            duplicate_records,
            failed_records,
            imported_by,
            imported_at
        )
        VALUES
        (
            :institute_id,
            :session_id,
            :batch_name,
            '',
            0,
            0,
            0,
            0,
            :imported_by,
            NOW()
        )
    ");

    $stmt->execute([
        ':institute_id' => $instituteId,
        ':session_id'   => $sessionId,
        ':batch_name'   => $batchName,
        ':imported_by'  => $user["id"]
    ]);

    $batchId = (int)$pdo->lastInsertId();

    /*
    |--------------------------------------------------------------------------
    | Save File
    |--------------------------------------------------------------------------
    */

    $storedFile = "batch_{$batchId}.{$extension}";

    if (!move_uploaded_file(
        $file['tmp_name'],
        $uploadDir . $storedFile
    )) {
        throw new Exception('Unable to save uploaded file.');
    }

    /*
    |--------------------------------------------------------------------------
    | Update File Name
    |--------------------------------------------------------------------------
    */

    $stmt = $pdo->prepare("
        UPDATE import_batches
        SET file_name = :file_name
        WHERE id = :id
    ");

    $stmt->execute([
        ':file_name' => $storedFile,
        ':id' => $batchId
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully.',
        'data' => [
            'batch_id' => $batchId,
            'batch_name' => $batchName,
            'file_name' => $storedFile
        ]
    ]);

} catch (Throwable $e) {

    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to upload this spreadsheet.'
    ]);
}
