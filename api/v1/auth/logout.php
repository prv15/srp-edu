<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/auth.php";

startSecureSession();
requireCsrf();
$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), "", time() - 42000, $params["path"], "", $params["secure"], true);
}
session_destroy();
success([], "Signed out successfully.");
