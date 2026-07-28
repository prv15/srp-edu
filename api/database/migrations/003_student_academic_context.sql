START TRANSACTION;

CREATE TABLE subject_disciplines (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    institute_id INT NOT NULL,
    department_id INT NULL,
    name VARCHAR(180) NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_subject_discipline (institute_id, name),
    KEY idx_subject_discipline_department (institute_id, department_id),
    CONSTRAINT fk_subject_discipline_institute
        FOREIGN KEY (institute_id) REFERENCES institutes (id),
    CONSTRAINT fk_subject_discipline_department
        FOREIGN KEY (department_id) REFERENCES departments (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO subject_disciplines (institute_id, department_id, name)
SELECT
    subject.institute_id,
    MIN(subject.department_id),
    UPPER(TRIM(subject.name))
FROM subjects subject
WHERE UPPER(COALESCE(subject.paper_category, '')) LIKE '%MJC'
GROUP BY subject.institute_id, UPPER(TRIM(subject.name));

ALTER TABLE students
    ADD COLUMN semester_id INT NULL AFTER course_id,
    ADD COLUMN major_subject_id BIGINT UNSIGNED NULL AFTER semester_id,
    ADD INDEX idx_student_semester (institute_id, semester_id),
    ADD INDEX idx_student_major_subject (institute_id, major_subject_id),
    ADD CONSTRAINT fk_student_semester
        FOREIGN KEY (semester_id) REFERENCES course_semesters (id),
    ADD CONSTRAINT fk_student_major_subject
        FOREIGN KEY (major_subject_id) REFERENCES subject_disciplines (id);

UPDATE students student
INNER JOIN academic_sessions academic_session
    ON academic_session.id = student.session_id
    AND academic_session.institute_id = student.institute_id
INNER JOIN courses course
    ON course.id = student.course_id
    AND course.institute_id = student.institute_id
INNER JOIN course_semesters current_semester
    ON current_semester.institute_id = student.institute_id
    AND current_semester.course_id = student.course_id
    AND current_semester.semester_no = LEAST(
        course.duration * 2,
        GREATEST(
            1,
            (YEAR(CURRENT_DATE) - academic_session.start_year) * 2
                + IF(MONTH(CURRENT_DATE) >= 7, 1, 0)
        )
    )
SET student.semester_id = current_semester.id
WHERE student.semester_id IS NULL
  AND academic_session.start_year IS NOT NULL
  AND course.duration IS NOT NULL;

UPDATE students student
INNER JOIN (
    SELECT
        result.student_id,
        MAX(semester.semester_no) AS latest_semester_no
    FROM student_exam_results result
    INNER JOIN examination_papers paper
        ON paper.id = result.examination_paper_id
    INNER JOIN subjects subject
        ON subject.id = paper.subject_id
    INNER JOIN course_semesters semester
        ON semester.id = subject.semester_id
    GROUP BY result.student_id
) latest
    ON latest.student_id = student.id
INNER JOIN course_semesters current_semester
    ON current_semester.institute_id = student.institute_id
    AND current_semester.course_id = student.course_id
    AND current_semester.semester_no = latest.latest_semester_no
SET student.semester_id = current_semester.id
WHERE student.semester_id IS NULL;

UPDATE students student
INNER JOIN (
    SELECT
        result.student_id,
        MIN(discipline.id) AS major_subject_id
    FROM student_exam_results result
    INNER JOIN examination_papers paper
        ON paper.id = result.examination_paper_id
    INNER JOIN subjects subject
        ON subject.id = paper.subject_id
    INNER JOIN subject_disciplines discipline
        ON discipline.institute_id = subject.institute_id
        AND discipline.name = UPPER(TRIM(subject.name))
    WHERE UPPER(subject.paper_category) LIKE '%MJC'
    GROUP BY result.student_id
) major
    ON major.student_id = student.id
INNER JOIN subject_disciplines discipline
    ON discipline.id = major.major_subject_id
    AND discipline.institute_id = student.institute_id
SET student.major_subject_id = major.major_subject_id
WHERE student.major_subject_id IS NULL;

COMMIT;
