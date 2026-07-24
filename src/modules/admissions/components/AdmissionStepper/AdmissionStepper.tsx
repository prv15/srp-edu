import {
    CheckCircle2,
    Circle,
    CircleDot,
} from "lucide-react";

import styles from "./AdmissionStepper.module.css";

interface Props {

    steps: readonly string[];

    currentStep: number;

}

export default function AdmissionStepper({

    steps,

    currentStep,

}: Props) {

    const formatLabel = (step: string) =>

        step
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (letter) => letter.toUpperCase());

    return (

        <div className={styles.wrapper}>

            {steps.map((step, index) => {

                const completed = index < currentStep;

                const active = index === currentStep;

                return (

                    <div
                        key={step}
                        className={`${styles.step}
                            ${completed ? styles.completed : ""}
                            ${active ? styles.active : ""}`}
                    >

                        <div className={styles.icon}>

                            {completed ? (

                                <CheckCircle2 size={28} />

                            ) : active ? (

                                <CircleDot size={30} />

                            ) : (

                                <Circle size={28} />

                            )}

                        </div>

                        <div className={styles.label}>

                            {formatLabel(step)}

                        </div>

                        {index < steps.length - 1 && (

                            <div className={styles.line} />

                        )}

                    </div>

                );

            })}

        </div>

    );

}