import { Eye } from "lucide-react";
import DashboardCard from "../DashboardCard";
import styles from "./RecentAdmissions.module.css";

const admissions = [
    {
        id: "SRP260012",
        name: "Rahul Kumar",
        course: "Class VIII",
        status: "Verified",
        fee: "Paid"
    },
    {
        id: "SRP260013",
        name: "Priya Sharma",
        course: "B.Ed",
        status: "Pending Docs",
        fee: "Pending"
    },
    {
        id: "SRP260014",
        name: "Aman Verma",
        course: "BCA",
        status: "Approved",
        fee: "Paid"
    },
    {
        id: "SRP260015",
        name: "Neha Singh",
        course: "Class XI",
        status: "Verified",
        fee: "Paid"
    }
];

export default function RecentAdmissions() {

    return (

        <DashboardCard title="Recent Admissions">

            <div className={styles.list}>

                {admissions.map(student => (

                    <div
                        key={student.id}
                        className={styles.item}
                    >

                        <div className={styles.avatar}>

                            {student.name.charAt(0)}

                        </div>

                        <div className={styles.info}>

                            <h4>{student.name}</h4>

                            <span>{student.course}</span>

                            <small>{student.id}</small>

                        </div>

                        <div className={styles.status}>

                            <span className={styles.badge}>

                                {student.status}

                            </span>

                            <small>{student.fee}</small>

                        </div>

                        <button className={styles.viewButton}>

                            <Eye size={18} />

                        </button>

                    </div>

                ))}

            </div>

        </DashboardCard>

    );

}