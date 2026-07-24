<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

set_time_limit(0);
ini_set('memory_limit','1024M');

require_once __DIR__ . '/../config/database.php';

$db = (new Database())->connect();

/*
|--------------------------------------------------------------------------
| CSV Files
|--------------------------------------------------------------------------
*/

$files = [

    [
        'file'       => __DIR__.'/2024-2028_Arts.csv',
        'session'    => '2024-2028',
        'department' => 'Arts',
        'course'     => 'Bachelor of Arts'
    ],

    [
        'file'       => __DIR__.'/2024-2028_Science.csv',
        'session'    => '2024-2028',
        'department' => 'Science',
        'course'     => 'Bachelor of Science'
    ],

    [
        'file'       => __DIR__.'/2024-2028_Commerce.csv',
        'session'    => '2024-2028',
        'department' => 'Commerce',
        'course'     => 'Bachelor of Commerce'
    ],

    [
        'file'       => __DIR__.'/2025-2029_Arts.csv',
        'session'    => '2025-2029',
        'department' => 'Arts',
        'course'     => 'Bachelor of Arts'
    ],

    [
        'file'       => __DIR__.'/2025-2029_Science.csv',
        'session'    => '2025-2029',
        'department' => 'Science',
        'course'     => 'Bachelor of Science'
    ],

    [
        'file'       => __DIR__.'/2025-2029_Commerce.csv',
        'session'    => '2025-2029',
        'department' => 'Commerce',
        'course'     => 'Bachelor of Commerce'
    ]

];

echo "<h1>SRP ERP Student CSV Import</h1>";
echo "<hr>";

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

function value(array $row,array $keys): string
{
    foreach($keys as $key){

        if(isset($row[$key])){

            $v = trim((string)$row[$key]);

            if($v !== ''){
                return $v;
            }

        }

    }

    return '';
}

function mobile(?string $mobile): string
{
    return preg_replace('/[^0-9]/','',$mobile ?? '');
}

function aadhaar(?string $aadhaar): string
{
    return preg_replace('/[^0-9]/','',$aadhaar ?? '');
}

function mysqlDate(?string $date): ?string
{
    $date = trim((string)$date);

    if($date==''){
        return null;
    }

    $time = strtotime($date);

    if(!$time){
        return null;
    }

    return date('Y-m-d',$time);
}

function getId(PDO $db,string $table,string $column,string $value): ?int
{
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

function normalizeHeaders(array $headers): array
{
    $new = [];

    foreach($headers as $header){

        $header = strtoupper(trim($header));

        $header = preg_replace('/\s+/',' ',$header);

        $header = str_replace(
            [
                'GEN DER',
                'CATE GORY',
                'ADMISSION  DATE'
            ],
            [
                'GENDER',
                'CATEGORY',
                'ADMISSION DATE'
            ],
            $header
        );

        $new[] = $header;
    }

    return $new;
}
/*
|--------------------------------------------------------------------------
| Master IDs
|--------------------------------------------------------------------------
*/

$master = [

    'institute' => getId(
        $db,
        'institutes',
        'code',
        'degree'
    ),

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

    ],

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

        'Bachelor of Arts' => getId(
            $db,
            'courses',
            'course_name',
            'Bachelor of Arts'
        ),

        'Bachelor of Science' => getId(
            $db,
            'courses',
            'course_name',
            'Bachelor of Science'
        ),

        'Bachelor of Commerce' => getId(
            $db,
            'courses',
            'course_name',
            'Bachelor of Commerce'
        )

    ]

];

if(!$master['institute']){
    die("Degree institute not found.");
}

/*
|--------------------------------------------------------------------------
| Statistics
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
| Existing Admission Numbers
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

}

/*
|--------------------------------------------------------------------------
| Student UID Counter
|--------------------------------------------------------------------------
*/

$stmt = $db->query("
    SELECT COUNT(*)
    FROM students
");

$studentSerial =
    ((int)$stmt->fetchColumn()) + 1;

/*
|--------------------------------------------------------------------------
| Start Transaction
|--------------------------------------------------------------------------
*/

$db->beginTransaction();

try{

/*
|--------------------------------------------------------------------------
| Student Insert
|--------------------------------------------------------------------------
*/

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

status,

created_at,
updated_at

)

VALUES(

?,?,?,?,?,

?,?,?,?,?,

?,?,?,?,?,

?,?,?,

?,?,?,?,?,

?,?,

'Active',

NOW(),
NOW()

)

");

/*
|--------------------------------------------------------------------------
| Guardian Insert
|--------------------------------------------------------------------------
*/

$guardianInsert = $db->prepare("

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

?,?,?,?,?,

?,?,?,?,?

)

");

echo "<h3>Master Data Loaded</h3>";
echo "<hr>";
	/*
|--------------------------------------------------------------------------
| Process CSV Files
|--------------------------------------------------------------------------
*/

foreach($files as $fileInfo){

    echo "<h2>".$fileInfo['file']."</h2>";

    if(!file_exists($fileInfo['file'])){

        echo "<div style='color:red'>
        File not found : ".$fileInfo['file']."
        </div>";

        continue;

    }

    $fp = fopen($fileInfo['file'],'r');

    if(!$fp){

        echo "<div style='color:red'>
        Unable to open file.
        </div>";

        continue;

    }

    /*
    |--------------------------------------------------------------------------
    | Read Header
    |--------------------------------------------------------------------------
    */

    $header = fgetcsv($fp);

    /*
    |--------------------------------------------------------------------------
    | 2024 Arts & Science have one extra row
    |--------------------------------------------------------------------------
    */

    if(

        isset($header[0]) &&

        (
            stripos($header[0],"Unnamed") !== false ||

            trim($header[0])==""

        )

    ){

        $header = fgetcsv($fp);

    }

    $header = normalizeHeaders($header);

    echo "<b>Session :</b> ".$fileInfo['session']."<br>";
    echo "<b>Department :</b> ".$fileInfo['department']."<br><br>";

    while(($row = fgetcsv($fp)) !== false){

        if(count($row)==0){
            continue;
        }

        $student = [];

        foreach($header as $index=>$heading){

            $student[$heading] =
                trim($row[$index] ?? '');

        }

        if(

            value(
                $student,
                ["STUDENT'S NAME"]
            )==""

        ){
            continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Duplicate Check
        |--------------------------------------------------------------------------
        */

        $admissionFormNo = value(
            $student,
            [
                "COLLEGE ADM. FORM NO."
            ]
        );

        if(isset($existingAdmissions[$admissionFormNo])){

            $stats['duplicates']++;

            continue;

        }

        $existingAdmissions[$admissionFormNo] = true;

        /*
        |--------------------------------------------------------------------------
        | Student UID
        |--------------------------------------------------------------------------
        */

        $studentUid =
            "SRP".
            date("y").
            str_pad(
                $studentSerial,
                6,
                "0",
                STR_PAD_LEFT
            );

        $studentSerial++;

        /*
        |--------------------------------------------------------------------------
        | Admission Date
        |--------------------------------------------------------------------------
        */

        $admissionDate = mysqlDate(

            value(
                $student,
                [
                    "ADMISSION DATE"
                ]
            )

        );

        $cycle = null;

        if($admissionDate){

            $month = date(
                "n",
                strtotime($admissionDate)
            );

            $cycle =
                ($month<=6)
                ? "January"
                : "July";

        }

        /*
        |--------------------------------------------------------------------------
        | Address
        |--------------------------------------------------------------------------
        */

        $address = trim(

            value($student,["AT"])."\n".

            value($student,["PO"])."\n".

            value($student,["PS"])

        );
		        /*
        |--------------------------------------------------------------------------
        | Insert Student
        |--------------------------------------------------------------------------
        */

        try{

            $studentInsert->execute([

                $studentUid,

                $master['institute'],

                $master['sessions'][
                    $fileInfo['session']
                ],

                $master['departments'][
                    $fileInfo['department']
                ],

                $master['courses'][
                    $fileInfo['course']
                ],

                $admissionFormNo,

                value($student,[
                    "COLLEGE ADMISSION NO.",
                    "COLLEGE ADM. FORM NO."
                ]),

                value($student,[
                    "COLLEGE ID / ROLL NO."
                ]),

                value($student,[
                    "REGISTRATION NO."
                ]),

                value($student,[
                    "PU EXAM ROLL NO."
                ]),

                value($student,[
                    "STUDENT'S NAME"
                ]),

                value($student,[
                    "GENDER"
                ]),

                mysqlDate(
                    value($student,[
                        "DOB"
                    ])
                ),

                value($student,[
                    "CATEGORY"
                ]),

                mobile(
                    value($student,[
                        "STUDENT'S MOBILE NO."
                    ])
                ),

                value($student,[
                    "STUDENT'S EMAIL ID"
                ]),

                aadhaar(
                    value($student,[
                        "STUDENT'S AADHAR NO."
                    ])
                ),

                $address,

                "",

                value($student,[
                    "DISTRICT"
                ]),

                value($student,[
                    "STATE"
                ]),

                value($student,[
                    "PIN CODE"
                ]),

                $admissionDate,

                $cycle,

                value($student,[
                    "LAST EDUCATION"
                ])

            ]);

            $studentId = $db->lastInsertId();

            /*
            |--------------------------------------------------------------------------
            | Insert Guardian
            |--------------------------------------------------------------------------
            */

            $guardianInsert->execute([

                $studentId,

                value($student,[
                    "FATHERS' NAME"
                ]),

                mobile(
                    value($student,[
                        "FATHER'S MOBILE NO."
                    ])
                ),

                aadhaar(
                    value($student,[
                        "FATHER'S AADHAR NO."
                    ])
                ),

                value($student,[
                    "OCCUPATION"
                ]),

                value($student,[
                    "MOTHERS' NAME"
                ]),

                mobile(
                    value($student,[
                        "MOTHER'S MOBILE NO."
                    ])
                ),

                aadhaar(
                    value($student,[
                        "MOTHER'S AADHAR NO."
                    ])
                ),

                "",

                ""

            ]);

            $stats['students']++;
            $stats['guardians']++;

        }
        catch(Exception $e){

            $stats['errors']++;

            echo "<div style='color:red;margin-bottom:10px;'>";

            echo "<b>".$studentUid."</b> : ";

            echo htmlspecialchars(
                $e->getMessage()
            );

            echo "</div>";

        }

    }

    fclose($fp);

}

/*
|--------------------------------------------------------------------------
| Commit
|--------------------------------------------------------------------------
*/

$db->commit();

echo "<hr>";

echo "<h2 style='color:green'>
Import Completed Successfully
</h2>";

echo "<table border='1' cellpadding='8' cellspacing='0'>";

echo "<tr>
<td>Students Imported</td>
<td>{$stats['students']}</td>
</tr>";

echo "<tr>
<td>Guardians Imported</td>
<td>{$stats['guardians']}</td>
</tr>";

echo "<tr>
<td>Duplicates Skipped</td>
<td>{$stats['duplicates']}</td>
</tr>";

echo "<tr>
<td>Errors</td>
<td>{$stats['errors']}</td>
</tr>";

echo "</table>";

}
catch(Exception $e){

    if($db->inTransaction()){

        $db->rollBack();

    }

    echo "<hr>";

    echo "<h2 style='color:red'>
Import Failed
</h2>";

    echo "<pre>";

    echo htmlspecialchars(
        $e->getMessage()
    );

    echo "</pre>";

}

echo "<hr>";
echo "<b>Importer Finished.</b>";

?>