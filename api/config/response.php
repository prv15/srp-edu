<?php

declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: no-store, private");

function success(

    mixed $data=[],

    string $message="Success",

    int $code=200

):never{

    http_response_code($code);

    echo json_encode([

        "success"=>true,

        "message"=>$message,

        "data"=>$data

    ]);

    exit;

}

function error(

    string $message,

    int $code=400

):never{

    http_response_code($code);

    echo json_encode([

        "success"=>false,

        "message"=>$message

    ]);

    exit;

}

function serverError(Throwable $exception): never
{
    error_log(sprintf(
        "[%s] %s in %s:%d",
        bin2hex(random_bytes(6)),
        $exception->getMessage(),
        $exception->getFile(),
        $exception->getLine()
    ));
    error("An unexpected server error occurred.", 500);
}
