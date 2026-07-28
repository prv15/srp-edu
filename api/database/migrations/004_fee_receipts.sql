START TRANSACTION;

CREATE TABLE institute_receipt_settings (
    institute_id INT NOT NULL,
    receipt_heading VARCHAR(180) NOT NULL,
    legal_name VARCHAR(180) NOT NULL,
    managing_body VARCHAR(180) NULL,
    address_line VARCHAR(255) NULL,
    ug_recognition_text VARCHAR(500) NULL,
    professional_recognition_text VARCHAR(500) NULL,
    ug_accent_color CHAR(7) NOT NULL DEFAULT '#FFDA68',
    professional_accent_color CHAR(7) NOT NULL DEFAULT '#92D050',
    logo_path VARCHAR(255) NULL,
    PRIMARY KEY (institute_id),
    CONSTRAINT fk_receipt_settings_institute
        FOREIGN KEY (institute_id) REFERENCES institutes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO institute_receipt_settings (
    institute_id,
    receipt_heading,
    legal_name,
    managing_body,
    address_line,
    ug_recognition_text,
    professional_recognition_text
)
SELECT
    id,
    'SRPB DEGREE COLLEGE OF EDUCATION',
    'SUNRISE PUNAM BIRENDRA DEGREE COLLEGE OF EDUCATION',
    'RUN UNDER - GM EDUCATIONAL TRUST',
    'Geeta Bhubneshwar Nagar, Vishwaspur, Mahthour, Dagarua - 854326, Purnia, Bihar',
    'Recognised By - Higher Education (Govt. of Bihar) | A Unit of - Purnea University, Purnia',
    'Recognised By - AICTE (Govt. of India) & Higher Education (Govt. of Bihar) | A Unit of - Aryabhatta Knowledge University, Patna'
FROM institutes
WHERE code = 'degree'
ON DUPLICATE KEY UPDATE
    receipt_heading = VALUES(receipt_heading),
    legal_name = VALUES(legal_name);

CREATE TABLE fee_receipts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    institute_id INT NOT NULL,
    student_id BIGINT NOT NULL,
    academic_session_id INT NULL,
    semester_id INT NULL,
    receipt_no VARCHAR(50) NOT NULL,
    receipt_template ENUM('UG', 'BBA_BCA') NOT NULL DEFAULT 'UG',
    university_application_no VARCHAR(100) NULL,
    practical_subject VARCHAR(180) NULL,
    period_label VARCHAR(100) NULL,
    payment_mode VARCHAR(50) NULL,
    transaction_id VARCHAR(120) NULL,
    gross_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    practical_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    other_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    advance_back_dues DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_payable DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    remarks VARCHAR(500) NULL,
    issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_fee_receipt_number (institute_id, receipt_no),
    KEY idx_fee_receipt_student (institute_id, student_id, issued_at),
    CONSTRAINT fk_fee_receipt_institute
        FOREIGN KEY (institute_id) REFERENCES institutes (id),
    CONSTRAINT fk_fee_receipt_student
        FOREIGN KEY (student_id) REFERENCES students (id),
    CONSTRAINT fk_fee_receipt_session
        FOREIGN KEY (academic_session_id) REFERENCES academic_sessions (id),
    CONSTRAINT fk_fee_receipt_semester
        FOREIGN KEY (semester_id) REFERENCES course_semesters (id),
    CONSTRAINT fk_fee_receipt_creator
        FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fee_receipt_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    receipt_id BIGINT UNSIGNED NOT NULL,
    fee_head_id INT NULL,
    section_label VARCHAR(80) NULL,
    particulars VARCHAR(180) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    display_order SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_receipt_item_order (receipt_id, display_order),
    CONSTRAINT fk_receipt_item_receipt
        FOREIGN KEY (receipt_id) REFERENCES fee_receipts (id) ON DELETE CASCADE,
    CONSTRAINT fk_receipt_item_head
        FOREIGN KEY (fee_head_id) REFERENCES fee_heads (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
