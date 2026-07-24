<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";

try {
    $instituteId = (int)($_GET["institute_id"] ?? 0);
    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "dashboard.view");

    $totals = $db->prepare(
        "SELECT
            COUNT(*) AS students,
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS active_students,
            SUM(CASE WHEN YEAR(admission_date) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS admissions_this_year,
            SUM(CASE WHEN gender IS NOT NULL AND gender <> '' THEN 1 ELSE 0 END) AS gender_recorded
         FROM students
         WHERE institute_id = :institute_id"
    );
    $totals->execute([":institute_id" => $instituteId]);

    $recent = $db->prepare(
        "SELECT s.id, s.student_name, s.admission_no, s.admission_date, s.status,
                c.course_name, a.session_name
         FROM students s
         LEFT JOIN courses c ON c.id = s.course_id
         LEFT JOIN academic_sessions a ON a.id = s.session_id
         WHERE s.institute_id = :institute_id
         ORDER BY s.admission_date DESC, s.id DESC
         LIMIT 5"
    );
    $recent->execute([":institute_id" => $instituteId]);

    success([
        "stats" => $totals->fetch() ?: [],
        "recent_admissions" => $recent->fetchAll(),
        "generated_at" => gmdate(DATE_ATOM),
    ]);
} catch (Throwable $exception) {
    serverError($exception);
}
