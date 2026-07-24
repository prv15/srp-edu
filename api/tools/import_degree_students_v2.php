<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_time_limit(0);
ini_set('memory_limit', '1024M');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

echo "<h1>SRP ERP Degree College Import Tool</h1>";
echo "<hr>";

$files = [

    [
        'file'       => __DIR__.'/UG - Admission Register 2024-2028.xlsx',
        'session'    => '2024-2028',
        'headerRow'  => 11,
        'startRow'   => 12
    ],

    [
    'file'      => __DIR__.'/UG - Admission Register 2025-2029.xlsx',
    'session'   => '2025-2029',
    'headerRow' => 12,
    'startRow'  => 13
]

];
function getId(PDO $db, string $table, string $column, string $value): ?int
{
    $stmt = $db->prepare(
        "SELECT id FROM {$table} WHERE {$column}=? LIMIT 1"
    );

    $stmt->execute([$value]);

    $id = $stmt->fetchColumn();

    return $id ? (int)$id : null;
}

function excel(array $row, array $possibleColumns): string
{
    foreach($possibleColumns as $column){

        if(isset($row[$column])){

            $value=trim((string)$row[$column]);

            if($value!==""){
                return $value;
            }

        }

    }

    return "";
}

function cleanMobile(string $mobile): string
{
    return preg_replace('/[^0-9]/','',$mobile);
}

function cleanAadhaar(string $aadhaar): string
{
    return preg_replace('/[^0-9]/','',$aadhaar);
}

function mysqlDate(string $date): ?string
{
    if(trim($date)==""){
        return null;
    }

    $time=strtotime($date);

    if(!$time){
        return null;
    }

    return date('Y-m-d',$time);
}
/*
|--------------------------------------------------------------------------
| Load Master IDs
|--------------------------------------------------------------------------
*/

$master = [

    'institute' => getId(
        $db,
        'institutes',
        'code',
        'degree'
    ),

    'departments' => [

        'Arts'      => getId($db,'departments','name','Arts'),
        'Science'   => getId($db,'departments','name','Science'),
        'Commerce'  => getId($db,'departments','name','Commerce')

    ],

    'courses' => [

        'Arts'      => getId($db,'courses','course_name','Bachelor of Arts'),
        'Science'   => getId($db,'courses','course_name','Bachelor of Science'),
        'Commerce'  => getId($db,'courses','course_name','Bachelor of Commerce')

    ],

    'sessions' => [

        '2024-2028' => getId($db,'academic_sessions','session_name','2024-2028'),
        '2025-2029' => getId($db,'academic_sessions','session_name','2025-2029')

    ]

];

echo "<h3>Master Data</h3>";

echo "<pre>";

print_r($master);

echo "</pre>";
/*
|--------------------------------------------------------------------------
| Import Statistics
|--------------------------------------------------------------------------
*/

$stats = [

    'students'   => 0,
    'guardians'  => 0,
    'duplicates' => 0,
    'errors'     => 0

];
/*
|--------------------------------------------------------------------------
| Read Excel Files
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Start Database Transaction
|--------------------------------------------------------------------------
*/

$db->beginTransaction();

try {

    /*
    |--------------------------------------------------------------------------
    | Prepare Student Insert
    |--------------------------------------------------------------------------
    */

    $studentInsert = $db->prepare("
        INSERT INTO students
        (
            student_uid,
            institute_id,
            session_id,
            department_id,
            course_id,

            admission_form_no,
            admission_no,
            college_roll_no,
            registration_no,
            university_roll_no,

            student_name,
            gender,
            dob,
            category,

            mobile,
            email,
            aadhaar,

            admission_date,
            last_education,

            status,
            created_at,
            updated_at
        )
        VALUES
        (
            ?,?,?,?,?,?,
            ?,?,?,?,
            ?,?,?,?,
            ?,?,?,
            ?,?,
            'Active',
            NOW(),
            NOW()
        )
    ");

    /*
    |--------------------------------------------------------------------------
    | Prepare Guardian Insert
    |--------------------------------------------------------------------------
    */

    $guardianInsert = $db->prepare("
        INSERT INTO student_guardians
        (
            student_id,

            father_name,
            father_mobile,
            father_aadhaar,
            father_occupation,

           mother_name,
mother_mobile,
mother_aadhaar,
guardian_name,
guardian_mobile
        )
       VALUES
(
    ?,?,?,?,?,?,?,?,?,?
)
    ");
	$studentSerial = 1;
	$stmt = $db->query("
    SELECT COUNT(*) 
    FROM students
");

$studentSerial = (int)$stmt->fetchColumn() + 1;
foreach ($files as $workbook) {
	$studentUid = "SRP"
            . date("y")
            . str_pad(
                $studentSerial,
                6,
                "0",
                STR_PAD_LEFT
            );

$studentSerial++;

    echo "<hr>";
    echo "<h2>Academic Session : {$workbook['session']}</h2>";

    if (!file_exists($workbook['file'])) {

        echo "<span style='color:red'>Workbook not found.</span>";

        continue;

    }

    $spreadsheet = IOFactory::load($workbook['file']);

    foreach (['Arts','Science','Commerce'] as $sheetName) {

        echo "<h3>Department : {$sheetName}</h3>";

        $sheet = $spreadsheet->getSheetByName($sheetName);

        if (!$sheet) {

            echo "Sheet not found.<br>";

            continue;

        }

        $highestRow = $sheet->getHighestRow();

        $highestColumn = Coordinate::columnIndexFromString(
            $sheet->getHighestColumn()
        );

     

    }
	/*
|--------------------------------------------------------------------------
| Read Header Row
|--------------------------------------------------------------------------
*/

$headers = [];

for ($i = 1; $i <= $highestColumn; $i++) {

    $column = Coordinate::stringFromColumnIndex($i);

    $heading = trim(
        (string)$sheet
            ->getCell($column . $workbook['headerRow'])
            ->getFormattedValue()
    );

    if ($heading != "") {
        $headers[$column] = strtoupper($heading);
    }
}

echo "Rows : <b>{$highestRow}</b><br>";
echo "Columns : <b>{$highestColumn}</b><br>";

echo "<details>";
echo "<summary><b>View Headers</b></summary>";

echo "<pre>";

foreach ($headers as $column => $heading) {

    echo $column . " => " . $heading . PHP_EOL;

}

echo "</pre>";

echo "</details>";

/*
|--------------------------------------------------------------------------
| Read Student Rows
|--------------------------------------------------------------------------
*/

echo "<table border='1' cellpadding='5' cellspacing='0'>";

echo "<tr>
<th>#</th>
<th>Admission No</th>
<th>Student Name</th>
<th>Father</th>
<th>Father Mobile</th>
</tr>";

$count = 0;

for ($row = $workbook['startRow']; $row <= $highestRow; $row++) {

    $student = [];

    foreach ($headers as $column => $heading) {

        $student[$heading] = trim(
            (string)$sheet
                ->getCell($column.$row)
                ->getFormattedValue()
        );

    }

    if (empty($student["STUDENT'S NAME"])) {
        continue;
    }

    $count++;

    /*
    |--------------------------------------------------------------------------
    | Generate Student UID
    |--------------------------------------------------------------------------
    */

   $studentUid = "SRP"
            . date("y")
            . str_pad($studentSerial, 6, "0", STR_PAD_LEFT);

$studentSerial++;

    /*
    |--------------------------------------------------------------------------
    | Insert Student
    |--------------------------------------------------------------------------
    */
	$cycle = null;

$admissionDate = mysqlDate(
    excel($student,["ADMISSION  DATE"])
);

if($admissionDate){

    $month = date(
        "n",
        strtotime($admissionDate)
    );

    $cycle = ($month <= 6)
        ? "January"
        : "July";

}
	$address = trim(

    excel($student,["AT"])."\n".

    excel($student,["PO"])."\n".

    excel($student,["PS"])

);
$duplicate = $db->prepare("
SELECT id
FROM students
WHERE admission_form_no = ?
LIMIT 1
");

$duplicate->execute([
    excel($student,["COLLEGE ADM. FORM NO."])
]);

if($duplicate->fetch()){

    $stats['duplicates']++;

    continue;

}
    $studentInsert->execute([

        $studentUid,

        $master['institute'],
        $master['sessions'][$workbook['session']],
        $master['departments'][$sheetName],
        $master['courses'][$sheetName],

        excel($student,["COLLEGE ADM. FORM NO."]),

        excel($student,[
            "COLLEGE ADMISSION NO.",
            "COLLEGE ADM. FORM NO."
        ]),

        excel($student,["COLLEGE ID / ROLL NO."]),

        excel($student,["REGISTRATION NO."]),

        excel($student,["PU EXAM ROLL NO."]),

        excel($student,["STUDENT'S NAME"]),

        excel($student,["GEN DER"]),

        mysqlDate(
            excel($student,["DOB"])
        ),

        excel($student,["CATE GORY"]),

        excel($student,["STUDENT'S MOBILE NO."]),

        excel($student,["STUDENT'S EMAIL ID"]),

        cleanAadhaar(
            excel($student,["STUDENT'S AADHAR NO."])
        ),							



        mysqlDate(
            excel($student,["ADMISSION  DATE"])
        ),

        excel($student,["LAST EDUCATION"])

    ]);

    /*
    |--------------------------------------------------------------------------
    | Get Student ID
    |--------------------------------------------------------------------------
    */

    $studentId = $db->lastInsertId();

    /*
    |--------------------------------------------------------------------------
    | Insert Guardian
    |--------------------------------------------------------------------------
    */

    $guardianInsert->execute([

        $studentId,

        excel($student,["FATHERS' NAME"]),

        cleanMobile(
            excel($student,["FATHER'S MOBILE NO."])
        ),

        cleanAadhaar(
            excel($student,["FATHER'S AADHAR NO."])
        ),

        excel($student,["OCCUPATION"]),

        excel($student,["MOTHERS' NAME"]),

        cleanMobile(
            excel($student,["MOTHER'S MOBILE NO."])
        ),

        cleanAadhaar(
            excel($student,["MOTHER'S AADHAR NO."])
        ),

        "",

        ""

    ]);

    $stats['students']++;
    $stats['guardians']++;

}

echo "</table>";

echo "<br><b>Total Students :</b> {$count}<br><hr>";

}
	    $db->commit();

    echo "<hr>";
    echo "<h2 style='color:green'>Import Completed Successfully</h2>";

}
catch(Exception $e){

    $db->rollBack();

    echo "<h2 style='color:red'>Import Failed</h2>";

    echo "<pre>";
    echo $e->getMessage();
    echo "</pre>";

}
