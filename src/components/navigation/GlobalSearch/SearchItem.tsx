import { Pin, PinOff, type LucideIcon } from "lucide-react";
import HighlightText from "./HighlightText";
import type { GlobalSearchItem } from "./types";
import styles from "./GlobalSearch.module.css";

export default function SearchItem({
    item,
    query,
    icon: Icon,
    selected,
    pinned,
    onSelect,
    onHover,
    onTogglePin,
}: {
    item: GlobalSearchItem;
    query: string;
    icon: LucideIcon;
    selected: boolean;
    pinned: boolean;
    onSelect: () => void;
    onHover: () => void;
    onTogglePin: () => void;
}) {
    return (
        <div
            role="option"
            aria-selected={selected}
            className={`${styles.resultItem} ${selected ? styles.selectedItem : ""}`}
            onMouseEnter={onHover}
        >
            <button type="button" className={styles.resultMain} onClick={onSelect}>
                <span className={styles.resultIcon}><Icon size={18} /></span>
                <span className={styles.resultCopy}>
                    <strong><HighlightText text={item.title} query={query} /></strong>
                    {item.subtitle && (
                        <span><HighlightText text={item.subtitle} query={query} /></span>
                    )}
                    {item.meta && (
                        <small><HighlightText text={item.meta} query={query} /></small>
                    )}
                </span>
            </button>
            <button
                type="button"
                className={styles.pinButton}
                aria-label={pinned ? "Unpin result" : "Pin result"}
                title={pinned ? "Unpin" : "Pin for quick access"}
                onClick={event => {
                    event.stopPropagation();
                    onTogglePin();
                }}
            >
                {pinned ? <PinOff size={15} /> : <Pin size={15} />}
            </button>
        </div>
    );
}
