import type { StudentProfile } from "../../../types/student";
import styles from "./ParentTab.module.css";

type Props = {
    student: StudentProfile;
};

const Card = ({
    title,
    icon,
    items
}:{
    title:string;
    icon:string;
    items:{
        label:string;
        value:string | undefined | null;
    }[];
})=>{

    return(

        <div className={styles.card}>

            <h2>

                <span>{icon}</span>

                {title}

            </h2>

            <div className={styles.grid}>

                {items.map(item=>(

                    <div
                        key={item.label}
                        className={styles.item}
                    >

                        <label>{item.label}</label>

                        <p>

                            {item.value || "Not Available"}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default function ParentTab({
    student
}:Props){

    return(

        <div className={styles.wrapper}>

            <Card

                title="Father Information"

                icon="👨"

                items={[

                    {
                        label:"Father Name",
                        value:student.father_name
                    },

                    {
                        label:"Mobile",
                        value:student.father_mobile
                    },

                    {
                        label:"Occupation",
                        value:student.father_occupation
                    },

                    {
                        label:"Email",
                        value:student.father_email
                    }

                ]}

            />

            <Card

                title="Mother Information"

                icon="👩"

                items={[

                    {
                        label:"Mother Name",
                        value:student.mother_name
                    },

                    {
                        label:"Mobile",
                        value:student.mother_mobile
                    },

                    {
                        label:"Occupation",
                        value:student.mother_occupation
                    },

                    {
                        label:"Email",
                        value:student.mother_email
                    }

                ]}

            />

            <Card

                title="Guardian Information"

                icon="🛡"

                items={[

                    {
                        label:"Guardian",
                        value:student.guardian_name
                    },

                    {
                        label:"Relation",
                        value:student.guardian_relation
                    },

                    {
                        label:"Mobile",
                        value:student.guardian_mobile
                    },

                    {
                        label:"Email",
                        value:student.guardian_email
                    }

                ]}

            />

        </div>

    );

}