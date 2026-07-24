CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    employee_id VARCHAR(80) NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive', 'Locked') NOT NULL DEFAULT 'Active',
    failed_login_attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    last_login_at DATETIME NULL,
    password_changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_institutes (
    user_id BIGINT UNSIGNED NOT NULL,
    institute_id INT NOT NULL,
    PRIMARY KEY (user_id, institute_id),
    CONSTRAINT fk_user_institutes_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_institutes_institute
        FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO roles (code, name) VALUES
('super_admin', 'Super Administrator'),
('organization_admin', 'Organization Administrator'),
('institute_admin', 'Institute Administrator'),
('principal', 'Principal'),
('faculty', 'Faculty'),
('accounts', 'Accounts'),
('reception', 'Reception'),
('librarian', 'Librarian'),
('transport', 'Transport'),
('student', 'Student'),
('parent', 'Parent');

INSERT IGNORE INTO permissions (code, name) VALUES
('dashboard.view', 'View dashboard'),
('students.view', 'View students'),
('students.create', 'Create students'),
('students.update', 'Update students'),
('students.import', 'Import students'),
('admissions.view', 'View admissions'),
('admissions.manage', 'Manage admissions'),
('fees.view', 'View fees'),
('fees.manage', 'Manage fees'),
('attendance.view', 'View attendance'),
('attendance.manage', 'Manage attendance'),
('academics.view', 'View academic configuration'),
('academics.manage', 'Manage academic configuration'),
('reports.view', 'View reports'),
('reports.export', 'Export reports');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.code IN ('organization_admin', 'institute_admin');
