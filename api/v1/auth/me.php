<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";

$user = authenticatedUser($db);
$institutes = $db->prepare(
    "SELECT DISTINCT i.id, i.code, i.name
     FROM institutes i
     LEFT JOIN user_institutes ui ON ui.institute_id = i.id AND ui.user_id = :user_id
     WHERE :super_admin = 1 OR ui.user_id IS NOT NULL
     ORDER BY i.name"
);
$institutes->execute([
    ":user_id" => $user["id"],
    ":super_admin" => $user["role_code"] === "super_admin" ? 1 : 0,
]);

$permissions = $db->prepare(
    "SELECT p.code FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = :role_id ORDER BY p.code"
);
$permissions->execute([":role_id" => $user["role_id"]]);

unset($user["role_id"]);
success([
    "user" => $user,
    "institutes" => $institutes->fetchAll(),
    "permissions" => $user["role_code"] === "super_admin"
        ? ["*"]
        : $permissions->fetchAll(PDO::FETCH_COLUMN),
    "csrf_token" => csrfToken(),
]);
