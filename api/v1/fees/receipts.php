<?php

declare(strict_types=1);

header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../config/config.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/response.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";

try {
    $instituteId = isset($_GET["institute_id"]) ? (int)$_GET["institute_id"] : 0;
    $studentId = isset($_GET["student_id"]) ? (int)$_GET["student_id"] : 0;
    if ($studentId <= 0) {
        error("Student ID is required.", 422);
    }

    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "fees.view");

    $statement = $db->prepare(
        "SELECT
            receipt.id,
            receipt.receipt_no,
            receipt.receipt_template,
            receipt.issued_at,
            receipt.payment_mode,
            receipt.transaction_id,
            receipt.paid_amount,
            receipt.balance_amount,
            receipt.remarks,
            session.session_name,
            semester.name AS semester_name
         FROM fee_receipts receipt
         INNER JOIN students student
            ON student.id = receipt.student_id
            AND student.institute_id = receipt.institute_id
         LEFT JOIN academic_sessions session
            ON session.id = receipt.academic_session_id
         LEFT JOIN course_semesters semester
            ON semester.id = receipt.semester_id
         WHERE receipt.institute_id = :institute
           AND receipt.student_id = :student
         ORDER BY receipt.issued_at DESC, receipt.id DESC"
    );
    $statement->execute([
        ":institute" => $instituteId,
        ":student" => $studentId,
    ]);

    success($statement->fetchAll());
} catch (Throwable $exception) {
    serverError($exception);
}
