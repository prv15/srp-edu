import { useState } from "react";

import SectionCard from "../../../../components/layout/SectionCard";
import styles from "./Payment.module.css";

export default function Payment() {

    const [paymentMethod, setPaymentMethod] = useState("Cash");

    const fees = [

        {
            title: "Registration Fee",
            amount: 500,
        },

        {
            title: "Admission Fee",
            amount: 2000,
        },

        {
            title: "Development Fee",
            amount: 1000,
        },

        {
            title: "Prospectus Fee",
            amount: 300,
        },

    ];

    const total = fees.reduce(

        (sum, item) => sum + item.amount,

        0

    );

    return (

        <div className="styles.page">

            <SectionCard

                title="Admission Fees"

                description="Review the fee structure before admission."

            >

                <div className={styles.feeList}>

    {fees.map((fee) => (

        <div
            key={fee.title}
            className={styles.feeRow}
        >

            <div className={styles.feeTitle}>

                {fee.title}

            </div>

            <div className={styles.feeAmount}>

                ₹ {fee.amount.toLocaleString("en-IN")}

            </div>

        </div>

    ))}

    <div className={styles.totalRow}>

        <div className={styles.totalLabel}>
            Total Amount
        </div>

        <div className={styles.totalAmount}>
            ₹ {total.toLocaleString("en-IN")}
        </div>

    </div>

</div>

            </SectionCard>

            <SectionCard

                title="Payment Method"

                description="Select the payment mode."

            >

                <div className="styles.methodGrid">
                                        {[
                        "Cash",
                        "UPI",
                        "Credit / Debit Card",
                        "Net Banking",
                        "Cheque",
                        "Pending",
                    ].map((method) => (

                        <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`${styles.methodCard} ${
    paymentMethod === method
        ? styles.methodActive
        : ""
}`}
                        >

                            <div className="styles.methodTitle">

                                {method}

                            </div>

                            <div className="styles.methodSubtitle">

                                {paymentMethod === method
                                    ? "Selected"
                                    : "Click to select"}

                            </div>

                        </button>

                    ))}

                </div>

            </SectionCard>

            <SectionCard
                title="Receipt Details"
                description="Payment receipt information."
            >

                <div className="styles.fieldGrid">

                    <Field
                        label="Receipt No."
                        value="RCPT-2026-000145"
                    />

                    <Field
                        label="Payment Date"
                        value={new Date().toLocaleDateString()}
                    />

                    <Field
                        label="Collected By"
                        value="Administrator"
                    />

                    <Field
                        label="Payment Method"
                        value={paymentMethod}
                    />

                </div>

            </SectionCard>
                        <SectionCard
                title="Transaction Details"
                description="Additional payment information."
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Field
                        label="Transaction ID"
                        value="Will be generated after payment"
                    />

                    <Field
                        label="Payment Status"
                        value="Paid"
                        highlight
                    />

                    <Field
                        label="Remarks"
                        value="Admission fee received successfully."
                    />

                    <Field
                        label="Next Step"
                        value="Continue to Review"
                    />

                </div>

            </SectionCard>

        </div>

    );

}

/* ======================================
    Helper Component
====================================== */

interface FieldProps {

    label: string;

    value: string;

    highlight?: boolean;

}

function Field({

    label,

    value,

    highlight = false,

}: FieldProps) {

    return (

        <div className={styles.fieldCard}>

            <div className={styles.fieldLabel}>

                {label}

            </div>

            {highlight ? (

                <div className={styles.statusPaid}>

                    {value}

                </div>

            ) : (

                <div className={styles.fieldValue}>

                    {value}

                </div>

            )}

        </div>

    );

}