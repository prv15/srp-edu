import { useInstitute } from "../../../../contexts/InstituteContext";
import { useAdmission } from "../../../../contexts/AdmissionContext";

import { admissionRegistry } from "../../config/admissionRegistry";

import PageHeader from "../../../../components/layout/PageHeader";
import StickyBar from "../../../../components/layout/StickyBar";
import AdmissionStepper from "../AdmissionStepper";
import WizardFooter from "../WizardFooter";
import PageContent from "../../../../components/layout/PageContent";
import styles from "./AdmissionWizard.module.css";

export default function AdmissionWizard() {

    const { institute } = useInstitute();

    const { currentStep } = useAdmission();

    const workflow = admissionRegistry[institute.code];

    const CurrentPage = workflow.steps[currentStep].component;

    return (

        <div className={styles.page}>

            <PageHeader

    title="New Student Admission"

    description={`Create admission for ${institute.name}`}

/>

<PageContent>

    <StickyBar>

        <AdmissionStepper

            steps={workflow.steps.map(step=>step.title)}

            currentStep={currentStep}

        />

    </StickyBar>

    <CurrentPage/>

</PageContent>

<WizardFooter/>

        </div>

    );

}