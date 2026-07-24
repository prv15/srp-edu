import { ChevronDown, Plus, Upload } from "lucide-react";
import styles from "./StudentHeader.module.css";

export default function StudentHeader() {
    return (
        <div className={styles.header}>

            <div className={styles.left}>

                <h1>Students</h1>

                <p>
                    Manage all students across SRP Educational Institutions
                </p>

            </div>

            <div className={styles.right}>

                <button className={styles.importButton}>

                    <Upload size={18} />

                    Import Students

                </button>

                <button className={styles.addButton}>

                    <Plus size={18} />

                    New Admission

                    <ChevronDown size={16} />

                </button>

            </div>

        </div>
    );
}