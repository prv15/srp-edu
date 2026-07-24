import {
    Plus,
    UserPlus,
    FileText,
    Sun
} from "lucide-react";

import styles from "./Hero.module.css";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../providers/AuthProvider";

export default function Hero() {
    const { institute } = useInstitute();
    const { user } = useAuth();
    const navigate = useNavigate();

    return (

        <section className={styles.hero}>

            <div className={styles.left}>

                <div className={styles.badge}>

                    <Sun size={16} />

                    <span>Good Afternoon</span>

                </div>

                <h1>Dashboard Overview</h1>

                <p>
                    Welcome back, {user?.name || "User"}.
                    Here's what's happening across your institution today.
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
