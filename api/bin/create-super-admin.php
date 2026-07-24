<?php

declare(strict_types=1);

if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit;
}

require_once __DIR__ . "/../config/database.php";

$options = getopt("", ["name:", "email:"]);
$name = trim((string)($options["name"] ?? ""));
$email = filter_var(mb_strtolower(trim((string)($options["email"] ?? ""))), FILTER_VALIDATE_EMAIL);
$password = (string)(getenv("TPS_SUPER_ADMIN_PASSWORD") ?: "");

if ($name === "" || $email === false || strlen($password) < 12) {
    fwrite(STDERR, "Set TPS_SUPER_ADMIN_PASSWORD (minimum 12 characters), then run: php api/bin/create-super-admin.php --name=\"Name\" --email=\"admin@example.org\"\n");
    exit(1);
}

try {
    $db->beginTransaction();

    $db->exec(
        "INSERT INTO roles (code, name)
         VALUES ('super_admin', 'Super Administrator')
         ON DUPLICATE KEY UPDATE name = VALUES(name)"
    );
    $roleId = (int)$db->query(
        "SELECT id FROM roles WHERE code = 'super_admin' LIMIT 1"
    )->fetchColumn();

    $statement = $db->prepare(
        "INSERT INTO users (role_id, name, email, password_hash, status)
         VALUES (:role_id, :name, :email, :password_hash, 'Active')
         ON DUPLICATE KEY UPDATE
            role_id = VALUES(role_id),
            name = VALUES(name),
            password_hash = VALUES(password_hash),
            status = 'Active',
            failed_login_attempts = 0,
            locked_until = NULL,
            password_changed_at = NOW()"
    );
    $statement->execute([
        ":role_id" => $roleId,
        ":name" => $name,
        ":email" => $email,
        ":password_hash" => password_hash($password, PASSWORD_DEFAULT),
    ]);

    $db->commit();
    fwrite(STDOUT, "Super Administrator account is ready. It can access every institute.\n");
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    fwrite(STDERR, "Unable to create account: {$exception->getMessage()}\n");
    exit(1);
}
