<?php

namespace Helpers;

class AdmissionRegisterMapper
{
    /**
     * Excel Column => students table
     */
    private const STUDENT_MAPPING = [

        "COLLEGE ADM. FORM NO."     => "admission_form_no",
        "COLLEGE ADM. NO."          => "admission_no",
        "COLLEGE ID / ROLL NO."     => "college_roll_no",
        "REGISTRATION NO."          => "registration_no",
        "PU EXAM ROLL NO."          => "university_roll_no",

        "STUDENT'S NAME"            => "student_name",

        "DATE OF BIRTH"             => "dob",

        "GENDER"                    => "gender",

        "CATEGORY"                  => "category",

        "RELIGION"                  => "religion",

        "AADHAAR NO."               => "aadhaar",

        "MOBILE NO."                => "mobile",

        "EMAIL ID"                  => "email",

        "LAST EDUCATION"            => "last_education"

    ];

    /**
     * Excel Column => student_guardians table
     */
    private const GUARDIAN_MAPPING = [

        "FATHER'S NAME"             => "father_name",

        "FATHER'S MOBILE"           => "father_mobile",

        "FATHER'S AADHAAR"          => "father_aadhaar",

        "FATHER'S OCCUPATION"       => "father_occupation",

        "MOTHER'S NAME"             => "mother_name",

        "MOTHER'S MOBILE"           => "mother_mobile",

        "MOTHER'S AADHAAR"          => "mother_aadhaar"

    ];

    /**
     * Convert one excel row into ERP structure
     */
    public static function map(
        array $row,
        string $department,
        string $session,
        int $instituteId = 3
    ): array {

        $student = [];
        $guardian = [];

        foreach (self::STUDENT_MAPPING as $excel => $db) {

            $student[$db] = self::value($row, $excel);

        }

        foreach (self::GUARDIAN_MAPPING as $excel => $db) {

            $guardian[$db] = self::value($row, $excel);

        }

        /*
        ----------------------------------------
        Extra Fields
        ----------------------------------------
        */

        $student["institute_id"] = $instituteId;

        $student["department"] = $department;

        $student["session"] = $session;

        /*
        ----------------------------------------
        Name Split
        ----------------------------------------
        */

        $names = self::splitName(
            $student["student_name"] ?? ""
        );

        $student["first_name"] = $names["first_name"];

        $student["middle_name"] = $names["middle_name"];

        $student["last_name"] = $names["last_name"];

        /*
        ----------------------------------------
        Cleaning
        ----------------------------------------
        */

        $student["mobile"] = self::mobile(
            $student["mobile"] ?? ""
        );

        $student["aadhaar"] = self::aadhaar(
            $student["aadhaar"] ?? ""
        );

        $guardian["father_mobile"] = self::mobile(
            $guardian["father_mobile"] ?? ""
        );

        $guardian["mother_mobile"] = self::mobile(
            $guardian["mother_mobile"] ?? ""
        );

        $guardian["father_aadhaar"] = self::aadhaar(
            $guardian["father_aadhaar"] ?? ""
        );

        $guardian["mother_aadhaar"] = self::aadhaar(
            $guardian["mother_aadhaar"] ?? ""
        );

        /*
        ----------------------------------------
        Date
        ----------------------------------------
        */

        if (!empty($student["dob"])) {

            $student["dob"] = self::date(
                $student["dob"]
            );

        }

        return [

            "student" => $student,

            "guardian" => $guardian

        ];

    }

    private static function value(
        array $row,
        string $column
    ): string {

        return trim(
            (string)($row[$column] ?? "")
        );

    }

    private static function mobile(
        string $mobile
    ): string {

        return preg_replace(
            "/[^0-9]/",
            "",
            $mobile
        );

    }

    private static function aadhaar(
        string $aadhaar
    ): string {

        return preg_replace(
            "/[^0-9]/",
            "",
            $aadhaar
        );

    }

    private static function date(
        string $date
    ): string {

        $timestamp = strtotime($date);

        if (!$timestamp) {

            return "";

        }

        return date(
            "Y-m-d",
            $timestamp
        );

    }

    private static function splitName(
        string $name
    ): array {

        $parts = preg_split(
            "/\s+/",
            trim($name)
        );

        $count = count($parts);

        if ($count === 1) {

            return [

                "first_name" => $parts[0],

                "middle_name" => "",

                "last_name" => ""

            ];

        }

        if ($count === 2) {

            return [

                "first_name" => $parts[0],

                "middle_name" => "",

                "last_name" => $parts[1]

            ];

        }

        return [

            "first_name" => array_shift($parts),

            "last_name" => array_pop($parts),

            "middle_name" => implode(" ", $parts)

        ];

    }
}