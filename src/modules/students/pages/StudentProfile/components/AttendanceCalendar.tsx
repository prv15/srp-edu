import styles from "./AttendanceCalendar.module.css";

const days = Array.from({ length: 31 }, (_, i) => {

    let status = "present";

    if (i === 3) status = "absent";
    if (i === 7) status = "leave";
    if (i === 11 || i === 12 || i === 18 || i === 19 || i === 25 || i === 26)
        status = "holiday";

    return {
        day: i + 1,
        status
    };

});

export default function AttendanceCalendar() {

    return (

        <div className={styles.calendar}>

            {days.map(day => (

                <div
                    key={day.day}
                    className={`${styles.day} ${styles[day.status]}`}
                >

                    {day.day}

                </div>

            ))}

        </div>

    );

}