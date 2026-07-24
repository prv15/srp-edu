import type { ReactNode } from "react";

import styles from "./StatsGrid.module.css";

interface Props{

    children:ReactNode;

}

export default function StatsGrid({

    children,

}:Props){

    return(

        <div className={styles.grid}>

            {children}

        </div>

    );

}