import {
    IndianRupee,
    TrendingUp,
    AlertCircle,
} from "lucide-react";

import DashboardCard from "../DashboardCard";
import styles from "./FeeCollection.module.css";

export default function FeeCollection() {

    return (

        <DashboardCard title="Fee Collection">

            <div className={styles.wrapper}>

                <div className={styles.card}>

                    <div className={styles.icon}>

                        <IndianRupee size={22}/>

                    </div>

                    <div>

                        <span>Today's Collection</span>

                        <h2>₹2,48,500</h2>

                    </div>

                </div>

                <div className={styles.card}>

                    <div className={styles.iconGreen}>

                        <TrendingUp size={22}/>

                    </div>

                    <div>

                        <span>This Month</span>

                        <h2>₹38.45 L</h2>

                    </div>

                </div>

                <div className={styles.card}>

                    <div className={styles.iconRed}>

                        <AlertCircle size={22}/>

                    </div>

                    <div>

                        <span>Pending Fees</span>

                        <h2>₹12.60 L</h2>

                    </div>

                </div>

            </div>

        </DashboardCard>

    )

}