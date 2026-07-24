import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getStudentById } from "../../services/student.service";

import OverviewTab from "./tabs/OverviewTab";
import AcademicTab from "./tabs/AcademicTab";
import ParentTab from "./tabs/ParentTab";
import AttendanceTab from "./tabs/AttendanceTab";
import FeeTab from "./tabs/FeeTab";
import DocumentTab from "./tabs/DocumentTab";
import TransportTab from "./tabs/TransportTab";
import LibraryTab from "./tabs/LibraryTab";
import MedicalTab from "./tabs/MedicalTab";
import ExaminationTab from "./tabs/ExaminationTab";
import type { StudentProfile } from "../../types/student";
import StudentHero from "./components/StudentHero";
import styles from "./StudentProfile.module.css";

const tabs = [
    "Overview",
    "Academic",
    "Parents",
    "Attendance",
    "Fees",
    "Documents",
    "Transport",
    "Library",
    "Medical",
    "Examination"
];

export default function StudentProfile() {

    const navigate = useNavigate();

const { id } = useParams();

const [activeTab, setActiveTab] = useState("Overview");



const [student, setStudent] = useState<StudentProfile | null>(null);

const [loading, setLoading] = useState(true);
useEffect(() => {

    async function loadStudent() {

        if (!id) return;

        try {

           const data = await getStudentById(id!);

            setStudent(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    loadStudent();

}, [id]);

    const renderContent = () => {

        switch (activeTab) {

            case "Overview":
                return <OverviewTab student={student!} />;;

            case "Academic":
                return <AcademicTab student={student!} />;

            case "Parents":
                return <ParentTab student={student!} />;

            case "Attendance":
                return <AttendanceTab  />;

            case "Fees":
                return <FeeTab />;

            case "Documents":
                return <DocumentTab />;

            case "Transport":
                return <TransportTab />;

            case "Library":
                return <LibraryTab />;

            case "Medical":
                return <MedicalTab />;

            case "Examination":
                return <ExaminationTab />;

            default:
                return <OverviewTab student={student!} />;

        }

    };


if (loading) {

    return <div className={styles.page}>Loading student...</div>;

}

if (!student) {

    return <div className={styles.page}>Student not found.</div>;

}

// Student initials for avatar
const initials = (student.student_name || "")
    .split(" ")
    .map((name: string) => name.charAt(0))
    .slice(0, 2)
    .join("");

return (

    <div className={styles.page}>

           <button
    className={styles.backButton}
    onClick={() => navigate("/students")}
>
    <ArrowLeft size={18} />
    Back to Students
</button>

            <div className={styles.layout}>

                {/* Left Sidebar */}

                <aside className={styles.sidebar}>

    {/* Profile Card */}

    <div className={styles.profileCard}>

        <div className={styles.avatar}>
            {initials}
        </div>

        <h2>{student.student_name}</h2>

        <p>{student.course_name}</p>

        <span className={styles.badge}>
            {student.status}
        </span>

        <div className={styles.infoList}>

            <div>
                <label>Admission No</label>
                <strong>{student.admission_no}</strong>
            </div>

            <div>
                <label>Roll No</label>
                <strong>{student.college_roll_no || "-"}</strong>
            </div>

            <div>
                <label>Session</label>
                <strong>{student.session_name}</strong>
            </div>

            <div>
                <label>Department</label>
                <strong>{student.department_name}</strong>
            </div>

        </div>

    </div>

    {/* Quick Stats */}

    <div className={styles.stats}>

        <div className={styles.statCard}>
            <span>Attendance</span>
            <strong>95%</strong>
        </div>

        <div className={styles.statCard}>
            <span>Fees Due</span>
            <strong>₹0</strong>
        </div>

        <div className={styles.statCard}>
            <span>Documents</span>
            <strong>8</strong>
        </div>

        <div className={styles.statCard}>
            <span>Library</span>
            <strong>3</strong>
        </div>

    </div>

    {/* Navigation */}

    <nav className={styles.navigation}>

        {tabs.map((tab) => (

            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                    activeTab === tab
                        ? styles.active
                        : ""
                }
            >

                {tab}

            </button>

        ))}

    </nav>

</aside>


                {/* Right */}

                <section className={styles.content}>

    <StudentHero

        student={student!}

        initials={initials}

    />

    {renderContent()}

</section>

            </div>

        </div>

    );

}