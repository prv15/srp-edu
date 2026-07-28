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

    $instituteId = isset($_GET['institute_id'])
        ? (int)$_GET['institute_id']
        : 0;

    if ($instituteId <= 0) {
        error("Institute ID is required.", 422);
    }
    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "students.view");

    $search = trim($_GET['search'] ?? '');

    $sql = "
        SELECT

            s.id,
            s.student_uid,
            s.student_name,
            s.admission_no,
            s.college_roll_no,
            s.registration_no,
            s.university_roll_no,
            s.gender,
            s.mobile,
            s.email,
            s.status,
            s.admission_date,
            s.semester_id,
            s.major_subject_id,

            i.name AS institute,

            a.session_name,

            d.name AS department,

            c.course_name,
            cs.semester_no,
            cs.name AS semester_name,
            ms.name AS major_subject
            ,g.father_name
            ,g.mother_name
            ,g.guardian_name
            ,g.guardian_mobile

        FROM students s

        LEFT JOIN institutes i
            ON i.id = s.institute_id

        LEFT JOIN academic_sessions a
            ON a.id = s.session_id

        LEFT JOIN departments d
            ON d.id = s.department_id

        LEFT JOIN courses c
            ON c.id = s.course_id

        LEFT JOIN course_semesters cs
            ON cs.id = s.semester_id
            AND cs.institute_id = s.institute_id
            AND cs.course_id = s.course_id

        LEFT JOIN subject_disciplines ms
            ON ms.id = s.major_subject_id
            AND ms.institute_id = s.institute_id

        LEFT JOIN student_guardians g
            ON g.student_id = s.id

        WHERE s.institute_id = :institute
    ";

    $semesterId = isset($_GET["semester_id"]) ? (int)$_GET["semester_id"] : 0;
    $semesterNumber = isset($_GET["semester"]) ? (int)$_GET["semester"] : 0;
    $majorSubjectId = isset($_GET["major_subject_id"]) ? (int)$_GET["major_subject_id"] : 0;

    if ($semesterId > 0) {
        $sql .= " AND s.semester_id = :semester_id";
    } elseif ($semesterNumber > 0) {
        $sql .= " AND cs.semester_no = :semester_no";
    }

    if ($majorSubjectId > 0) {
        $sql .= " AND s.major_subject_id = :major_subject_id";
    }

    if ($search !== '') {

        $sql .= "
            AND CONVERT(CONCAT_WS(
                ' ',
                s.student_name,
                s.admission_no,
                s.college_roll_no,
                s.registration_no,
                s.mobile,
                s.email,
                s.category,
                g.father_name,
                g.mother_name,
                g.guardian_name,
                g.guardian_mobile,
                d.name,
                c.course_name,
                a.session_name,
                cs.name,
                ms.name
            ) USING utf8mb4) COLLATE utf8mb4_unicode_ci
                LIKE CONVERT(:search USING utf8mb4) COLLATE utf8mb4_unicode_ci
        ";
    }

    $sql .= " ORDER BY s.student_name ASC";

    $stmt = $db->prepare($sql);

    $stmt->bindValue(':institute', $instituteId, PDO::PARAM_INT);

    if ($semesterId > 0) {
        $stmt->bindValue(":semester_id", $semesterId, PDO::PARAM_INT);
    } elseif ($semesterNumber > 0) {
        $stmt->bindValue(":semester_no", $semesterNumber, PDO::PARAM_INT);
    }

    if ($majorSubjectId > 0) {
        $stmt->bindValue(":major_subject_id", $majorSubjectId, PDO::PARAM_INT);
    }

    if ($search !== '') {

        $stmt->bindValue(
            ':search',
            "%{$search}%"
        );

    }

    $stmt->execute();

    success(
        $stmt->fetchAll()
    );

} catch (Throwable $e) {
    serverError($e);
}
