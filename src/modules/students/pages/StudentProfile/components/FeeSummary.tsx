import styles from "./FeeSummary.module.css";
import {
    IndianRupee,
    Wallet,
    AlertTriangle,
    BadgePercent,
} from "lucide-react";

const summary = [
    {
        title: "Total Fees",
        value: "₹75,000",
        subtitle: "Academic Year 2025-26",
        icon: IndianRupee,
        color: "#2563eb",
    },
    {
        title: "Paid",
        value: "₹50,000",
        subtitle: "Collected",
        icon: Wallet,
        color: "#16a34a",
    },
    {
        title: "Outstanding",
        value: "₹25,000",
        subtitle: "Pending",
        icon: AlertTriangle,
        color: "#dc2626",
    },
    {
        title: "Scholarship",
        value: "₹5,000",
        subtitle: "Concession",
        icon: BadgePercent,
        color: "#7c3aed",
    },
];

export default function FeeSummary() {

    return (

        <div className={styles.grid}>

            {summary.map((item) => {

                const Icon = item.icon;

                return (

                    <div
                        key={item.title}
                        className={styles.card}
                        style={{
                            borderTop: `4px solid ${item.color}`,
                        }}
                    >

                        <div className={styles.header}>

                            <div>

                                <h4>{item.title}</h4>

                                <h2
                                    style={{
                                        color: item.color,
                                    }}
                                >
                                    {item.value}
                                </h2>

                                <span>{item.subtitle}</span>

                            </div>

                            <div
                                className={styles.icon}
                                style={{
                                    background: item.color,
                                }}
                            >

                                <Icon size={24} />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}