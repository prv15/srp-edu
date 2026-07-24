<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/auth.php";

if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
    error("Method not allowed.", 405);
}

$payload = requestJson();
$email = filter_var(trim((string)($payload["email"] ?? "")), FILTER_VALIDATE_EMAIL);
$password = (string)($payload["password"] ?? "");
if ($email === false || $password === "") {
    error("Invalid email or password.", 422);
}

$statement = $db->prepare(
    "SELECT id, password_hash, status, failed_login_attempts, locked_until
     FROM users WHERE email = :email LIMIT 1"
);
$statement->execute([":email" => mb_strtolower($email)]);
$account = $statement->fetch();

$locked = $account
    && $account["locked_until"]
    && strtotime($account["locked_until"]) > time();

if (!$account || $locked || $account["status"] !== "Active"
    || !password_verify($password, $account["password_hash"])) {
    if ($account && !$locked) {
        $attempts = (int)$account["failed_login_attempts"] + 1;
        $lockUntil = $attempts >= 5 ? date("Y-m-d H:i:s", time() + 900) : null;
        $update = $db->prepare(
            "UPDATE users SET failed_login_attempts = :attempts, locked_until = :locked
             WHERE id = :id"
        );
        $update->execute([
            ":attempts" => $attempts,
            ":locked" => $lockUntil,
            ":id" => $account["id"],
        ]);
    }
    usleep(250000);
    error("Invalid email or password.", 401);
}

startSecureSession();
session_regenerate_id(true);
$_SESSION["user_id"] = (int)$account["id"];
$_SESSION["authenticated_at"] = time();
$_SESSION["csrf_token"] = bin2hex(random_bytes(32));

$db->prepare(
    "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW()
     WHERE id = :id"
)->execute([":id" => $account["id"]]);

success(["csrf_token" => $_SESSION["csrf_token"]], "Signed in successfully.");
