import DashboardCard from "../DashboardCard";
import styles from "./StudentGrowthCard.module.css";

const yearlyData = [
    { year: "2023", value: 1850 },
    { year: "2024", value: 2230 },
    { year: "2025", value: 2780 },
    { year: "2026", value: 3214 },
];

export default function StudentGrowthCard() {
    const max = Math.max(...yearlyData.map(item => item.value));

    return (
        <div className={styles.wrapper}>
            <DashboardCard title="Student Growth">

                <div className={styles.chart}>

                    {yearlyData.map(item => (

                        <div
                            key={item.year}
                            className={styles.barGroup}
                        >

                            <div
                                className={styles.bar}
                                style={{
                                    height: `${(item.value / max) * 150}px`
                                }}
                            />

                            <span>{item.year}</span>

                        </div>

                    ))}

                </div>

            </DashboardCard>
        </div>
    );
}