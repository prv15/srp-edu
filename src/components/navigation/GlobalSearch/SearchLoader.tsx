import styles from "./GlobalSearch.module.css";

export default function SearchLoader() {
    return (
        <div className={styles.loader} role="status" aria-label="Searching">
            {[1, 2, 3].map(item => (
                <div className={styles.loaderRow} key={item}>
                    <span />
                    <div><i /><i /></div>
                </div>
            ))}
        </div>
    );
}
