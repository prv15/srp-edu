import { Search } from "lucide-react";

import type { InputHTMLAttributes } from "react";

import TextField from "../TextField";

interface Props extends InputHTMLAttributes<HTMLInputElement>{

    label?:string;

}

export default function SearchField({

    label="Search",

    placeholder="Search...",

    ...props

}:Props){

    return(

        <TextField

            {...props}

            label={label}

            placeholder={placeholder}

            leftIcon={<Search size={18}/>}

        />

    );

}