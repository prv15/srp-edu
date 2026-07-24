<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";

try {
    $instituteId = (int)($_GET["institute_id"] ?? 0);
    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);

    if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "POST") {
        requireCsrf();
        requirePermission($db, $user, "academics.manage");
        $payload = requestJson();
        $action = (string)($payload["action"] ?? "");

        if ($action === "create_course") {
            $name = trim((string)($payload["course_name"] ?? ""));
            $departmentId = (int)($payload["department_id"] ?? 0);
            $duration = (int)($payload["duration"] ?? 0);
            if ($name === "" || $departmentId <= 0 || $duration < 1 || $duration > 8) {
                error("Course name, department and a valid duration are required.", 422);
            }
            $department = $db->prepare(
                "SELECT 1 FROM departments WHERE id = :id AND institute_id = :institute"
            );
            $department->execute([":id" => $departmentId, ":institute" => $instituteId]);
            if (!$department->fetchColumn()) error("Invalid department.", 422);

            $duplicate = $db->prepare(
                "SELECT 1 FROM courses
                 WHERE institute_id = :institute AND LOWER(course_name) = LOWER(:name) LIMIT 1"
            );
            $duplicate->execute([":institute" => $instituteId, ":name" => $name]);
            if ($duplicate->fetchColumn()) error("A course with this name already exists.", 409);

            $db->beginTransaction();
            $insert = $db->prepare(
                "INSERT INTO courses
                    (institute_id, department_id, course_name, duration, status)
                 VALUES (:institute, :department, :name, :duration, 1)"
            );
            $insert->execute([
                ":institute" => $instituteId,
                ":department" => $departmentId,
                ":name" => $name,
                ":duration" => $duration,
            ]);
            $courseId = (int)$db->lastInsertId();
            $instituteCodeStatement = $db->prepare(
                "SELECT code FROM institutes WHERE id = :id"
            );
            $instituteCodeStatement->execute([":id" => $instituteId]);
            $higherEducation = in_array(
                $instituteCodeStatement->fetchColumn(),
                ["degree", "training"],
                true
            );
            $semester = $db->prepare(
                "INSERT INTO course_semesters
                    (institute_id, course_id, semester_no, name, admission_session, status)
                 VALUES (:institute, :course, :number, :name, :admission_session, 'Active')"
            );
            $semesterCount = $duration * 2;
            for ($number = 1; $number <= $semesterCount; $number++) {
                $semester->execute([
                    ":institute" => $instituteId,
                    ":course" => $courseId,
                    ":number" => $number,
                    ":name" => "Semester {$number}",
                    ":admission_session" => $higherEducation
                        ? ($number % 2 === 1 ? "July" : "January")
                        : "Annual",
                ]);
            }
            $db->commit();
            success(["id" => $courseId], "Course created with {$semesterCount} semesters.", 201);
        }

        if ($action === "create_subject") {
            $semesterId = (int)($payload["semester_id"] ?? 0);
            $code = strtoupper(trim((string)($payload["code"] ?? "")));
            $name = trim((string)($payload["name"] ?? ""));
            if ($semesterId <= 0 || $code === "" || $name === "") {
                error("Semester, subject code and subject name are required.", 422);
            }
            $semester = $db->prepare(
                "SELECT cs.id, cs.course_id, c.department_id
                 FROM course_semesters cs
                 INNER JOIN courses c ON c.id = cs.course_id
                 WHERE cs.id = :id AND cs.institute_id = :institute LIMIT 1"
            );
            $semester->execute([":id" => $semesterId, ":institute" => $instituteId]);
            $context = $semester->fetch();
            if (!$context) error("Invalid semester.", 422);

            $insert = $db->prepare(
                "INSERT INTO subjects
                    (institute_id, course_id, department_id, semester_id, code, name,
                     paper_category, paper_title, delivery_type, credits,
                     max_cia_marks, max_university_marks, status)
                 VALUES
                    (:institute, :course, :department, :semester, :code, :name,
                     :category, :title, :delivery, :credits,
                     :cia_marks, :university_marks, 'Active')"
            );
            try {
                $insert->execute([
                    ":institute" => $instituteId,
                    ":course" => $context["course_id"],
                    ":department" => $context["department_id"],
                    ":semester" => $semesterId,
                    ":code" => $code,
                    ":name" => $name,
                    ":category" => trim((string)($payload["paper_category"] ?? "")) ?: null,
                    ":title" => trim((string)($payload["paper_title"] ?? "")) ?: null,
                    ":delivery" => in_array($payload["delivery_type"] ?? "", ["Theory", "Practical", "Theory and Practical"], true)
                        ? $payload["delivery_type"] : "Theory",
                    ":credits" => is_numeric($payload["credits"] ?? null) ? $payload["credits"] : null,
                    ":cia_marks" => is_numeric($payload["max_cia_marks"] ?? null) ? $payload["max_cia_marks"] : null,
                    ":university_marks" => is_numeric($payload["max_university_marks"] ?? null) ? $payload["max_university_marks"] : null,
                ]);
            } catch (PDOException $exception) {
                if ((int)($exception->errorInfo[1] ?? 0) === 1062) {
                    error("This subject code already exists for the selected programme and semester.", 409);
                }
                throw $exception;
            }
            success(["id" => (int)$db->lastInsertId()], "Subject created.", 201);
        }

        error("Unsupported academic action.", 422);
    }

    requirePermission($db, $user, "academics.view");

    $departments = $db->prepare(
        "SELECT d.id, d.name, d.code, COUNT(s.id) AS student_count
         FROM departments d
         LEFT JOIN students s
            ON s.department_id = d.id AND s.institute_id = d.institute_id
         WHERE d.institute_id = :institute_id
         GROUP BY d.id, d.name, d.code
         ORDER BY d.name"
    );
    $departments->execute([":institute_id" => $instituteId]);

    $courses = $db->prepare(
        "SELECT c.id, c.course_name, c.duration, c.status,
                d.id AS department_id, d.name AS department_name,
                COUNT(s.id) AS student_count
         FROM courses c
         LEFT JOIN departments d
            ON d.id = c.department_id AND d.institute_id = c.institute_id
         LEFT JOIN students s
            ON s.course_id = c.id AND s.institute_id = c.institute_id
         WHERE c.institute_id = :institute_id
         GROUP BY c.id, c.course_name, c.duration, c.status, d.id, d.name
         ORDER BY c.course_name"
    );
    $courses->execute([":institute_id" => $instituteId]);

    $sessions = $db->prepare(
        "SELECT a.id, a.session_name, a.start_year, a.end_year, a.status,
                COUNT(s.id) AS student_count
         FROM academic_sessions a
         LEFT JOIN students s
            ON s.session_id = a.id AND s.institute_id = a.institute_id
         WHERE a.institute_id = :institute_id
         GROUP BY a.id, a.session_name, a.start_year, a.end_year, a.status
         ORDER BY a.start_year DESC, a.session_name"
    );
    $sessions->execute([":institute_id" => $instituteId]);

    $semesters = $db->prepare(
        "SELECT cs.id, cs.course_id, cs.semester_no, cs.name, cs.admission_session, cs.status,
                c.course_name, COUNT(DISTINCT sub.id) AS subject_count
         FROM course_semesters cs
         INNER JOIN courses c ON c.id = cs.course_id
         LEFT JOIN subjects sub ON sub.semester_id = cs.id
         WHERE cs.institute_id = :institute_id
         GROUP BY cs.id, cs.course_id, cs.semester_no, cs.name, cs.admission_session, cs.status, c.course_name
         ORDER BY c.course_name, cs.semester_no"
    );
    $semesters->execute([":institute_id" => $instituteId]);

    $subjects = $db->prepare(
        "SELECT sub.id, sub.code, sub.name, sub.paper_category, sub.paper_title,
                sub.delivery_type, sub.max_cia_marks, sub.max_university_marks,
                c.course_name, cs.name AS semester_name, cs.semester_no
         FROM subjects sub
         INNER JOIN courses c ON c.id = sub.course_id
         INNER JOIN course_semesters cs ON cs.id = sub.semester_id
         WHERE sub.institute_id = :institute_id AND sub.status = 'Active'
         ORDER BY c.course_name, cs.semester_no, sub.paper_category, sub.code"
    );
    $subjects->execute([":institute_id" => $instituteId]);

    $affiliations = $db->prepare(
        "SELECT u.name, u.short_name, u.authority_type, ia.affiliation_no, ia.status
         FROM institute_affiliations ia
         INNER JOIN universities u ON u.id = ia.university_id
         WHERE ia.institute_id = :institute_id AND ia.status = 'Active'
         ORDER BY u.name"
    );
    $affiliations->execute([":institute_id" => $instituteId]);

    success([
        "departments" => $departments->fetchAll(),
        "courses" => $courses->fetchAll(),
        "sessions" => $sessions->fetchAll(),
        "semesters" => $semesters->fetchAll(),
        "subjects" => $subjects->fetchAll(),
        "affiliations" => $affiliations->fetchAll(),
    ]);
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    serverError($exception);
}
