import {  School, Trophy } from "lucide-react";

import { useAdmission } from "../../../../contexts/AdmissionContext";
import { useInstitute } from "../../../../contexts/InstituteContext";

import SectionCard from "../../../../components/layout/SectionCard";
import FormGrid from "../../../../components/forms/FormGrid";
import TextField from "../../../../components/forms/TextField";
import SelectField from "../../../../components/forms/SelectField";
import TextArea from "../../../../components/forms/TextArea";
import DateField from "../../../../components/forms/DateField";

export default function AcademicDetails() {

    const {

        formData,

        updateAcademicField,

    } = useAdmission();

    const { institute } = useInstitute();

    return (

        <>

            {/* Current Admission */}

            <SectionCard

                title="Current Admission"

                description="Admission details for the selected institute."

            >

                <FormGrid>

                    {

                        institute.code === "school" && (

                            <>

                                <SelectField

                                    label="Applying Class"

                                    value={formData.academic.applyingClass}

                                    options={[]}

                                    onChange={(e)=>

                                        updateAcademicField(

                                            "applyingClass",

                                            e.target.value

                                        )

                                    }

                                />

                                <TextField

                                    label="Section Preference"

                                    value={formData.academic.sectionPreference}

                                    onChange={(e)=>

                                        updateAcademicField(

                                            "sectionPreference",

                                            e.target.value

                                        )

                                    }

                                />

                            </>

                        )

                    }

                    {

                        institute.code === "training" && (

                            <>

                                <TextField

                                    label="Training Program"

                                    value={formData.academic.applyingClass}

                                    onChange={(e)=>

                                        updateAcademicField(

                                            "applyingClass",

                                            e.target.value

                                        )

                                    }

                                />

                                <TextField

                                    label="Batch"

                                    value={formData.academic.sectionPreference}

                                    onChange={(e)=>

                                        updateAcademicField(

                                            "sectionPreference",

                                            e.target.value

                                        )

                                    }

                                />

                            </>

                        )

                    }

                    {

                        institute.code === "degree" && (

                            <>

                                <TextField

                                    label="Department"

                                    value={formData.academic.applyingClass}

                                    onChange={(e)=>

                                        updateAcademicField(

                                            "applyingClass",

                                            e.target.value

                                        )

                                    }

                                />

                                <TextField

                                    label="Semester"

                                    value={formData.academic.sectionPreference}

                                    onChange={(e)=>

                                        updateAcademicField(

                                            "sectionPreference",

                                            e.target.value

                                        )

                                    }

                                />

                            </>

                        )

                    }

                    <TextField

                        label="Academic Session"

                        value={formData.academic.academicSession}

                        onChange={(e)=>

                            updateAcademicField(

                                "academicSession",

                                e.target.value

                            )

                        }

                    />

                    <SelectField

                        label="Admission Type"

                        value={formData.academic.admissionType}

                        options={[

                            {

                                label:"New Admission",

                                value:"New"

                            },

                            {

                                label:"Transfer",

                                value:"Transfer"

                            },

                            {

                                label:"Re-Admission",

                                value:"Re-Admission"

                            }

                        ]}

                        onChange={(e)=>

                            updateAcademicField(

                                "admissionType",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

            {/* Previous Academic Record */}

            <SectionCard

                title="Previous Academic Record"

                description="Student's educational history."

            >

                <FormGrid>

                    <TextField

                        label="Previous School"

                        leftIcon={<School size={16}/>}

                        value={formData.academic.previousSchool}

                        onChange={(e)=>

                            updateAcademicField(

                                "previousSchool",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Board / University"

                        value={formData.academic.previousBoard}

                        onChange={(e)=>

                            updateAcademicField(

                                "previousBoard",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Previous Class"

                        value={formData.academic.previousClass}

                        onChange={(e)=>

                            updateAcademicField(

                                "previousClass",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Passing Year"

                        value={formData.academic.passingYear}

                        onChange={(e)=>

                            updateAcademicField(

                                "passingYear",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Percentage / CGPA"

                        value={formData.academic.percentage}

                        onChange={(e)=>

                            updateAcademicField(

                                "percentage",

                                e.target.value

                            )

                        }

                    />

                    <DateField

                        label="TC Date"

                        value={formData.academic.tcDate}

                        onChange={(e)=>

                            updateAcademicField(

                                "tcDate",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

            {/* Student Interests */}

            <SectionCard

                title="Student Interests"

                description="Sports, hobbies and achievements."

            >

                <FormGrid>

                    <TextField

                        label="Sports"

                        leftIcon={<Trophy size={16}/>}

                        value={formData.academic.sports}

                        onChange={(e)=>

                            updateAcademicField(

                                "sports",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Music"

                        value={formData.academic.music}

                        onChange={(e)=>

                            updateAcademicField(

                                "music",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Dance"

                        value={formData.academic.dance}

                        onChange={(e)=>

                            updateAcademicField(

                                "dance",

                                e.target.value

                            )

                        }

                    />

                    <TextField

                        label="Art"

                        value={formData.academic.art}

                        onChange={(e)=>

                            updateAcademicField(

                                "art",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

            {/* Office Remarks */}

            <SectionCard

                title="Office Remarks"

                description="Internal remarks by admission office."

            >

                <FormGrid>

                   <TextArea

                        label="Counselling Remarks"

                        value={formData.academic.counsellingRemarks}

                        onChange={(e)=>

                            updateAcademicField(

                                "counsellingRemarks",

                                e.target.value

                            )

                        }

                    />

                    <TextArea

                        label="Office Remarks"

                        value={formData.academic.officeRemarks}

                        onChange={(e)=>

                            updateAcademicField(

                                "officeRemarks",

                                e.target.value

                            )

                        }

                    />

                    <TextArea

                        label="Special Instructions"

                        value={formData.academic.specialInstructions}

                        onChange={(e)=>

                            updateAcademicField(

                                "specialInstructions",

                                e.target.value

                            )

                        }

                    />

                </FormGrid>

            </SectionCard>

        </>

    );

}