import { RotateCcw } from "lucide-react";
import styles from "./StudentFilters.module.css";

export default function StudentFilters() {
    return (
        <div className={styles.filterBar}>

            <div className={styles.filters}>

                {/* Class / Course */}

                <select className={styles.select}>
                    <option>All Classes / Courses</option>
                </select>

                {/* Status */}

                <select className={styles.select}>
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Transferred</option>
                    <option>Completed</option>
                </select>

                {/* Academic Session */}

                <select className={styles.select}>
                    <option>2026–2027</option>
                    <option>2025–2026</option>
                </select>

            </div>

            <button className={styles.resetButton}>

                <RotateCcw size={18} />

                <span>Reset Filters</span>

            </button>

        </div>
    );
}