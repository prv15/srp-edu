import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {

    children: ReactNode;

    icon?: ReactNode;

    variant?: Variant;

}

export default function Button({

    children,

    icon,

    variant = "primary",

    className = "",

    ...props

}: ButtonProps) {

    return (

        <button

            {...props}

            className={`${styles.button} ${styles[variant]} ${className}`}

        >

            {icon && <span className={styles.icon}>{icon}</span>}

            <span>{children}</span>

        </button>

    );

}