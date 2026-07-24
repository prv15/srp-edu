import type { InputHTMLAttributes, ReactNode } from "react";

import styles from "./TextField.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

    required?:boolean;

    helperText?:string;

    error?:string;

    leftIcon?:ReactNode;

    rightIcon?:ReactNode;

}

export default function TextField({

    label,

    required,

    helperText,

    error,

    leftIcon,

    rightIcon,

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

                {leftIcon && (

                    <div className={styles.leftIcon}>

                        {leftIcon}

                    </div>

                )}

                <input

                    {...props}

                    className={`

                        ${styles.input}

                        ${leftIcon ? styles.withLeftIcon : ""}

                        ${rightIcon ? styles.withRightIcon : ""}

                        ${error ? styles.errorInput : ""}

                        ${className}

                    `}

                />

                {rightIcon && (

                    <div className={styles.rightIcon}>

                        {rightIcon}

                    </div>

                )}

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