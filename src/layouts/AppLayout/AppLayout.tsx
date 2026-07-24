import { Outlet } from "react-router-dom";

import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/Sidebar";

import styles from "./AppLayout.module.css";

export default function AppLayout() {
    return (
        <div className={styles.layout}>
            <Sidebar />

            <div className={styles.main}>
                <Header />

                <main className={styles.page}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}