import type { Student } from "../types/student";

const API_URL = "https://thetechservices.in/srp-edu/api/v1";

type StudentApi = {
    id: number;
    student_uid: string;
    student_name: string;
    admission_no: string;
    college_roll_no: string;
    gender: "Male" | "Female" | "Other";
    mobile: string;
    email: string;
    status: string;
    course_name: string;
};

export async function getStudents(
    instituteId: number
): Promise<Student[]> {

    const response = await fetch(
        `${API_URL}/students/list.php?institute_id=${instituteId}`
    );

    const json = await response.json();

    if (!json.success) {
        throw new Error(json.message);
    }

    return (json.data as StudentApi[]).map((row): Student => {

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

            gender: row.gender,

            course: row.course_name || "",

            section: "",

            rollNo: row.college_roll_no || "",

            // Your college DB doesn't currently have father's name in the
            // students table, so leave it blank for now.
            fatherName: "",

            mobile: row.mobile || "",

            email: row.email || "",

            status:
                row.status === "Active"
                    ? "Active"
                    : row.status === "Completed"
                    ? "Completed"
                    : row.status === "TC"
                    ? "TC"
                    : "Inactive"

        };

    });

}

export async function getStudentById(id: string) {

    const response = await fetch(
        `${API_URL}/students/details.php?id=${id}`
    );

    const json = await response.json();

    return json.data;

}