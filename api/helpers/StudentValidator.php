<?php

namespace Helpers;

class StudentValidator
{
    public static function validate(array $student): array
    {
        $errors = [];

        if ($student["student_name"] === "") {
            $errors[] = "Student Name Missing";
        }

        if ($student["father_name"] === "") {
            $errors[] = "Father Name Missing";
        }

        if ($student["admission_no"] === "") {
            $errors[] = "Admission Number Missing";
        }

        return $errors;
    }
}