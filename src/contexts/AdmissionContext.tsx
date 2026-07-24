/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { AdmissionForm } from "../modules/admissions/types/admission";

interface AdmissionContextType {

    currentStep:number;

    setCurrentStep:React.Dispatch<
        React.SetStateAction<number>
    >;

    formData:AdmissionForm;

    setFormData:React.Dispatch<
        React.SetStateAction<AdmissionForm>
    >;

    nextStep:()=>void;

    previousStep:()=>void;

    updateOfficeField:(

        field:keyof AdmissionForm["office"],

        value:string

    )=>void;

    updatePersonalField:(

        field:keyof AdmissionForm["personal"],

        value:string

    )=>void;

    updateParentsField:(

        field:keyof AdmissionForm["parents"],

        value:string

    )=>void;

    updateAddressField:(

        field:keyof AdmissionForm["address"],

        value:string | boolean

    )=>void;

    updateAcademicField:(

        field:keyof AdmissionForm["academic"],

        value:string

    )=>void;

    updateDocumentsField:(

        field:keyof AdmissionForm["documents"],

        value:unknown

    )=>void;

    updateDeclarationField:(

        field:keyof AdmissionForm["declaration"],

        value:string | boolean

    )=>void;

}

const AdmissionContext=createContext<
AdmissionContextType | null
>(null);

const initialData:AdmissionForm={

    office:{

        formNo:"",

        admissionNo:"",

        admissionDate:"",

        counsellingDate:"",

        sessionFrom:"",

        sessionTo:"",

        className:"",

        schoolRollNo:"",

        penNumber:"",

    },

    personal:{

        firstName:"",

        middleName:"",

        lastName:"",

        hindiName:"",

        gender:"",

        dob:"",

        dobInWords:"",

        bloodGroup:"",

        religion:"",

        nationality:"Indian",

        category:"",

        caste:"",

        apaarId:"",

        aadhaar:"",

        height:"",

        weight:"",

        disability:"",

        disabilityCertificateNo:"",

        motherTongue:"",

        birthPlace:"",

        mobile:"",

        email:"",

    },

    parents:{

        fatherName:"",

        fatherMobile:"",

        fatherAadhaar:"",

        fatherOccupation:"",

        fatherQualification:"",

        motherName:"",

        motherMobile:"",

        motherAadhaar:"",

        motherOccupation:"",

        motherQualification:"",

        guardianName:"",

        guardianMobile:"",

        guardianAadhaar:"",

        guardianOccupation:"",

        guardianRelation:"",

    },

    address:{

    permanentAddress:"",

    permanentVillage:"",

    permanentPO:"",

    permanentPS:"",

    permanentDistrict:"",

    permanentState:"",

    permanentPincode:"",

    correspondenceAddress:"",

    correspondenceVillage:"",

    correspondencePO:"",

    correspondencePS:"",

    correspondenceDistrict:"",

    correspondenceState:"",

    correspondencePincode:"",

    sameAsPermanent:true,

},
    academic:{

    applyingClass:"",

    sectionPreference:"",

    medium:"English",

    academicSession:"",

    admissionType:"New",

    house:"",

    rollNumber:"",

    scholarNumber:"",

    previousSchool:"",

    previousAddress:"",

    previousBoard:"",

    previousClass:"",

    passingYear:"",

    percentage:"",

    cgpa:"",

    previousMedium:"",

    tcNumber:"",

    tcDate:"",

    reasonForLeaving:"",

    sports:"",

    music:"",

    dance:"",

    art:"",

    computer:"",

    olympiad:"",

    ncc:"",

    scouts:"",

    achievements:"",

    interviewTakenBy:"",

    counsellingRemarks:"",

    officeRemarks:"",

    specialInstructions:"",

},

    documents:{

        studentPhoto:"",

        parentsPhoto:"",

        guardianPhoto:"",

        studentAadhaar:"",

        motherAadhaar:"",

        fatherAadhaar:"",

        birthCertificate:"",

        transferCertificate:"",

        reportCard:"",

        apaar:"",

        residenceCertificate:"",

        casteCertificate:"",

        incomeCertificate:"",

        motherVoter:"",

        fatherVoter:"",

        motherPAN:"",

        fatherPAN:"",

        medicalCertificate:"",

        musicCertificate:"",

        danceCertificate:"",

        sportsCertificate:"",

        otherDocuments:[],

    },

    declaration:{

        accepted:false,

        place:"",

        date:"",

        studentSignature:"",

        motherSignature:"",

        fatherSignature:"",

    },

};
export function AdmissionProvider({

    children,

}:{

    children:ReactNode;

}){

    const[currentStep,setCurrentStep]=useState(0);

    const[formData,setFormData]=useState(initialData);

    function updateOfficeField(

        field:keyof AdmissionForm["office"],

        value:string

    ){

        setFormData(prev=>({

            ...prev,

            office:{

                ...prev.office,

                [field]:value,

            },

        }));

    }

    function updatePersonalField(

        field:keyof AdmissionForm["personal"],

        value:string

    ){

        setFormData(prev=>({

            ...prev,

            personal:{

                ...prev.personal,

                [field]:value,

            },

        }));

    }

    function updateParentsField(

        field:keyof AdmissionForm["parents"],

        value:string

    ){

        setFormData(prev=>({

            ...prev,

            parents:{

                ...prev.parents,

                [field]:value,

            },

        }));

    }

    function updateAddressField(

        field:keyof AdmissionForm["address"],

        value:string | boolean

    ){

        setFormData(prev=>({

            ...prev,

            address:{

                ...prev.address,

                [field]:value,

            },

        }));

    }

    function updateAcademicField(

        field:keyof AdmissionForm["academic"],

        value:string

    ){

        setFormData(prev=>({

            ...prev,

            academic:{

                ...prev.academic,

                [field]:value,

            },

        }));

    }

    function updateDocumentsField(

        field:keyof AdmissionForm["documents"],

        value:unknown

    ){

        setFormData(prev=>({

            ...prev,

            documents:{

                ...prev.documents,

                [field]:value,

            },

        }));

    }

    function updateDeclarationField(

        field:keyof AdmissionForm["declaration"],

        value:string | boolean

    ){

        setFormData(prev=>({

            ...prev,

            declaration:{

                ...prev.declaration,

                [field]:value,

            },

        }));

    }

    function nextStep(){

        setCurrentStep(prev=>prev+1);

    }

    function previousStep(){

        setCurrentStep(prev=>Math.max(prev-1,0));

    }

    return(

        <AdmissionContext.Provider

            value={{

                currentStep,

                setCurrentStep,

                formData,

                setFormData,

                nextStep,

                previousStep,

                updateOfficeField,

                updatePersonalField,

                updateParentsField,

                updateAddressField,

                updateAcademicField,

                updateDocumentsField,

                updateDeclarationField,

            }}

        >

            {children}

        </AdmissionContext.Provider>

    );

}
export function useAdmission(){

    const context=useContext(AdmissionContext);

    if(!context){

        throw new Error(

            "useAdmission must be used inside AdmissionProvider"

        );

    }

    return context;

}