import {
    Download,
    Smartphone,
    CreditCard,
    Landmark,
    Wallet,
} from "lucide-react";

import styles from "./PaymentHistory.module.css";

const payments = [
    {
        receipt: "RCPT-2026-001",
        date: "10 Jul 2026",
        amount: 12500,
        method: "UPI",
        status: "Paid",
    },
    {
        receipt: "RCPT-2026-002",
        date: "10 Jun 2026",
        amount: 12500,
        method: "Card",
        status: "Paid",
    },
    {
        receipt: "RCPT-2026-003",
        date: "10 May 2026",
        amount: 12500,
        method: "Cash",
        status: "Paid",
    },
    {
        receipt: "RCPT-2026-004",
        date: "10 Apr 2026",
        amount: 12500,
        method: "Bank",
        status: "Pending",
    },
];

function paymentIcon(method: string) {

    switch (method) {

        case "UPI":
            return <Smartphone size={18} />;

        case "Card":
            return <CreditCard size={18} />;

        case "Cash":
            return <Wallet size={18} />;

        default:
            return <Landmark size={18} />;

    }

}

export default function PaymentHistory() {

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h2>Payment History</h2>

                <button>

                    View All

                </button>

            </div>

            <table className={styles.table}>

                <thead>

                    <tr>

                        <th>Receipt</th>

                        <th>Date</th>

                        <th>Method</th>

                        <th>Amount</th>

                        <th>Status</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {payments.map((payment) => (

                        <tr key={payment.receipt}>

                            <td>{payment.receipt}</td>

                            <td>{payment.date}</td>

                            <td>

                                <div className={styles.method}>

                                    {paymentIcon(payment.method)}

                                    {payment.method}

                                </div>

                            </td>

                            <td>

                                ₹{payment.amount.toLocaleString("en-IN")}

                            </td>

                            <td>

                                <span
                                    className={
                                        payment.status === "Paid"
                                            ? styles.paid
                                            : styles.pending
                                    }
                                >

                                    {payment.status}

                                </span>

                            </td>

                            <td>

                                <button
                                    className={styles.download}
                                >

                                    <Download size={16} />

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}