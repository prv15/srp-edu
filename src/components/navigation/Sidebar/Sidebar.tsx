import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import { navigation } from "../../../config/navigation";

import styles from "./Sidebar.module.css";
import { useAuth } from "../../../providers/AuthProvider";

export default function Sidebar({
    mobileOpen = false,
    onNavigate,
}: {
    mobileOpen?: boolean;
    onNavigate?: () => void;
}) {
    const { user } = useAuth();

    const location = useLocation();

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    function toggleMenu(title: string) {
        setOpenMenu(current => current === title ? null : title);
    }

    return (

        <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>

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

                    const activeChild = item.children?.some(child =>
                        location.pathname.startsWith(child.path)
                    );
                    const isOpen = openMenu === item.title || activeChild;

                    if (!hasChildren) {

                        return (

                            <NavLink

                                key={item.title}

                                to={item.path!}
                                onClick={onNavigate}

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
                                        onClick={onNavigate}

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
                    {(user?.name || "User").split(/\s+/).map(part => part[0]).slice(0, 2).join("")}
                </div>

                <div>

                    <strong>{user?.name || "User"}</strong>

                    <small>{user?.role_name || "Authorized user"}</small>

                </div>

            </div>

        </aside>

    );

}
