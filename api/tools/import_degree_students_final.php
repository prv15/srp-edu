<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

set_time_limit(0);
ini_set('memory_limit','1024M');

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../config/database.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

echo "<h2>SRP ERP Degree Student Import</h2>";

$db->beginTransaction();
$workbooks=[

[
"session"=>"2024-2028",
"file"=>__DIR__."/UG - Admission Register 2024-2028.xlsx"
],

[
"session"=>"2025-2029",
"file"=>__DIR__."/UG - Admission Register 2025-2029.xlsx"
]

];

$departments=[
"Arts",
"Science",
"Commerce"
];
$stats=[

"students"=>0,
"guardians"=>0,
"duplicates"=>0,
"errors"=>0

];
function excel($row,$headers){

foreach($headers as $header){

if(isset($row[$header]) && trim($row[$header])!=""){
return trim($row[$header]);
}

}

return "";

}

function cleanMobile($v){
return preg_replace('/\D/','',$v);
}

function cleanAadhaar($v){
return preg_replace('/\D/','',$v);
}

function mysqlDate($v){

if(trim($v)=="") return null;

$t=strtotime($v);

if(!$t) return null;

return date("Y-m-d",$t);

}
function getId(PDO $db,string $table,string $column,string $value): ?int
{
    $stmt=$db->prepare("
        SELECT id
        FROM {$table}
        WHERE {$column}=?
        LIMIT 1
    ");

    $stmt->execute([$value]);

    $id=$stmt->fetchColumn();

    return $id ? (int)$id : null;
}
$instituteId=getId(
    $db,
    "institutes",
    "code",
    "degree"
);

if(!$instituteId){
    die("Degree institute not found.");
}
$existingAdmissions=[];

$stmt=$db->query("
SELECT admission_form_no
FROM students
WHERE admission_form_no IS NOT NULL
");

while($row=$stmt->fetch(PDO::FETCH_ASSOC)){

    $existingAdmissions[
        trim($row['admission_form_no'])
    ]=true;

}
$studentSerial=1;
$studentInsert=$db->prepare("

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
$guardianInsert=$db->prepare("

INSERT INTO student_guardians(

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

VALUES(

?,

?,?,?,?,

?,?,?,

?,?

)

");
foreach($workbooks as $workbook){

    echo "<hr>";
    echo "<h2>".$workbook['session']."</h2>";

    if(!file_exists($workbook['file'])){
        die("Workbook not found : ".$workbook['file']);
    }

    $sessionId=getId(
        $db,
        "academic_sessions",
        "session_name",
        $workbook['session']
    );

    if(!$sessionId){
        die("Session not found : ".$workbook['session']);
    }

    $spreadsheet=IOFactory::load(
        $workbook['file']
    );

    foreach($departments as $department){

        echo "<h3>".$department."</h3>";

        switch($department){

            case "Arts":
                $courseName="Bachelor of Arts";
                break;

            case "Science":
                $courseName="Bachelor of Science";
                break;

            case "Commerce":
                $courseName="Bachelor of Commerce";
                break;

        }

        $departmentId=getId(
            $db,
            "departments",
            "name",
            $department
        );

        $courseId=getId(
            $db,
            "courses",
            "course_name",
            $courseName
        );

        if(!$departmentId){
            die("Department missing : ".$department);
        }

        if(!$courseId){
            die("Course missing : ".$courseName);
        }

        $sheet=$spreadsheet->getSheetByName($department);

        if(!$sheet){

            echo "Sheet Missing<br>";

            continue;

        }

        $highestColumn=$sheet->getHighestColumn();
        $highestRow=$sheet->getHighestRow();
		        $headerRow=0;

        for($r=1;$r<=20;$r++){

            $col='A';

            while(true){

                $value=strtoupper(
                    trim(
                        (string)$sheet
                        ->getCell($col.$r)
                        ->getFormattedValue()
                    )
                );

                if(
                    strpos($value,"STUDENT'S NAME")!==false ||
                    strpos($value,"COLLEGE ADM. FORM NO.")!==false
                ){

                    $headerRow=$r;

                    break 2;

                }

                if($col==$highestColumn){
                    break;
                }

                $col++;

            }

        }

        if(!$headerRow){

            echo "Header Not Found<br>";

            continue;

        }
		        $headers=[];

        $duplicates=[];

        $col='A';

        while(true){

            $heading=trim(
                (string)$sheet
                ->getCell($col.$headerRow)
                ->getFormattedValue()
            );

            if($heading!=""){

                if(isset($duplicates[$heading])){

                    $duplicates[$heading]++;

                    $heading.="_".$duplicates[$heading];

                }else{

                    $duplicates[$heading]=1;

                }

                $headers[$col]=$heading;

            }

            if($col==$highestColumn){
                break;
            }

            $col++;

        }

        $startRow=$headerRow+1;
		        for($row=$startRow;$row<=$highestRow;$row++){

            $student=[];

            foreach($headers as $column=>$heading){

                $student[$heading]=trim(
                    (string)$sheet
                    ->getCell($column.$row)
                    ->getFormattedValue()
                );

            }

            if(
                excel(
                    $student,
                    ["STUDENT'S NAME"]
                )==""
            ){
                continue;
            }
					$studentUid="SRP".date("y").str_pad(
    $studentSerial,
    6,
    "0",
    STR_PAD_LEFT
);

$studentSerial++;

$admissionFormNo=excel(
    $student,
    ["COLLEGE ADM. FORM NO."]
);

if($admissionFormNo==""){
    continue;
}

if(isset($existingAdmissions[trim($admissionFormNo)])){
    $stats['duplicates']++;
    continue;
}

$existingAdmissions[trim($admissionFormNo)]=true;

$admissionNo=excel(
    $student,
    [
        "COLLEGE ADMISSION NO.",
        "COLLEGE ADM. FORM NO."
    ]
);

$collegeRollNo=excel(
    $student,
    [
        "COLLEGE ID / ROLL NO.",
        "COLLEGE ID & ROLL NO."
    ]
);

$registrationNo=excel(
    $student,
    ["REGISTRATION NO."]
);

$universityRollNo=excel(
    $student,
    ["PU EXAM ROLL NO."]
);

$studentName=excel(
    $student,
    ["STUDENT'S NAME"]
);

$fatherName=excel(
    $student,
    [
        "FATHERS' NAME",
        "FATHER'S NAME"
    ]
);

$motherName=excel(
    $student,
    [
        "MOTHERS' NAME",
        "MOTHER'S NAME"
    ]
);

$mobile=cleanMobile(
    excel(
        $student,
        [
            "STUDENT'S MOBILE NO.",
            "STUDENT MOBILE NO.",
            "MOBILE NO.",
            "MOBILE"
        ]
    )
);

$email=excel(
    $student,
    [
        "EMAIL",
        "EMAIL ID",
        "E-MAIL"
    ]
);

$aadhaar=cleanAadhaar(
    excel(
        $student,
        [
            "AADHAAR",
            "AADHAAR NO.",
            "AADHAR NO."
        ]
    )
);

$gender=excel(
    $student,
    [
        "GEN DER",
        "GENDER"
    ]
);

$category=excel(
    $student,
    [
        "CATEGORY",
        "CATE GORY"
    ]
);

$dob=mysqlDate(
    excel(
        $student,
        ["DOB"]
    )
);

$admissionDate=mysqlDate(
    excel(
        $student,
        [
            "ADMISSION DATE",
            "ADMISSION  DATE"
        ]
    )
);

$lastEducation=excel(
    $student,
    ["LAST EDUCATION"]
);

$currentAddress=trim(
    excel($student,["AT"])."\n".
    excel($student,["PO"])."\n".
    excel($student,["PS"])
);

$currentDistrict=excel($student,["DISTRICT"]);
$currentState=excel($student,["STATE"]);
$currentPincode=excel($student,["PIN CODE"]);

$admissionCycle=null;

if($admissionDate){

    $month=(int)date(
        "n",
        strtotime($admissionDate)
    );

    $admissionCycle=
        $month<=6
        ? "January"
        : "July";

}
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

$studentId=$db->lastInsertId();

$stats['students']++;
					$guardianInsert->execute([

    $studentId,

    $fatherName,
    "",
    "",
    "",

    $motherName,
    "",
    "",

    $fatherName,
    ""

]);

$stats['guardians']++;
					$db->commit();

echo "<hr>";

echo "<h2>Import Completed Successfully</h2>";

echo "<b>Students :</b> ".$stats['students']."<br>";
echo "<b>Guardians :</b> ".$stats['guardians']."<br>";
echo "<b>Duplicates :</b> ".$stats['duplicates']."<br>";
echo "<b>Errors :</b> ".$stats['errors']."<br>";
					}catch(Exception $e){

    $db->rollBack();

    die(
        "<h2>IMPORT FAILED</h2><pre>".
        $e->getMessage().
        "</pre>"
    );

}