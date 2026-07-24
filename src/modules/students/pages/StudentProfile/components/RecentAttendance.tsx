import styles from "./RecentAttendance.module.css";

const records = [
    {
        date: "21 Jul 2026",
        day: "Monday",
        status: "Present"
    },
    {
        date: "20 Jul 2026",
        day: "Sunday",
        status: "Holiday"
    },
    {
        date: "19 Jul 2026",
        day: "Saturday",
        status: "Present"
    },
    {
        date: "18 Jul 2026",
        day: "Friday",
        status: "Absent"
    },
    {
        date: "17 Jul 2026",
        day: "Thursday",
        status: "Present"
    },
    {
        date: "16 Jul 2026",
        day: "Wednesday",
        status: "Leave"
    }
];

const getBadgeClass = (status: string) => {

    switch (status) {

        case "Present":
            return styles.present;

        case "Absent":
            return styles.absent;

        case "Leave":
            return styles.leave;

        case "Holiday":
            return styles.holiday;

        default:
            return styles.defaultBadge;

    }

};

export default function RecentAttendance() {

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <h2>Recent Attendance</h2>

                <button>View All</button>

            </div>

            <div className={styles.timeline}>

                {records.map((record, index) => (

                    <div
                        key={index}
                        className={styles.item}
                    >

                        <div>

                            <h4>{record.date}</h4>

                            <span>{record.day}</span>

                        </div>

                        <span
                            className={`${styles.badge} ${getBadgeClass(record.status)}`}
                        >

                            {record.status}

                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}