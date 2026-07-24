import {
    ArrowDownCircle,
    ArrowUpCircle,
    Gift,
    AlertTriangle,
} from "lucide-react";

import styles from "./StudentFeeLedger.module.css";

const ledger = [
    {
        date: "01 Apr 2026",
        description: "Opening Fee Balance",
        type: "Debit",
        amount: 75000,
        balance: 75000,
    },
    {
        date: "10 Apr 2026",
        description: "Scholarship",
        type: "Credit",
        amount: 5000,
        balance: 70000,
    },
    {
        date: "15 Apr 2026",
        description: "Fee Payment (UPI)",
        type: "Credit",
        amount: 12500,
        balance: 57500,
    },
    {
        date: "15 May 2026",
        description: "Fee Payment (Card)",
        type: "Credit",
        amount: 12500,
        balance: 45000,
    },
    {
        date: "20 Jun 2026",
        description: "Late Fee",
        type: "Debit",
        amount: 500,
        balance: 45500,
    },
];

function getIcon(item: typeof ledger[number]) {

    if (item.description.includes("Scholarship")) {

        return <Gift size={18} />;

    }

    if (item.description.includes("Late")) {

        return <AlertTriangle size={18} />;

    }

    return item.type === "Credit"

        ? <ArrowDownCircle size={18} />

        : <ArrowUpCircle size={18} />;

}

export default function StudentFeeLedger() {

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h2>Student Fee Ledger</h2>

                <span>Running Financial Statement</span>

            </div>

            <table className={styles.table}>

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Description</th>

                        <th>Debit</th>

                        <th>Credit</th>

                        <th>Balance</th>

                    </tr>

                </thead>

                <tbody>

                    {ledger.map((item, index) => (

                        <tr key={index}>

                            <td>{item.date}</td>

                            <td>

                                <div className={styles.description}>

                                    <span className={styles.icon}>

                                        {getIcon(item)}

                                    </span>

                                    {item.description}

                                </div>

                            </td>

                            <td>

                                {item.type === "Debit"

                                    ? `₹${item.amount.toLocaleString("en-IN")}`

                                    : "-"}

                            </td>

                            <td>

                                {item.type === "Credit"

                                    ? `₹${item.amount.toLocaleString("en-IN")}`

                                    : "-"}

                            </td>

                            <td>

                                <strong>

                                    ₹{item.balance.toLocaleString("en-IN")}

                                </strong>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}