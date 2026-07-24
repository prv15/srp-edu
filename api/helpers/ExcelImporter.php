<?php

namespace Helpers;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExcelImporter
{
    private $spreadsheet;

    public function load(string $filePath): void
    {
        $this->spreadsheet = IOFactory::load($filePath);
    }

    /**
     * Return all worksheet names.
     */
    public function getSheetNames(): array
    {
        return $this->spreadsheet->getSheetNames();
    }

    /**
     * Read an admission register sheet.
     */
    public function readAdmissionSheet(string $sheetName): array
    {
        $sheet = $this->spreadsheet->getSheetByName($sheetName);

        if (!$sheet instanceof Worksheet) {
            return [];
        }

        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        $headerRow = null;

        /*
        ----------------------------------------------------
        Detect Header Row Automatically
        ----------------------------------------------------
        */

        for ($row = 1; $row <= min(30, $highestRow); $row++) {

            $values = [];

            for ($col = 'A'; $col <= $highestColumn; $col++) {

                $values[] = strtoupper(
                    trim(
                        (string)$sheet
                            ->getCell($col . $row)
                            ->getFormattedValue()
                    )
                );

            }

            $text = implode(" ", $values);

            if (
                str_contains($text, "STUDENT") &&
                str_contains($text, "NAME") &&
                str_contains($text, "COLLEGE")
            ) {

                $headerRow = $row;

                break;

            }

        }

        if (!$headerRow) {

            throw new \Exception(
                "Unable to detect header row."
            );

        }

        /*
        ----------------------------------------------------
        Read Header
        ----------------------------------------------------
        */

        $header = [];

        for ($col = 'A'; $col <= $highestColumn; $col++) {

            $header[$col] = trim(

                (string)$sheet
                    ->getCell($col . $headerRow)
                    ->getFormattedValue()

            );

        }

        /*
        ----------------------------------------------------
        Read Data
        ----------------------------------------------------
        */

        $rows = [];

        for ($row = $headerRow + 1; $row <= $highestRow; $row++) {

            $record = [];

            $empty = true;

            foreach ($header as $column => $name) {

                $value = trim(

                    (string)$sheet
                        ->getCell($column . $row)
                        ->getFormattedValue()

                );

                if ($value !== "") {

                    $empty = false;

                }

                $record[$name] = $value;

            }

            if (!$empty) {

                $rows[] = $record;

            }

        }

        return [

            "sheet" => $sheetName,

            "headerRow" => $headerRow,

            "header" => $header,

            "rows" => $rows

        ];

    }

}