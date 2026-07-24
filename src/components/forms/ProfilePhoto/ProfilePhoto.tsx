import { Camera, Upload } from "lucide-react";


import styles from "./ProfilePhoto.module.css";

interface ProfilePhotoProps {

    title?: string;

    subtitle?: string;

    image?: string;

    onChange?: (
        file: File
    ) => void;

}

export default function ProfilePhoto({

    title = "Student Photo",

    subtitle = "Recent passport-size photograph",

    image,

    onChange,

}: ProfilePhotoProps) {

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ){

        const file = e.target.files?.[0];

        if(file && onChange){

            onChange(file);

        }

    }

    return(

        <div className={styles.card}>

            <div className={styles.preview}>

                {

                    image ?

                        (

                            <img

                                src={image}

                                alt="Student"

                            />

                        )

                        :

                        (

                            <Camera size={54} />

                        )

                }

            </div>

            <h4>

                {title}

            </h4>

            <p>

                {subtitle}

            </p>

            <label className={styles.upload}>

                <Upload size={18}/>

                Upload Photo

                <input

                    type="file"

                    accept="image/*"

                    hidden

                    onChange={handleChange}

                />

            </label>

            <small>

                JPG • PNG • Maximum 2 MB

            </small>

        </div>

    );

}