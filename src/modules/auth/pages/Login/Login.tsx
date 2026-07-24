import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {

    const navigate = useNavigate();

    return (

        <div className={styles.container}>

            <button
                className={styles.loginButton}
                onClick={() => navigate("/dashboard")}
            >
                Enter ERP
            </button>

        </div>

    );

}