import type { ReactNode } from "react";
import styles from "./DashboardGrid.module.css";

interface DashboardGridProps {
    children: ReactNode;
}

export default function DashboardGrid({
    children,
}: DashboardGridProps) {
    return (
        <section className={styles.grid}>
            {children}
        </section>
    );
}