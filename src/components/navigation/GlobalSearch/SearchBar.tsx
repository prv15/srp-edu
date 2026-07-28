import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import styles from "./GlobalSearch.module.css";

type SearchBarProps = {
    value: string;
    expanded: boolean;
    onChange: (value: string) => void;
    onFocus: () => void;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onClear: () => void;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
    { value, expanded, onChange, onFocus, onKeyDown, onClear },
    ref,
) {
    return (
        <div className={`${styles.searchBar} ${expanded ? styles.searchBarExpanded : ""}`}>
            <Search size={19} aria-hidden="true" />
            <input
                ref={ref}
                type="search"
                value={value}
                placeholder="Search students, fees, faculty, courses…"
                aria-label="Search across SRP Education Cloud"
                aria-expanded={expanded}
                aria-controls="global-search-panel"
                aria-autocomplete="list"
                autoComplete="off"
                onChange={event => onChange(event.target.value)}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
            />
            {value ? (
                <button type="button" className={styles.clearButton} onClick={onClear} aria-label="Clear search">
                    <X size={16} />
                </button>
            ) : (
                <kbd>⌘ K</kbd>
            )}
        </div>
    );
});

export default SearchBar;
