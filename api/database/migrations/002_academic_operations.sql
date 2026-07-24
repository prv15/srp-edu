CREATE TABLE IF NOT EXISTS universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    short_name VARCHAR(60) NULL,
    authority_type ENUM('University','Board','Council') NOT NULL DEFAULT 'University',
    state VARCHAR(100) NULL,
    website VARCHAR(255) NULL,
    UNIQUE KEY uq_university_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS institute_affiliations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    university_id INT NOT NULL,
    affiliation_no VARCHAR(100) NULL,
    valid_from DATE NULL,
    valid_to DATE NULL,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    UNIQUE KEY uq_institute_university (institute_id, university_id),
    CONSTRAINT fk_affiliation_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_affiliation_university FOREIGN KEY (university_id) REFERENCES universities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS course_semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    course_id INT NOT NULL,
    semester_no TINYINT UNSIGNED NOT NULL,
    name VARCHAR(60) NOT NULL,
    admission_session ENUM('January','July','Annual') NOT NULL DEFAULT 'Annual',
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    UNIQUE KEY uq_course_semester (course_id, semester_no),
    KEY idx_semester_tenant (institute_id, status),
    CONSTRAINT fk_semester_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_semester_course FOREIGN KEY (course_id) REFERENCES courses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    course_id INT NOT NULL,
    department_id INT NULL,
    semester_id INT NOT NULL,
    code VARCHAR(40) NOT NULL,
    name VARCHAR(180) NOT NULL,
    paper_category VARCHAR(30) NULL,
    paper_title VARCHAR(255) NULL,
    delivery_type ENUM('Theory','Practical','Theory and Practical') NOT NULL DEFAULT 'Theory',
    credits DECIMAL(4,1) NULL,
    max_cia_marks DECIMAL(6,2) NULL,
    max_university_marks DECIMAL(6,2) NULL,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    UNIQUE KEY uq_subject_offering (institute_id, course_id, semester_id, code),
    KEY idx_subject_tenant_semester (institute_id, semester_id),
    CONSTRAINT fk_subject_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_subject_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_subject_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_subject_semester FOREIGN KEY (semester_id) REFERENCES course_semesters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS academic_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    course_id INT NOT NULL,
    session_id INT NOT NULL,
    semester_id INT NOT NULL,
    name VARCHAR(80) NOT NULL,
    capacity SMALLINT UNSIGNED NULL,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    UNIQUE KEY uq_section (institute_id, session_id, semester_id, name),
    CONSTRAINT fk_section_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_section_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_section_session FOREIGN KEY (session_id) REFERENCES academic_sessions(id),
    CONSTRAINT fk_section_semester FOREIGN KEY (semester_id) REFERENCES course_semesters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faculty (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    department_id INT NULL,
    employee_id VARCHAR(60) NOT NULL,
    name VARCHAR(160) NOT NULL,
    designation VARCHAR(100) NULL,
    email VARCHAR(190) NULL,
    mobile VARCHAR(20) NULL,
    qualification VARCHAR(255) NULL,
    employment_type ENUM('Permanent','Contract','Guest','Visiting') NOT NULL DEFAULT 'Permanent',
    joining_date DATE NULL,
    status ENUM('Active','Inactive','On Leave') NOT NULL DEFAULT 'Active',
    UNIQUE KEY uq_faculty_employee (institute_id, employee_id),
    KEY idx_faculty_tenant_status (institute_id, status),
    CONSTRAINT fk_faculty_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_faculty_department FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faculty_subject_assignments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    faculty_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    section_id INT NULL,
    academic_session_id INT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uq_faculty_assignment (faculty_id, subject_id, section_id, academic_session_id),
    CONSTRAINT fk_assignment_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_assignment_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    CONSTRAINT fk_assignment_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
    CONSTRAINT fk_assignment_section FOREIGN KEY (section_id) REFERENCES academic_sections(id),
    CONSTRAINT fk_assignment_session FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    section_id INT NULL,
    faculty_id BIGINT UNSIGNED NULL,
    attendance_date DATE NOT NULL,
    period_label VARCHAR(50) NULL,
    topic VARCHAR(255) NULL,
    status ENUM('Draft','Submitted','Locked') NOT NULL DEFAULT 'Draft',
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_attendance_tenant_date (institute_id, attendance_date),
    CONSTRAINT fk_attendance_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_attendance_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
    CONSTRAINT fk_attendance_section FOREIGN KEY (section_id) REFERENCES academic_sections(id),
    CONSTRAINT fk_attendance_faculty FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    CONSTRAINT fk_attendance_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_attendance (
    attendance_session_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT NOT NULL,
    attendance_status ENUM('Present','Absent','Late','Excused') NOT NULL,
    remarks VARCHAR(255) NULL,
    PRIMARY KEY (attendance_session_id, student_id),
    CONSTRAINT fk_student_attendance_session FOREIGN KEY (attendance_session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_attendance_student FOREIGN KEY (student_id) REFERENCES students(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS examinations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    academic_session_id INT NOT NULL,
    semester_id INT NOT NULL,
    exam_type ENUM('CIA','University','Practical','Assignment') NOT NULL,
    name VARCHAR(160) NOT NULL,
    form_start_date DATE NULL,
    form_end_date DATE NULL,
    exam_start_date DATE NULL,
    exam_end_date DATE NULL,
    status ENUM('Planned','Form Open','Scheduled','Completed','Published') NOT NULL DEFAULT 'Planned',
    UNIQUE KEY uq_exam_context (institute_id, academic_session_id, semester_id, exam_type, name),
    KEY idx_exam_tenant (institute_id, academic_session_id, semester_id),
    CONSTRAINT fk_exam_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_exam_session FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id),
    CONSTRAINT fk_exam_semester FOREIGN KEY (semester_id) REFERENCES course_semesters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS examination_papers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    examination_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    exam_date DATE NULL,
    max_marks DECIMAL(6,2) NOT NULL,
    passing_marks DECIMAL(6,2) NULL,
    UNIQUE KEY uq_examination_subject (examination_id, subject_id),
    CONSTRAINT fk_exam_paper_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_exam_paper_exam FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE,
    CONSTRAINT fk_exam_paper_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_exam_results (
    examination_paper_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT NOT NULL,
    marks_obtained DECIMAL(6,2) NULL,
    attendance_status ENUM('Present','Absent','Withheld') NOT NULL DEFAULT 'Present',
    remarks VARCHAR(255) NULL,
    entered_by BIGINT UNSIGNED NULL,
    entered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (examination_paper_id, student_id),
    CONSTRAINT fk_result_paper FOREIGN KEY (examination_paper_id) REFERENCES examination_papers(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_result_user FOREIGN KEY (entered_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fee_heads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    code VARCHAR(40) NOT NULL,
    name VARCHAR(120) NOT NULL,
    refundable BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    UNIQUE KEY uq_fee_head (institute_id, code),
    CONSTRAINT fk_fee_head_institute FOREIGN KEY (institute_id) REFERENCES institutes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fee_structures (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    course_id INT NOT NULL,
    academic_session_id INT NOT NULL,
    semester_id INT NULL,
    fee_head_id INT NOT NULL,
    admission_session ENUM('January','July','Annual') NOT NULL DEFAULT 'Annual',
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NULL,
    UNIQUE KEY uq_fee_structure (course_id, academic_session_id, semester_id, fee_head_id, admission_session),
    CONSTRAINT fk_fee_structure_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_fee_structure_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_fee_structure_session FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id),
    CONSTRAINT fk_fee_structure_semester FOREIGN KEY (semester_id) REFERENCES course_semesters(id),
    CONSTRAINT fk_fee_structure_head FOREIGN KEY (fee_head_id) REFERENCES fee_heads(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_fee_ledger (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institute_id INT NOT NULL,
    student_id BIGINT NOT NULL,
    fee_structure_id BIGINT UNSIGNED NULL,
    entry_type ENUM('Charge','Payment','Discount','Refund','Fine','Adjustment') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reference_no VARCHAR(100) NULL,
    payment_mode ENUM('Cash','UPI','Card','Bank Transfer','Cheque','Online','Other') NULL,
    entry_date DATE NOT NULL,
    remarks VARCHAR(255) NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_fee_ledger_tenant_student (institute_id, student_id, entry_date),
    CONSTRAINT fk_fee_ledger_institute FOREIGN KEY (institute_id) REFERENCES institutes(id),
    CONSTRAINT fk_fee_ledger_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_fee_ledger_structure FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id),
    CONSTRAINT fk_fee_ledger_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO universities (name, short_name, authority_type, state)
VALUES ('Purnea University, Purnea', 'Purnea University', 'University', 'Bihar');

INSERT IGNORE INTO institute_affiliations (institute_id, university_id, status)
SELECT i.id, u.id, 'Active'
FROM institutes i CROSS JOIN universities u
WHERE i.code = 'degree' AND u.name = 'Purnea University, Purnea';

INSERT IGNORE INTO course_semesters
    (institute_id, course_id, semester_no, name, admission_session, status)
SELECT c.institute_id, c.id, numbers.semester_no,
       CONCAT('Semester ', numbers.semester_no),
       IF(MOD(numbers.semester_no, 2) = 1, 'July', 'January'),
       'Active'
FROM courses c
CROSS JOIN (
    SELECT 1 semester_no UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
) numbers
WHERE c.institute_id = (SELECT id FROM institutes WHERE code = 'degree' LIMIT 1);

INSERT IGNORE INTO permissions (code, name) VALUES
('faculty.view', 'View faculty'),
('faculty.manage', 'Manage faculty'),
('examinations.view', 'View examinations'),
('examinations.manage', 'Manage examinations'),
('library.view', 'View library'),
('library.manage', 'Manage library'),
('hostel.view', 'View hostel'),
('hostel.manage', 'Manage hostel'),
('transport.view', 'View transport'),
('transport.manage', 'Manage transport'),
('inventory.view', 'View inventory'),
('inventory.manage', 'Manage inventory'),
('communication.view', 'View communication'),
('communication.manage', 'Manage communication');
