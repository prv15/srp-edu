import { useState, type FormEvent } from "react";
import { Building2, Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../providers/AuthProvider";
import styles from "./Login.module.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function submit(event: FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            await login(email, password);
            const state = location.state as { from?: string } | null;
            navigate(state?.from || "/dashboard", { replace: true });
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Unable to sign in.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.brandPanel}>
                <div className={styles.brand}>
                    <div className={styles.logo}><GraduationCap size={30} /></div>
                    <div>
                        <strong>TPS Education Cloud</strong>
                        <span>SRPB Group of Institutions</span>
                    </div>
                </div>
                <div className={styles.message}>
                    <span className={styles.eyebrow}>Institution intelligence platform</span>
                    <h1>One secure workspace for every institute.</h1>
                    <p>Admissions, academics, finance and student services—with institute-level isolation built into every workflow.</p>
                </div>
                <div className={styles.institutes}>
                    <span><Building2 size={17} /> SRP School</span>
                    <span><Building2 size={17} /> Teachers’ Training College</span>
                    <span><Building2 size={17} /> Degree College</span>
                </div>
            </section>

            <section className={styles.formPanel}>
                <form className={styles.card} onSubmit={submit}>
                    <div className={styles.cardHeader}>
                        <span className={styles.secure}><LockKeyhole size={16} /> Secure access</span>
                        <h2>Welcome back</h2>
                        <p>Sign in with your institutional account.</p>
                    </div>

                    {error && <div className={styles.error} role="alert">{error}</div>}

                    <label>
                        <span>Email address</span>
                        <div className={styles.input}>
                            <Mail size={19} />
                            <input
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                                placeholder="name@institution.edu"
                                required
                            />
                        </div>
                    </label>

                    <label>
                        <span>Password</span>
                        <div className={styles.input}>
                            <LockKeyhole size={19} />
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className={styles.reveal}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(value => !value)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </label>

                    <button className={styles.loginButton} disabled={submitting}>
                        {submitting ? "Signing in…" : "Sign in to TPS Cloud"}
                    </button>
                    <p className={styles.support}>Account access is managed by your institution administrator.</p>
                </form>
            </section>
        </main>
    );
}
