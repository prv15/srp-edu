<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/auth.php";
require_once __DIR__ . "/../config/database.php";

function authenticatedUser(PDO $db): array
{
    startSecureSession();
    $userId = (int)($_SESSION["user_id"] ?? 0);
    if ($userId <= 0) {
        error("Authentication required.", 401);
    }

    $statement = $db->prepare(
        "SELECT u.id, u.name, u.email, u.employee_id, u.status,
                r.id AS role_id, r.code AS role_code, r.name AS role_name
         FROM users u
         INNER JOIN roles r ON r.id = u.role_id
         WHERE u.id = :id AND u.status = 'Active'
         LIMIT 1"
    );
    $statement->execute([":id" => $userId]);
    $user = $statement->fetch();
    if (!$user) {
        $_SESSION = [];
        session_destroy();
        error("Session is no longer valid.", 401);
    }

    return $user;
}

function requireInstituteAccess(PDO $db, array $user, int $instituteId): void
{
    if ($instituteId <= 0) {
        error("Institute ID is required.", 422);
    }

    if ($user["role_code"] === "super_admin") {
        return;
    }

    $statement = $db->prepare(
        "SELECT 1 FROM user_institutes
         WHERE user_id = :user_id AND institute_id = :institute_id
         LIMIT 1"
    );
    $statement->execute([
        ":user_id" => $user["id"],
        ":institute_id" => $instituteId,
    ]);
    if (!$statement->fetchColumn()) {
        error("You do not have access to this institute.", 403);
    }
}
