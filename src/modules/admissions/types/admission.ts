export interface AdmissionForm {

    office:{

        formNo:string;

        admissionNo:string;

        admissionDate:string;

        counsellingDate:string;

        sessionFrom:string;

        sessionTo:string;

        className:string;

        schoolRollNo:string;

        penNumber:string;

    };

    personal:{

        firstName:string;

        middleName:string;

        lastName:string;

        hindiName:string;

        gender:string;

        dob:string;

        dobInWords:string;

        bloodGroup:string;

        religion:string;

        nationality:string;

        category:string;

        caste:string;

        apaarId:string;

        aadhaar:string;

        height:string;

        weight:string;

        disability:string;

        disabilityCertificateNo:string;

        motherTongue:string;

        birthPlace:string;

        mobile:string;

        email:string;

    };

    parents:{

        fatherName:string;

        fatherMobile:string;

        fatherAadhaar:string;

        fatherOccupation:string;

        fatherQualification:string;

        motherName:string;

        motherMobile:string;

        motherAadhaar:string;

        motherOccupation:string;

        motherQualification:string;

        guardianName:string;

        guardianMobile:string;

        guardianAadhaar:string;

        guardianOccupation:string;

        guardianRelation:string;

    };

    address:{

    permanentAddress:string;

    permanentVillage:string;

    permanentPO:string;

    permanentPS:string;

    permanentDistrict:string;

    permanentState:string;

    permanentPincode:string;

    correspondenceAddress:string;

    correspondenceVillage:string;

    correspondencePO:string;

    correspondencePS:string;

    correspondenceDistrict:string;

    correspondenceState:string;

    correspondencePincode:string;

    sameAsPermanent:boolean;

};

    academic:{

    /* Current Admission */

    applyingClass:string;

    sectionPreference:string;

    medium:string;

    academicSession:string;

    admissionType:string;

    house:string;

    rollNumber:string;

    scholarNumber:string;

    /* Previous Academic Record */

    previousSchool:string;

    previousAddress:string;

    previousBoard:string;

    previousClass:string;

    passingYear:string;

    percentage:string;

    cgpa:string;

    previousMedium:string;

    tcNumber:string;

    tcDate:string;

    reasonForLeaving:string;

    /* Student Interests */

    sports:string;

    music:string;

    dance:string;

    art:string;

    computer:string;

    olympiad:string;

    ncc:string;

    scouts:string;

    achievements:string;

    /* Office */

    interviewTakenBy:string;

    counsellingRemarks:string;

    officeRemarks:string;

    specialInstructions:string;

};

    documents:{

        studentPhoto:string;

        parentsPhoto:string;

        guardianPhoto:string;

        studentAadhaar:string;

        motherAadhaar:string;

        fatherAadhaar:string;

        birthCertificate:string;

        transferCertificate:string;

        reportCard:string;

        apaar:string;

        residenceCertificate:string;

        casteCertificate:string;

        incomeCertificate:string;

        motherVoter:string;

        fatherVoter:string;

        motherPAN:string;

        fatherPAN:string;

        medicalCertificate:string;

        musicCertificate:string;

        danceCertificate:string;

        sportsCertificate:string;

        otherDocuments:string[];

    };

    declaration:{

        accepted:boolean;

        place:string;

        date:string;

        studentSignature:string;

        motherSignature:string;

        fatherSignature:string;

    };

}