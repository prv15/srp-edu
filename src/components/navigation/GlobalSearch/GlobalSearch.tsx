import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useInstitute } from "../../../contexts/InstituteContext";
import { useAuth } from "../../../providers/AuthProvider";
import SearchBar from "./SearchBar";
import SearchDropdown from "./SearchDropdown";
import type { PinnedSearchItem } from "./types";
import { useGlobalSearch } from "./useGlobalSearch";
import styles from "./GlobalSearch.module.css";

function readStringList(key: string): string[] {
    try {
        const value: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
        return Array.isArray(value)
            ? value.filter(item => typeof item === "string").slice(0, 10)
            : [];
    } catch {
        return [];
    }
}

function readPinnedItems(key: string): PinnedSearchItem[] {
    try {
        const value: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
        if (!Array.isArray(value)) return [];
        return value.filter((item): item is PinnedSearchItem => {
            if (!item || typeof item !== "object") return false;
            const candidate = item as Partial<PinnedSearchItem>;
            return typeof candidate.id === "string"
                && typeof candidate.title === "string"
                && typeof candidate.url === "string"
                && typeof candidate.sectionKey === "string"
                && typeof candidate.sectionLabel === "string";
        }).slice(0, 10);
    } catch {
        return [];
    }
}

export default function GlobalSearch() {
    const { institute } = useInstitute();
    return <InstituteGlobalSearch key={institute.id} instituteId={institute.id} />;
}

function InstituteGlobalSearch({ instituteId }: { instituteId: number }) {
    const navigate = useNavigate();
    const { can } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const recentKey = `tps.globalSearch.recent.${instituteId}`;
    const pinnedKey = `tps.globalSearch.pinned.${instituteId}`;
    const [recentSearches, setRecentSearches] = useState<string[]>(() => readStringList(recentKey));
    const [pinnedItems, setPinnedItems] = useState<PinnedSearchItem[]>(() => readPinnedItems(pinnedKey));
    const { sections, items, results, loading, error } = useGlobalSearch(instituteId, query);

    useEffect(() => {
        const handleShortcut = (event: globalThis.KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
                event.preventDefault();
                setOpen(true);
                window.requestAnimationFrame(() => inputRef.current?.focus());
            }
        };
        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, []);

    const rememberSearch = useCallback((search: string) => {
        const normalized = search.trim().replace(/\s+/g, " ");
        if (normalized.length < 2) return;
        setRecentSearches(current => {
            const next = [normalized, ...current.filter(item => item !== normalized)].slice(0, 10);
            window.localStorage.setItem(recentKey, JSON.stringify(next));
            return next;
        });
    }, [recentKey]);

    const closeSearch = useCallback(() => {
        setOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
    }, []);

    const goTo = useCallback((url: string, saveCurrentSearch = false) => {
        if (saveCurrentSearch) rememberSearch(query);
        navigate(url);
        closeSearch();
    }, [closeSearch, navigate, query, rememberSearch]);

    const openResult = useCallback((index: number) => {
        const result = items[index];
        if (result) goTo(result.item.url, true);
    }, [goTo, items]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeSearch();
            return;
        }
        if (!open) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (items.length > 0) {
                setSelectedIndex(current => (current + 1 + items.length) % items.length);
            }
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (items.length > 0) {
                setSelectedIndex(current => (current - 1 + items.length) % items.length);
            }
        } else if (event.key === "Enter" && effectiveSelectedIndex >= 0) {
            event.preventDefault();
            openResult(effectiveSelectedIndex);
        }
    };

    const effectiveSelectedIndex = items.length === 0
        ? -1
        : selectedIndex >= 0 && selectedIndex < items.length
            ? selectedIndex
            : 0;

    const togglePin = (item: PinnedSearchItem) => {
        setPinnedItems(current => {
            const exists = current.some(
                saved => saved.sectionKey === item.sectionKey && saved.id === item.id,
            );
            const next = exists
                ? current.filter(saved => !(saved.sectionKey === item.sectionKey && saved.id === item.id))
                : [item, ...current].slice(0, 10);
            window.localStorage.setItem(pinnedKey, JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className={styles.globalSearch}>
            <SearchBar
                ref={inputRef}
                value={query}
                expanded={open}
                onChange={value => {
                    setQuery(value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                onClear={() => {
                    setQuery("");
                    setSelectedIndex(-1);
                    inputRef.current?.focus();
                }}
            />
            {open && (
                <SearchDropdown
                    query={query}
                    sections={sections}
                    total={results.total}
                    loading={loading}
                    error={error}
                    selectedIndex={effectiveSelectedIndex}
                    recentSearches={recentSearches}
                    pinnedItems={pinnedItems}
                    can={can}
                    onClose={closeSearch}
                    onSearch={search => {
                        setQuery(search);
                        inputRef.current?.focus();
                    }}
                    onNavigate={url => goTo(url)}
                    onSelectIndex={setSelectedIndex}
                    onOpen={openResult}
                    onTogglePin={togglePin}
                />
            )}
        </div>
    );
}
