import { AdmissionProvider } from "../../../../contexts/AdmissionContext";

import AdmissionWizard from "../../components/AdmissionWizard/AdmissionWizard";

export default function NewAdmission() {

    return (

        <AdmissionProvider>

            <AdmissionWizard />

        </AdmissionProvider>

    );

}