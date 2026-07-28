export type StudentStatus =
    | "Active"
    | "Inactive"
    | "TC"
    | "Completed";

export interface Student {

    id: string;

    admissionNo: string;

    institute: "school" | "degree" | "training";

    firstName: string;

    lastName: string;

    gender: "Male" | "Female" | "Other";

    course: string;

    section?: string;

    rollNo: string;

    fatherName: string;

    mobile: string;

    email?: string;

    status: StudentStatus;
    department?: string;
    academicYear?: string;
    admissionDate?: string;
    semesterId?: number;
    semester?: string;
    semesterNumber?: number;
    majorSubjectId?: number;
    majorSubject?: string;

}

/* -------------------------------------------------- */
/* Student Profile API Model */
/* -------------------------------------------------- */

export interface StudentProfile {

    id: number;
    institute_id: string;

    student_uid: string;

    student_name: string;

    admission_no: string;

    college_roll_no: string;

    registration_no: string;

    university_roll_no: string;
     university_registration_no?: string;

    first_name: string | null;

    middle_name: string | null;

    last_name: string | null;

    gender: string;

    dob: string | null;

    category: string | null;

    religion: string | null;

    mobile: string;

    email: string;

    aadhaar: string | null;

    blood_group: string | null;

    address: string | null;

    city: string | null;

    district: string | null;

    state: string | null;

    pincode: string | null;

    admission_date: string;

    status: string;

    institute_name: string;

    session_name: string;

    department_name: string;

    course_name: string;
    semester_id: number | null;
    semester_no: number | null;
    semester_name: string | null;
    major_subject_id: number | null;
    major_subject: string | null;
    admission_cycle: "January" | "July" | null;

    father_name: string | null;

    mother_name: string | null;
    father_mobile: string | null;
    father_occupation: string | null;
    father_email: string | null;
    mother_mobile: string | null;
    mother_occupation: string | null;
    mother_email: string | null;

    guardian_name: string | null;
    guardian_relation: string | null;
    guardian_mobile: string | null;
    guardian_email: string | null;

}
