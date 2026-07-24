import DashboardCard from "../DashboardCard";
import styles from "./LiveActivity.module.css";

const activities = [

    {
        time: "09:42 AM",
        title: "Rahul Kumar admitted to Class VIII",
        icon: "🎓"
    },

    {
        time: "09:15 AM",
        title: "₹24,500 fee collected",
        icon: "💰"
    },

    {
        time: "08:56 AM",
        title: "Library book issued to Priya Singh",
        icon: "📚"
    },

    {
        time: "08:42 AM",
        title: "Bus No. 3 departed",
        icon: "🚌"
    },

    {
        time: "08:30 AM",
        title: "Physics attendance submitted",
        icon: "👨‍🏫"
    },

    {
        time: "08:15 AM",
        title: "New admission enquiry received",
        icon: "📝"
    }

];

export default function LiveActivity() {

    return (

        <div className={styles.wrapper}>

            <DashboardCard title="Live Activity">

                <div className={styles.timeline}>

                    {activities.map((activity,index)=>(

                        <div
                            key={index}
                            className={styles.item}
                        >

                            <div className={styles.icon}>

                                {activity.icon}

                            </div>

                            <div className={styles.content}>

                                <strong>

                                    {activity.title}

                                </strong>

                                <span>

                                    {activity.time}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </DashboardCard>

        </div>

    )

}