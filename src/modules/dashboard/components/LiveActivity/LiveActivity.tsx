import { BookOpenCheck, GraduationCap, IndianRupee, UserPlus, UsersRound } from "lucide-react";
import type { ActivityItem } from "../../types/dashboard";
import DashboardCard from "../DashboardCard";
import styles from "./LiveActivity.module.css";

const icons = {
    admission: UserPlus,
    fee: IndianRupee,
    attendance: UsersRound,
    result: BookOpenCheck,
    faculty: GraduationCap,
};

function relativeTime(value: string): string {
    const time = new Date(value).getTime();
    if (!Number.isFinite(time)) return value;
    const seconds = Math.max(0, Math.round((Date.now() - time) / 1000));
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(time);
}

export default function LiveActivity({ activities }: { activities: ActivityItem[] }) {
    return (
        <div className={styles.wrapper}>
            <DashboardCard title="Live institutional activity">
                <div className={styles.liveLabel}><i /> Live database events</div>
                <div className={styles.timeline}>
                    {activities.length === 0 && <div className={styles.empty}>No operational activity has been recorded for this institute yet.</div>}
                    {activities.map(activity => {
                        const Icon = icons[activity.activity_type] || BookOpenCheck;
                        return <div key={activity.id} className={styles.item}>
                            <div className={`${styles.icon} ${styles[activity.activity_type]}`}><Icon size={18} /></div>
                            <div className={styles.content}>
                                <strong>{activity.title}</strong>
                                <p>{activity.detail}</p>
                                <span>{relativeTime(activity.occurred_at)}</span>
                            </div>
                        </div>;
                    })}
                </div>
            </DashboardCard>
        </div>
    );
}
