import styles from "./AttendanceSubjects.module.css";

const subjects = [
    {
        subject: "Mathematics",
        classes: 62,
        present: 60,
        percentage: "96.8%"
    },
    {
        subject: "Physics",
        classes: 58,
        present: 56,
        percentage: "96.5%"
    },
    {
        subject: "Chemistry",
        classes: 54,
        present: 52,
        percentage: "96.3%"
    },
    {
        subject: "English",
        classes: 48,
        present: 47,
        percentage: "97.9%"
    }
];

export default function AttendanceSubjects() {

    return (

        <div className={styles.card}>

            <h2>Subject-wise Attendance</h2>

            <table className={styles.table}>

                <thead>

                    <tr>

                        <th>Subject</th>

                        <th>Classes</th>

                        <th>Present</th>

                        <th>%</th>

                    </tr>

                </thead>

                <tbody>

                    {subjects.map(subject => (

                        <tr key={subject.subject}>

                            <td>{subject.subject}</td>

                            <td>{subject.classes}</td>

                            <td>{subject.present}</td>

                            <td>{subject.percentage}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}