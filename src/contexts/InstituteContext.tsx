import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export type InstituteType =
    | "school"
    | "training"
    | "degree";

export interface Institute {

    id:number;

    code:InstituteType;

    name:string;

    shortName:string;

    session:string;

}

const institutes:Institute[]=[

    {

        id:1,

        code:"school",

        name:"SRP School",

        shortName:"School",

        session:"2026-2027"

    },

    {

        id:2,

        code:"training",

        name:"SRP Teachers Training College",

        shortName:"Training",

        session:"2026-2027"

    },

    {

        id:3,

        code:"degree",

        name:"SRP Degree College",

        shortName:"Degree",

        session:"2026-2027"

    }

];

interface InstituteContextType{

    institute:Institute;

    institutes:Institute[];

    setInstitute:(institute:Institute)=>void;

}

const InstituteContext=createContext<InstituteContextType | null>(null);

export function InstituteProvider({

    children,

}:{

    children:ReactNode;

}){

    const [institute,setInstitute]=useState<Institute>(institutes[0]);

    return(

        <InstituteContext.Provider

            value={{

                institute,

                institutes,

                setInstitute,

            }}

        >

            {children}

        </InstituteContext.Provider>

    );

}

export function useInstitute(){

    const context=useContext(InstituteContext);

    if(!context){

        throw new Error(

            "useInstitute must be used inside InstituteProvider"

        );

    }

    return context;

}