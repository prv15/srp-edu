import AttendanceCalendar from "../components/AttendanceCalendar";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceTrend from "../components/AttendanceTrend";
import AttendanceSubjects from "../components/AttendanceSubjects";
import AttendanceTimeline from "../components/AttendanceTimeline";

import styles from "./AttendanceTab.module.css";

export default function AttendanceTab() {

    return (

        <div className={styles.wrapper}>

            {/* Summary Cards */}

            <AttendanceSummary />

            {/* Calendar + Recent Attendance */}

            <div className={styles.contentGrid}>

                <div className={styles.card}>

                    <h2>Monthly Attendance</h2>

                    <AttendanceCalendar />

                </div>

                <AttendanceTimeline />

            </div>

            {/* Monthly Trend */}

            <AttendanceTrend />

            {/* Subject-wise Attendance */}

            <AttendanceSubjects />

        </div>

    );

}