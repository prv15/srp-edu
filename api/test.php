<?php

declare(strict_types=1);

header("Content-Type: application/json");

require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/config/config.php";
require_once __DIR__ . "/config/database.php";
require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/response.php";

try{

    $db->query("SELECT 1");

    success([
        "database" => "Connected",
        "php" => PHP_VERSION,
        "time" => date("Y-m-d H:i:s")
    ]);

}catch(Throwable $e){

    error($e->getMessage(),500);

}