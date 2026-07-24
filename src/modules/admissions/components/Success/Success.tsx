import { CheckCircle2, Printer, Receipt, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../../../../components/layout/SectionCard";
import styles from "./Success.module.css";

export default function Success() {
    const navigate = useNavigate();

    // Demo data (replace with API response later)
    const admissionNo = "ADM-2026-000145";
    const studentId = "STU-2026-000145";
    const receiptNo = "RCPT-2026-000145";
    const admissionDate = new Date().toLocaleDateString("en-IN");
    const paymentStatus = "PAID";

    return (
        <div className={styles.page}>

            <div className={styles.hero}>

                <div className={styles.iconCircle}>
                    <CheckCircle2 size={60} />
                </div>

                <h1 className={styles.title}>
                    Admission Submitted Successfully
                </h1>

                <p className={styles.subtitle}>
                    The student has been successfully registered in the system.
                </p>

            </div>

            <SectionCard
                title="Admission Summary"
                description="Admission details generated after successful submission."
            >

                <div className={styles.summaryGrid}>

                    <InfoCard
                        label="Admission Number"
                        value={admissionNo}
                    />

                    <InfoCard
                        label="Student ID"
                        value={studentId}
                    />

                    <InfoCard
                        label="Receipt Number"
                        value={receiptNo}
                    />

                    <InfoCard
                        label="Admission Date"
                        value={admissionDate}
                    />

                    <InfoCard
                        label="Payment Status"
                        value={paymentStatus}
                        success
                    />

                </div>

            </SectionCard>

            <SectionCard
                title="System Status"
                description="Automatic actions completed."
            >

                <div className={styles.statusList}>

                    <StatusItem text="Student record created successfully" />

                    <StatusItem text="Admission registered successfully" />

                    <StatusItem text="Receipt generated successfully" />

                    <StatusItem text="SMS notification queued" />

                    <StatusItem text="Email notification queued" />

                </div>

            </SectionCard>

            <div className={styles.buttonBar}>

                <button className={styles.secondaryButton}>
                    <Printer size={18} />
                    Print Admission Form
                </button>

                <button className={styles.secondaryButton}>
                    <Receipt size={18} />
                    Download Receipt
                </button>

                <button
                    className={styles.primaryButton}
                    onClick={() => navigate("/students/profile")}
                >
                    <User size={18} />
                    View Student Profile
                </button>

                <button
                    className={styles.secondaryButton}
                    onClick={() => navigate("/admissions/new")}
                >
                    <Plus size={18} />
                    New Admission
                </button>

            </div>

        </div>
    );
}

interface InfoCardProps {
    label: string;
    value: string;
    success?: boolean;
}

function InfoCard({
    label,
    value,
    success = false,
}: InfoCardProps) {
    return (
        <div className={styles.infoCard}>

            <div className={styles.infoLabel}>
                {label}
            </div>

            <div
                className={
                    success
                        ? styles.successValue
                        : styles.infoValue
                }
            >
                {value}
            </div>

        </div>
    );
}

interface StatusItemProps {
    text: string;
}

function StatusItem({
    text,
}: StatusItemProps) {
    return (
        <div className={styles.statusItem}>

            <CheckCircle2
                size={18}
                className={styles.statusIcon}
            />

            <span>{text}</span>

        </div>
    );
}