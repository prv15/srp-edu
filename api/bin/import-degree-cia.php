<?php

declare(strict_types=1);

if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit;
}

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../config/database.php";

use PhpOffice\PhpSpreadsheet\IOFactory;

$path = $argv[1] ?? "";
if ($path === "" || !is_file($path)) {
    fwrite(STDERR, "Usage: php api/bin/import-degree-cia.php /absolute/path/to/cia-marksheet.xlsx\n");
    exit(1);
}

$instituteId = (int)$db->query(
    "SELECT id FROM institutes WHERE code = 'degree' LIMIT 1"
)->fetchColumn();
$sessionId = (int)$db->query(
    "SELECT id FROM academic_sessions
     WHERE institute_id = {$instituteId} AND session_name = '2025-2029' LIMIT 1"
)->fetchColumn();

$courseMap = [
    "BA" => "Bachelor of Arts",
    "BSC" => "Bachelor of Science",
    "BCOM" => "Bachelor of Commerce",
];
$courseStatement = $db->prepare(
    "SELECT c.id, c.department_id FROM courses c
     WHERE c.institute_id = :institute AND c.course_name = :name LIMIT 1"
);
$semesterStatement = $db->prepare(
    "SELECT id FROM course_semesters
     WHERE institute_id = :institute AND course_id = :course AND semester_no = :semester LIMIT 1"
);
$subjectStatement = $db->prepare(
    "INSERT INTO subjects
        (institute_id, course_id, department_id, semester_id, code, name,
         paper_category, paper_title, delivery_type, max_cia_marks, status)
     VALUES
        (:institute, :course, :department, :semester, :code, :name,
         :category, :title, :delivery, :max_marks, 'Active')
     ON DUPLICATE KEY UPDATE
        name = VALUES(name), paper_category = VALUES(paper_category),
        paper_title = VALUES(paper_title), delivery_type = VALUES(delivery_type),
        max_cia_marks = VALUES(max_cia_marks), id = LAST_INSERT_ID(id)"
);
$examStatement = $db->prepare(
    "INSERT INTO examinations
        (institute_id, academic_session_id, semester_id, exam_type, name, status)
     VALUES (:institute, :session, :semester, 'CIA', :name, 'Completed')
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)"
);
$paperStatement = $db->prepare(
    "INSERT INTO examination_papers
        (institute_id, examination_id, subject_id, max_marks, passing_marks)
     VALUES (:institute, :exam, :subject, :max_marks, :passing_marks)
     ON DUPLICATE KEY UPDATE max_marks = VALUES(max_marks), id = LAST_INSERT_ID(id)"
);
$studentStatement = $db->prepare(
    "SELECT id FROM students
     WHERE institute_id = :institute AND college_roll_no = :roll LIMIT 1"
);
$studentByNameStatement = $db->prepare(
    "SELECT MIN(id) AS id, COUNT(*) AS matches
     FROM students
     WHERE institute_id = :institute AND course_id = :course
       AND session_id = :session AND UPPER(TRIM(student_name)) = :name"
);
$resultStatement = $db->prepare(
    "INSERT INTO student_exam_results
        (examination_paper_id, student_id, marks_obtained, attendance_status)
     VALUES (:paper, :student, :marks, 'Present')
     ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained)"
);

$sheet = IOFactory::load($path)->getActiveSheet();
$subjects = [];
$results = 0;
$unmatched = 0;
$db->beginTransaction();
try {
    foreach ($sheet->toArray(null, true, true, false) as $row) {
        if (trim((string)($row[0] ?? "")) === "S.No." || !is_numeric($row[14] ?? null)) {
            continue;
        }

        $courseKey = strtoupper(preg_replace('/[^A-Z]/i', '', (string)($row[7] ?? "")));
        $courseName = $courseMap[$courseKey] ?? null;
        $code = trim((string)($row[10] ?? ""));
        if (!$courseName || $code === "") {
            continue;
        }

        $semesterNumber = (int)filter_var(
            (string)($row[5] ?? "1"),
            FILTER_SANITIZE_NUMBER_INT
        ) ?: 1;
        $courseStatement->execute([":institute" => $instituteId, ":name" => $courseName]);
        $course = $courseStatement->fetch();
        if (!$course) continue;
        $semesterStatement->execute([
            ":institute" => $instituteId,
            ":course" => $course["id"],
            ":semester" => $semesterNumber,
        ]);
        $semesterId = (int)$semesterStatement->fetchColumn();
        if ($semesterId <= 0) continue;

        $maxMarks = (float)$row[14];
        $delivery = strcasecmp(trim((string)($row[13] ?? "")), "Practical") === 0
            ? "Practical" : "Theory";
        $subjectStatement->execute([
            ":institute" => $instituteId,
            ":course" => $course["id"],
            ":department" => $course["department_id"],
            ":semester" => $semesterId,
            ":code" => $code,
            ":name" => trim((string)($row[11] ?? $code)),
            ":category" => trim((string)($row[9] ?? "")) ?: null,
            ":title" => trim((string)($row[12] ?? "")) ?: null,
            ":delivery" => $delivery,
            ":max_marks" => $maxMarks,
        ]);
        $subjectId = (int)$db->lastInsertId();
        $subjects[$courseName . ":" . $code] = true;

        $examStatement->execute([
            ":institute" => $instituteId,
            ":session" => $sessionId,
            ":semester" => $semesterId,
            ":name" => "CIA {$semesterNumber} Semester - December 2025",
        ]);
        $examId = (int)$db->lastInsertId();
        $paperStatement->execute([
            ":institute" => $instituteId,
            ":exam" => $examId,
            ":subject" => $subjectId,
            ":max_marks" => $maxMarks,
            ":passing_marks" => round($maxMarks * 0.4, 2),
        ]);
        $paperId = (int)$db->lastInsertId();

        $roll = trim((string)($row[1] ?? ""));
        $studentStatement->execute([":institute" => $instituteId, ":roll" => $roll]);
        $studentId = (int)$studentStatement->fetchColumn();
        if ($studentId <= 0) {
            $studentByNameStatement->execute([
                ":institute" => $instituteId,
                ":course" => $course["id"],
                ":session" => $sessionId,
                ":name" => mb_strtoupper(trim((string)($row[4] ?? ""))),
            ]);
            $nameMatch = $studentByNameStatement->fetch();
            $studentId = (int)($nameMatch["matches"] ?? 0) === 1
                ? (int)$nameMatch["id"]
                : 0;
        }
        if ($studentId <= 0) {
            $unmatched++;
            continue;
        }
        if (is_numeric($row[15] ?? null)) {
            $resultStatement->execute([
                ":paper" => $paperId,
                ":student" => $studentId,
                ":marks" => (float)$row[15],
            ]);
            $results++;
        }
    }
    $db->commit();
    fwrite(STDOUT, sprintf(
        "Imported %d subject offerings and %d matched CIA results; %d source rows had no matching local student.\n",
        count($subjects),
        $results,
        $unmatched
    ));
} catch (Throwable $exception) {
    $db->rollBack();
    fwrite(STDERR, "Import failed: {$exception->getMessage()}\n");
    exit(1);
}
