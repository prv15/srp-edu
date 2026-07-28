import {
    BookOpen,
    Building2,
    CalendarRange,
    ClipboardCheck,
    FileCheck2,
    GraduationCap,
    IndianRupee,
    Landmark,
    Search,
    Users,
    X,
    type LucideIcon,
} from "lucide-react";
import SearchEmpty from "./SearchEmpty";
import SearchFooter from "./SearchFooter";
import SearchLoader from "./SearchLoader";
import SearchSection from "./SearchSection";
import SearchSuggestions from "./SearchSuggestions";
import type {
    GlobalSearchSection,
    PinnedSearchItem,
} from "./types";
import styles from "./GlobalSearch.module.css";

const SECTION_ICONS: Record<string, LucideIcon> = {
    students: GraduationCap,
    faculty: Users,
    courses: BookOpen,
    departments: Building2,
    subjects: BookOpen,
    major_subjects: Landmark,
    semesters: CalendarRange,
    academic_sessions: CalendarRange,
    fees: IndianRupee,
    attendance: ClipboardCheck,
    examinations: FileCheck2,
    results: FileCheck2,
    institutes: Building2,
};

const SECTION_DESTINATIONS: Record<string, string> = {
    students: "/students",
    faculty: "/faculty",
    courses: "/academics/courses",
    departments: "/faculty/departments",
    subjects: "/academics/subjects",
    major_subjects: "/academics/subjects",
    semesters: "/academics/semesters",
    academic_sessions: "/academics/semesters",
    fees: "/students",
    attendance: "/students",
    examinations: "/examinations",
    results: "/examinations",
    institutes: "/dashboard",
};

export default function SearchDropdown({
    query,
    sections,
    total,
    loading,
    error,
    selectedIndex,
    recentSearches,
    pinnedItems,
    can,
    onClose,
    onSearch,
    onNavigate,
    onSelectIndex,
    onOpen,
    onTogglePin,
}: {
    query: string;
    sections: GlobalSearchSection[];
    total: number;
    loading: boolean;
    error: string;
    selectedIndex: number;
    recentSearches: string[];
    pinnedItems: PinnedSearchItem[];
    can: (permission: string) => boolean;
    onClose: () => void;
    onSearch: (query: string) => void;
    onNavigate: (url: string) => void;
    onSelectIndex: (index: number) => void;
    onOpen: (index: number) => void;
    onTogglePin: (item: PinnedSearchItem) => void;
}) {
    let offset = 0;
    const showResults = query.trim().length >= 2;

    return (
        <>
            <button className={styles.backdrop} aria-label="Close search" onClick={onClose} />
            <div id="global-search-panel" className={styles.dropdown}>
                <div className={styles.mobilePanelHeader}>
                    <div><Search size={18} /><strong>Global Search</strong></div>
                    <button type="button" onClick={onClose} aria-label="Close global search"><X size={20} /></button>
                </div>
                <div className={styles.dropdownBody}>
                    {!showResults ? (
                        <SearchSuggestions
                            recentSearches={recentSearches}
                            pinnedItems={pinnedItems}
                            can={can}
                            onSearch={onSearch}
                            onNavigate={onNavigate}
                        />
                    ) : loading ? (
                        <SearchLoader />
                    ) : error || sections.length === 0 ? (
                        <SearchEmpty query={query} error={error} />
                    ) : (
                        sections.map(section => {
                            const sectionOffset = offset;
                            offset += section.items.length;
                            return (
                                <SearchSection
                                    key={section.key}
                                    section={section}
                                    query={query}
                                    icon={SECTION_ICONS[section.key] || Search}
                                    offset={sectionOffset}
                                    selectedIndex={selectedIndex}
                                    pinnedItems={pinnedItems}
                                    onSelectIndex={onSelectIndex}
                                    onOpen={onOpen}
                                    onTogglePin={onTogglePin}
                                    onViewMore={() => onNavigate(
                                        SECTION_DESTINATIONS[section.key] || section.items[0]?.url || "/dashboard",
                                    )}
                                />
                            );
                        })
                    )}
                </div>
                {showResults && !loading && !error && total > 0 && <SearchFooter total={total} />}
            </div>
        </>
    );
}
