import { BookOpenCheck, CalendarCheck2, IndianRupee, ShieldCheck } from "lucide-react";
import type { DashboardOverview, DistributionItem } from "../../types/dashboard";
import styles from "./InstitutionInsights.module.css";

const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export default function InstitutionInsights({ overview }: { overview: DashboardOverview }) {
    const qualityFields = [
        ["Mobile", overview.data_quality.mobile],
        ["Email", overview.data_quality.email],
        ["Aadhaar", overview.data_quality.aadhaar],
        ["Registration", overview.data_quality.registration],
        ["College roll", overview.data_quality.college_roll],
        ["Blood group", overview.data_quality.blood_group],
    ] as const;
    const total = Number(overview.data_quality.total) || 0;

    return (
        <>
            <section className={styles.operations}>
                <OperationCard
                    icon={IndianRupee}
                    title="Fee position"
                    primary={currency.format(Number(overview.finance.collected))}
                    detail={`${currency.format(Number(overview.finance.outstanding))} outstanding`}
                    meta={`${currency.format(Number(overview.finance.collected_today))} collected today`}
                    tone="green"
                />
                <OperationCard
                    icon={CalendarCheck2}
                    title="Attendance · 30 days"
                    primary={`${Number(overview.attendance.attendance_rate || 0).toFixed(1)}%`}
                    detail={`${Number(overview.attendance.marked).toLocaleString("en-IN")} student marks`}
                    meta={`${Number(overview.attendance.sessions_today)} sessions today`}
                    tone="purple"
                />
                <OperationCard
                    icon={BookOpenCheck}
                    title="Examination performance"
                    primary={`${Number(overview.examinations.average_percentage || 0).toFixed(1)}%`}
                    detail={`${Number(overview.examinations.results).toLocaleString("en-IN")} result entries`}
                    meta={`${Number(overview.examinations.papers)} papers across ${Number(overview.examinations.examinations)} examinations`}
                    tone="amber"
                />
            </section>

            <section className={styles.insightGrid}>
                <Distribution title="Students by programme" items={overview.distributions.courses} />
                <Distribution title="Students by academic session" items={overview.distributions.sessions} />
                <article className={styles.quality}>
                    <header><div><span>Governance</span><h2>Student data completeness</h2></div><ShieldCheck size={21} /></header>
                    {qualityFields.map(([label, value]) => {
                        const percentage = total ? Math.round(Number(value) / total * 100) : 0;
                        return <div className={styles.qualityRow} key={label}>
                            <div><span>{label}</span><strong>{percentage}%</strong></div>
                            <div className={styles.track}><i style={{ width: `${percentage}%` }} /></div>
                        </div>;
                    })}
                    {!total && <p className={styles.noData}>No student records are available for this institute.</p>}
                </article>
            </section>
        </>
    );
}

function OperationCard({
    icon: Icon, title, primary, detail, meta, tone,
}: {
    icon: typeof IndianRupee; title: string; primary: string; detail: string; meta: string;
    tone: "green" | "purple" | "amber";
}) {
    return <article className={`${styles.operation} ${styles[tone]}`}>
        <div className={styles.operationTop}><div className={styles.operationIcon}><Icon size={21} /></div><span>Live</span></div>
        <p>{title}</p><h2>{primary}</h2><strong>{detail}</strong><small>{meta}</small>
    </article>;
}

function Distribution({ title, items }: { title: string; items: DistributionItem[] }) {
    const maximum = Math.max(...items.map(item => Number(item.value)), 1);
    const total = items.reduce((sum, item) => sum + Number(item.value), 0);
    return <article className={styles.distribution}>
        <header><div><span>Distribution</span><h2>{title}</h2></div><strong>{total.toLocaleString("en-IN")}</strong></header>
        <div className={styles.bars}>
            {items.map(item => <div key={`${item.id || ""}-${item.label}`} className={styles.barRow}>
                <div><span title={item.label}>{item.label}</span><strong>{Number(item.value).toLocaleString("en-IN")}</strong></div>
                <div className={styles.track}><i style={{ width: `${Number(item.value) / maximum * 100}%` }} /></div>
            </div>)}
            {!items.length && <p className={styles.noData}>No configured records for this institute.</p>}
        </div>
    </article>;
}
