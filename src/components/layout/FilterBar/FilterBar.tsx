import type { ReactNode } from "react";

import styles from "./FilterBar.module.css";

interface Props{

    children:ReactNode;

}

export default function FilterBar({

    children,

}:Props){

    return(

        <div className={styles.filterBar}>

            {children}

        </div>

    );

}