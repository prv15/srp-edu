import { useEffect, useState } from "react";
import { useInstitute } from "../../../../../contexts/InstituteContext";
import type { StudentProfile } from "../../../types/student";
import { getStudentFeeReceipts } from "../../../services/fee.service";
import type { FeeReceiptSummary } from "../../../services/fee.service";
import FeeSummary from "../components/FeeSummary";
import FeeStructure from "../components/FeeStructure";
import InstallmentCard from "../components/InstallmentCard";
import PaymentHistory from "../components/PaymentHistory";
import StudentFeeLedger from "../components/StudentFeeLedger";

import styles from "./FeeTab.module.css";

export default function FeeTab({ student }: { student: StudentProfile }) {
    const { institute } = useInstitute();
    const [receipts, setReceipts] = useState<FeeReceiptSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const initial = window.setTimeout(() => {
            setLoading(true);
            setError("");
            void getStudentFeeReceipts(institute.id, student.id, controller.signal)
                .then(setReceipts)
                .catch(cause => {
                    if (cause instanceof DOMException && cause.name === "AbortError") return;
                    setError(cause instanceof Error ? cause.message : "Unable to load fee receipts.");
                })
                .finally(() => {
                    if (!controller.signal.aborted) setLoading(false);
                });
        }, 0);
        return () => {
            window.clearTimeout(initial);
            controller.abort();
        };
    }, [institute.id, student.id]);

    return (

        <div className={styles.wrapper}>

            <FeeSummary />

            <div className={styles.topGrid}>

                <FeeStructure />

                <InstallmentCard />

            </div>

            <PaymentHistory
                receipts={receipts}
                instituteId={institute.id}
                loading={loading}
                error={error}
            />
            <StudentFeeLedger />

        </div>

    );

}
