import {
    BookOpen,
    Clock3,
    IndianRupee,
    LayoutDashboard,
    Pin,
    Plus,
    UserCheck,
    UserPlus,
    Users,
} from "lucide-react";
import type { PinnedSearchItem } from "./types";
import styles from "./GlobalSearch.module.css";

export type SearchSuggestion = {
    label: string;
    url: string;
};

export default function SearchSuggestions({
    recentSearches,
    pinnedItems,
    can,
    onSearch,
    onNavigate,
}: {
    recentSearches: string[];
    pinnedItems: PinnedSearchItem[];
    can: (permission: string) => boolean;
    onSearch: (query: string) => void;
    onNavigate: (url: string) => void;
}) {
    const quickActions = [
        { label: "Add Student", url: "/admissions/new", permission: "students.create", icon: UserPlus },
        { label: "Collect Fee", url: "/students", permission: "fees.manage", icon: IndianRupee },
        { label: "Take Attendance", url: "/students", permission: "attendance.manage", icon: UserCheck },
        { label: "Create Admission", url: "/admissions/new", permission: "admissions.manage", icon: Plus },
        { label: "Add Faculty", url: "/faculty", permission: "faculty.manage", icon: Users },
    ].filter(action => can(action.permission));

    const modules = [
        { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { label: "Students", url: "/students", icon: Users, permission: "students.view" },
        { label: "Academics", url: "/academics/courses", icon: BookOpen, permission: "academics.view" },
        { label: "Faculty", url: "/faculty", icon: UserCheck, permission: "faculty.view" },
    ].filter(module => !module.permission || can(module.permission));

    return (
        <div className={styles.suggestions}>
            {recentSearches.length > 0 && (
                <section>
                    <h3><Clock3 size={16} /> Recent searches</h3>
                    <div className={styles.recentList}>
                        {recentSearches.map(search => (
                            <button type="button" key={search} onClick={() => onSearch(search)}>
                                <Clock3 size={14} /> {search}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {pinnedItems.length > 0 && (
                <section>
                    <h3><Pin size={16} /> Pinned items</h3>
                    <div className={styles.pinnedGrid}>
                        {pinnedItems.slice(0, 6).map(item => (
                            <button
                                type="button"
                                key={`${item.sectionKey}-${item.id}`}
                                onClick={() => onNavigate(item.url)}
                            >
                                <span>{item.sectionLabel}</span>
                                <strong>{item.title}</strong>
                                {item.subtitle && <small>{item.subtitle}</small>}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h3>Frequently accessed modules</h3>
                <div className={styles.moduleGrid}>
                    {modules.map(module => {
                        const Icon = module.icon;
                        return (
                            <button type="button" key={module.url} onClick={() => onNavigate(module.url)}>
                                <Icon size={18} />
                                <span>{module.label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {quickActions.length > 0 && (
                <section>
                    <h3>Quick actions</h3>
                    <div className={styles.quickActions}>
                        {quickActions.map(action => {
                            const Icon = action.icon;
                            return (
                                <button type="button" key={action.label} onClick={() => onNavigate(action.url)}>
                                    <Icon size={16} /> {action.label}
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
