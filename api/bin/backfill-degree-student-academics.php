<?php

declare(strict_types=1);

if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit;
}

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../config/database.php";

use PhpOffice\PhpSpreadsheet\IOFactory;

$sources = collectSources(array_slice($argv, 1) ?: [__DIR__ . "/../tools"]);
if ($sources === []) {
    fwrite(STDERR, "No CSV or XLSX admission registers were found.\n");
    exit(1);
}

$instituteStatement = $db->prepare(
    "SELECT id FROM institutes WHERE code = :code LIMIT 1"
);
$instituteStatement->execute([":code" => "degree"]);
$instituteId = (int)$instituteStatement->fetchColumn();
if ($instituteId <= 0) {
    fwrite(STDERR, "Degree College institute was not found.\n");
    exit(1);
}

$studentStatement = $db->prepare(
    "SELECT id, course_id, department_id
     FROM students
     WHERE institute_id = :institute
       AND (
           (admission_form_no <> '' AND admission_form_no = :admission_form)
           OR (admission_no <> '' AND admission_no = :admission_no)
           OR (college_roll_no <> '' AND college_roll_no = :college_roll)
       )
     ORDER BY
       CASE
           WHEN admission_form_no = :admission_form_order THEN 1
           WHEN admission_no = :admission_no_order THEN 2
           ELSE 3
       END
     LIMIT 1"
);
$studentByAcademicContextStatement = $db->prepare(
    "SELECT student.id, student.course_id, student.department_id
     FROM students student
     INNER JOIN courses course ON course.id = student.course_id
     INNER JOIN academic_sessions academic_session
        ON academic_session.id = student.session_id
     WHERE student.institute_id = :institute
       AND UPPER(TRIM(student.student_name)) = UPPER(TRIM(:student_name))
       AND academic_session.session_name = :academic_session
       AND course.course_name = :course
     ORDER BY student.id ASC
     LIMIT 1"
);
$disciplineStatement = $db->prepare(
    "INSERT INTO subject_disciplines
        (institute_id, department_id, name, status)
     VALUES
        (:institute, :department, UPPER(TRIM(:major_subject)), 'Active')
     ON DUPLICATE KEY UPDATE
        department_id = COALESCE(department_id, VALUES(department_id)),
        id = LAST_INSERT_ID(id)"
);
$updateStatement = $db->prepare(
    "UPDATE students
     SET major_subject_id = :major_subject
     WHERE id = :student
       AND institute_id = :institute
       AND (major_subject_id IS NULL OR major_subject_id <> :major_subject_check)"
);

$stats = [
    "updated" => 0,
    "unchanged" => 0,
    "unmatched_students" => 0,
    "rows" => 0,
];

$processRow = static function (
    array $row,
    array $academicContext
) use (
    $db,
    $instituteId,
    $studentStatement,
    $studentByAcademicContextStatement,
    $disciplineStatement,
    $updateStatement,
    &$stats
): void {
    $majorSubject = firstValue($row, ["MJC"]);
    $studentName = firstValue($row, ["STUDENT'S NAME"]);
    if ($majorSubject === "" || $studentName === "") {
        return;
    }
    $stats["rows"]++;

    $admissionForm = firstValue($row, ["COLLEGE ADM. FORM NO."]);
    $admissionNo = firstValue($row, [
        "COLLEGE ADMISSION NO.",
        "COLLEGE ADM. FORM NO.",
    ]);
    $collegeRoll = firstValue($row, [
        "COLLEGE ID / ROLL NO.",
        "COLLEGE ID ROLL NO.",
    ]);

    $studentStatement->execute([
        ":institute" => $instituteId,
        ":admission_form" => $admissionForm,
        ":admission_no" => $admissionNo,
        ":college_roll" => $collegeRoll,
        ":admission_form_order" => $admissionForm,
        ":admission_no_order" => $admissionNo,
    ]);
    $student = $studentStatement->fetch();
    if (!$student) {
        $studentByAcademicContextStatement->execute([
            ":institute" => $instituteId,
            ":student_name" => $studentName,
            ":academic_session" => $academicContext["session"],
            ":course" => $academicContext["course"],
        ]);
        $student = $studentByAcademicContextStatement->fetch();
    }
    if (!$student) {
        $stats["unmatched_students"]++;
        return;
    }

    $disciplineStatement->execute([
        ":institute" => $instituteId,
        ":department" => (int)$student["department_id"],
        ":major_subject" => $majorSubject,
    ]);
    $majorSubjectId = (int)$db->lastInsertId();

    $updateStatement->execute([
        ":major_subject" => $majorSubjectId,
        ":student" => (int)$student["id"],
        ":institute" => $instituteId,
        ":major_subject_check" => $majorSubjectId,
    ]);
    if ($updateStatement->rowCount() > 0) {
        $stats["updated"]++;
    } else {
        $stats["unchanged"]++;
    }
};

$db->beginTransaction();
try {
    foreach ($sources as $source) {
        $extension = strtolower(pathinfo($source, PATHINFO_EXTENSION));
        if ($extension === "csv") {
            $context = academicContext($source);
            if ($context !== null) {
                foreach (csvRows($source) as $row) {
                    $processRow($row, $context);
                }
            }
            continue;
        }

        $workbook = IOFactory::load($source);
        foreach ($workbook->getWorksheetIterator() as $worksheet) {
            $context = academicContext($source, $worksheet->getTitle());
            if ($context === null) {
                continue;
            }
            foreach (tabularRows($worksheet->toArray(null, true, true, false)) as $row) {
                $processRow($row, $context);
            }
        }
        $workbook->disconnectWorksheets();
        unset($workbook);
    }
    $db->commit();
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    fwrite(STDERR, "Academic backfill failed: {$exception->getMessage()}\n");
    exit(1);
}

fwrite(STDOUT, sprintf(
    "Source rows: %d; major subjects updated: %d; already current: %d; unmatched students: %d.\n",
    $stats["rows"],
    $stats["updated"],
    $stats["unchanged"],
    $stats["unmatched_students"]
));

function collectSources(array $inputs): array
{
    $sources = [];
    foreach ($inputs as $input) {
        if (is_file($input) && preg_match("/\\.(csv|xlsx)$/i", $input)) {
            $sources[] = realpath($input) ?: $input;
            continue;
        }
        if (!is_dir($input)) {
            continue;
        }
        foreach (["*.csv", "*.xlsx"] as $pattern) {
            foreach (glob(rtrim($input, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $pattern) ?: [] as $file) {
                $sources[] = realpath($file) ?: $file;
            }
        }
    }
    return array_values(array_unique($sources));
}

function csvRows(string $file): Generator
{
    $handle = fopen($file, "rb");
    if ($handle === false) {
        return;
    }
    try {
        $rows = [];
        while (($row = fgetcsv($handle, null, ",", "\"", "\\")) !== false) {
            $rows[] = $row;
        }
        yield from tabularRows($rows);
    } finally {
        fclose($handle);
    }
}

function tabularRows(array $rows): Generator
{
    $headers = null;
    foreach ($rows as $values) {
        $normalized = array_map("normalizeHeader", $values);
        if ($headers === null) {
            if (in_array("MJC", $normalized, true)
                && in_array("STUDENT'S NAME", $normalized, true)) {
                $headers = $normalized;
            }
            continue;
        }

        $row = [];
        foreach ($headers as $index => $header) {
            if ($header !== "") {
                $row[$header] = trim((string)($values[$index] ?? ""));
            }
        }
        yield $row;
    }
}

function normalizeHeader(mixed $header): string
{
    $value = strtoupper(trim((string)$header));
    $value = str_replace("&", "/", $value);
    return trim(preg_replace("/\\s+/", " ", $value) ?? "");
}

function firstValue(array $row, array $keys): string
{
    foreach ($keys as $key) {
        $value = trim((string)($row[$key] ?? ""));
        if ($value !== "") {
            return $value;
        }
    }
    return "";
}

function academicContext(string $file, ?string $sheet = null): ?array
{
    if (!preg_match("/(20\\d{2})\\s*[-–]\\s*(20\\d{2})/", basename($file), $sessionMatch)) {
        return null;
    }
    $source = strtolower((string)($sheet ?: basename($file)));
    $courses = [
        "arts" => "Bachelor of Arts",
        "science" => "Bachelor of Science",
        "commerce" => "Bachelor of Commerce",
    ];
    foreach ($courses as $keyword => $course) {
        if (str_contains($source, $keyword)) {
            return [
                "session" => "{$sessionMatch[1]}-{$sessionMatch[2]}",
                "course" => $course,
            ];
        }
    }
    return null;
}
