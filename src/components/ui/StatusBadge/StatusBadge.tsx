import styles from "./StatusBadge.module.css";

export type StatusType =
    | "active"
    | "inactive"
    | "pending"
    | "completed"
    | "cancelled"
    | "draft"
    | "paid"
    | "unpaid";

interface Props {

    status: StatusType;

    label?: string;

}

export default function StatusBadge({

    status,

    label,

}: Props) {

    return (

        <span className={`${styles.badge} ${styles[status]}`}>

            <span className={styles.dot}></span>

            {label ?? status}

        </span>

    );

}