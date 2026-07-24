import {
    User,
    Users,
    Droplets,
    Globe2,
} from "lucide-react";

import { useAdmission } from "../../../../contexts/AdmissionContext";

import FormGrid from "../../../../components/forms/FormGrid";
import TextField from "../../../../components/forms/TextField";
import SelectField from "../../../../components/forms/SelectField";
import DateField from "../../../../components/forms/DateField";
import PhoneField from "../../../../components/forms/PhoneField";
import AadhaarField from "../../../../components/forms/AadhaarField";
import EmailField from "../../../../components/forms/EmailField";
import ProfilePhoto from "../../../../components/forms/ProfilePhoto";

import SectionCard from "../../../../components/layout/SectionCard";

const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
];

const bloodGroupOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
];

export default function PersonalDetails() {

    const {

        formData,

        updatePersonalField,

    } = useAdmission();

    return (

        <>

            <SectionCard

                title="Student Photograph"

                description="Upload a recent passport-size photograph."

            >

                <ProfilePhoto />

            </SectionCard>

            <SectionCard

                title="Basic Information"

                description="Student's personal details."

            >

                <FormGrid>

                    <TextField

                        label="First Name"

                        required

                        leftIcon={<User size={16} />}

                        value={formData.personal.firstName}

                        onChange={(e)=>updatePersonalField("firstName",e.target.value)}

                    />

                    <TextField

                        label="Middle Name"

                        leftIcon={<User size={16} />}

                        value={formData.personal.middleName}

                        onChange={(e)=>updatePersonalField("middleName",e.target.value)}

                    />

                    <TextField

                        label="Last Name"

                        required

                        leftIcon={<User size={16} />}

                        value={formData.personal.lastName}

                        onChange={(e)=>updatePersonalField("lastName",e.target.value)}

                    />

                    <SelectField

                        label="Gender"

                        required

                        leftIcon={<Users size={16} />}

                        placeholder="Select Gender"

                        options={genderOptions}

                        value={formData.personal.gender}

                        onChange={(e)=>updatePersonalField("gender",e.target.value)}

                    />

                    <DateField

                        label="Date of Birth"

                        required

                        value={formData.personal.dob}

                        onChange={(e)=>updatePersonalField("dob",e.target.value)}

                    />

                    <SelectField

                        label="Blood Group"

                        leftIcon={<Droplets size={16} />}

                        placeholder="Select Blood Group"

                        options={bloodGroupOptions}

                    />

                </FormGrid>

            </SectionCard>

            <SectionCard

                title="Identity Details"

                description="Government and identity information."

            >

                <FormGrid>

                    <AadhaarField

                        label="Aadhaar Number"

                        value={formData.personal.aadhaar}

                        onChange={(e)=>updatePersonalField("aadhaar",e.target.value)}

                    />

                    <TextField

                        label="Nationality"

                        leftIcon={<Globe2 size={16} />}

                        defaultValue="Indian"

                    />

                    <TextField

                        label="Religion"

                    />

                    <TextField

                        label="Category"

                    />

                </FormGrid>

            </SectionCard>

            <SectionCard

                title="Communication"

                description="Student contact details."

            >

                <FormGrid>

                    <PhoneField

                        label="Mobile Number"

                        required

                        value={formData.personal.mobile}

                        onChange={(e)=>updatePersonalField("mobile",e.target.value)}

                    />

                    <EmailField

                        label="Email Address"

                        value={formData.personal.email}

                        onChange={(e)=>updatePersonalField("email",e.target.value)}

                    />

                    <TextField

                        label="Mother Tongue"

                    />

                    <TextField

                        label="Birth Place"

                    />

                </FormGrid>

            </SectionCard>

        </>

    );

}