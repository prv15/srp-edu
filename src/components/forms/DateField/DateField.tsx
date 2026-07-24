import type { InputHTMLAttributes } from "react";
//import { CalendarDays } from "lucide-react";

import styles from "./DateField.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

    required?:boolean;

    helperText?:string;

    error?:string;

}

export default function DateField({

    label,

    required,

    helperText,

    error,

    className="",

    ...props

}:Props){

    return(

        <div className={styles.field}>

            <label className={styles.label}>

                {label}

                {required && (

                    <span className={styles.required}>

                        *

                    </span>

                )}

            </label>

           <div className={styles.inputWrapper}>

    <input

        type="date"

        {...props}

        className={`
            ${styles.input}
            ${error ? styles.errorInput : ""}
            ${className}
        `}

    />

</div>

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