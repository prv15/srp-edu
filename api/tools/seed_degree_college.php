<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/../config/database.php';

try {

    $db->beginTransaction();

    /*
    |--------------------------------------------------------------------------
    | Institute
    |--------------------------------------------------------------------------
    */

    $db->exec("
        INSERT INTO institutes (id, code, name)
        VALUES
        (1,'school','School'),
        (2,'training','Training Institute'),
        (3,'degree','Degree College')
        ON DUPLICATE KEY UPDATE name=VALUES(name)
    ");

    /*
    |--------------------------------------------------------------------------
    | Departments
    |--------------------------------------------------------------------------
    */

    $db->exec("
        INSERT INTO departments
        (id,institute_id,name,code)
        VALUES
        (1,3,'Arts','ART'),
        (2,3,'Science','SCI'),
        (3,3,'Commerce','COM')
        ON DUPLICATE KEY UPDATE name=VALUES(name)
    ");

    /*
    |--------------------------------------------------------------------------
    | Courses
    |--------------------------------------------------------------------------
    */

    $db->exec("
        INSERT INTO courses
        (id,institute_id,department_id,course_name,duration,status)
        VALUES
        (1,3,1,'Bachelor of Arts',4,'Active'),
        (2,3,2,'Bachelor of Science',4,'Active'),
        (3,3,3,'Bachelor of Commerce',4,'Active')
        ON DUPLICATE KEY UPDATE course_name=VALUES(course_name)
    ");

    /*
    |--------------------------------------------------------------------------
    | Academic Sessions
    |--------------------------------------------------------------------------
    */

    $db->exec("
        INSERT INTO academic_sessions
        (id,institute_id,session_name,start_year,end_year,status)
        VALUES
        (1,3,'2024-2028',2024,2028,'Active'),
        (2,3,'2025-2029',2025,2029,'Active')
        ON DUPLICATE KEY UPDATE session_name=VALUES(session_name)
    ");

    $db->commit();

    echo "<h2>✅ Degree College Master Data Created Successfully.</h2>";

} catch (Exception $e) {

    $db->rollBack();

    die($e->getMessage());

}