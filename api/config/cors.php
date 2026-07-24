<?php

declare(strict_types=1);

require_once __DIR__ . "/environment.php";

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
$allowedOrigins = array_values(array_filter(array_map(
    "trim",
    explode(",", getenv("TPS_ALLOWED_ORIGINS") ?: "")
)));

if ($origin !== "" && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Max-Age: 600");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "OPTIONS") {
    if ($origin !== "" && !in_array($origin, $allowedOrigins, true)) {
        http_response_code(403);
        exit;
    }
    http_response_code(204);
    exit;
}
