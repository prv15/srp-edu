<?php

declare(strict_types=1);

function feeReceiptById(PDO $db, int $receiptId, int $instituteId): ?array
{
    $statement = $db->prepare(
        "SELECT
            receipt.*,
            student.student_name,
            student.admission_no,
            student.college_roll_no,
            student.registration_no,
            student.gender,
            student.category,
            student.mobile,
            student.admission_cycle,
            guardian.father_name,
            guardian.mother_name,
            course.course_name,
            session.session_name,
            semester.name AS semester_name,
            semester.semester_no,
            discipline.name AS major_subject,
            institute.name AS institute_name,
            institute.short_name,
            settings.receipt_heading,
            settings.legal_name,
            settings.managing_body,
            settings.address_line,
            settings.ug_recognition_text,
            settings.professional_recognition_text,
            settings.ug_accent_color,
            settings.professional_accent_color
         FROM fee_receipts receipt
         INNER JOIN students student
            ON student.id = receipt.student_id
            AND student.institute_id = receipt.institute_id
         INNER JOIN institutes institute
            ON institute.id = receipt.institute_id
         LEFT JOIN student_guardians guardian
            ON guardian.student_id = student.id
         LEFT JOIN courses course ON course.id = student.course_id
         LEFT JOIN academic_sessions session
            ON session.id = receipt.academic_session_id
         LEFT JOIN course_semesters semester
            ON semester.id = receipt.semester_id
         LEFT JOIN subject_disciplines discipline
            ON discipline.id = student.major_subject_id
         LEFT JOIN institute_receipt_settings settings
            ON settings.institute_id = receipt.institute_id
         WHERE receipt.id = :receipt
           AND receipt.institute_id = :institute
         LIMIT 1"
    );
    $statement->execute([
        ":receipt" => $receiptId,
        ":institute" => $instituteId,
    ]);
    $receipt = $statement->fetch();
    if (!$receipt) {
        return null;
    }

    $itemStatement = $db->prepare(
        "SELECT section_label, particulars, amount, display_order
         FROM fee_receipt_items
         WHERE receipt_id = :receipt
         ORDER BY display_order ASC, id ASC"
    );
    $itemStatement->execute([":receipt" => $receiptId]);
    $receipt["items"] = $itemStatement->fetchAll();

    return $receipt;
}

function feeReceiptHtml(array $receipt): string
{
    $professional = $receipt["receipt_template"] === "BBA_BCA";
    $accent = $professional
        ? ($receipt["professional_accent_color"] ?: "#92D050")
        : ($receipt["ug_accent_color"] ?: "#FFDA68");
    $recognition = $professional
        ? $receipt["professional_recognition_text"]
        : $receipt["ug_recognition_text"];
    $title = $professional ? "FEE RECEIPT - BBA / BCA" : "FEE RECEIPT - U.G.";
    $gender = match (strtoupper((string)$receipt["gender"])) {
        "F" => "FEMALE",
        "M" => "MALE",
        default => strtoupper((string)$receipt["gender"]),
    };
    $money = static fn(mixed $value): string => number_format((float)$value, 2);
    $safe = static fn(mixed $value): string => htmlspecialchars(
        trim((string)$value) !== "" ? (string)$value : "-",
        ENT_QUOTES,
        "UTF-8"
    );

    $items = "";
    $lastSection = null;
    $serial = 1;
    foreach ($receipt["items"] as $item) {
        $section = trim((string)$item["section_label"]);
        if ($section !== "" && $section !== $lastSection) {
            $items .= "<tr class=\"section\"><td colspan=\"2\">{$safe($section)}</td><td></td></tr>";
            $lastSection = $section;
        }
        $items .= sprintf(
            "<tr><td class=\"serial\">%d</td><td>%s</td><td class=\"amount\">%s</td></tr>",
            $serial++,
            $safe($item["particulars"]),
            $money($item["amount"])
        );
    }

    $recognitionLines = implode("<br>", array_map(
        $safe,
        array_filter(array_map("trim", explode("|", (string)$recognition)))
    ));
    $issuedAt = new DateTimeImmutable((string)$receipt["issued_at"]);

    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
@page { margin: 20px 24px; }
body { font-family: DejaVu Sans, sans-serif; color:#111; font-size:10px; margin:0; }
.receipt { border:1px solid #111; }
.brand { position:relative; text-align:center; padding:8px 12px 6px 92px; min-height:78px; }
.logo { position:absolute; left:12px; top:12px; width:62px; height:62px; border-radius:50%; background:#4775c5; border:2px solid #173b73; color:#fff; text-align:center; line-height:62px; font-size:12px; }
.brand h1 { color:#a70000; font-family:serif; font-size:20px; margin:0 0 2px; }
.brand h2 { font-family:serif; font-size:14px; font-weight:normal; margin:0; }
.trust { display:inline-block; background:#243d6b; color:#fff; padding:1px 10px; margin:2px 0; }
.brand p { font-size:10px; font-weight:bold; margin:1px 0; line-height:1.25; }
.title { background:{$accent}; border-top:1px solid #111; border-bottom:1px solid #111; text-align:center; font: bold 22px serif; padding:4px; letter-spacing:1px; }
table { width:100%; border-collapse:collapse; }
td, th { border-right:1px solid #111; border-bottom:1px solid #111; padding:3px 6px; vertical-align:middle; }
tr > *:last-child { border-right:0; }
.details td:nth-child(odd) { background:#b8d1e8; font-weight:bold; width:25%; }
.details td:nth-child(even) { width:25%; font-weight:bold; }
.student-name { background:{$accent}!important; }
.items th { background:#c6c6c6; font-size:11px; }
.items th:first-child, .serial { width:6%; text-align:center; font-weight:bold; }
.items th:last-child, .amount { width:20%; text-align:center; font-weight:bold; }
.section td { background:#c6c6c6; font-weight:bold; font-style:italic; }
.totals td:first-child { text-align:right; font-weight:bold; }
.totals td:last-child { width:20%; text-align:center; font-weight:bold; }
.remark { background:#b8d1e8; padding:5px 12px; font-size:10px; border-bottom:1px solid #111; }
.notes { padding:7px 14px 8px; font-size:9px; font-weight:bold; line-height:1.35; }
.notes div { margin:2px 0; }
</style>
</head>
<body>
<div class="receipt">
  <div class="brand">
    <div class="logo">LOGO</div>
    <h1>{$safe($receipt["receipt_heading"] ?: $receipt["institute_name"])}</h1>
    <h2>{$safe($receipt["legal_name"])}</h2>
    <div class="trust">{$safe($receipt["managing_body"])}</div>
    <p>{$safe($receipt["address_line"])}</p>
    <p>{$recognitionLines}</p>
  </div>
  <div class="title">{$title}</div>
  <table class="details">
    <tr><td>RECEIPT NO.</td><td>{$safe($receipt["receipt_no"])}</td><td>DATE &amp; TIME</td><td>{$issuedAt->format("d-m-Y ; H:i:s")}</td></tr>
    <tr><td>SESSION</td><td>{$safe($receipt["session_name"])}</td><td>COURSE</td><td>{$safe($receipt["course_name"])}</td></tr>
    <tr><td>UNIV. APPLICATION NO.</td><td>{$safe($receipt["university_application_no"])}</td><td>SEMESTER</td><td>{$safe($receipt["semester_name"])}</td></tr>
    <tr><td>ENROL./REG. NO.</td><td>{$safe($receipt["registration_no"])}</td><td>FOR THE PERIOD</td><td>{$safe($receipt["period_label"])}</td></tr>
    <tr><td>ADMISSION NO.</td><td>{$safe($receipt["admission_no"])}</td><td>STUDENT'S NAME</td><td class="student-name">{$safe($receipt["student_name"])}</td></tr>
    <tr><td>COLLEGE ID ROLL NO.</td><td>{$safe($receipt["college_roll_no"])}</td><td>FATHER'S NAME</td><td>{$safe($receipt["father_name"])}</td></tr>
    <tr><td>GENDER</td><td>{$safe($gender)}</td><td>MOTHER'S NAME</td><td>{$safe($receipt["mother_name"])}</td></tr>
    <tr><td>CATEGORY</td><td>{$safe($receipt["category"])}</td><td>MOBILE NO.</td><td>{$safe($receipt["mobile"])}</td></tr>
    <tr><td>MJC</td><td>{$safe($receipt["major_subject"] ?? null)}</td><td>PAYMENT MODE</td><td>{$safe($receipt["payment_mode"])}</td></tr>
    <tr><td>PRACTICAL SUB. (If any)</td><td>{$safe($receipt["practical_subject"])}</td><td>TRANSACTION ID</td><td>{$safe($receipt["transaction_id"])}</td></tr>
  </table>
  <table class="items">
    <thead><tr><th>S.N.</th><th>PARTICULARS</th><th>AMOUNT (INR)</th></tr></thead>
    <tbody>{$items}</tbody>
  </table>
  <table class="totals">
    <tr><td>Gross Total</td><td>{$money($receipt["gross_total"])}</td></tr>
    <tr><td>Practical Fee</td><td>{$money($receipt["practical_fee"])}</td></tr>
    <tr><td>Other Fee</td><td>{$money($receipt["other_fee"])}</td></tr>
    <tr><td>Net Total Fee</td><td>{$money((float)$receipt["gross_total"] + (float)$receipt["practical_fee"] + (float)$receipt["other_fee"])}</td></tr>
    <tr><td>Advance / Back Dues</td><td>{$money($receipt["advance_back_dues"])}</td></tr>
    <tr><td>Concession / Discount</td><td>{$money($receipt["discount_amount"])}</td></tr>
    <tr><td>Total Amount to be Paid</td><td>{$money($receipt["total_payable"])}</td></tr>
    <tr><td>Paid Amount</td><td>{$money($receipt["paid_amount"])}</td></tr>
    <tr><td>Advance / Dues</td><td>{$money($receipt["balance_amount"])}</td></tr>
  </table>
  <div class="remark"><strong>Remark (If any) - </strong>{$safe($receipt["remarks"])}</div>
  <div class="notes">
    <div>&#9670; Online payments are subject to Accounts verification. Any reversal or return must be reimbursed by the student.</div>
    <div>&#9670; This is a computer-generated receipt and does not require a signature.</div>
    <div>&#9670; Please contact the College office in case of any discrepancy.</div>
  </div>
</div>
</body>
</html>
HTML;
}
