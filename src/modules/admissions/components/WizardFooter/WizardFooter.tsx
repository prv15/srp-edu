import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import Button from "../../../../components/ui/Button";

import { useAdmission } from "../../../../contexts/AdmissionContext";

import styles from "./WizardFooter.module.css";

export default function WizardFooter() {

    const {

    currentStep,

    nextStep,

    previousStep,

} = useAdmission();

const isLastStep = currentStep === 6;

    return (

        <footer className={styles.footer}>

            <Button

                variant="outline"

                icon={<ArrowLeft size={18} />}

                onClick={previousStep}

                disabled={currentStep === 0}

            >

                Previous

            </Button>

            <div className={styles.status}>

                <CheckCircle2 size={18} />

                <span>

                    Changes saved automatically

                </span>

            </div>

            <Button
    variant="primary"
    icon={
        isLastStep
            ? <CheckCircle2 size={18} />
            : <ArrowRight size={18} />
    }
    onClick={nextStep}
>
    {isLastStep ? "Submit Admission" : "Next"}
</Button>

        </footer>

    );

}