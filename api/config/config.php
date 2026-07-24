<?php

declare(strict_types=1);

require_once __DIR__ . "/environment.php";

date_default_timezone_set("Asia/Kolkata");

define("APP_NAME","SRP ERP");

define("APP_VERSION","1.0.0");

define("UPLOAD_PATH",__DIR__."/../uploads/");

define(
    "BASE_URL",
    rtrim(getenv("TPS_APP_URL") ?: "http://localhost", "/") . "/api/"
);
