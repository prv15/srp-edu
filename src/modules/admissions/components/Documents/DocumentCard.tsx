import type { FC } from "react";
import styles from "./Documents.module.css";

interface Props {

    title: string;

    field: string;

    value: string;

    required?: boolean;

    onChange: (

        field: string,

        value: string

    ) => void;

}

const DocumentCard:FC<Props>=({

    title,

    field,

    value,

    required=false,

    onChange,

})=>{

    function handleFileChange(

        e:React.ChangeEvent<HTMLInputElement>

    ){

        const file=e.target.files?.[0];

        if(!file){

            return;

        }

        onChange(

            field,

            file.name

        );

    }

    return(

        <div className={styles.documentCard}>

            <div className={styles.documentHeader}>

                <div>

                    <h4>

                        {title}

                    </h4>

                    <small>

                        {

                            required

                            ?

                            "Required"

                            :

                            "Optional"

                        }

                    </small>

                </div>

                {

                    value

                    &&

                    <span className={styles.uploadedBadge}>

                        Uploaded

                    </span>

                }

            </div>

            <label className={styles.uploadBox}>

                <input

                    type="file"

                    hidden

                    accept=".pdf,.jpg,.jpeg,.png"

                    onChange={handleFileChange}

                />

                {

                    value

                    ?

                    <>

                        <strong>

                            {

                                String(value)

                            }

                        </strong>

                        <span>

                            Click to Replace

                        </span>
                    </>

                    :

                    <>

                        <strong>

                            Choose File

                        </strong>

                        <span>

                            PDF, JPG or PNG

                        </span>
                    </>

                }

            </label>

        </div>

    );

};

export default DocumentCard;