import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "../../components/navigation/Header";
import Sidebar from "../../components/navigation/Sidebar";

import styles from "./AppLayout.module.css";

export default function AppLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
            {mobileMenuOpen && (
                <button
                    className={styles.backdrop}
                    aria-label="Close navigation"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div className={styles.main}>
                <Header onMenuToggle={() => setMobileMenuOpen(open => !open)} />

                <main className={styles.page}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
