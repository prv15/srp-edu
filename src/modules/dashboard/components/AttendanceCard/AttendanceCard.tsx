import DashboardCard from "../DashboardCard";
import { useInstitute } from "../../../../contexts/InstituteContext";

import { getDashboardData } from "../../services/dashboard.service";
import styles from "./AttendanceCard.module.css";

export default function AttendanceCard() {

    const { institute } = useInstitute();

const dashboard = getDashboardData(institute.code);

const attendance = dashboard.stats.attendance;

const present = Math.round(
    dashboard.stats.students *
    dashboard.stats.attendance /
    100
);

const absent =
    dashboard.stats.students - present;

const late = Math.round(absent * 0.25);

    return (

        <div className={styles.wrapper}>

            <DashboardCard title="Today's Attendance">

                <div className={styles.percent}>

                    {attendance}%

                </div>

                <div className={styles.progress}>

                    <div
                        className={styles.progressFill}
                        style={{ width: `${attendance}%` }}
                    />

                </div>

                <div className={styles.stats}>

                    <div>

                        <span>Present</span>

                        <strong>{present}</strong>

                    </div>

                    <div>

                        <span>Absent</span>

                        <strong>{absent}</strong>

                    </div>

                    <div>

                        <span>Late</span>

                        <strong>{late}</strong>

                    </div>

                </div>

            </DashboardCard>

        </div>

    );

}