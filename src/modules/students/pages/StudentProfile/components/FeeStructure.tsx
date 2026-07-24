import {
    GraduationCap,
    BookOpen,
    FlaskConical,
    Trophy,
    FileText,
    Bus,
} from "lucide-react";

import styles from "./FeeStructure.module.css";

const fees = [
    {
        icon: GraduationCap,
        title: "Admission Fee",
        amount: 10000,
    },
    {
        icon: BookOpen,
        title: "Tuition Fee",
        amount: 40000,
    },
    {
        icon: FlaskConical,
        title: "Laboratory Fee",
        amount: 3000,
    },
    {
        icon: Trophy,
        title: "Sports Fee",
        amount: 2500,
    },
    {
        icon: FileText,
        title: "Examination Fee",
        amount: 5000,
    },
    {
        icon: Bus,
        title: "Transport Fee",
        amount: 14500,
    },
];

const total = fees.reduce(
    (sum, item) => sum + item.amount,
    0
);

export default function FeeStructure() {

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h2>Fee Structure</h2>

                <span>Academic Year 2025-26</span>

            </div>

            <div className={styles.list}>

                {fees.map((fee) => {

                    const Icon = fee.icon;

                    return (

                        <div
                            key={fee.title}
                            className={styles.row}
                        >

                            <div className={styles.left}>

                                <div className={styles.icon}>

                                    <Icon size={18} />

                                </div>

                                <span>{fee.title}</span>

                            </div>

                            <strong>

                                ₹{fee.amount.toLocaleString("en-IN")}

                            </strong>

                        </div>

                    );

                })}

            </div>

            <div className={styles.footer}>

                <span>Total Fees</span>

                <strong>

                    ₹{total.toLocaleString("en-IN")}

                </strong>

            </div>

        </div>

    );

}