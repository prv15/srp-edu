<?php

declare(strict_types=1);

/**
 * Loads an optional local .env file without overriding server environment
 * variables. Production should provide variables through the web server or
 * hosting control panel instead.
 */
function loadLocalEnvironment(string $file): void
{
    if (!is_file($file) || !is_readable($file)) {
        return;
    }

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === "" || str_starts_with($line, "#")) {
            continue;
        }

        [$name, $value] = array_pad(explode("=", $line, 2), 2, "");
        $name = trim($name);
        if (!preg_match('/^[A-Z][A-Z0-9_]*$/', $name) || getenv($name) !== false) {
            continue;
        }

        $value = trim($value);
        if (strlen($value) >= 2) {
            $first = $value[0];
            $last = $value[strlen($value) - 1];
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $value = substr($value, 1, -1);
            }
        }

        putenv("{$name}={$value}");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}

loadLocalEnvironment(dirname(__DIR__) . "/.env");
