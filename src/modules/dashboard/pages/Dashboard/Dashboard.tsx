import Hero from "../../components/Hero/Hero";
import KPICards from "../../components/KPICards";

import DashboardLayout from "../../components/DashboardLayout";
import DashboardGrid from "../../components/DashboardGrid";

import AttendanceCard from "../../components/AttendanceCard";
import StudentGrowthCard from "../../components/StudentGrowthCard";

import UpcomingEventsCard from "../../components/UpcomingEventsCard";
import LiveActivity from "../../components/LiveActivity";
import QuickActions from "../../components/QuickActions";
import RecentAdmissions from "../../components/RecentAdmissions";
import FeeCollection from "../../components/FeeCollection";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
    return (
        <div className={styles.dashboard}>
            {/* Hero Section */}

            <Hero />

            {/* KPI Cards */}

            <KPICards />

            {/* Main Dashboard Layout */}

            <DashboardLayout
                left={
    <>
        <DashboardGrid>
            <AttendanceCard />
            <StudentGrowthCard />
        </DashboardGrid>

        <RecentAdmissions />

        {/* Academic Calendar */}

        <FeeCollection />

    </>
}
                right={
                    <>
                        <LiveActivity />

                        <UpcomingEventsCard />

                        <QuickActions />

                        {/* <NoticeBoard /> */}
                    </>
                }
            />
        </div>
    );
}