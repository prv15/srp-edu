<?php

function sanitize(

    ?string $value

):string{

    return trim(

        htmlspecialchars(

            $value ?? "",

            ENT_QUOTES,

            "UTF-8"

        )

    );

}

function uuid(

    string $prefix=""

):string{

    return $prefix.

    strtoupper(

        bin2hex(random_bytes(6))

    );

}