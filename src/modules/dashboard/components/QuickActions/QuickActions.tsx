import {
    UserPlus,
    Users,
    IndianRupee,
    BookOpen,
    ClipboardCheck,
    FileText,
    Bus,
    Plus
} from "lucide-react";

import DashboardCard from "../DashboardCard";
import styles from "./QuickActions.module.css";

const actions = [

    {
        title: "New Admission",
        icon: UserPlus
    },

    {
        title: "Add Student",
        icon: Users
    },

    {
        title: "Collect Fee",
        icon: IndianRupee
    },

    {

    title: "Issue Book",

    icon: BookOpen

},

    {
        title: "Take Attendance",
        icon: ClipboardCheck
    },

    {
        title: "Generate Report",
        icon: FileText
    },

    {
        title: "Transport",
        icon: Bus
    },

    {
        title: "More",
        icon: Plus
    }

];

export default function QuickActions(){

    return(

        <div className={styles.wrapper}>

            <DashboardCard title="Quick Actions">

                <div className={styles.grid}>

                    {actions.map((action)=>{

                        const Icon=action.icon;

                        return(

                            <button
                                key={action.title}
                                className={styles.action}
                            >

                                <Icon size={24}/>

                                <span>

                                    {action.title}

                                </span>

                            </button>

                        )

                    })}

                </div>

            </DashboardCard>

        </div>

    )

}