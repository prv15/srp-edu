import { Upload, FileText, CheckCircle2 } from "lucide-react";

import styles from "./DocumentUploadCard.module.css";

interface Props{

    title:string;

    required?:boolean;

    fileName?:string;

    onUpload?:(file:File)=>void;

}

export default function DocumentUploadCard({

    title,

    required,

    fileName,

    onUpload,

}:Props){

    function handleChange(

        e:React.ChangeEvent<HTMLInputElement>

    ){

        const file=e.target.files?.[0];

        if(file && onUpload){

            onUpload(file);

        }

    }

    return(

        <div className={styles.card}>

            {

                fileName

                ?

                <>

                    <CheckCircle2

                        size={42}

                        className={styles.success}

                    />

                    <h4>

                        {title}

                    </h4>

                    <p>

                        {fileName}

                    </p>

                </>

                :

                <>

                    <FileText size={42}/>

                    <h4>

                        {title}

                    </h4>

                    <p>

                        {

                            required

                            ?

                            "Required Document"

                            :

                            "Optional Document"

                        }

                    </p>

                </>

            }

            <label className={styles.button}>

                <Upload size={18}/>

                {

                    fileName

                    ?

                    "Replace File"

                    :

                    "Upload File"

                }

                <input

                    type="file"

                    hidden

                    onChange={handleChange}

                />

            </label>

        </div>

    );

}