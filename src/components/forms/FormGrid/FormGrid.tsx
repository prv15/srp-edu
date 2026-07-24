import type { ReactNode } from "react";
import styles from "./FormGrid.module.css";

interface Props {

    children: ReactNode;

}

export default function FormGrid({

    children,

}: Props){

    return(

        <div className={styles.grid}>

            {children}

        </div>

    );

}