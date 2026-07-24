import {
    CheckCircle2,
    XCircle,
    Clock3,
    Plane,
} from "lucide-react";

import styles from "./AttendanceTimeline.module.css";

const records = [
    {
        date: "21 Jul 2026",
        time: "09:05 AM",
        status: "Present",
    },
    {
        date: "20 Jul 2026",
        time: "09:08 AM",
        status: "Present",
    },
    {
        date: "19 Jul 2026",
        time: "",
        status: "Absent",
    },
    {
        date: "18 Jul 2026",
        time: "",
        status: "Holiday",
    },
    {
        date: "17 Jul 2026",
        time: "09:12 AM",
        status: "Late",
    },
];

function getStatus(status: string) {

    switch (status) {

        case "Present":
            return {
                icon: <CheckCircle2 size={20} />,
                className: styles.present,
            };

        case "Absent":
            return {
                icon: <XCircle size={20} />,
                className: styles.absent,
            };

        case "Late":
            return {
                icon: <Clock3 size={20} />,
                className: styles.late,
            };

        default:
            return {
                icon: <Plane size={20} />,
                className: styles.holiday,
            };

    }

}

export default function AttendanceTimeline() {

    return (

        <div className={styles.card}>

            <h2>Recent Attendance</h2>

            <div className={styles.timeline}>

                {records.map((item, index) => {

                    const status = getStatus(item.status);

                    return (

                        <div
                            key={index}
                            className={styles.row}
                        >

                            <div
                                className={`${styles.icon} ${status.className}`}
                            >
                                {status.icon}
                            </div>

                            <div className={styles.info}>

                                <strong>{item.status}</strong>

                                <span>{item.date}</span>

                                {item.time && (
                                    <small>{item.time}</small>
                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}