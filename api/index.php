<?php

require_once "config/config.php";

require_once "config/cors.php";

require_once "config/response.php";

success([

    "application"=>APP_NAME,

    "version"=>APP_VERSION,

    "status"=>"Running"

]);