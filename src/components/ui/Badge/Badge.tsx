import type { ReactNode } from "react";

import styles from "./Badge.module.css";

type Variant =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";

interface Props{

    children:ReactNode;

    variant?:Variant;

}

export default function Badge({

    children,

    variant="neutral",

}:Props){

    return(

        <span
            className={`${styles.badge} ${styles[variant]}`}
        >

            {children}

        </span>

    );

}