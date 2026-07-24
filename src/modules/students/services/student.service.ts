import { ApiError, apiRequest } from "../../../services/api";
import type { Student, StudentProfile } from "../types/student";

type StudentApi = {
    id: string | number;
    student_uid: string;
    student_name: string;
    admission_no: string;
    college_roll_no: string;
    gender: "M" | "F" | "O" | "Male" | "Female" | "Other";
    mobile: string;
    email: string;
    status: string;
    course_name: string;
    department?: string;
    session_name?: string;
    admission_date?: string;
    father_name?: string;
};

export async function getStudents(
    instituteId: number,
    signal?: AbortSignal,
): Promise<Student[]> {
    const rows = await apiRequest<StudentApi[]>("students/list.php", {
        instituteId,
        signal,
    });

    return rows.map((row): Student => {
        const parts = (row.student_name || "").trim().split(/\s+/);

        return {
            id: String(row.id),
            admissionNo: row.admission_no || "",
            institute:
                instituteId === 1
                    ? "school"
                    : instituteId === 2
                    ? "training"
                    : "degree",
            firstName: parts.shift() || "",
            lastName: parts.join(" "),
            gender:
                row.gender === "M" || row.gender === "Male"
                    ? "Male"
                    : row.gender === "F" || row.gender === "Female"
                    ? "Female"
                    : "Other",
            course: row.course_name || "",
            section: "",
            rollNo: row.college_roll_no || "",
            fatherName: row.father_name || "",
            mobile: row.mobile || "",
            email: row.email || "",
            department: row.department || "",
            academicYear: row.session_name || "",
            admissionDate: row.admission_date || "",
            status:
                row.status === "Active"
                    ? "Active"
                    : row.status === "Completed"
                    ? "Completed"
                    : row.status === "TC"
                    ? "TC"
                    : "Inactive",
        };
    });
}

export async function getStudentById(
    id: string,
    instituteId: number,
    signal?: AbortSignal,
): Promise<StudentProfile> {
    const student = await apiRequest<StudentProfile>("students/details.php", {
        instituteId,
        signal,
        query: { id },
    });

    if (Number(student.institute_id) !== instituteId) {
        throw new ApiError("Student does not belong to the selected institute.", 403);
    }

    return student;
}
