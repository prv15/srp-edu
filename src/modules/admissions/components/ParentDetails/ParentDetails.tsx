import { User, Briefcase, GraduationCap } from "lucide-react";
import { useAdmission } from "../../../../contexts/AdmissionContext";

import SectionCard from "../../../../components/layout/SectionCard";
import FormGrid from "../../../../components/forms/FormGrid";
import TextField from "../../../../components/forms/TextField";
import PhoneField from "../../../../components/forms/PhoneField";
import AadhaarField from "../../../../components/forms/AadhaarField";
import ProfilePhoto from "../../../../components/forms/ProfilePhoto";

export default function ParentDetails() {

    const {

        formData,

        updateParentsField,

    } = useAdmission();

    return (

        <>

            {/* Father */}

            <SectionCard

                title="Father's Information"

                description="Enter father's details."

            >

                <FormGrid>

                    <TextField

                        label="Father's Name"

                        required

                        leftIcon={<User size={16}/>}

                        value={formData.parents.fatherName}

                        onChange={(e)=>

                            updateParentsField(

                                "fatherName",

                                e.target.value

                            )

                        }

                    />

                    <PhoneField

                        label="Mobile Number"

                        required

                        value={formData.parents.fatherMobile}

                        onChange={(e)=>

                            updateParentsField(

                                "fatherMobile",

                                e.target.value

                            )

                        }

                    />

                    <AadhaarField

                        label="Aadhaar Number"

                        value={formData.parents.fatherAadhaar}

                        onChange={(e)=>

                            updateParentsField(

                                "fatherAadhaar",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Occupation"

                        leftIcon={<Briefcase size={16}/>}

                        value={formData.parents.fatherOccupation}

                        onChange={(e)=>

                            updateParentsField(

                                "fatherOccupation",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Highest Qualification"

                        leftIcon={<GraduationCap size={16}/>}

                        value={formData.parents.fatherQualification}

                        onChange={(e)=>

                            updateParentsField(

                                "fatherQualification",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

            {/* Mother */}

            <SectionCard

                title="Mother's Information"

                description="Enter mother's details."

            >

                <FormGrid>

                    <TextField

                        label="Mother's Name"

                        required

                        leftIcon={<User size={16}/>}

                        value={formData.parents.motherName}

                        onChange={(e)=>

                            updateParentsField(

                                "motherName",

                                e.target.value

                            )

                        }

                    />

                    <PhoneField

                        label="Mobile Number"

                        value={formData.parents.motherMobile}

                        onChange={(e)=>

                            updateParentsField(

                                "motherMobile",

                                e.target.value

                            )

                        }

                    />

                    <AadhaarField

                        label="Aadhaar Number"

                        value={formData.parents.motherAadhaar}

                        onChange={(e)=>

                            updateParentsField(

                                "motherAadhaar",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Occupation"

                        leftIcon={<Briefcase size={16}/>}

                        value={formData.parents.motherOccupation}

                        onChange={(e)=>

                            updateParentsField(

                                "motherOccupation",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Highest Qualification"

                        leftIcon={<GraduationCap size={16}/>}

                        value={formData.parents.motherQualification}

                        onChange={(e)=>

                            updateParentsField(

                                "motherQualification",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

            {/* Guardian */}

            <SectionCard

                title="Local Guardian"

                description="Guardian details (if applicable)."

            >

                <FormGrid>

                    <TextField

                        label="Guardian Name"

                        value={formData.parents.guardianName}

                        onChange={(e)=>

                            updateParentsField(

                                "guardianName",

                                e.target.value

                            )

                        }

                    />

                    <PhoneField

                        label="Mobile Number"

                        value={formData.parents.guardianMobile}

                        onChange={(e)=>

                            updateParentsField(

                                "guardianMobile",

                                e.target.value

                            )

                        }

                    />

                    <AadhaarField

                        label="Aadhaar Number"

                        value={formData.parents.guardianAadhaar}

                        onChange={(e)=>

                            updateParentsField(

                                "guardianAadhaar",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Occupation"

                        value={formData.parents.guardianOccupation}

                        onChange={(e)=>

                            updateParentsField(

                                "guardianOccupation",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Relation"

                        value={formData.parents.guardianRelation}

                        onChange={(e)=>

                            updateParentsField(

                                "guardianRelation",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

            {/* Photos */}

            <SectionCard

                title="Parent Photographs"

                description="Upload parent and guardian photographs."

            >

                <div
                    style={{
                        display:"grid",
                        gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
                        gap:"20px",
                    }}
                >

                    <ProfilePhoto

                        title="Father Photo"

                    />

                    <ProfilePhoto

                        title="Mother Photo"

                    />

                    <ProfilePhoto

                        title="Guardian Photo"

                    />

                </div>

            </SectionCard>

        </>

    );

}