import type { InputHTMLAttributes } from "react";

import { Mail } from "lucide-react";

import TextField from "../TextField";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

    required?:boolean;

    helperText?:string;

    error?:string;

}

export default function EmailField({

    ...props

}:Props){

    return(

        <TextField

            {...props}

            type="email"

            leftIcon={<Mail size={18}/>}

            placeholder="student@email.com"

        />

    );

}