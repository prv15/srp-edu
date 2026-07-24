<?php

declare(strict_types=1);

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../middleware/authenticate.php";
require_once __DIR__ . "/../../middleware/authorize.php";

try {
    $instituteId = (int)($_GET["institute_id"] ?? 0);
    $user = authenticatedUser($db);
    requireInstituteAccess($db, $user, $instituteId);
    requirePermission($db, $user, "dashboard.view");

    $stats = $db->prepare(
        "SELECT
            COUNT(*) AS students,
            COALESCE(SUM(s.status = 'Active'), 0) AS active_students,
            COALESCE(SUM(YEAR(s.admission_date) = YEAR(CURRENT_DATE())), 0) AS admissions_this_year,
            COALESCE(SUM(s.admission_date >= CURRENT_DATE() - INTERVAL 30 DAY), 0) AS admissions_last_30_days,
            COALESCE(SUM(NULLIF(TRIM(s.gender), '') IS NOT NULL), 0) AS gender_recorded,
            (SELECT COUNT(*) FROM faculty f WHERE f.institute_id = :faculty_institute AND f.status = 'Active') AS active_faculty,
            (SELECT COUNT(*) FROM courses c WHERE c.institute_id = :course_institute AND c.status = 1) AS active_courses,
            (SELECT COUNT(*) FROM subjects sub WHERE sub.institute_id = :subject_institute AND sub.status = 'Active') AS active_subjects
         FROM students s
         WHERE s.institute_id = :student_institute"
    );
    $stats->execute([
        ":faculty_institute" => $instituteId,
        ":course_institute" => $instituteId,
        ":subject_institute" => $instituteId,
        ":student_institute" => $instituteId,
    ]);

    $finance = $db->prepare(
        "SELECT
            COALESCE(SUM(CASE WHEN entry_type IN ('Charge','Fine') THEN amount ELSE 0 END), 0) AS charged,
            COALESCE(SUM(CASE WHEN entry_type = 'Payment' THEN amount ELSE 0 END), 0) AS collected,
            COALESCE(SUM(CASE WHEN entry_type IN ('Discount','Adjustment') THEN amount ELSE 0 END), 0) AS concessions,
            COALESCE(SUM(CASE WHEN entry_type = 'Refund' THEN amount ELSE 0 END), 0) AS refunded,
            COALESCE(SUM(CASE WHEN entry_type = 'Payment' AND entry_date = CURRENT_DATE() THEN amount ELSE 0 END), 0) AS collected_today
         FROM student_fee_ledger
         WHERE institute_id = :institute"
    );
    $finance->execute([":institute" => $instituteId]);
    $financeData = $finance->fetch() ?: [];
    $financeData["outstanding"] = max(
        0,
        (float)($financeData["charged"] ?? 0)
        - (float)($financeData["collected"] ?? 0)
        - (float)($financeData["concessions"] ?? 0)
        + (float)($financeData["refunded"] ?? 0)
    );

    $attendance = $db->prepare(
        "SELECT
            COUNT(DISTINCT ats.id) AS sessions,
            COUNT(sa.student_id) AS marked,
            COALESCE(SUM(sa.attendance_status IN ('Present','Late')), 0) AS present,
            COALESCE(SUM(sa.attendance_status = 'Absent'), 0) AS absent,
            ROUND(
                COALESCE(SUM(sa.attendance_status IN ('Present','Late')), 0)
                / NULLIF(COUNT(sa.student_id), 0) * 100,
                1
            ) AS attendance_rate,
            COUNT(DISTINCT CASE WHEN ats.attendance_date = CURRENT_DATE() THEN ats.id END) AS sessions_today
         FROM attendance_sessions ats
         LEFT JOIN student_attendance sa ON sa.attendance_session_id = ats.id
         WHERE ats.institute_id = :institute
           AND ats.attendance_date >= CURRENT_DATE() - INTERVAL 30 DAY"
    );
    $attendance->execute([":institute" => $instituteId]);

    $examinations = $db->prepare(
        "SELECT
            COUNT(DISTINCT e.id) AS examinations,
            COUNT(DISTINCT ep.id) AS papers,
            COUNT(ser.student_id) AS results,
            ROUND(AVG(CASE WHEN ep.max_marks > 0 THEN ser.marks_obtained / ep.max_marks * 100 END), 1) AS average_percentage
         FROM examinations e
         LEFT JOIN examination_papers ep ON ep.examination_id = e.id
         LEFT JOIN student_exam_results ser ON ser.examination_paper_id = ep.id
         WHERE e.institute_id = :institute"
    );
    $examinations->execute([":institute" => $instituteId]);

    $recent = $db->prepare(
        "SELECT s.id, s.student_name, s.admission_no, s.admission_date, s.status,
                c.course_name, a.session_name
         FROM students s
         LEFT JOIN courses c ON c.id = s.course_id
         LEFT JOIN academic_sessions a ON a.id = s.session_id
         WHERE s.institute_id = :institute
         ORDER BY s.admission_date DESC, s.id DESC
         LIMIT 6"
    );
    $recent->execute([":institute" => $instituteId]);

    $courseDistribution = $db->prepare(
        "SELECT c.id, c.course_name AS label, COUNT(s.id) AS value
         FROM courses c
         LEFT JOIN students s ON s.course_id = c.id AND s.institute_id = c.institute_id
         WHERE c.institute_id = :institute
         GROUP BY c.id, c.course_name
         ORDER BY value DESC, c.course_name"
    );
    $courseDistribution->execute([":institute" => $instituteId]);

    $sessionDistribution = $db->prepare(
        "SELECT a.id, a.session_name AS label, COUNT(s.id) AS value
         FROM academic_sessions a
         LEFT JOIN students s ON s.session_id = a.id AND s.institute_id = a.institute_id
         WHERE a.institute_id = :institute
         GROUP BY a.id, a.session_name, a.start_year
         ORDER BY a.start_year DESC, a.session_name"
    );
    $sessionDistribution->execute([":institute" => $instituteId]);

    $genderDistribution = $db->prepare(
        "SELECT COALESCE(NULLIF(TRIM(gender), ''), 'Not recorded') AS label, COUNT(*) AS value
         FROM students WHERE institute_id = :institute
         GROUP BY COALESCE(NULLIF(TRIM(gender), ''), 'Not recorded')
         ORDER BY value DESC"
    );
    $genderDistribution->execute([":institute" => $instituteId]);

    $quality = $db->prepare(
        "SELECT
            COUNT(*) AS total,
            COALESCE(SUM(NULLIF(TRIM(mobile), '') IS NOT NULL), 0) AS mobile,
            COALESCE(SUM(NULLIF(TRIM(email), '') IS NOT NULL), 0) AS email,
            COALESCE(SUM(NULLIF(TRIM(aadhaar), '') IS NOT NULL), 0) AS aadhaar,
            COALESCE(SUM(NULLIF(TRIM(registration_no), '') IS NOT NULL), 0) AS registration,
            COALESCE(SUM(NULLIF(TRIM(college_roll_no), '') IS NOT NULL), 0) AS college_roll,
            COALESCE(SUM(NULLIF(TRIM(blood_group), '') IS NOT NULL), 0) AS blood_group
         FROM students WHERE institute_id = :institute"
    );
    $quality->execute([":institute" => $instituteId]);

    $activitySql = "
        SELECT * FROM (
            SELECT CAST(CONCAT('student-', s.id) AS CHAR) COLLATE utf8mb4_unicode_ci AS id,
                   CAST('admission' AS CHAR) COLLATE utf8mb4_unicode_ci AS activity_type,
                   CAST(CONCAT(s.student_name, ' added to ', COALESCE(c.course_name, 'student records')) AS CHAR) COLLATE utf8mb4_unicode_ci AS title,
                   CAST(CONCAT(COALESCE(s.admission_no, 'No admission number'), ' · ', COALESCE(a.session_name, 'Session not assigned')) AS CHAR) COLLATE utf8mb4_unicode_ci AS detail,
                   s.created_at AS occurred_at
            FROM students s
            LEFT JOIN courses c ON c.id = s.course_id
            LEFT JOIN academic_sessions a ON a.id = s.session_id
            WHERE s.institute_id = {$instituteId}

            UNION ALL

            SELECT CAST(CONCAT('fee-', l.id) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST('fee' AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(l.entry_type, ' of ₹', FORMAT(l.amount, 0), ' recorded') AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(COALESCE(st.student_name, 'Student'), COALESCE(CONCAT(' · ', l.reference_no), '')) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   l.created_at
            FROM student_fee_ledger l
            LEFT JOIN students st ON st.id = l.student_id
            WHERE l.institute_id = {$instituteId}

            UNION ALL

            SELECT CAST(CONCAT('attendance-', ats.id) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST('attendance' AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(COALESCE(sub.name, 'Class'), ' attendance ', LOWER(ats.status)) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(DATE_FORMAT(ats.attendance_date, '%d %b %Y'), COALESCE(CONCAT(' · ', ats.period_label), '')) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   ats.created_at
            FROM attendance_sessions ats
            LEFT JOIN subjects sub ON sub.id = ats.subject_id
            WHERE ats.institute_id = {$instituteId}

            UNION ALL

            SELECT CAST(CONCAT('result-', ep.id, '-', ser.student_id) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST('result' AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT('CIA result entered for ', COALESCE(st.student_name, 'student')) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(sub.code, ' · ', ser.marks_obtained, '/', ep.max_marks) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   ser.entered_at
            FROM student_exam_results ser
            INNER JOIN examination_papers ep ON ep.id = ser.examination_paper_id
            INNER JOIN subjects sub ON sub.id = ep.subject_id
            LEFT JOIN students st ON st.id = ser.student_id
            WHERE ep.institute_id = {$instituteId}

            UNION ALL

            SELECT CAST(CONCAT('faculty-', f.id) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST('faculty' AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(f.name, ' added to faculty directory') AS CHAR) COLLATE utf8mb4_unicode_ci,
                   CAST(CONCAT(COALESCE(f.designation, 'Faculty'), COALESCE(CONCAT(' · ', d.name), '')) AS CHAR) COLLATE utf8mb4_unicode_ci,
                   COALESCE(f.joining_date, CURRENT_DATE())
            FROM faculty f
            LEFT JOIN departments d ON d.id = f.department_id
            WHERE f.institute_id = {$instituteId}
        ) activity
        ORDER BY occurred_at DESC
        LIMIT 14
    ";
    $activities = $db->query($activitySql)->fetchAll();

    success([
        "stats" => $stats->fetch() ?: [],
        "finance" => $financeData,
        "attendance" => $attendance->fetch() ?: [],
        "examinations" => $examinations->fetch() ?: [],
        "recent_admissions" => $recent->fetchAll(),
        "distributions" => [
            "courses" => $courseDistribution->fetchAll(),
            "sessions" => $sessionDistribution->fetchAll(),
            "gender" => $genderDistribution->fetchAll(),
        ],
        "data_quality" => $quality->fetch() ?: [],
        "activities" => $activities,
        "generated_at" => gmdate(DATE_ATOM),
        "refresh_after_seconds" => 30,
    ]);
} catch (Throwable $exception) {
    serverError($exception);
}
