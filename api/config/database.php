<?php

declare(strict_types=1);

require_once __DIR__ . "/config.php";

final class Database
{
    private ?PDO $connection = null;

    public function connect(): PDO
    {
        if ($this->connection instanceof PDO) {
            return $this->connection;
        }

        $host = self::environment("TPS_DB_HOST", "localhost");
        $port = self::environment("TPS_DB_PORT", "3306");
        $name = self::environment("TPS_DB_NAME");
        $user = self::environment("TPS_DB_USER");
        // An empty password is permitted for an explicitly configured local
        // development database. Production must set a strong value.
        $password = self::environment("TPS_DB_PASSWORD", "");

        $this->connection = new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_STRINGIFY_FETCHES => false,
            ]
        );

        return $this->connection;
    }

    private static function environment(string $name, ?string $default = null): string
    {
        $value = getenv($name);
        if ($value !== false && $value !== "") {
            return $value;
        }

        if ($default !== null) {
            return $default;
        }

        throw new RuntimeException("Required database configuration is missing.");
    }
}

$db = (new Database())->connect();
$pdo = $db; // Temporary compatibility alias for the existing import helpers.
