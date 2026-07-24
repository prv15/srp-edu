import styles from "./Avatar.module.css";

interface AvatarProps{

    name:string;

    image?:string;

    size?:"sm"|"md"|"lg";

}

export default function Avatar({

    name,

    image,

    size="md",

}:AvatarProps){

    const initials=name

        .split(" ")

        .map(word=>word.charAt(0))

        .join("")

        .substring(0,2)

        .toUpperCase();

    return(

        <div
            className={`${styles.avatar} ${styles[size]}`}
        >

            {

                image

                ?

                (

                    <img

                        src={image}

                        alt={name}

                    />

                )

                :

                (

                    initials

                )

            }

        </div>

    );

}