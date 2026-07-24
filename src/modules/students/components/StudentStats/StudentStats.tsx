import {
    Users,
    UserCheck,
    UserPlus,
    GraduationCap,
} from "lucide-react";

import styles from "./StudentStats.module.css";

const stats = [
    {
        title: "Total Students",
        value: "5,462",
        change: "+126 this month",
        icon: Users,
        color: styles.blue,
    },
    {
        title: "Active Students",
        value: "5,238",
        change: "95.9%",
        icon: UserCheck,
        color: styles.green,
    },
    {
        title: "New Admissions",
        value: "154",
        change: "+18 this week",
        icon: UserPlus,
        color: styles.orange,
    },
    {
        title: "Graduated / TC",
        value: "70",
        change: "Current Session",
        icon: GraduationCap,
        color: styles.purple,
    },
];

export default function StudentStats() {
    return (
        <div className={styles.grid}>
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <div key={item.title} className={styles.card}>

                        <div className={`${styles.icon} ${item.color}`}>
                            <Icon size={24} />
                        </div>

                        <div className={styles.content}>
                            <span>{item.title}</span>
                            <h2>{item.value}</h2>
                            <small>{item.change}</small>
                        </div>

                    </div>
                );
            })}
        </div>
    );
}