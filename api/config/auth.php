<?php

declare(strict_types=1);

require_once __DIR__ . "/response.php";

function startSecureSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name(getenv("TPS_SESSION_NAME") ?: "tps_erp_session");
    session_set_cookie_params([
        "lifetime" => 0,
        "path" => "/",
        "secure" => ($_SERVER["HTTPS"] ?? "") === "on",
        "httponly" => true,
        "samesite" => "Lax",
    ]);
    ini_set("session.use_strict_mode", "1");
    ini_set("session.use_only_cookies", "1");
    session_start();
}

function csrfToken(): string
{
    startSecureSession();
    if (empty($_SESSION["csrf_token"])) {
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
    }
    return $_SESSION["csrf_token"];
}

function requireCsrf(): void
{
    $method = $_SERVER["REQUEST_METHOD"] ?? "GET";
    if (in_array($method, ["GET", "HEAD", "OPTIONS"], true)) {
        return;
    }

    startSecureSession();
    $provided = $_SERVER["HTTP_X_CSRF_TOKEN"] ?? "";
    if ($provided === "" || !hash_equals($_SESSION["csrf_token"] ?? "", $provided)) {
        error("Invalid security token.", 419);
    }
}

function requestJson(): array
{
    $payload = json_decode(file_get_contents("php://input"), true);
    if (!is_array($payload)) {
        error("A valid JSON request body is required.", 400);
    }
    return $payload;
}
