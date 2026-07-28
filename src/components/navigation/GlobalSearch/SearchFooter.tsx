import styles from "./GlobalSearch.module.css";

export default function SearchFooter({ total }: { total: number }) {
    return (
        <footer className={styles.searchFooter}>
            <span>{total} result{total === 1 ? "" : "s"} in the selected institute</span>
            <div><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close</div>
        </footer>
    );
}
