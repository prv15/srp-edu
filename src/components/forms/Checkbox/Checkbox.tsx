import type { InputHTMLAttributes } from "react";

import styles from "./Checkbox.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

    helperText?:string;

}

export default function Checkbox({

    label,

    helperText,

    className="",

    ...props

}:Props){

    return(

        <div className={styles.wrapper}>

            <label className={styles.checkbox}>

                <input

                    type="checkbox"

                    {...props}

                    className={`${styles.input} ${className}`}

                />

                <span className={styles.label}>

                    {label}

                </span>

            </label>

            {

                helperText && (

                    <small className={styles.helper}>

                        {helperText}

                    </small>

                )

            }

        </div>

    );

}