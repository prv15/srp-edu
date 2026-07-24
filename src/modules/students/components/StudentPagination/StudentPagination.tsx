import styles from "./StudentPagination.module.css";

type Props = {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
};

export default function StudentPagination({
    page,
    pageSize,
    total,
    onPageChange,
}: Props) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
        <div className={styles.pagination}>
            <span>{start}-{end} of {total}</span>
            <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </button>
            <button className={styles.active} aria-current="page">{page}</button>
            <button
                disabled={page >= pageCount}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
