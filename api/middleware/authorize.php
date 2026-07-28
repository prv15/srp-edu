<?php

declare(strict_types=1);

function requirePermission(PDO $db, array $user, string $permission): void
{
    if (!hasPermission($db, $user, $permission)) {
        error("You do not have permission to perform this action.", 403);
    }
}

function hasPermission(PDO $db, array $user, string $permission): bool
{
    if ($user["role_code"] === "super_admin") {
        return true;
    }

    $statement = $db->prepare(
        "SELECT 1
         FROM role_permissions rp
         INNER JOIN permissions p ON p.id = rp.permission_id
         WHERE rp.role_id = :role_id AND p.code = :permission
         LIMIT 1"
    );
    $statement->execute([
        ":role_id" => $user["role_id"],
        ":permission" => $permission,
    ]);

    return (bool)$statement->fetchColumn();
}
