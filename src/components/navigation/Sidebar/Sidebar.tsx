import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import { navigation } from "../../../config/navigation";

import styles from "./Sidebar.module.css";

export default function Sidebar() {

    const location = useLocation();

    const [openMenus, setOpenMenus] = useState<string[]>([
        "Admissions",
        "Students",
    ]);

    function toggleMenu(title: string) {

        setOpenMenus((prev) =>

            prev.includes(title)

                ? prev.filter((item) => item !== title)

                : [...prev, title]

        );

    }

    return (

        <aside className={styles.sidebar}>

            <div className={styles.logoArea}>

                <div className={styles.logo}>
                    SRP
                </div>

                <div>

                    <h2>SRP Education</h2>

                    <span>Education Cloud ERP</span>

                </div>

            </div>

            <nav className={styles.menu}>

                {navigation.map((item) => {

                    const Icon = item.icon;

                    const hasChildren = !!item.children;

                    const isOpen = openMenus.includes(item.title);

                    const activeChild = item.children?.some(child =>
                        location.pathname.startsWith(child.path)
                    );

                    if (!hasChildren) {

                        return (

                            <NavLink

                                key={item.title}

                                to={item.path!}

                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.active}`
                                        : styles.link
                                }

                            >

                                <Icon size={19} />

                                <span>{item.title}</span>

                            </NavLink>

                        );

                    }

                    return (

                        <div
                            key={item.title}
                            className={styles.group}
                        >

                            <button

                                className={`${styles.groupButton} ${activeChild ? styles.activeGroup : ""}`}

                                onClick={() => toggleMenu(item.title)}

                            >

                                <div className={styles.groupLeft}>

                                    <Icon size={19} />

                                    <span>{item.title}</span>

                                </div>

                                {isOpen
                                    ? <ChevronDown size={16} />
                                    : <ChevronRight size={16} />
                                }

                            </button>

                            <div

                                className={`${styles.children} ${isOpen ? styles.open : ""}`}

                            >

                                {item.children?.map(child => (

                                    <NavLink

                                        key={child.path}

                                        to={child.path}

                                        className={({ isActive }) =>
                                            isActive
                                                ? `${styles.child} ${styles.activeChild}`
                                                : styles.child
                                        }

                                    >

                                        {child.title}

                                    </NavLink>

                                ))}

                            </div>

                        </div>

                    );

                })}

            </nav>

            <div className={styles.footer}>

                <div className={styles.avatar}>
                    PR
                </div>

                <div>

                    <strong>Prakash Raj</strong>

                    <small>Administrator</small>

                </div>

            </div>

        </aside>

    );

}