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
        requirePermission($db, $user, "faculty.manage");
        $payload = requestJson();
        $employeeId = trim((string)($payload["employee_id"] ?? ""));
        $name = trim((string)($payload["name"] ?? ""));
        $departmentId = (int)($payload["department_id"] ?? 0);
        if ($employeeId === "" || $name === "") {
            error("Employee ID and faculty name are required.", 422);
        }
        if ($departmentId > 0) {
            $department = $db->prepare(
                "SELECT 1 FROM departments WHERE id = :id AND institute_id = :institute"
            );
            $department->execute([":id" => $departmentId, ":institute" => $instituteId]);
            if (!$department->fetchColumn()) error("Invalid department.", 422);
        }
        $statement = $db->prepare(
            "INSERT INTO faculty
                (institute_id, department_id, employee_id, name, designation,
                 email, mobile, qualification, employment_type, joining_date, status)
             VALUES
                (:institute, :department, :employee_id, :name, :designation,
                 :email, :mobile, :qualification, :employment_type, :joining_date, 'Active')"
        );
        $statement->execute([
            ":institute" => $instituteId,
            ":department" => $departmentId ?: null,
            ":employee_id" => $employeeId,
            ":name" => $name,
            ":designation" => trim((string)($payload["designation"] ?? "")) ?: null,
            ":email" => filter_var($payload["email"] ?? "", FILTER_VALIDATE_EMAIL) ?: null,
            ":mobile" => trim((string)($payload["mobile"] ?? "")) ?: null,
            ":qualification" => trim((string)($payload["qualification"] ?? "")) ?: null,
            ":employment_type" => in_array($payload["employment_type"] ?? "", ["Permanent", "Contract", "Guest", "Visiting"], true)
                ? $payload["employment_type"] : "Permanent",
            ":joining_date" => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($payload["joining_date"] ?? ""))
                ? $payload["joining_date"] : null,
        ]);
        success(["id" => (int)$db->lastInsertId()], "Faculty member created.", 201);
    }

    requirePermission($db, $user, "faculty.view");
    $statement = $db->prepare(
        "SELECT f.id, f.employee_id, f.name, f.designation, f.email, f.mobile,
                f.qualification, f.employment_type, f.joining_date, f.status,
                d.id AS department_id, d.name AS department_name,
                COUNT(DISTINCT a.subject_id) AS subject_count
         FROM faculty f
         LEFT JOIN departments d ON d.id = f.department_id
         LEFT JOIN faculty_subject_assignments a ON a.faculty_id = f.id
         WHERE f.institute_id = :institute
         GROUP BY f.id, f.employee_id, f.name, f.designation, f.email, f.mobile,
                  f.qualification, f.employment_type, f.joining_date, f.status,
                  d.id, d.name
         ORDER BY f.status = 'Active' DESC, f.name"
    );
    $statement->execute([":institute" => $instituteId]);
    success($statement->fetchAll());
} catch (PDOException $exception) {
    if ((int)$exception->errorInfo[1] === 1062) {
        error("That employee ID already exists for this institute.", 409);
    }
    serverError($exception);
} catch (Throwable $exception) {
    serverError($exception);
}
