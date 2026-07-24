import {
    Eye,
    Pencil,
    MoreVertical
} from "lucide-react";

import styles from "./StudentTable.module.css";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { getStudents } from "../../services/student.service";


export default function StudentTable(){
    const { institute } = useInstitute();

const students = getStudents(institute.code);

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

                    {students.map(student=>(

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