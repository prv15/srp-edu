import { useCallback, useEffect, useRef, useState } from "react";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { getDashboardOverview } from "../../services/dashboard.service";
import type { DashboardOverview } from "../../types/dashboard";
import Hero from "../../components/Hero/Hero";
import KPICards from "../../components/KPICards";
import RecentAdmissions from "../../components/RecentAdmissions";
import InstitutionInsights from "../../components/InstitutionInsights";
import LiveActivity from "../../components/LiveActivity";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    const { institute } = useInstitute();
    return <DashboardContent key={institute.id} instituteId={institute.id} />;
}

function DashboardContent({ instituteId }: { instituteId: number }) {
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);

    const load = useCallback(async (manual = false) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        if (manual) setRefreshing(true);
        try {
            const next = await getDashboardOverview(instituteId, controller.signal);
            setOverview(next);
            setError("");
        } catch (cause) {
            if (cause instanceof DOMException && cause.name === "AbortError") return;
            setError(cause instanceof Error ? cause.message : "Dashboard data is unavailable.");
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [instituteId]);

    useEffect(() => {
        const initial = window.setTimeout(() => void load(), 0);
        const interval = window.setInterval(() => {
            if (document.visibilityState === "visible") void load();
        }, 30_000);
        const handleVisibility = () => {
            if (document.visibilityState === "visible") void load();
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            window.clearTimeout(initial);
            window.clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibility);
            controllerRef.current?.abort();
        };
    }, [load]);

    return (
        <div className={styles.dashboard}>
            <Hero generatedAt={overview?.generated_at} refreshing={refreshing} onRefresh={() => void load(true)} />
            {loading ? (
                <div className={styles.loading} aria-label="Loading dashboard">
                    <span /><span /><span /><span />
                </div>
            ) : error ? (
                <div role="alert">Unable to load live dashboard data: {error}</div>
            ) : overview ? (
                <>
                    <KPICards stats={overview.stats} />
                    <InstitutionInsights overview={overview} />
                    <section className={styles.activityGrid}>
                        <LiveActivity activities={overview.activities} />
                        <RecentAdmissions admissions={overview.recent_admissions} />
                    </section>
                </>
            ) : null}
        </div>
    );
}
