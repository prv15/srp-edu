import type { ReactNode } from "react";

import styles from "./ActionBar.module.css";

interface ActionBarProps{

    left?:ReactNode;

    right?:ReactNode;

}

export default function ActionBar({

    left,

    right,

}:ActionBarProps){

    return(

        <div className={styles.actionBar}>

            <div className={styles.left}>

                {left}

            </div>

            <div className={styles.right}>

                {right}

            </div>

        </div>

    );

}