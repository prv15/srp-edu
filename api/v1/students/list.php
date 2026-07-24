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

            i.name AS institute,

            a.session_name,

            d.name AS department,

            c.course_name
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

        LEFT JOIN student_guardians g
            ON g.student_id = s.id

        WHERE s.institute_id = :institute
    ";

    if ($search !== '') {

        $sql .= "
            AND (

                s.student_name LIKE :search

                OR s.admission_no LIKE :search

                OR s.college_roll_no LIKE :search

                OR s.registration_no LIKE :search

                OR s.mobile LIKE :search
                OR s.email LIKE :search
                OR s.category LIKE :search
                OR g.father_name LIKE :search
                OR g.mother_name LIKE :search
                OR g.guardian_name LIKE :search
                OR g.guardian_mobile LIKE :search
                OR d.name LIKE :search
                OR c.course_name LIKE :search
                OR a.session_name LIKE :search

            )
        ";
    }

    $sql .= " ORDER BY s.student_name ASC";

    $stmt = $db->prepare($sql);

    $stmt->bindValue(':institute', $instituteId, PDO::PARAM_INT);

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
