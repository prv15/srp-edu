import styles from "./AttendanceTrend.module.css";

export default function AttendanceTrend() {

    return (

        <div className={styles.card}>

            <h2>Attendance Trend</h2>

            <div className={styles.placeholder}>

                📈 Monthly Attendance Chart

                <span>

                    Recharts will be integrated here.

                </span>

            </div>

        </div>

    );

}