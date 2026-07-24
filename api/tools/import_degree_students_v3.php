<?php

/**
 * ---------------------------------------------------------
 * SRP ERP - Degree Student Import Tool v3
 * ---------------------------------------------------------
 * Author : Tech Pearl Solutions
 * Version: 3.0
 * Purpose:
 * Import Degree College students from Admission Register
 * Excel files into SRP ERP.
 * ---------------------------------------------------------
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_time_limit(0);
ini_set('memory_limit', '1024M');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

echo "<h1>SRP ERP Degree Student Import Tool</h1>";
echo "<hr>";

/*
|--------------------------------------------------------------------------
| Excel Files
|--------------------------------------------------------------------------
|
| Add future workbooks here.
|
*/

$workbooks = [

    [
        'session' => '2024-2028',
        'file' => __DIR__ . '/UG - Admission Register 2024-2028.xlsx'
    ],

    [
        'session' => '2025-2029',
        'file' => __DIR__ . '/UG - Admission Register 2025-2029.xlsx'
    ]

];

/*
|--------------------------------------------------------------------------
| Departments
|--------------------------------------------------------------------------
*/

$departments = [

    'Arts',
    'Science',
    'Commerce'

];

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

$stats = [

    'students'      => 0,
    'guardians'     => 0,
    'duplicates'    => 0,
    'errors'        => 0,
    'workbooks'     => 0,
    'worksheets'    => 0

];

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

function excel(array $row, array $headers): string
{
    foreach ($headers as $header) {

        if (isset($row[$header])) {

            $value = trim((string)$row[$header]);

            if ($value !== '') {
                return $value;
            }

        }

    }

    return '';
}

function cleanMobile(?string $mobile): string
{
    return preg_replace('/[^0-9]/', '', $mobile ?? '');
}

function cleanAadhaar(?string $aadhaar): string
{
    return preg_replace('/[^0-9]/', '', $aadhaar ?? '');
}

function mysqlDate(?string $date): ?string
{
    if (trim((string)$date) == '') {
        return null;
    }

    $time = strtotime($date);

    if (!$time) {
        return null;
    }

    return date('Y-m-d', $time);
}

function getId(
    PDO $db,
    string $table,
    string $column,
    string $value
): ?int {

    $stmt = $db->prepare("
        SELECT id
        FROM {$table}
        WHERE {$column}=?
        LIMIT 1
    ");

    $stmt->execute([$value]);

    $id = $stmt->fetchColumn();

    return $id ? (int)$id : null;
}

echo "<div style='padding:10px;background:#e8f5e9;border:1px solid #4caf50;margin-bottom:20px;'>
Bootstrap Loaded Successfully
</div>";
/*
|--------------------------------------------------------------------------
| Master Data
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

        'Arts' => getId(
            $db,
            'departments',
            'name',
            'Arts'
        ),

        'Science' => getId(
            $db,
            'departments',
            'name',
            'Science'
        ),

        'Commerce' => getId(
            $db,
            'departments',
            'name',
            'Commerce'
        )

    ],

    'courses' => [

        'Arts' => getId(
            $db,
            'courses',
            'course_name',
            'Bachelor of Arts'
        ),

        'Science' => getId(
            $db,
            'courses',
            'course_name',
            'Bachelor of Science'
        ),

        'Commerce' => getId(
            $db,
            'courses',
            'course_name',
            'Bachelor of Commerce'
        )

    ],

    'sessions' => [

        '2024-2028' => getId(
            $db,
            'academic_sessions',
            'session_name',
            '2024-2028'
        ),

        '2025-2029' => getId(
            $db,
            'academic_sessions',
            'session_name',
            '2025-2029'
        )

    ]

];

if(
    !$master['institute']
){

    die("Institute not found.");

}

/*
|--------------------------------------------------------------------------
| Auto Header Detection
|--------------------------------------------------------------------------
*/

function detectHeaderRow(
    Worksheet $sheet
): int
{

    $highestColumn = Coordinate::columnIndexFromString(
        $sheet->getHighestColumn()
    );

    /*
    Search first 20 rows
    */

    for(
        $row = 1;
        $row <= 20;
        $row++
    ){

        for(
            $col = 1;
            $col <= $highestColumn;
            $col++
        ){

            $letter = Coordinate::stringFromColumnIndex(
                $col
            );

            $value = strtoupper(
                trim(
                    (string)$sheet
                        ->getCell(
                            $letter.$row
                        )
                        ->getFormattedValue()
                )
            );

            if(

                strpos(
                    $value,
                    "COLLEGE ADM. FORM NO."
                ) !== false

                ||

                strpos(
                    $value,
                    "STUDENT'S NAME"
                ) !== false

            ){

                return $row;

            }

        }

    }

    throw new Exception(

        "Unable to detect header row in sheet : ".
        $sheet->getTitle()

    );

}

/*
|--------------------------------------------------------------------------
| Read Headers
|--------------------------------------------------------------------------
*/

function getHeaders($sheet, $headerRow)
{
    $headers = [];
    $duplicates = [];

    $highestColumn = $sheet->getHighestColumn();

    $column = 'A';

    while(true){

        $heading = trim(
            (string)$sheet
                ->getCell($column.$headerRow)
                ->getFormattedValue()
        );

        if($heading != ""){

            $heading = preg_replace('/\s+/', ' ', $heading);

            if(isset($duplicates[$heading])){

                $duplicates[$heading]++;

                $heading .= "_".$duplicates[$heading];

            }else{

                $duplicates[$heading] = 1;

            }

            $headers[$column] = $heading;

        }

        if($column == $highestColumn){
            break;
        }

        $column++;

    }

    return $headers;
}

echo "<div style='padding:10px;background:#e3f2fd;border:1px solid #2196f3;margin-bottom:20px;'>

Master Data Loaded<br>

Automatic Header Detection Ready

</div>";
echo "<hr>";
echo "<h2>Stage 1 - Reading Excel Files</h2>";

try{

	$db->beginTransaction();

	$studentInsert = $db->prepare("
INSERT INTO students(

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

address,
city,
district,
state,
pincode,

admission_date,
admission_cycle,
last_education,
status

)

VALUES(

?,?,?,?,?,

?,?,?,?,?,

?,?,?,?,?,?,?,

?,?,?,?,?,

?,?,?,?

)
");
	/*
|--------------------------------------------------------------------------
| Master ID Maps
|--------------------------------------------------------------------------
*/

$instituteId = getId(
    $db,
    "institutes",
    "code",
    "degree"
);



if(!$instituteId){
    throw new Exception("Degree Institute not found.");
}

echo "<div style='padding:10px;background:#e8f5e9;
border:1px solid #4caf50;
margin-bottom:20px;'>";

echo "Database Transaction Started";

echo "</div>";

	/*
|--------------------------------------------------------------------------
| Global Student Serial
|--------------------------------------------------------------------------
*/

$studentSerial = 1;
	$headerDebugShown = false;
/*
|--------------------------------------------------------------------------
| Import Statistics
|--------------------------------------------------------------------------
*/

$stats = [
    'inserted' => 0,
    'duplicates' => 0,
    'guardians' => 0,
    'errors' => 0
];

/*
|--------------------------------------------------------------------------
| Global Student UID Counter
|--------------------------------------------------------------------------
*/

$studentSerial = 1;

/*
|--------------------------------------------------------------------------
| Load Existing Admission Numbers
|--------------------------------------------------------------------------
*/

$existingAdmissions = [];

$stmt = $db->query("
    SELECT admission_form_no
    FROM students
    WHERE admission_form_no IS NOT NULL
");

while($row = $stmt->fetch(PDO::FETCH_ASSOC)){

    $existingAdmissions[
        trim($row['admission_form_no'])
    ] = true;
	try{

    $studentInsert->execute([

        $studentUid,
        $instituteId,
        $sessionId,
        $departmentId,
        $courseId,

        $admissionFormNo,
        $admissionNo,
        $collegeRollNo,
        $registrationNo,
        $universityRollNo,

        $studentName,
        $gender,
        $dob,
        $category,
        $mobile,
        $email,
        $aadhaar,

        $currentAddress,
        "",
        $currentDistrict,
        $currentState,
        $currentPincode,

        $admissionDate,
        $admissionCycle,
        $lastEducation,
        "Active"

    ]);

    $studentId = (int)$db->lastInsertId();

    $stats['inserted']++;

}catch(Exception $e){

    $stats['errors']++;

    echo "<div style='color:red'>";

    echo $studentName." : ".$e->getMessage();

    echo "</div>";

    continue;

}

}

echo "<div style='padding:10px;background:#fff8e1;border:1px solid #ffc107;margin-bottom:20px;'>";

echo "Existing Students Loaded : <b>"
    .count($existingAdmissions).
    "</b>";

echo "</div>";

	$instituteId = getId(
    $db,
    "institutes",
    "code",
    "degree"
);

if(!$instituteId){
    throw new Exception("Degree institute not found.");
}
	
    foreach($workbooks as $workbook){
		

$sessionId = getId(
    $db,
    "academic_sessions",
    "session_name",
    $workbook['session']
);

if(!$sessionId){
    throw new Exception(
        "Session not found : ".$workbook['session']
    );
}

        echo "<hr>";
        echo "<h2>Session : {$workbook['session']}</h2>";

        if(!file_exists($workbook['file'])){
            throw new Exception(
                "Workbook not found : ".$workbook['file']
            );
        }

        $spreadsheet = IOFactory::load(
            $workbook['file']
        );

        foreach($departments as $department){
			
$departmentId = getId(
    $db,
    "departments",
    "name",
    $department
);

if(!$departmentId){
    throw new Exception(
        "Department not found : ".$department
    );
}

switch($department){

    case "Arts":
        $courseName = "Bachelor of Arts";
        break;

    case "Science":
        $courseName = "Bachelor of Science";
        break;

    case "Commerce":
        $courseName = "Bachelor of Commerce";
        break;

    default:
        throw new Exception("Unknown department : ".$department);
}


$courseId = getId(
    $db,
    "courses",
    "course_name",
    $courseName
);

if(!$courseId){
    throw new Exception(
        "Course not found : ".$courseName
    );
}

            echo "<h3>{$department}</h3>";

            $sheet = $spreadsheet->getSheetByName(
                $department
            );

            if(!$sheet){

                echo "<span style='color:red'>
                Sheet Missing
                </span><br>";

                continue;
            }

            /*
            -------------------------
            Detect Header
            -------------------------
            */

            $headerRow = detectHeaderRow($sheet);

            $headers = getHeaders(
                $sheet,
                $headerRow
            );
			if(!$headerDebugShown){

    echo "<details>";
    echo "<summary>Detected Headers</summary>";
    echo "<pre>";
    print_r(array_values($headers));
    echo "</pre>";
    echo "</details>";

    $headerDebugShown = true;

}

            $startRow = $headerRow + 1;

            $highestRow = $sheet->getHighestRow();

            echo "Header Row : <b>{$headerRow}</b><br>";
            echo "Data Starts : <b>{$startRow}</b><br>";
            echo "Last Row : <b>{$highestRow}</b><br>";

            $studentCount = 0;

            $previewShown = false;

            for(
                $row=$startRow;
                $row<=$highestRow;
                $row++
            ){

                $student=[];

                foreach(
                    $headers as $column=>$heading
                ){

                    $student[$heading]=trim(
                        (string)$sheet
                        ->getCell(
                            $column.$row
                        )
                        ->getFormattedValue()
                    );

                }

                if(
                    excel(
                        $student,
                        [
                            "STUDENT'S NAME"
                        ]
                    )==""
                ){
                    continue;
                }

                $studentCount++;
/*
|--------------------------------------------------------------------------
| Generate Student UID
|--------------------------------------------------------------------------
*/

$studentUid = "SRP"
    . date("y")
    . str_pad(
        $studentSerial,
        6,
        "0",
        STR_PAD_LEFT
    );

$studentSerial++;
				/*
|--------------------------------------------------------------------------
| Basic Mapping
|--------------------------------------------------------------------------
*/

$admissionFormNo = excel(
    $student,
    ["COLLEGE ADM. FORM NO."]
);

$admissionNo = excel(
    $student,
    [
        "COLLEGE ADMISSION NO.",
        "COLLEGE ADM. FORM NO."
    ]
);

$collegeRollNo = excel(
    $student,
    [
        "COLLEGE ID / ROLL NO.",
        "COLLEGE ID & ROLL NO."
    ]
);

$registrationNo = excel(
    $student,
    ["REGISTRATION NO."]
);

$universityRollNo = excel(
    $student,
    ["PU EXAM ROLL NO."]
);

$studentName = excel(
    $student,
    ["STUDENT'S NAME"]
);

$fatherName = excel(
    $student,
    [
        "FATHERS' NAME",
        "FATHER'S NAME"
    ]
);

$motherName = excel(
    $student,
    [
        "MOTHERS' NAME",
        "MOTHER'S NAME"
    ]
);

$mobile = cleanMobile(
    excel(
        $student,
        [
            "STUDENT'S MOBILE NO.",
            "STUDENT MOBILE NO.",
            "MOBILE NO.",
            "MOBILE",
            "CONTACT NO.",
            "PHONE NO.",
            "PHONE"
        ]
    )
);

$email = excel(
    $student,
    [
        "STUDENT'S EMAIL ID",
        "EMAIL ID",
        "EMAIL",
        "E-MAIL"
    ]
);

$aadhaar = cleanAadhaar(
    excel(
        $student,
        [
            "STUDENT'S AADHAR NO.",
            "STUDENT'S AADHAAR NO.",
            "AADHAR NO.",
            "AADHAAR NO.",
            "AADHAR",
            "AADHAAR"
        ]
    )
);

$gender = excel(
    $student,
    [
        "GEN DER",
        "GENDER"
    ]
);

$category = excel(
    $student,
    [
        "CATE GORY",
        "CATEGORY"
    ]
);

$dob = mysqlDate(
    excel(
        $student,
        ["DOB"]
    )
);

$admissionDate = mysqlDate(
    excel(
        $student,
        [
            "ADMISSION DATE",
            "ADMISSION  DATE"
        ]
    )
);

$lastEducation = excel(
    $student,
    ["LAST EDUCATION"]
);

/*
|--------------------------------------------------------------------------
| Admission Cycle
|--------------------------------------------------------------------------
*/

$admissionCycle = null;

if($admissionDate){

    $month = (int)date(
        "n",
        strtotime($admissionDate)
    );

    $admissionCycle = ($month <= 6)
        ? "January"
        : "July";

}

/*
|--------------------------------------------------------------------------
| Address
|--------------------------------------------------------------------------
*/

$currentAddress = trim(
    excel($student,["AT"])."\n".
    excel($student,["PO"])."\n".
    excel($student,["PS"])
);

$currentDistrict = excel($student,["DISTRICT"]);
$currentState    = excel($student,["STATE"]);
$currentPincode  = excel($student,["PIN CODE"]);

$permanentAddress = trim(
    excel($student,["AT_2"])."\n".
    excel($student,["PO_2"])."\n".
    excel($student,["PS_2"])
);

$permanentDistrict = excel($student,["DISTRICT_2"]);
$permanentState    = excel($student,["STATE_2"]);
$permanentPincode  = excel($student,["PIN CODE_2"]);
				
$isDuplicate = isset(
    $existingAdmissions[
        trim($admissionFormNo)
    ]
);

if($isDuplicate){

    $stats['duplicates']++;

    continue;

}
				$existingAdmissions[
    trim($admissionFormNo)
] = true;



            if(!$previewShown){

    echo "<pre>";

    print_r([
        "UID"=>$studentUid,
        "Admission"=>$admissionFormNo,
        "Name"=>$studentName,
        "Father"=>$fatherName,
        "Mobile"=>$mobile,
        "Category"=>$category,
        "Cycle"=>$admissionCycle,
        "Duplicate"=>$isDuplicate ? "YES" : "NO"
    ]);

    echo "</pre>";

    $previewShown = true;

}

            }

            echo "<b>Total Students :
            {$studentCount}</b>";

            echo "<hr>";

        }

    }

   echo "<hr>";

echo "<h2>Import Summary</h2>";

echo "<table border='1' cellpadding='8' cellspacing='0'>";

echo "<tr>
<td>Total Existing Students</td>
<td>".count($existingAdmissions)."</td>
</tr>";

echo "<tr>
<td>Duplicates Found</td>
<td>{$stats['duplicates']}</td>
</tr>";

echo "<tr>
<td>Students Inserted</td>
<td>{$stats['inserted']}</td>
</tr>";

echo "<tr>
<td>Guardians Inserted</td>
<td>{$stats['guardians']}</td>
</tr>";

echo "<tr>
<td>Errors</td>
<td>{$stats['errors']}</td>
</tr>";

echo "</table>";

echo "<br><h2 style='color:green'>
Stage 3A Completed Successfully
</h2>";

}
catch(Exception $e){

    echo "<h2 style='color:red'>
    Error
    </h2>";

    echo "<pre>";
    echo $e->getMessage();
    echo "</pre>";

}