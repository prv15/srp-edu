import { useEffect, useState } from "react";
import { Award, ClipboardCheck, FileCheck2, Sigma } from "lucide-react";
import { useInstitute } from "../../../contexts/InstituteContext";
import { apiRequest } from "../../../services/api";
import styles from "./ExaminationOverview.module.css";

type Overview = {
    summary: { examinations: number; papers: number; results: number; average_marks?: number; average_percentage?: number };
    examinations: Array<{ id: number; name: string; exam_type: string; status: string; session_name: string; semester_name: string; course_name: string; paper_count: number; result_count: number; average_marks?: number }>;
};

export default function ExaminationOverview() {
    const { institute } = useInstitute();
    return <Content key={institute.id} instituteId={institute.id} instituteName={institute.name} />;
}

function Content({ instituteId, instituteName }: { instituteId: number; instituteName: string }) {
    const [data, setData] = useState<Overview | null>(null);
    const [error, setError] = useState("");
    useEffect(() => {
        const controller = new AbortController();
        apiRequest<Overview>("examinations/overview.php", { instituteId, signal: controller.signal })
            .then(setData).catch(cause => {
                if (cause instanceof DOMException && cause.name === "AbortError") return;
                setError(cause instanceof Error ? cause.message : "Unable to load examinations.");
            });
        return () => controller.abort();
    }, [instituteId]);

    return <main className={styles.page}>
        <header><span>Assessment & university workflow</span><h1>Examinations</h1><p>CIA, practical and university examination records for {instituteName}</p></header>
        {error && <div className={styles.error}>{error}</div>}
        {!data && !error && <div className={styles.loading}>Loading examination records…</div>}
        {data && <>
            <section className={styles.stats}>
                <Stat icon={FileCheck2} label="Examinations" value={data.summary.examinations} />
                <Stat icon={ClipboardCheck} label="Papers" value={data.summary.papers} />
                <Stat icon={Sigma} label="Result entries" value={data.summary.results} />
                <Stat icon={Award} label="Average" value={`${Number(data.summary.average_percentage || 0).toFixed(1)}%`} />
            </section>
            {data.examinations.length ? <section className={styles.table}><table><thead><tr><th>Examination</th><th>Programme</th><th>Session</th><th>Semester</th><th>Papers</th><th>Results</th><th>Average marks</th><th>Status</th></tr></thead><tbody>{data.examinations.map(exam => <tr key={exam.id}><td><strong>{exam.name}</strong><small>{exam.exam_type}</small></td><td>{exam.course_name}</td><td>{exam.session_name}</td><td>{exam.semester_name}</td><td>{exam.paper_count}</td><td>{exam.result_count}</td><td>{exam.average_marks ?? "—"}</td><td><span>{exam.status}</span></td></tr>)}</tbody></table></section>
            : <section className={styles.empty}><FileCheck2 size={30}/><h2>No examinations configured</h2><p>Create the institute’s first CIA or university examination cycle.</p></section>}
        </>}
    </main>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof FileCheck2; label: string; value: number | string }) {
    return <article><Icon size={20}/><div><span>{label}</span><strong>{value}</strong></div></article>;
}
