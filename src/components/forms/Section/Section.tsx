import type { ReactNode } from "react";
import styles from "./Section.module.css";

interface Props {

    title: string;

    description?: string;

    children: ReactNode;

}

export default function Section({

    title,

    description,

    children,

}: Props) {

    return (

        <section className={styles.section}>

            <div className={styles.header}>

                <h2>{title}</h2>

                {description && (

                    <p>{description}</p>

                )}

            </div>

            <div className={styles.content}>

                {children}

            </div>

        </section>

    );

}