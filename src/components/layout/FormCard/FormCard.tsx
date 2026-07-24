import type { ReactNode } from "react";

import styles from "./FormCard.module.css";

interface FormCardProps{

    title?:string;

    description?:string;

    children:ReactNode;

}

export default function FormCard({

    title,

    description,

    children,

}:FormCardProps){

    return(

        <div className={styles.card}>

            {(title || description) && (

                <div className={styles.header}>

                    {title && (

                        <h2>{title}</h2>

                    )}

                    {description && (

                        <p>{description}</p>

                    )}

                </div>

            )}

            <div className={styles.body}>

                {children}

            </div>

        </div>

    );

}