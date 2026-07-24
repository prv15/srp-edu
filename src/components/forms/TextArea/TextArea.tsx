import type {
    TextareaHTMLAttributes,
} from "react";

import styles from "./TextArea.module.css";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {

    label: string;

    required?: boolean;

    helperText?: string;

    error?: string;

}

export default function TextArea({

    label,

    required,

    helperText,

    error,

    className = "",

    ...props

}: Props) {

    return (

        <div className={styles.field}>

            <label className={styles.label}>

                {label}

                {required && (

                    <span className={styles.required}>

                        *

                    </span>

                )}

            </label>

            <textarea

                {...props}

                className={`
                    ${styles.textarea}
                    ${error ? styles.errorInput : ""}
                    ${className}
                `}

            />

            {helperText && !error && (

                <small className={styles.helper}>

                    {helperText}

                </small>

            )}

            {error && (

                <small className={styles.error}>

                    {error}

                </small>

            )}

        </div>

    );

}