import styles from "./StudentPagination.module.css";

export default function StudentPagination() {
    return (
        <div className={styles.pagination}>

            <button>Previous</button>

            <button className={styles.active}>1</button>

            <button>2</button>

            <button>3</button>

            <button>Next</button>

        </div>
    );
}