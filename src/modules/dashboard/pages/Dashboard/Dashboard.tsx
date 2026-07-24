import { useEffect, useState } from "react";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { getDashboardOverview } from "../../services/dashboard.service";
import type { DashboardOverview } from "../../types/dashboard";
import Hero from "../../components/Hero/Hero";
import KPICards from "../../components/KPICards";
import RecentAdmissions from "../../components/RecentAdmissions";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const { institute } = useInstitute();
    return <DashboardContent key={institute.id} instituteId={institute.id} />;
}

function DashboardContent({ instituteId }: { instituteId: number }) {
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        getDashboardOverview(instituteId, controller.signal)
            .then(setOverview)
            .catch(cause => {
                if (cause instanceof DOMException && cause.name === "AbortError") return;
                setError(cause instanceof Error ? cause.message : "Dashboard data is unavailable.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [instituteId]);

    return (
        <div className={styles.dashboard}>
            <Hero />
            {loading ? (
                <div className={styles.loading} aria-label="Loading dashboard">
                    <span /><span /><span /><span />
                </div>
            ) : error ? (
                <div role="alert">Unable to load live dashboard data: {error}</div>
            ) : overview ? (
                <>
                    <KPICards stats={overview.stats} />
                    <RecentAdmissions admissions={overview.recent_admissions} />
                </>
            ) : null}
        </div>
    );
}
