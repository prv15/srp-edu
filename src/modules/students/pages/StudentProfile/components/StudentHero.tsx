import type { StudentProfile } from "../../../types/student";
import styles from "./StudentHero.module.css";

type Props = {
    student: StudentProfile;
    initials: string;
};

export default function StudentHero({
    student,
    initials
}: Props) {

    return (

        <div className={styles.hero}>

            <div className={styles.left}>

                <div className={styles.avatar}>

                    {initials}

                </div>

                <div>

                    <h1>{student.student_name}</h1>

                    <p>

                        {student.course_name}

                        {" • "}

                        {student.department_name}

                    </p>

                    <div className={styles.meta}>

                        <span>

                            Admission :
                            {student.admission_no}

                        </span>

                        <span>

                            Roll :
                            {student.college_roll_no || "-"}

                        </span>

                        <span>

                            Session :
                            {student.session_name}

                        </span>

                    </div>

                </div>

            </div>

            <div className={styles.right}>

                <span className={styles.status}>

                    {student.status}

                </span>

                <button>Edit</button>

                <button>Print ID</button>

                <button>Download PDF</button>

                <button>Promote</button>

            </div>

        </div>

    );

}