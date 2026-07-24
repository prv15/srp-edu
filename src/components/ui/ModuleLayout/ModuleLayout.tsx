import type { ReactNode } from "react";
import styles from "./ModuleLayout.module.css";

interface ModuleLayoutProps {

    children: ReactNode;

}

export default function ModuleLayout({

    children,

}: ModuleLayoutProps) {

    return (

        <section className={styles.module}>

            {children}

        </section>

    );

}