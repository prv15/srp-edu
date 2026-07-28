import { ArrowRight, type LucideIcon } from "lucide-react";
import SearchItem from "./SearchItem";
import type { GlobalSearchSection, PinnedSearchItem } from "./types";
import styles from "./GlobalSearch.module.css";

export default function SearchSection({
    section,
    query,
    icon,
    offset,
    selectedIndex,
    pinnedItems,
    onSelectIndex,
    onOpen,
    onTogglePin,
    onViewMore,
}: {
    section: GlobalSearchSection;
    query: string;
    icon: LucideIcon;
    offset: number;
    selectedIndex: number;
    pinnedItems: PinnedSearchItem[];
    onSelectIndex: (index: number) => void;
    onOpen: (index: number) => void;
    onTogglePin: (item: PinnedSearchItem) => void;
    onViewMore: () => void;
}) {
    const Icon = icon;
    return (
        <section className={styles.resultSection}>
            <header className={styles.sectionHeader}>
                <div><Icon size={17} /><strong>{section.label}</strong></div>
                <span>{section.count}{section.has_more ? "+" : ""}</span>
            </header>
            <div role="listbox">
                {section.items.map((item, itemIndex) => {
                    const globalIndex = offset + itemIndex;
                    const pinItem: PinnedSearchItem = {
                        ...item,
                        sectionKey: section.key,
                        sectionLabel: section.label,
                    };
                    const pinned = pinnedItems.some(
                        saved => saved.sectionKey === section.key && saved.id === item.id,
                    );
                    return (
                        <SearchItem
                            key={`${section.key}-${item.id}`}
                            item={item}
                            query={query}
                            icon={icon}
                            selected={selectedIndex === globalIndex}
                            pinned={pinned}
                            onHover={() => onSelectIndex(globalIndex)}
                            onSelect={() => onOpen(globalIndex)}
                            onTogglePin={() => onTogglePin(pinItem)}
                        />
                    );
                })}
            </div>
            {section.has_more && (
                <button type="button" className={styles.viewMore} onClick={onViewMore}>
                    View more {section.label.toLocaleLowerCase()} <ArrowRight size={15} />
                </button>
            )}
        </section>
    );
}
