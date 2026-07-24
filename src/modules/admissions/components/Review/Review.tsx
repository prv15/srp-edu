import { useAdmission } from "../../../../contexts/AdmissionContext";

import SectionCard from "../../../../components/layout/SectionCard";
import styles from "./Review.module.css";

export default function Review() {

    const { formData } = useAdmission();

    const fullName = [
        formData.personal.firstName,
        formData.personal.middleName,
        formData.personal.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    const uploadedDocuments = Object.entries(formData.documents).filter(
        ([key, value]) =>
            key !== "otherDocuments" &&
            typeof value === "string" &&
            value !== ""
    );

    const missingDocuments = Object.entries(formData.documents).filter(
        ([key, value]) =>
            key !== "otherDocuments" &&
            typeof value === "string" &&
            value === ""
    );

    return (
        <div className={styles.page}>

            {/* =========================
                STUDENT INFORMATION
            ========================== */}

            <SectionCard
                title="Student Information"
                description="Verify the student's personal details."
            >

                <div className={styles.grid3}>

                    <Info
                        label="Full Name"
                        value={fullName}
                    />

                    <Info
                        label="Hindi Name"
                        value={formData.personal.hindiName}
                    />

                    <Info
                        label="Gender"
                        value={formData.personal.gender}
                    />

                    <Info
                        label="Date of Birth"
                        value={formData.personal.dob}
                    />

                    <Info
                        label="Blood Group"
                        value={formData.personal.bloodGroup}
                    />

                    <Info
                        label="Religion"
                        value={formData.personal.religion}
                    />

                    <Info
                        label="Nationality"
                        value={formData.personal.nationality}
                    />

                    <Info
                        label="Category"
                        value={formData.personal.category}
                    />

                    <Info
                        label="Caste"
                        value={formData.personal.caste}
                    />

                    <Info
                        label="Mobile"
                        value={formData.personal.mobile}
                    />

                    <Info
                        label="Email"
                        value={formData.personal.email}
                    />

                    <Info
                        label="APAAR ID"
                        value={formData.personal.apaarId}
                    />

                    <Info
                        label="Aadhaar"
                        value={formData.personal.aadhaar}
                    />

                </div>

            </SectionCard>

            {/* =========================
                PARENTS
            ========================== */}

            <SectionCard
                title="Parent / Guardian Details"
                description="Verify parent and guardian information."
            >

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <Info
                        label="Father Name"
                        value={formData.parents.fatherName}
                    />

                    <Info
                        label="Father Mobile"
                        value={formData.parents.fatherMobile}
                    />

                    <Info
                        label="Father Occupation"
                        value={formData.parents.fatherOccupation}
                    />

                    <Info
                        label="Mother Name"
                        value={formData.parents.motherName}
                    />

                    <Info
                        label="Mother Mobile"
                        value={formData.parents.motherMobile}
                    />

                    <Info
                        label="Mother Occupation"
                        value={formData.parents.motherOccupation}
                    />

                    <Info
                        label="Guardian"
                        value={formData.parents.guardianName}
                    />

                    <Info
                        label="Guardian Mobile"
                        value={formData.parents.guardianMobile}
                    />

                    <Info
                        label="Relation"
                        value={formData.parents.guardianRelation}
                    />

                </div>

            </SectionCard>

            {/* =========================
                ADDRESS
            ========================== */}

            <SectionCard
                title="Address"
                description="Permanent and correspondence address."
            >

                <div className={styles.grid2}>

                    <div>

                        <h4 className="font-semibold mb-3">
                            Permanent Address
                        </h4>

                        <AddressBlock
                            address={formData.address.permanentAddress}
                            village={formData.address.permanentVillage}
                            po={formData.address.permanentPO}
                            ps={formData.address.permanentPS}
                            district={formData.address.permanentDistrict}
                            state={formData.address.permanentState}
                            pincode={formData.address.permanentPincode}
                        />

                    </div>

                    <div>

                        <h4 className="font-semibold mb-3">
                            Correspondence Address
                        </h4>

                        <AddressBlock
                            address={formData.address.correspondenceAddress}
                            village={formData.address.correspondenceVillage}
                            po={formData.address.correspondencePO}
                            ps={formData.address.correspondencePS}
                            district={formData.address.correspondenceDistrict}
                            state={formData.address.correspondenceState}
                            pincode={formData.address.correspondencePincode}
                        />

                    </div>

                </div>

            </SectionCard>
                        {/* =========================
                ACADEMIC DETAILS
            ========================== */}

            <SectionCard
                title="Academic Details"
                description="Previous academic information."
            >

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <Info
                        label="Applying Class"
                        value={formData.academic.applyingClass}
                    />

                    <Info
                        label="Section Preference"
                        value={formData.academic.sectionPreference}
                    />

                    <Info
                        label="Academic Session"
                        value={formData.academic.academicSession}
                    />

                    <Info
                        label="Admission Type"
                        value={formData.academic.admissionType}
                    />

                    <Info
                        label="Medium"
                        value={formData.academic.medium}
                    />

                    <Info
                        label="Previous School"
                        value={formData.academic.previousSchool}
                    />

                    <Info
                        label="Previous Board"
                        value={formData.academic.previousBoard}
                    />

                    <Info
                        label="Previous Class"
                        value={formData.academic.previousClass}
                    />

                    <Info
                        label="Passing Year"
                        value={formData.academic.passingYear}
                    />

                    <Info
                        label="Percentage"
                        value={formData.academic.percentage}
                    />

                    <Info
                        label="TC Number"
                        value={formData.academic.tcNumber}
                    />

                    <Info
                        label="Reason For Leaving"
                        value={formData.academic.reasonForLeaving}
                    />

                </div>

            </SectionCard>

            {/* =========================
                DOCUMENTS
            ========================== */}

            <SectionCard
                title="Uploaded Documents"
                description="Uploaded documents summary."
            >

                <div className={styles.documentGrid}>

                    {uploadedDocuments.map(([key]) => (

                        <div
                            key={key}
                            className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3"
                        >

                            <span className="font-medium capitalize">

                                {key.replace(/([A-Z])/g, " $1")}

                            </span>

                            <span className="text-green-700 text-sm">

                                ✓ Uploaded

                            </span>

                        </div>

                    ))}

                    {missingDocuments.map(([key]) => (

                        <div
                            key={key}
                            className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                        >

                            <span className="font-medium capitalize">

                                {key.replace(/([A-Z])/g, " $1")}

                            </span>

                            <span className="text-red-600 text-sm">

                                ✗ Missing

                            </span>

                        </div>

                    ))}

                </div>

            </SectionCard>

            {/* =========================
                DECLARATION
            ========================== */}

            <SectionCard
                title="Declaration"
                description="Applicant declaration details."
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <Info
                        label="Declaration Accepted"
                        value={
                            formData.declaration.accepted
                                ? "Yes"
                                : "No"
                        }
                    />

                    <Info
                        label="Place"
                        value={formData.declaration.place}
                    />

                    <Info
                        label="Date"
                        value={formData.declaration.date}
                    />

                </div>

            </SectionCard>
                    </div>
    );
}

/* ==========================================
    HELPER COMPONENTS
========================================== */

interface InfoProps {
    label: string;
    value: string;
}

function Info({
    label,
    value,
}: InfoProps) {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-4">

            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">

                {label}

            </div>

            <div className="font-medium text-slate-800 break-words">

                {value || "-"}

            </div>

        </div>

    );

}

interface AddressBlockProps {

    address: string;

    village: string;

    po: string;

    ps: string;

    district: string;

    state: string;

    pincode: string;

}

function AddressBlock({

    address,

    village,

    po,

    ps,

    district,

    state,

    pincode,

}: AddressBlockProps) {

    return (

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">

            <AddressRow
                label="Address"
                value={address}
            />

            <AddressRow
                label="Village"
                value={village}
            />

            <AddressRow
                label="Post Office"
                value={po}
            />

            <AddressRow
                label="Police Station"
                value={ps}
            />

            <AddressRow
                label="District"
                value={district}
            />

            <AddressRow
                label="State"
                value={state}
            />

            <AddressRow
                label="Pincode"
                value={pincode}
            />

        </div>

    );

}

interface AddressRowProps {

    label: string;

    value: string;

}

function AddressRow({

    label,

    value,

}: AddressRowProps) {

    return (

        <div className="flex justify-between gap-4 border-b border-slate-200 pb-2 last:border-b-0 last:pb-0">

            <span className="text-slate-500">

                {label}

            </span>

            <span className="font-medium text-right">

                {value || "-"}

            </span>

        </div>

    );

}