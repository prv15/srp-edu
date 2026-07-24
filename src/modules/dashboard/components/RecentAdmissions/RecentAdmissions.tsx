import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RecentAdmission } from "../../types/dashboard";
import DashboardCard from "../DashboardCard";
import styles from "./RecentAdmissions.module.css";

export default function RecentAdmissions({ admissions }: { admissions: RecentAdmission[] }) {
    const navigate = useNavigate();

    return (
        <DashboardCard title="Recent admissions">
            <div className={styles.list}>
                {admissions.length === 0 && <p>No admission records are available.</p>}
                {admissions.map(student => (
                    <div key={student.id} className={styles.item}>
                        <div className={styles.avatar}>{student.student_name.charAt(0)}</div>
                        <div className={styles.info}>
                            <h4>{student.student_name}</h4>
                            <span>{student.course_name || "Course not assigned"}</span>
                            <small>{student.admission_no} · {student.admission_date || "Date unavailable"}</small>
                        </div>
                        <div className={styles.status}>
                            <span className={styles.badge}>{student.status}</span>
                            <small>{student.session_name || "Session not assigned"}</small>
                        </div>
                        <button
                            className={styles.viewButton}
                            aria-label={`Open ${student.student_name}'s profile`}
                            onClick={() => navigate(`/students/profile/${student.id}`)}
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
}
