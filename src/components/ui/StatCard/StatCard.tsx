import type { ReactNode } from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {

    title: string;

    value: string | number;

    icon: ReactNode;

    change?: string;

    color?: "blue" | "green" | "orange" | "red";

}

export default function StatCard({

    title,

    value,

    icon,

    change,

    color = "blue",

}: StatCardProps) {

    return (

        <div className={styles.card}>

            <div className={`${styles.icon} ${styles[color]}`}>

                {icon}

            </div>

            <div className={styles.content}>

                <span className={styles.title}>

                    {title}

                </span>

                <h2>{value}</h2>

                {change && (

                    <p>{change}</p>

                )}

            </div>

        </div>

    );

}