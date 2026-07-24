import DashboardCard from "../DashboardCard";
import { getDashboardData } from "../../services/dashboard.service";
import { useInstitute } from "../../../../contexts/InstituteContext";

import styles from "./UpcomingEventsCard.module.css";

export default function UpcomingEventsCard() {

    const { institute } = useInstitute();

    const dashboard = getDashboardData(institute.code);

    return (

        <div className={styles.wrapper}>

            <DashboardCard title="Upcoming Events">

                <div className={styles.timeline}>

                    {dashboard.events.map((event, index) => (

                        <div
                            key={index}
                            className={styles.item}
                        >

                            <div className={styles.date}>

                                {event.date}

                            </div>

                            <div className={styles.details}>

                                <h4>{event.title}</h4>

                                <span className={styles.badge}>

                                    {event.category}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </DashboardCard>

        </div>

    );

}