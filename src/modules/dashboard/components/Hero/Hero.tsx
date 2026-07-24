import {
    Plus,
    UserPlus,
    FileText,
    RefreshCw,
    Sun
} from "lucide-react";

import styles from "./Hero.module.css";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../providers/AuthProvider";

export default function Hero({
    generatedAt,
    refreshing,
    onRefresh,
}: {
    generatedAt?: string;
    refreshing?: boolean;
    onRefresh?: () => void;
}) {
    const { institute } = useInstitute();
    const { user } = useAuth();
    const navigate = useNavigate();

    return (

        <section className={styles.hero}>

            <div className={styles.left}>

                <div className={styles.badge}>

                    <Sun size={16} />

                    <span>Super Admin command center</span>

                </div>

                <h1>{institute.name} Overview</h1>

                <p>
                    Welcome back, {user?.name || "User"}.
                    Live institutional intelligence, operational health and recent activity for the selected tenant.
                </p>

                <div className={styles.quickStats}>

                    <div>

                        <span>Institute</span>

                        <strong>{institute.name}</strong>

                    </div>

                    <div>

                        <span>Academic Session</span>

                        <strong>{institute.academicYear}</strong>

                    </div>

                    <div>

                        <span>Admission sessions</span>

                        <strong>{institute.admissionSessions.join(" & ")}</strong>

                    </div>

                </div>

            </div>

            <div className={styles.actions}>

                <div className={styles.liveStatus}>
                    <i />
                    <div><strong>Live data</strong><span>{generatedAt ? `Updated ${new Date(generatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Connecting…"}</span></div>
                    <button aria-label="Refresh dashboard" onClick={onRefresh} disabled={refreshing}><RefreshCw size={17} className={refreshing ? styles.spinning : ""} /></button>
                </div>

                <button className={styles.primary} onClick={() => navigate("/admissions/new")}>

                    <UserPlus size={18} />

                    New Admission

                </button>

                <button className={styles.secondary} onClick={() => navigate("/students")}>

                    <Plus size={18} />

                    Add Student

                </button>

                <button className={styles.secondary} onClick={() => navigate("/reports")}>

                    <FileText size={18} />

                    Generate Report

                </button>

            </div>

        </section>

    );

}
