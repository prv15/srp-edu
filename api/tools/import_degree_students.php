<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_time_limit(0);
ini_set('memory_limit', '1024M');

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';

function getId(PDO $db, string $table, string $column, string $value): ?int
{
    $stmt = $db->prepare("SELECT id FROM {$table} WHERE {$column}=? LIMIT 1");
    $stmt->execute([$value]);

    $id = $stmt->fetchColumn();

    return $id ? (int)$id : null;
}

$instituteId = getId(
    $db,
    "institutes",
    "code",
    "degree"
);

$departmentIds = [

    "Arts"      => getId($db,"departments","name","Arts"),
    "Science"   => getId($db,"departments","name","Science"),
    "Commerce"  => getId($db,"departments","name","Commerce")

];

$courseIds = [

    "Arts"      => getId($db,"courses","course_name","Bachelor of Arts"),
    "Science"   => getId($db,"courses","course_name","Bachelor of Science"),
    "Commerce"  => getId($db,"courses","course_name","Bachelor of Commerce")

];

$sessionIds = [

    "2024-2028" => getId($db,"academic_sessions","session_name","2024-2028"),
    "2025-2029" => getId($db,"academic_sessions","session_name","2025-2029")

];

echo "<pre>";
print_r([
    'Institute'  => $instituteId,
    'Departments'=> $departmentIds,
    'Courses'    => $courseIds,
    'Sessions'   => $sessionIds
]);
echo "</pre>";

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

echo "<h1>SRP ERP Degree College Import Tool</h1>";
echo "<hr>";

/*
|--------------------------------------------------------------------------
| Excel Files
|--------------------------------------------------------------------------
*/

$files = [

    [
        'file' => __DIR__ . '/UG - Admission Register 2024-2028.xlsx',
        'session' => '2024-2028',
        'headerRow' => 11,
        'startRow' => 12
    ],

    [
        'file' => __DIR__ . '/UG - Admission Register 2025-2029.xlsx',
        'session' => '2025-2029',
        'headerRow' => 10,
        'startRow' => 11
    ]

];

/*
|--------------------------------------------------------------------------
| Read Workbooks
|--------------------------------------------------------------------------
*/

foreach ($files as $workbook) {

    echo "<h2>Academic Session : {$workbook['session']}</h2>";

    if (!file_exists($workbook['file'])) {

        echo "<span style='color:red'>Workbook not found.</span><hr>";

        continue;

    }

    $spreadsheet = IOFactory::load($workbook['file']);

    foreach (['Arts', 'Science', 'Commerce'] as $sheetName) {

        echo "<h3>$sheetName</h3>";

        $sheet = $spreadsheet->getSheetByName($sheetName);

        if (!$sheet) {

            echo "Sheet not found.<br><hr>";

            continue;

        }
		$highestRow = $sheet->getHighestRow();

echo "Total Rows : ".$highestRow."<br>";

        $highestColumnIndex = Coordinate::columnIndexFromString(
            $sheet->getHighestColumn()
        );

        /*
        ---------------------------------------------------------
        Read Header
        ---------------------------------------------------------
        */

        $header = [];

        for ($i = 1; $i <= $highestColumnIndex; $i++) {

            $column = Coordinate::stringFromColumnIndex($i);

            $header[$column] = trim(
                (string)$sheet
                    ->getCell($column . $workbook['headerRow'])
                    ->getFormattedValue()
            );

        }

        echo "<b>Header Columns :</b> " . count($header) . "<br>";

        /*
        ---------------------------------------------------------
        First Student
        ---------------------------------------------------------
        */

       echo "<table border='1' cellpadding='5' cellspacing='0'>";
echo "<tr>
<th>#</th>
<th>Admission</th>
<th>Name</th>
<th>Father</th>
<th>Mobile</th>
</tr>";

$count = 0;

for($row=$workbook['startRow']; $row<=$highestRow; $row++){

    $student=[];

    foreach($header as $column=>$heading){

        $student[$heading]=trim(
            (string)$sheet
                ->getCell($column.$row)
                ->getFormattedValue()
        );

    }

    // Ignore completely empty rows
    if(empty($student["STUDENT'S NAME"])){
        continue;
    }

    $count++;

    echo "<tr>";

    echo "<td>".$count."</td>";

    echo "<td>".$student["COLLEGE ADMISSION NO."]."</td>";

    echo "<td>".$student["STUDENT'S NAME"]."</td>";

    echo "<td>".$student["FATHERS' NAME"]."</td>";

    echo "<td>".$student["MOBILE NO."]."</td>";

    echo "</tr>";

}

echo "</table>";

echo "<br>Total Students Found : <b>".$count."</b>";

echo "<hr>";

    }

}