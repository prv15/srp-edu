import type { ReactNode } from "react";

import styles from "./DashboardCard.module.css";

interface DashboardCardProps{

    title:string;

    action?:ReactNode;

    children:ReactNode;

}

export default function DashboardCard({

    title,

    action,

    children

}:DashboardCardProps){

    return(

        <section className={styles.card}>

            <header className={styles.header}>

                <h3>

                    {title}

                </h3>

                {action}

            </header>

            <div className={styles.body}>

                {children}

            </div>

        </section>

    )

}