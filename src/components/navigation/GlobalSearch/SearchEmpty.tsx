import { SearchX } from "lucide-react";
import styles from "./GlobalSearch.module.css";

export default function SearchEmpty({ query, error }: { query: string; error?: string }) {
    return (
        <div className={styles.emptyState}>
            <span><SearchX size={24} /></span>
            <strong>{error || "No matching records found"}</strong>
            <p>
                {error
                    ? "Please try again in a moment."
                    : `Try a student name, admission number, receipt, course, subject, or employee ID for “${query}”.`}
            </p>
        </div>
    );
}
