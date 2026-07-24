<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";

$user = authenticatedUser($db);
$statement = $db->prepare(
    "SELECT DISTINCT i.id, i.code, i.name
     FROM institutes i
     LEFT JOIN user_institutes ui ON ui.institute_id = i.id AND ui.user_id = :user_id
     WHERE :super_admin = 1 OR ui.user_id IS NOT NULL
     ORDER BY i.name"
);
$statement->execute([
    ":user_id" => $user["id"],
    ":super_admin" => $user["role_code"] === "super_admin" ? 1 : 0,
]);
success($statement->fetchAll());
