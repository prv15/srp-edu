import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface Action {
    label: string;
    icon?: ReactNode;
    primary?: boolean;
    onClick?: () => void;
}

interface Props {
    title: string;
    subtitle: string;
    actions?: Action[];
}

export default function PageHeader({

    title,

    subtitle,

    actions = [],

}: Props) {

    return (

        <div className={styles.header}>

            <div className={styles.left}>

                <h1>{title}</h1>

                <p>{subtitle}</p>

            </div>

            <div className={styles.actions}>

                {actions.map((action) => (

                    <button

                        key={action.label}

                        onClick={action.onClick}

                        className={
                            action.primary
                                ? styles.primaryButton
                                : styles.secondaryButton
                        }

                    >

                        {action.icon}

                        <span>{action.label}</span>

                    </button>

                ))}

            </div>

        </div>

    );

}