import type { ComponentType } from "react";
import type { InstituteType } from "../../../contexts/InstituteContext";

import PersonalDetails from "../components/PersonalDetails";
import ParentDetails from "../components/ParentDetails";
import AddressDetails from "../components/AddressDetails";
import AcademicDetails from "../components/AcademicDetails";
import Documents from "../components/Documents";
import Payment from "../components/Payment";
import Review from "../components/Review";
import Success from "../components/Success";

export interface AdmissionStep {

    key: string;

    title: string;

    component: ComponentType;

}

export interface AdmissionWorkflow {

    steps: AdmissionStep[];

}

export const admissionRegistry: Record<
    InstituteType,
    AdmissionWorkflow
> = {

    school: {

        steps: [

            {
                key: "personal",
                title: "Personal",
                component: PersonalDetails,
            },

            {
                key: "parents",
                title: "Parents",
                component: ParentDetails,
            },

            {
                key: "address",
                title: "Address",
                component: AddressDetails,
            },

            {
                key: "academic",
                title: "Academic",
                component: AcademicDetails,
            },

            {
                key: "documents",
                title: "Documents",
                component: Documents,
            },

            {
                key: "payment",
                title: "Payment",
                component: Payment,
            },

            {
                key: "review",
                title: "Review",
                component: Review,
            },
            {
    key: "success",
    title: "Success",
    component: Success,
},

        ],

    },

    training: {

        steps: [

            {
                key: "personal",
                title: "Personal",
                component: PersonalDetails,
            },

            {
                key: "parents",
                title: "Parents",
                component: ParentDetails,
            },

            {
                key: "address",
                title: "Address",
                component: AddressDetails,
            },

            {
                key: "academic",
                title: "Academic",
                component: AcademicDetails,
            },

            {
                key: "documents",
                title: "Documents",
                component: Documents,
            },

            {
                key: "review",
                title: "Review",
                component: Review,
            },

        ],

    },

    degree: {

        steps: [

            {
                key: "personal",
                title: "Personal",
                component: PersonalDetails,
            },

            {
                key: "parents",
                title: "Parents",
                component: ParentDetails,
            },

            {
                key: "address",
                title: "Address",
                component: AddressDetails,
            },

            {
                key: "academic",
                title: "Academic",
                component: AcademicDetails,
            },

            {
                key: "documents",
                title: "Documents",
                component: Documents,
            },

            {
                key: "review",
                title: "Review",
                component: Review,
            },

        ],

    },

};