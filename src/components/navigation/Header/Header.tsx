import {
    Bell,
    Building2,
    Calendar,
    ChevronDown,
    Search,
    Settings,
    User
} from "lucide-react";
import { useInstitute } from "../../../contexts/InstituteContext";
import styles from "./Header.module.css";

export default function Header() {
    const {
    institute,
    institutes,
    setInstitute
} = useInstitute();

    return (

        <header className={styles.header}>

            <div className={styles.search}>

                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search students, admissions, staff..."
                />

            </div>

            <div className={styles.right}>

                <div className={styles.selector}>

    <Building2 size={18} />

    <select

        value={institute.code}

        onChange={(e)=>{

            const selected=institutes.find(

                i=>i.code===e.target.value

            );

            if(selected){

                setInstitute(selected);

            }

        }}

    >

        {institutes.map(item=>(

            <option

                key={item.id}

                value={item.code}

            >

                {item.name}

            </option>

        ))}

    </select>

</div>

                <button className={styles.selector}>

                    <Calendar size={18} />

                    <span>2026–2027</span>

                    <ChevronDown size={16} />

                </button>

                <button className={styles.iconButton}>

                    <Bell size={20} />

                    <span className={styles.badge}>3</span>

                </button>

                <button className={styles.iconButton}>

                    <Settings size={20} />

                </button>

                <button className={styles.profile}>

                    <div className={styles.avatar}>

                        <User size={18} />

                    </div>

                    <div className={styles.info}>

                        <strong>Prakash Raj</strong>

                        <span>Administrator</span>

                    </div>

                    <ChevronDown size={16} />

                </button>

            </div>

        </header>

    );

}