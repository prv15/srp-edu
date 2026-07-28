<?php

declare(strict_types=1);

final class GlobalSearchRegistry
{
    /** @var array<string, array{label:string, permission:string, sql:string}> */
    private array $providers = [];

    public function register(
        string $key,
        string $label,
        string $permission,
        string $sql
    ): void {
        $this->providers[$key] = [
            "label" => $label,
            "permission" => $permission,
            "sql" => $sql,
        ];
    }

    /**
     * @param callable(string):bool $canView
     * @return array<string, array{
     *     key:string,
     *     label:string,
     *     count:int,
     *     has_more:bool,
     *     items:array<int, array<string, mixed>>
     * }>
     */
    public function search(
        PDO $db,
        int $instituteId,
        string $term,
        int $limit,
        callable $canView
    ): array {
        $sections = [];
        $queryLimit = $limit + 1;

        foreach ($this->providers as $key => $provider) {
            if (!$canView($provider["permission"])) {
                continue;
            }

            try {
                $statement = $db->prepare($provider["sql"] . " LIMIT :result_limit");
                $statement->bindValue(":institute_id", $instituteId, PDO::PARAM_INT);
                $statement->bindValue(":term", "%{$term}%", PDO::PARAM_STR);
                $statement->bindValue(":result_limit", $queryLimit, PDO::PARAM_INT);
                $statement->execute();
                $items = $statement->fetchAll();
            } catch (PDOException $exception) {
                if ((int)($exception->errorInfo[1] ?? 0) === 1146) {
                    continue;
                }
                throw $exception;
            }
            $hasMore = count($items) > $limit;
            if ($hasMore) {
                $items = array_slice($items, 0, $limit);
            }

            if ($items === []) {
                continue;
            }

            $sections[$key] = [
                "key" => $key,
                "label" => $provider["label"],
                "count" => count($items),
                "has_more" => $hasMore,
                "items" => $items,
            ];
        }

        return $sections;
    }
}

function createGlobalSearchRegistry(): GlobalSearchRegistry
{
    $registry = new GlobalSearchRegistry();

    $registry->register(
        "students",
        "Students",
        "students.view",
        "SELECT
            CAST(s.id AS CHAR) AS id,
            s.student_name AS title,
            CONCAT_WS(' · ', NULLIF(s.admission_no, ''), c.course_name, cs.name) AS subtitle,
            CONCAT_WS(' · ', NULLIF(s.college_roll_no, ''), ms.name, NULLIF(s.mobile, '')) AS meta,
            CONCAT('/students/profile/', s.id) AS url
         FROM students s
         LEFT JOIN courses c ON c.id = s.course_id AND c.institute_id = s.institute_id
         LEFT JOIN course_semesters cs ON cs.id = s.semester_id AND cs.institute_id = s.institute_id
         LEFT JOIN subject_disciplines ms ON ms.id = s.major_subject_id AND ms.institute_id = s.institute_id
         LEFT JOIN student_guardians g ON g.student_id = s.id
         WHERE s.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', s.student_name, s.student_uid, s.admission_no,
                s.college_roll_no, s.registration_no, s.university_roll_no,
                s.mobile, s.email, g.father_name, g.mother_name,
                g.guardian_name, g.guardian_mobile, c.course_name, cs.name, ms.name)
               USING utf8mb4) COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY s.student_name"
    );

    $registry->register(
        "faculty",
        "Faculty & Staff",
        "faculty.view",
        "SELECT
            CAST(f.id AS CHAR) AS id,
            f.name AS title,
            CONCAT_WS(' · ', f.employee_id, f.designation) AS subtitle,
            CONCAT_WS(' · ', d.name, f.mobile, f.email) AS meta,
            '/faculty' AS url
         FROM faculty f
         LEFT JOIN departments d ON d.id = f.department_id AND d.institute_id = f.institute_id
         WHERE f.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', f.name, f.employee_id, f.designation, f.mobile,
                f.email, f.qualification, f.employment_type, d.name) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY f.status = 'Active' DESC, f.name"
    );

    $registry->register(
        "courses",
        "Courses",
        "academics.view",
        "SELECT
            CAST(c.id AS CHAR) AS id,
            c.course_name AS title,
            CONCAT_WS(' · ', d.name, CONCAT(c.duration, ' years')) AS subtitle,
            'Academic programme' AS meta,
            '/academics/courses' AS url
         FROM courses c
         LEFT JOIN departments d ON d.id = c.department_id AND d.institute_id = c.institute_id
         WHERE c.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', c.course_name, d.name, c.duration) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY c.course_name"
    );

    $registry->register(
        "departments",
        "Departments",
        "academics.view",
        "SELECT
            CAST(d.id AS CHAR) AS id,
            d.name AS title,
            NULLIF(d.code, '') AS subtitle,
            'Academic department' AS meta,
            '/faculty/departments' AS url
         FROM departments d
         WHERE d.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', d.name, d.code) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY d.name"
    );

    $registry->register(
        "subjects",
        "Subjects",
        "academics.view",
        "SELECT
            CAST(sub.id AS CHAR) AS id,
            sub.name AS title,
            CONCAT_WS(' · ', sub.code, c.course_name, cs.name) AS subtitle,
            CONCAT_WS(' · ', sub.paper_category, sub.delivery_type) AS meta,
            '/academics/subjects' AS url
         FROM subjects sub
         INNER JOIN courses c ON c.id = sub.course_id
         INNER JOIN course_semesters cs ON cs.id = sub.semester_id
         WHERE sub.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', sub.name, sub.code, sub.paper_title,
                sub.paper_category, sub.delivery_type, c.course_name, cs.name) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY sub.name"
    );

    $registry->register(
        "major_subjects",
        "Major Subjects",
        "academics.view",
        "SELECT
            CAST(ms.id AS CHAR) AS id,
            ms.name AS title,
            d.name AS subtitle,
            'Major subject' AS meta,
            '/academics/subjects' AS url
         FROM subject_disciplines ms
         LEFT JOIN departments d ON d.id = ms.department_id AND d.institute_id = ms.institute_id
         WHERE ms.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', ms.name, d.name) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY ms.name"
    );

    $registry->register(
        "semesters",
        "Semesters",
        "academics.view",
        "SELECT
            CAST(cs.id AS CHAR) AS id,
            cs.name AS title,
            c.course_name AS subtitle,
            CONCAT_WS(' · ', cs.admission_session, cs.status) AS meta,
            '/academics/semesters' AS url
         FROM course_semesters cs
         INNER JOIN courses c ON c.id = cs.course_id
         WHERE cs.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', cs.name, cs.semester_no, cs.admission_session, c.course_name) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY c.course_name, cs.semester_no"
    );

    $registry->register(
        "academic_sessions",
        "Academic Sessions",
        "academics.view",
        "SELECT
            CAST(a.id AS CHAR) AS id,
            a.session_name AS title,
            CONCAT_WS(' – ', a.start_year, a.end_year) AS subtitle,
            a.status AS meta,
            '/academics/semesters' AS url
         FROM academic_sessions a
         WHERE a.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', a.session_name, a.start_year, a.end_year, a.status) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY a.start_year DESC"
    );

    $registry->register(
        "fees",
        "Fees & Receipts",
        "fees.view",
        "SELECT
            CAST(fr.id AS CHAR) AS id,
            CONCAT('Receipt ', fr.receipt_no) AS title,
            s.student_name AS subtitle,
            CONCAT_WS(' · ', CONCAT('₹', FORMAT(fr.paid_amount, 0)),
                fr.payment_mode, DATE_FORMAT(fr.issued_at, '%d %b %Y')) AS meta,
            CONCAT('/students/profile/', fr.student_id, '?tab=Fees') AS url
         FROM fee_receipts fr
         INNER JOIN students s ON s.id = fr.student_id AND s.institute_id = fr.institute_id
         WHERE fr.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', fr.receipt_no, fr.transaction_id, fr.university_application_no,
                fr.payment_mode, fr.period_label, s.student_name, s.admission_no) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY fr.issued_at DESC"
    );

    $registry->register(
        "attendance",
        "Attendance",
        "attendance.view",
        "SELECT
            CAST(s.id AS CHAR) AS id,
            s.student_name AS title,
            CONCAT(ROUND(100 * SUM(sa.attendance_status IN ('Present', 'Late')) /
                NULLIF(COUNT(sa.student_id), 0), 1), '% attendance') AS subtitle,
            CONCAT(COUNT(sa.student_id), ' attendance records') AS meta,
            CONCAT('/students/profile/', s.id, '?tab=Attendance') AS url
         FROM student_attendance sa
         INNER JOIN attendance_sessions ats ON ats.id = sa.attendance_session_id
         INNER JOIN students s ON s.id = sa.student_id AND s.institute_id = ats.institute_id
         WHERE ats.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', s.student_name, s.admission_no, s.college_roll_no) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         GROUP BY s.id, s.student_name
         ORDER BY s.student_name"
    );

    $registry->register(
        "examinations",
        "Examinations",
        "examinations.view",
        "SELECT
            CAST(e.id AS CHAR) AS id,
            e.name AS title,
            CONCAT_WS(' · ', e.exam_type, c.course_name, cs.name) AS subtitle,
            CONCAT_WS(' · ', a.session_name, e.status) AS meta,
            '/examinations' AS url
         FROM examinations e
         INNER JOIN academic_sessions a ON a.id = e.academic_session_id
         INNER JOIN course_semesters cs ON cs.id = e.semester_id
         INNER JOIN courses c ON c.id = cs.course_id
         WHERE e.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', e.name, e.exam_type, e.status,
                a.session_name, cs.name, c.course_name) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY e.exam_start_date DESC, e.name"
    );

    $registry->register(
        "results",
        "Examination Results",
        "examinations.view",
        "SELECT
            CONCAT(ep.id, '-', s.id) AS id,
            s.student_name AS title,
            CONCAT_WS(' · ', sub.name,
                CONCAT(ser.marks_obtained, '/', ep.max_marks)) AS subtitle,
            CONCAT_WS(' · ', e.name, ser.attendance_status) AS meta,
            CONCAT('/students/profile/', s.id, '?tab=Examination') AS url
         FROM student_exam_results ser
         INNER JOIN examination_papers ep ON ep.id = ser.examination_paper_id
         INNER JOIN examinations e ON e.id = ep.examination_id
         INNER JOIN subjects sub ON sub.id = ep.subject_id
         INNER JOIN students s ON s.id = ser.student_id
         WHERE e.institute_id = :institute_id
           AND CONVERT(CONCAT_WS(' ', s.student_name, s.admission_no, sub.name,
                sub.code, e.name, ser.marks_obtained, ser.attendance_status) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY ser.entered_at DESC"
    );

    $registry->register(
        "institutes",
        "Institutes",
        "dashboard.view",
        "SELECT
            CAST(i.id AS CHAR) AS id,
            i.name AS title,
            COALESCE(NULLIF(i.short_name, ''), UPPER(i.code)) AS subtitle,
            i.current_session AS meta,
            '/dashboard' AS url
         FROM institutes i
         WHERE i.id = :institute_id
           AND CONVERT(CONCAT_WS(' ', i.name, i.short_name, i.code, i.current_session) USING utf8mb4)
               COLLATE utf8mb4_unicode_ci
               LIKE CONVERT(:term USING utf8mb4) COLLATE utf8mb4_unicode_ci
         ORDER BY i.name"
    );

    return $registry;
}
