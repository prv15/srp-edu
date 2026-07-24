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

    $id = isset($_GET['id'])
        ? (int) $_GET['id']
        : 0;

    if ($id <= 0) {
        error("Student ID is required.", 422);
    }
    $instituteId = isset($_GET["institute_id"]) ? (int)$_GET["institute_id"] : 0;
    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "students.view");

    $sql = "

        SELECT

            s.*,

            i.name AS institute_name,

            a.session_name,

            d.name AS department_name,

            c.course_name,

            g.father_name,
            g.mother_name,
            g.guardian_name,
            g.guardian_mobile

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

        WHERE s.id = :id AND s.institute_id = :institute_id

        LIMIT 1

    ";

    $stmt = $db->prepare($sql);

    $stmt->bindValue(
        ":id",
        $id,
        PDO::PARAM_INT
    );
    $stmt->bindValue(":institute_id", $instituteId, PDO::PARAM_INT);

    $stmt->execute();

    $student = $stmt->fetch();

    if (!$student) {

        error("Student not found.", 404);

    }

    success($student);

} catch (Throwable $e) {
    serverError($e);
}
