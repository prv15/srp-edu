import TextField from "../TextField/TextField";

import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

    required?:boolean;

    error?:string;

}

export default function AadhaarField(props:Props){

    return(

        <TextField

            maxLength={12}

            inputMode="numeric"

            {...props}

        />

    );

}