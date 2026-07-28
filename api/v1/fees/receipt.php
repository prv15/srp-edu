<?php

declare(strict_types=1);

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . "/../../config/config.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/response.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";
require_once __DIR__ . "/../../helpers/FeeReceiptService.php";

use Dompdf\Dompdf;
use Dompdf\Options;

try {
    $instituteId = isset($_GET["institute_id"]) ? (int)$_GET["institute_id"] : 0;
    $receiptId = isset($_GET["receipt_id"]) ? (int)$_GET["receipt_id"] : 0;
    if ($receiptId <= 0) {
        error("Receipt ID is required.", 422);
    }

    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "fees.view");

    $receipt = feeReceiptById($db, $receiptId, $instituteId);
    if (!$receipt) {
        error("Fee receipt not found.", 404);
    }

    $options = new Options();
    $options->set("isRemoteEnabled", false);
    $options->set("chroot", dirname(__DIR__, 2));
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml(feeReceiptHtml($receipt), "UTF-8");
    $dompdf->setPaper("A4", "portrait");
    $dompdf->render();

    $filename = preg_replace(
        "/[^A-Za-z0-9_-]+/",
        "-",
        "Fee-Receipt-{$receipt["receipt_no"]}"
    ) . ".pdf";
    header("Content-Type: application/pdf");
    header("Content-Disposition: attachment; filename=\"{$filename}\"");
    header("Cache-Control: no-store, private");
    echo $dompdf->output();
} catch (Throwable $exception) {
    serverError($exception);
}
