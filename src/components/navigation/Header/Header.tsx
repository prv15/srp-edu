import {
    Bell,
    Building2,
    Calendar,
    ChevronDown,
    Search,
    Settings,
    User,
    Menu
} from "lucide-react";
import { useInstitute } from "../../../contexts/InstituteContext";
import { useAuth } from "../../../providers/AuthProvider";
import styles from "./Header.module.css";

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
    const { user } = useAuth();
    const {
    institute,
    institutes,
    setInstitute
} = useInstitute();

    return (

        <header className={styles.header}>
            <button className={styles.menuButton} aria-label="Open navigation" onClick={onMenuToggle}>
                <Menu size={21} />
            </button>

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

                    <span>{institute.academicYear}</span>

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

                        <strong>{user?.name || "User"}</strong>

                        <span>{user?.role_name || "Authorized user"}</span>

                    </div>

                    <ChevronDown size={16} />

                </button>

            </div>

        </header>

    );

}
