import type { ReactNode } from "react";

import styles from "./StickyBar.module.css";

interface StickyBarProps{

    children:ReactNode;

}

export default function StickyBar({

    children,

}:StickyBarProps){

    return(

        <div className={styles.sticky}>

            {children}

        </div>

    );

}