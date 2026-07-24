<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";

try {
    $instituteId = (int)($_GET["institute_id"] ?? 0);
    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "examinations.view");

    $summary = $db->prepare(
        "SELECT COUNT(DISTINCT e.id) AS examinations,
                COUNT(DISTINCT p.id) AS papers,
                COUNT(r.student_id) AS results,
                ROUND(AVG(r.marks_obtained), 2) AS average_marks,
                ROUND(AVG(CASE WHEN p.max_marks > 0 THEN r.marks_obtained / p.max_marks * 100 END), 2) AS average_percentage
         FROM examinations e
         LEFT JOIN examination_papers p ON p.examination_id = e.id
         LEFT JOIN student_exam_results r ON r.examination_paper_id = p.id
         WHERE e.institute_id = :institute"
    );
    $summary->execute([":institute" => $instituteId]);

    $examinations = $db->prepare(
        "SELECT e.id, e.name, e.exam_type, e.status, e.exam_start_date, e.exam_end_date,
                a.session_name, cs.name AS semester_name, c.course_name,
                COUNT(DISTINCT p.id) AS paper_count,
                COUNT(r.student_id) AS result_count,
                ROUND(AVG(r.marks_obtained), 2) AS average_marks
         FROM examinations e
         INNER JOIN academic_sessions a ON a.id = e.academic_session_id
         INNER JOIN course_semesters cs ON cs.id = e.semester_id
         INNER JOIN courses c ON c.id = cs.course_id
         LEFT JOIN examination_papers p ON p.examination_id = e.id
         LEFT JOIN student_exam_results r ON r.examination_paper_id = p.id
         WHERE e.institute_id = :institute
         GROUP BY e.id, e.name, e.exam_type, e.status, e.exam_start_date, e.exam_end_date,
                  a.session_name, cs.name, c.course_name
         ORDER BY a.start_year DESC, cs.semester_no, c.course_name"
    );
    $examinations->execute([":institute" => $instituteId]);

    success([
        "summary" => $summary->fetch(),
        "examinations" => $examinations->fetchAll(),
    ]);
} catch (Throwable $exception) {
    serverError($exception);
}
