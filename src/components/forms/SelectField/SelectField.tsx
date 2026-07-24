import type {
    ReactNode,
    SelectHTMLAttributes,
} from "react";

import { ChevronDown } from "lucide-react";

import styles from "./SelectField.module.css";

interface Option {

    label: string;

    value: string;

}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {

    label: string;

    options: Option[];

    placeholder?: string;

    required?: boolean;

    helperText?: string;

    error?: string;

    leftIcon?: ReactNode;

}

export default function SelectField({

    label,

    options,

    placeholder,

    required,

    helperText,

    error,

    leftIcon,

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

            <div className={styles.selectWrapper}>

                {leftIcon && (

                    <div className={styles.leftIcon}>

                        {leftIcon}

                    </div>

                )}

                <select

                    {...props}

                    className={`

                        ${styles.select}

                        ${leftIcon ? styles.withLeftIcon : ""}

                        ${error ? styles.errorInput : ""}

                        ${className}

                    `}

                >

                    {placeholder && (

                        <option value="">

                            {placeholder}

                        </option>

                    )}

                    {options.map((option) => (

                        <option

                            key={option.value}

                            value={option.value}

                        >

                            {option.label}

                        </option>

                    ))}

                </select>

                <div className={styles.arrow}>

                    <ChevronDown size={18} />

                </div>

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