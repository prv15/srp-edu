import type { ReactNode } from "react";

import styles from "./SectionCard.module.css";

interface SectionCardProps {

    title: string;

    description?: string;

    children: ReactNode;

}

export default function SectionCard({

    title,

    description,

    children,

}: SectionCardProps) {

    return (

        <section className={styles.card}>

            <div className={styles.header}>

                <h2>{title}</h2>

                {description && (

                    <p>{description}</p>

                )}

            </div>

            <div className={styles.body}>

                {children}

            </div>

        </section>

    );

}