<?php

namespace Helpers;

class StudentImportService
{
    private ExcelImporter $excel;

    public function __construct()
    {
        $this->excel = new ExcelImporter();
    }

    /**
     * Read complete workbook
     */
    public function preview(
        string $file,
        int $instituteId,
        string $academicSession
    ): array
    {
        $this->excel->load($file);

        $summary = [];

        $students = [];

        foreach ($this->excel->getSheetNames() as $sheetName) {

            $sheet = $this->excel->readAdmissionSheet(
                $sheetName
            );

            if (empty($sheet)) {
                continue;
            }

            foreach ($sheet["rows"] as $index => $row) {

                $mapped = AdmissionRegisterMapper::map(

                    $row,

                    $sheetName,

                    $academicSession,

                    $instituteId

                );

                $errors = StudentValidator::validate(

                    $mapped["student"]

                );

                $students[] = [

                    "row" => $index + 1,

                    "department" => $sheetName,

                    "status" => empty($errors)
                        ? "Ready"
                        : "Error",

                    "errors" => $errors,

                    "student" => $mapped["student"],

                    "guardian" => $mapped["guardian"]

                ];

            }

            $summary[] = [

                "department" => $sheetName,

                "records" => count($sheet["rows"])

            ];

        }

        return [

            "summary" => $summary,

            "students" => $students

        ];

    }
}
