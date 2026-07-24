import {
    Users,
    GraduationCap,
    UserPlus,
    ClipboardCheck
} from "lucide-react";

import styles from "./KPICards.module.css";

const cards = [

    {
        title: "Students",
        value: "5,462",
        growth: "+12%",
        color: "#2563EB",
        icon: Users
    },

    {
        title: "Faculty",
        value: "228",
        growth: "+3%",
        color: "#10B981",
        icon: GraduationCap
    },

    {
        title: "Admissions",
        value: "154",
        growth: "+18%",
        color: "#F59E0B",
        icon: UserPlus
    },

    {
        title: "Attendance",
        value: "96.4%",
        growth: "+0.8%",
        color: "#8B5CF6",
        icon: ClipboardCheck
    }

];

export default function KPICards(){

    return(

        <section className={styles.grid}>

            {cards.map((card)=>{

                const Icon=card.icon;

                return(

                    <div
                        key={card.title}
                        className={styles.card}
                    >

                        <div className={styles.top}>

                            <div>

                                <p>{card.title}</p>

                                <h2>{card.value}</h2>

                            </div>

                            <div
                                className={styles.icon}
                                style={{background:card.color}}
                            >

                                <Icon size={24}/>

                            </div>

                        </div>

                        <span className={styles.growth}>

                            {card.growth}

                            this month

                        </span>

                    </div>

                )

            })}

        </section>

    )

}