import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {

    title?: string;

    subtitle?: string;

    children: ReactNode;

    actions?: ReactNode;

    className?: string;

}

export default function Card({

    title,

    subtitle,

    actions,

    children,

    className = "",

}: CardProps) {

    return (

        <div className={`${styles.card} ${className}`}>

            {(title || actions) && (

                <div className={styles.header}>

                    <div>

                        {title && (

                            <h3>{title}</h3>

                        )}

                        {subtitle && (

                            <p>{subtitle}</p>

                        )}

                    </div>

                    {actions}

                </div>

            )}

            <div className={styles.body}>

                {children}

            </div>

        </div>

    );

}