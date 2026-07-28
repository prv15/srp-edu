import { BadgeCheck, BookOpenCheck, GraduationCap, UserPlus, Users, VenusAndMars } from "lucide-react";
import type { DashboardStats } from "../../types/dashboard";
import styles from "./KPICards.module.css";

export default function KPICards({ stats }: { stats: DashboardStats }) {
    const currentYear = String(new Date().getFullYear());
    const cards = [
        {
            title: "Enrolled students",
            value: Number(stats.students).toLocaleString("en-IN"),
            detail: "Selected institute",
            color: "var(--primary)",
            icon: Users,
        },
        {
            title: "Active records",
            value: Number(stats.active_students).toLocaleString("en-IN"),
            detail: "Currently active",
            color: "#10B981",
            icon: BadgeCheck,
        },
        {
            title: "Admissions this year",
            value: Number(stats.admissions_this_year).toLocaleString("en-IN"),
            detail: currentYear,
            color: "#F59E0B",
            icon: UserPlus,
        },
        {
            title: "Gender recorded",
            value: Number(stats.gender_recorded).toLocaleString("en-IN"),
            detail: "Validated records",
            color: "#8B5CF6",
            icon: VenusAndMars,
        },
        {
            title: "Active faculty",
            value: Number(stats.active_faculty).toLocaleString("en-IN"),
            detail: "Teaching workforce",
            color: "#0EA5E9",
            icon: GraduationCap,
        },
        {
            title: "Academic catalogue",
            value: Number(stats.active_subjects).toLocaleString("en-IN"),
            detail: `${Number(stats.active_courses).toLocaleString("en-IN")} active programmes`,
            color: "#EC4899",
            icon: BookOpenCheck,
        },
    ];

    return (
        <section className={styles.grid} aria-label="Student overview">
            {cards.map(card => {
                const Icon = card.icon;
                return (
                    <div key={card.title} className={styles.card}>
                        <div className={styles.top}>
                            <div>
                                <p>{card.title}</p>
                                <h2>{card.value}</h2>
                            </div>
                            <div className={styles.icon} style={{ background: card.color }}>
                                <Icon size={24} />
                            </div>
                        </div>
                        <span className={styles.growth}>{card.detail}</span>
                    </div>
                );
            })}
        </section>
    );
}
