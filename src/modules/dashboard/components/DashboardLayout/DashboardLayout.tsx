import type { ReactNode } from "react";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
    left: ReactNode;
    right: ReactNode;
}

export default function DashboardLayout({
    left,
    right,
}: DashboardLayoutProps) {
    return (
        <section className={styles.layout}>
            <div className={styles.left}>
                {left}
            </div>

            <div className={styles.right}>
                {right}
            </div>
        </section>
    );
}