import type { ReactNode } from "react";

import styles from "./PageContent.module.css";

interface PageContentProps{

    children:ReactNode;

}

export default function PageContent({

    children,

}:PageContentProps){

    return(

        <main className={styles.container}>

            {children}

        </main>

    );

}