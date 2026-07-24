import { useInstitute } from "../../../../contexts/InstituteContext";
import { useAdmission } from "../../../../contexts/AdmissionContext";

import SectionCard from "../../../../components/layout/SectionCard";
import FormGrid from "../../../../components/forms/FormGrid";
import DocumentUploadCard from "../../../../components/forms/DocumentUploadCard";

import { documentConfig } from "./documentConfig";

export default function Documents() {

    const { institute } = useInstitute();

    const { formData, updateDocumentsField } = useAdmission();

    const groups =
        documentConfig[
            institute.code as keyof typeof documentConfig
        ] ?? [];

    return (
        <>
            {groups.map((group) => (

                <SectionCard
                    key={group.title}
                    title={group.title}
                    description="Upload clear scanned copies or photographs of the required documents."
                >

                    <FormGrid>

                        {group.documents.map((document) => (

                            <DocumentUploadCard
                                key={document.id}
                                title={document.title}
                                required={document.required}
                                fileName={
    formData.documents[
        document.id as keyof typeof formData.documents
    ] as string
}
                                onUpload={(file) => {

                                    updateDocumentsField(
    document.id as keyof typeof formData.documents,
    file.name
);
                                }}
                            />

                        ))}

                    </FormGrid>

                </SectionCard>

            ))}
        </>
    );

}