import {
    CalendarDays,
    IndianRupee,
    Clock3,
    CreditCard,
} from "lucide-react";

import styles from "./InstallmentCard.module.css";

const installment = {
    installment: "2nd Installment",
    dueDate: "15 August 2026",
    amount: 12500,
    paid: 50000,
    total: 75000,
};

const progress = (installment.paid / installment.total) * 100;

export default function InstallmentCard() {

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h2>Next Installment</h2>

                <span className={styles.badge}>
                    Upcoming
                </span>

            </div>

            <div className={styles.section}>

                <div className={styles.item}>

                    <CalendarDays size={18} />

                    <div>

                        <small>Due Date</small>

                        <strong>{installment.dueDate}</strong>

                    </div>

                </div>

                <div className={styles.item}>

                    <IndianRupee size={18} />

                    <div>

                        <small>Amount Due</small>

                        <strong>

                            ₹{installment.amount.toLocaleString("en-IN")}

                        </strong>

                    </div>

                </div>

                <div className={styles.item}>

                    <Clock3 size={18} />

                    <div>

                        <small>Installment</small>

                        <strong>{installment.installment}</strong>

                    </div>

                </div>

            </div>

            <div className={styles.progressBox}>

                <div className={styles.progressLabel}>

                    <span>Overall Payment</span>

                    <strong>{progress.toFixed(0)}%</strong>

                </div>

                <div className={styles.progressBar}>

                    <div
                        className={styles.progress}
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </div>

            <button className={styles.button}>

                <CreditCard size={18} />

                Pay Now

            </button>

        </div>

    );

}