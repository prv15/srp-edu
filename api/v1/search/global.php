<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";
require_once __DIR__ . "/../../helpers/GlobalSearchRegistry.php";

try {
    if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== "GET") {
        error("Method not allowed.", 405);
    }

    $instituteId = (int)($_GET["institute_id"] ?? 0);
    $query = preg_replace('/\s+/u', ' ', trim((string)($_GET["q"] ?? ""))) ?? "";
    $limit = min(10, max(1, (int)($_GET["limit"] ?? 6)));

    if (mb_strlen($query) < 2) {
        success([
            "query" => $query,
            "sections" => new stdClass(),
            "total" => 0,
        ]);
    }

    if (mb_strlen($query) > 100) {
        error("Search query must not exceed 100 characters.", 422);
    }

    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);

    $registry = createGlobalSearchRegistry();
    $sections = $registry->search(
        $db,
        $instituteId,
        $query,
        $limit,
        static fn(string $permission): bool => hasPermission($db, $user, $permission)
    );

    $total = array_sum(array_map(
        static fn(array $section): int => $section["count"],
        $sections
    ));

    success([
        "query" => $query,
        "sections" => $sections === [] ? new stdClass() : $sections,
        "total" => $total,
    ]);
} catch (Throwable $exception) {
    serverError($exception);
}
