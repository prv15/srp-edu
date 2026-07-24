import type { InputHTMLAttributes } from "react";

import { Phone } from "lucide-react";

import TextField from "../TextField";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

    required?:boolean;

    helperText?:string;

    error?:string;

}

export default function PhoneField({

    ...props

}:Props){

    return(

        <TextField

            {...props}

            type="tel"

            inputMode="numeric"

            maxLength={10}

            leftIcon={<Phone size={18}/>}

            placeholder="9876543210"

        />

    );

}