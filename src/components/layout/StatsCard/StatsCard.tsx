import type { ReactNode } from "react";

import styles from "./StatsCard.module.css";

interface StatsCardProps{

    title:string;

    value:string | number;

    icon?:ReactNode;

    color?:string;

    subtitle?:string;

    trend?:string;

}

export default function StatsCard({

    title,

    value,

    icon,

    color="var(--primary)",

    subtitle,

    trend,

}:StatsCardProps){

    return(

        <div className={styles.card}>

            <div className={styles.top}>

                <div>

                    <div className={styles.title}>

                        {title}

                    </div>

                    <div className={styles.value}>

                        {value}

                    </div>

                </div>

                {

                    icon && (

                        <div
                            className={styles.icon}
                            style={{

                                background:color,

                            }}
                        >

                            {icon}

                        </div>

                    )

                }

            </div>

            {

                subtitle && (

                    <div className={styles.subtitle}>

                        {subtitle}

                    </div>

                )

            }

            {

                trend && (

                    <div className={styles.trend}>

                        {trend}

                    </div>

                )

            }

        </div>

    );

}