import type { StudentProfile } from "../../../types/student";
import styles from "./OverviewTab.module.css";

type Props = {
    student: StudentProfile;
};

export default function OverviewTab({ student }: Props) {

    return (

        <>

            <div className={styles.card}>

                <h3>Personal Information</h3>

                <div className={styles.grid}>

                    <div>
                        <label>Student UID</label>
                        <p>{student.student_uid || "-"}</p>
                    </div>

                    <div>
                        <label>Admission No</label>
                        <p>{student.admission_no || "-"}</p>
                    </div>

                    <div>
                        <label>College Roll No</label>
                        <p>{student.college_roll_no || "-"}</p>
                    </div>

                    <div>
                        <label>Registration No</label>
                        <p>{student.registration_no || "-"}</p>
                    </div>

                    <div>
                        <label>University Roll No</label>
                        <p>{student.university_roll_no || "-"}</p>
                    </div>

                    <div>
                        <label>Gender</label>
                        <p>{student.gender || "-"}</p>
                    </div>

                    <div>
                        <label>Date of Birth</label>
                        <p>{student.dob || "-"}</p>
                    </div>

                    <div>
                        <label>Category</label>
                        <p>{student.category || "-"}</p>
                    </div>

                    <div>
                        <label>Religion</label>
                        <p>{student.religion || "-"}</p>
                    </div>

                    <div>
                        <label>Blood Group</label>
                        <p>{student.blood_group || "-"}</p>
                    </div>

                </div>

            </div>

            <div className={styles.card}>

                <h3>Contact Information</h3>

                <div className={styles.grid}>

                    <div>
                        <label>Mobile</label>
                        <p>{student.mobile || "-"}</p>
                    </div>

                    <div>
                        <label>Email</label>
                        <p>{student.email || "-"}</p>
                    </div>

                    <div>
                        <label>Address</label>
                        <p>{student.address || "-"}</p>
                    </div>

                    <div>
                        <label>City</label>
                        <p>{student.city || "-"}</p>
                    </div>

                    <div>
                        <label>District</label>
                        <p>{student.district || "-"}</p>
                    </div>

                    <div>
                        <label>State</label>
                        <p>{student.state || "-"}</p>
                    </div>

                    <div>
                        <label>Pincode</label>
                        <p>{student.pincode || "-"}</p>
                    </div>

                </div>

            </div>

            <div className={styles.card}>

                <h3>Academic Information</h3>

                <div className={styles.grid}>

                    <div>
                        <label>Institute</label>
                        <p>{student.institute_name}</p>
                    </div>

                    <div>
                        <label>Department</label>
                        <p>{student.department_name}</p>
                    </div>

                    <div>
                        <label>Course</label>
                        <p>{student.course_name || "-"}</p>
                    </div>

                    <div>
                        <label>Semester</label>
                        <p>{student.semester_name || "-"}</p>
                    </div>

                    <div>
                        <label>Major Subject</label>
                        <p>{student.major_subject || "-"}</p>
                    </div>

                    <div>
                        <label>Academic Session</label>
                        <p>{student.session_name || "-"}</p>
                    </div>

                    <div>
                        <label>Admission Session</label>
                        <p>{student.admission_cycle || "-"}</p>
                    </div>

                    <div>
                        <label>Admission Date</label>
                        <p>{student.admission_date}</p>
                    </div>

                    <div>
                        <label>Status</label>
                        <p>{student.status}</p>
                    </div>

                </div>

            </div>

            <div className={styles.card}>

                <h3>Guardian Information</h3>

                <div className={styles.grid}>

                    <div>
                        <label>Father Name</label>
                        <p>{student.father_name || "-"}</p>
                    </div>

                    <div>
                        <label>Mother Name</label>
                        <p>{student.mother_name || "-"}</p>
                    </div>

                    <div>
                        <label>Guardian Mobile</label>
                        <p>{student.guardian_mobile || "-"}</p>
                    </div>

                </div>

            </div>

        </>

    );

}
