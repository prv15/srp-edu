<?php

declare(strict_types=1);

if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit;
}

require_once __DIR__ . "/../config/database.php";

$studentId = isset($argv[1]) ? (int)$argv[1] : 0;
$studentStatement = $db->prepare(
    "SELECT id, institute_id, session_id, semester_id, course_id
     FROM students
     WHERE institute_id = (
         SELECT id FROM institutes WHERE code = 'degree' LIMIT 1
     )
       AND (:student_id = 0 OR id = :student_id_match)
       AND semester_id IS NOT NULL
     ORDER BY student_name ASC, id ASC
     LIMIT 1"
);
$studentStatement->execute([
    ":student_id" => $studentId,
    ":student_id_match" => $studentId,
]);
$student = $studentStatement->fetch();
if (!$student) {
    fwrite(STDERR, "A matching Degree College student was not found.\n");
    exit(1);
}

$existingStatement = $db->prepare(
    "SELECT id, student_id, receipt_no
     FROM fee_receipts
     WHERE institute_id = :institute
       AND receipt_no = 'SAMPLE-UG-001'
     LIMIT 1"
);
$existingStatement->execute([":institute" => $student["institute_id"]]);
$existing = $existingStatement->fetch();
if ($existing) {
    echo json_encode($existing), PHP_EOL;
    exit;
}

$userId = (int)$db->query(
    "SELECT user.id
     FROM users user
     INNER JOIN roles role ON role.id = user.role_id
     WHERE user.status = 'Active'
     ORDER BY (role.code = 'super_admin') DESC, user.id ASC
     LIMIT 1"
)->fetchColumn();
if ($userId <= 0) {
    fwrite(STDERR, "An active receipt issuer was not found.\n");
    exit(1);
}

$items = [
    ["PART - A", "Admission Fee", 350.00],
    ["PART - A", "Tuition Fee", 600.00],
    ["PART - A", "Cultural Tarang", 25.00],
    ["PART - B (MISCELLANEOUS)", "Library", 200.00],
    ["PART - B (MISCELLANEOUS)", "Identity Card", 100.00],
    ["PART - B (MISCELLANEOUS)", "NSS Fee + Athletics Fund", 150.00],
    ["PART - B (MISCELLANEOUS)", "Building Maintenance Fund + Electricity Fee", 300.00],
    ["PART - B (MISCELLANEOUS)", "Medical Fee", 100.00],
    ["PART - B (MISCELLANEOUS)", "Common Room Fund + Co-Curricular Fee", 100.00],
    ["PART - B (MISCELLANEOUS)", "Environmental Protection Fee", 50.00],
    ["PART - B (MISCELLANEOUS)", "Student Welfare Fee + Union Fee", 130.00],
    ["PART - B (MISCELLANEOUS)", "Society Subscription + Handbook / Directory + Magazine Fund", 150.00],
];

$db->beginTransaction();
try {
    $receiptStatement = $db->prepare(
        "INSERT INTO fee_receipts (
            institute_id, student_id, academic_session_id, semester_id,
            receipt_no, receipt_template, period_label, payment_mode,
            transaction_id, gross_total, practical_fee, other_fee,
            advance_back_dues, discount_amount, total_payable, paid_amount,
            balance_amount, remarks, issued_at, created_by
         ) VALUES (
            :institute, :student, :session, :semester,
            'SAMPLE-UG-001', 'UG', 'JULY TO DECEMBER', 'UPI',
            'SAMPLE-TRANSACTION', 2255, 600, 0,
            0, 0, 2855, 2855,
            0, :remarks, NOW(), :created_by
         )"
    );
    $receiptStatement->execute([
        ":institute" => $student["institute_id"],
        ":student" => $student["id"],
        ":session" => $student["session_id"],
        ":semester" => $student["semester_id"],
        ":remarks" => "SAMPLE RECEIPT FOR SOFTWARE DEMONSTRATION - NOT VALID FOR ACCOUNTING.",
        ":created_by" => $userId,
    ]);
    $receiptId = (int)$db->lastInsertId();

    $itemStatement = $db->prepare(
        "INSERT INTO fee_receipt_items (
            receipt_id, section_label, particulars, amount, display_order
         ) VALUES (
            :receipt, :section, :particulars, :amount, :display_order
         )"
    );
    foreach ($items as $index => [$section, $particulars, $amount]) {
        $itemStatement->execute([
            ":receipt" => $receiptId,
            ":section" => $section,
            ":particulars" => $particulars,
            ":amount" => $amount,
            ":display_order" => $index + 1,
        ]);
    }
    $db->commit();

    echo json_encode([
        "id" => $receiptId,
        "student_id" => (int)$student["id"],
        "receipt_no" => "SAMPLE-UG-001",
    ]), PHP_EOL;
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    fwrite(STDERR, "Sample receipt creation failed: {$exception->getMessage()}\n");
    exit(1);
}
