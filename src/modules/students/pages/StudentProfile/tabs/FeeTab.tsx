import FeeSummary from "../components/FeeSummary";
import FeeStructure from "../components/FeeStructure";
import InstallmentCard from "../components/InstallmentCard";
import PaymentHistory from "../components/PaymentHistory";
import StudentFeeLedger from "../components/StudentFeeLedger";

import styles from "./FeeTab.module.css";

export default function FeeTab() {

    return (

        <div className={styles.wrapper}>

            <FeeSummary />

            <div className={styles.topGrid}>

                <FeeStructure />

                <InstallmentCard />

            </div>

            <PaymentHistory />
            <StudentFeeLedger />

        </div>

    );

}