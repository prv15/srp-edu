import {
    Plus,
    UserPlus,
    FileText,
    Sun
} from "lucide-react";

import styles from "./Hero.module.css";

export default function Hero() {

    return (

        <section className={styles.hero}>

            <div className={styles.left}>

                <div className={styles.badge}>

                    <Sun size={16} />

                    <span>Good Afternoon</span>

                </div>

                <h1>Dashboard Overview</h1>

                <p>
                    Welcome back, Prakash Raj.
                    Here's what's happening across your institution today.
                </p>

                <div className={styles.quickStats}>

                    <div>

                        <span>Institute</span>

                        <strong>SRP School</strong>

                    </div>

                    <div>

                        <span>Academic Session</span>

                        <strong>2026–2027</strong>

                    </div>

                    <div>

                        <span>Working Day</span>

                        <strong>Day 62 / 220</strong>

                    </div>

                </div>

            </div>

            <div className={styles.actions}>

                <button className={styles.primary}>

                    <UserPlus size={18} />

                    New Admission

                </button>

                <button className={styles.secondary}>

                    <Plus size={18} />

                    Add Student

                </button>

                <button className={styles.secondary}>

                    <FileText size={18} />

                    Generate Report

                </button>

            </div>

        </section>

    );

}