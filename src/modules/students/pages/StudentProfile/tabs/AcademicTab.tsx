import type { StudentProfile } from "../../../types/student";
import styles from "./AcademicTab.module.css";

type Props = {
    student: StudentProfile;
};

export default function AcademicTab({ student }: Props) {

    const fields = [
        {
            label: "Institute",
            value: student.institute_name || "-"
        },
        {
            label: "Course",
            value: student.course_name || "-"
        },
        {
            label: "Department",
            value: student.department_name || "-"
        },
        {
            label: "Academic Session",
            value: student.session_name || "-"
        },
        {
            label: "Admission Number",
            value: student.admission_no || "-"
        },
        {
            label: "Roll Number",
            value: student.college_roll_no || "-"
        },
        {
            label: "Registration Number",
            value: student.registration_no || "-"
        },
        {
            label: "University Registration",
            value: student.university_registration_no || "-"
        },
        {
            label: "Admission Date",
            value: student.admission_date || "-"
        },
        {
            label: "Student Status",
            value: student.status || "-"
        }
    ];

    return (

        <div className={styles.card}>

            <h2>Academic Information</h2>

            <div className={styles.grid}>

                {fields.map((field) => (

                    <div
                        key={field.label}
                        className={styles.item}
                    >

                        <label>{field.label}</label>

                        <p>{field.value}</p>

                    </div>

                ))}

            </div>

        </div>

    );

}