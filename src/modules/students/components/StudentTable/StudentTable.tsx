import {
    Eye,
    Pencil,
    MoreVertical
} from "lucide-react";

import styles from "./StudentTable.module.css";
import { useEffect, useState } from "react";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { getStudents } from "../../services/student.service";
import type { Student } from "../../types/student";


export default function StudentTable(){
    const { institute } = useInstitute();

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        async function loadStudents() {
            try {
                const result = await getStudents(institute.id, controller.signal);
                setStudents(result);
            } catch (cause) {
                if (cause instanceof DOMException && cause.name === "AbortError") return;
                setError(cause instanceof Error ? cause.message : "Unable to load students.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        void loadStudents();
        return () => controller.abort();
    }, [institute.id]);

    return(

        <div className={styles.card}>

            <table className={styles.table}>

                <thead>

                    <tr>

                        <th>Student</th>

                        <th>Admission No</th>

                        <th>Class / Course</th>

                        <th>Parent</th>

                        <th>Mobile</th>

                        <th>Status</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {loading && (
                        <tr><td colSpan={7} className={styles.state}>Loading students…</td></tr>
                    )}

                    {!loading && error && (
                        <tr><td colSpan={7} className={styles.error}>{error}</td></tr>
                    )}

                    {!loading && !error && students.length === 0 && (
                        <tr><td colSpan={7} className={styles.state}>No students are available for this institute.</td></tr>
                    )}

                    {!loading && !error && students.map(student=>(

                        <tr key={student.id}>

                            <td>

                                <div className={styles.student}>

                                    <div className={styles.avatar}>

                                        {student.firstName.charAt(0)}

                                    </div>

                                    <div>

                                        <strong>

                                            {student.firstName} {student.lastName}

                                        </strong>

                                    </div>

                                </div>

                            </td>

                            <td>{student.admissionNo}</td>

                            <td>{student.course} {student.section && `-${student.section}`}

                            </td>

                            <td>{student.fatherName}</td>

                            <td>{student.mobile}</td>

                            <td>

                                <span
                                    className={`${styles.badge} ${
                                        student.status==="Active"
                                            ? styles.active
                                            : student.status==="TC"
                                            ? styles.tc
                                            : styles.inactive
                                    }`}
                                >

                                    {student.status}

                                </span>

                            </td>

                            <td>

                                <div className={styles.actions}>

                                    <button>

                                        <Eye size={18}/>

                                    </button>

                                    <button>

                                        <Pencil size={18}/>

                                    </button>

                                    <button>

                                        <MoreVertical size={18}/>

                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    )

}
