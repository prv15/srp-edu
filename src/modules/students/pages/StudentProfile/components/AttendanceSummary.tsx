import styles from "./AttendanceSummary.module.css";

const stats = [
    {
        title: "Present",
        value: "182",
        subtitle: "Days",
        color: "#16a34a"
    },
    {
        title: "Absent",
        value: "8",
        subtitle: "Days",
        color: "#dc2626"
    },
    {
        title: "Leave",
        value: "4",
        subtitle: "Days",
        color: "#f59e0b"
    },
    {
        title: "Late",
        value: "3",
        subtitle: "Days",
        color: "#2563eb"
    },
    {
        title: "Attendance",
        value: "95.4%",
        subtitle: "Overall",
        color: "#7c3aed"
    }
];

export default function AttendanceSummary() {

    return (

        <div className={styles.grid}>

            {stats.map(stat => (

                <div
                    key={stat.title}
                    className={styles.card}
                    style={{
                        borderTop: `5px solid ${stat.color}`
                    }}
                >

                    <h4>{stat.title}</h4>

                    <h2
                        style={{
                            color: stat.color
                        }}
                    >
                        {stat.value}
                    </h2>

                    <span>{stat.subtitle}</span>

                </div>

            ))}

        </div>

    );

}