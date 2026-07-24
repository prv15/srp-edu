<?php

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/ExcelImporter.php';
require_once __DIR__ . '/../../helpers/AdmissionRegisterMapper.php';
require_once __DIR__ . '/../../helpers/StudentValidator.php';
require_once __DIR__ . '/../../helpers/StudentImportService.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../middleware/authenticate.php';
require_once __DIR__ . '/../../middleware/authorize.php';

use Helpers\StudentImportService;

try {
    $user = authenticatedUser($db);
    requireCsrf();
    requirePermission($db, $user, "students.import");

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (
        !is_array($input) ||
        empty($input['batch_id'])
    ) {
        throw new Exception('Batch ID is required.');
    }

    $batchId = (int)$input['batch_id'];

    /*
    |--------------------------------------------------------------------------
    | Find Batch
    |--------------------------------------------------------------------------
    */

    $stmt = $pdo->prepare("
        SELECT *
        FROM import_batches
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->execute([$batchId]);

    $batch = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$batch) {
        throw new Exception('Import batch not found.');
    }
    requireInstituteAccess($db, $user, (int)$batch["institute_id"]);

    /*
    |--------------------------------------------------------------------------
    | File Exists?
    |--------------------------------------------------------------------------
    */

    $file = __DIR__
        . '/../../uploads/excel/temp/'
        . $batch['file_name'];

    if (!file_exists($file)) {
        throw new Exception('Uploaded file not found.');
    }

    /*
    |--------------------------------------------------------------------------
    | Preview
    |--------------------------------------------------------------------------
    */

    $sessionStatement = $db->prepare(
        "SELECT session_name FROM academic_sessions
         WHERE id = :session_id AND institute_id = :institute_id LIMIT 1"
    );
    $sessionStatement->execute([
        ":session_id" => $batch["session_id"],
        ":institute_id" => $batch["institute_id"],
    ]);
    $sessionName = (string)$sessionStatement->fetchColumn();
    if ($sessionName === "") {
        throw new Exception("Academic session is invalid.");
    }

    $service = new StudentImportService();

    $result = $service->preview(
        $file,
        (int)$batch["institute_id"],
        $sessionName
    );

    /*
    |--------------------------------------------------------------------------
    | Update Batch Statistics
    |--------------------------------------------------------------------------
    */

    $total = count($result['students']);

    $ready = 0;
    $failed = 0;

    foreach ($result['students'] as $student) {

        if ($student['status'] === 'Ready') {
            $ready++;
        } else {
            $failed++;
        }

    }

    $stmt = $pdo->prepare("
        UPDATE import_batches
        SET
            total_records = ?,
            failed_records = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $total,
        $failed,
        $batchId
    ]);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    echo json_encode([

        'success' => true,

        'batch' => [

            'id' => $batchId,

            'batch_name' => $batch['batch_name'],

            'total_records' => $total,

            'ready_records' => $ready,

            'failed_records' => $failed

        ],

        'summary' => $result['summary'],

        'students' => $result['students']

    ]);

} catch (Throwable $e) {

    http_response_code(400);

    echo json_encode([

        'success' => false,

        'message' => 'Unable to preview this import batch.'

    ]);

}
