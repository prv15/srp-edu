import { useCallback, useEffect, useState, type FormEvent } from "react";
import { GraduationCap, Plus, X } from "lucide-react";
import { useInstitute } from "../../../contexts/InstituteContext";
import { apiRequest } from "../../../services/api";
import styles from "./FacultyDirectory.module.css";

type Faculty = {
    id: number; employee_id: string; name: string; designation?: string;
    email?: string; mobile?: string; qualification?: string; employment_type: string;
    status: string; department_name?: string; subject_count: number;
};

export default function FacultyDirectory() {
    const { institute } = useInstitute();
    return <Directory key={institute.id} instituteId={institute.id} instituteName={institute.name} />;
}

function Directory({ instituteId, instituteName }: { instituteId: number; instituteName: string }) {
    const [faculty, setFaculty] = useState<Faculty[] | null>(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const load = useCallback(
        () => apiRequest<Faculty[]>("faculty/list.php", { instituteId })
            .then(setFaculty)
            .catch(cause => setError(cause instanceof Error ? cause.message : "Unable to load faculty.")),
        [instituteId],
    );

    useEffect(() => { void load(); }, [load]);

    async function create(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setError("");
        try {
            await apiRequest("faculty/list.php", {
                instituteId,
                method: "POST",
                body: Object.fromEntries(form.entries()),
            });
            setShowForm(false);
            await load();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Unable to create faculty member.");
        }
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div><span>People & teaching</span><h1>Faculty Directory</h1><p>Faculty records and subject workload for {instituteName}</p></div>
                <button onClick={() => setShowForm(true)}><Plus size={17} /> Add faculty</button>
            </header>
            {error && <div className={styles.error}>{error}</div>}
            {!faculty && !error && <div className={styles.loading}>Loading faculty directory…</div>}
            {faculty?.length === 0 && <section className={styles.empty}><GraduationCap size={30} /><h2>No faculty records yet</h2><p>Add verified faculty records for this institute. No placeholder staff are generated.</p></section>}
            {faculty && faculty.length > 0 && <section className={styles.grid}>{faculty.map(person => (
                <article key={person.id} className={styles.card}>
                    <div className={styles.avatar}>{person.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</div>
                    <div><h2>{person.name}</h2><p>{person.designation || "Designation not set"}</p></div>
                    <span>{person.status}</span>
                    <dl><div><dt>Employee ID</dt><dd>{person.employee_id}</dd></div><div><dt>Department</dt><dd>{person.department_name || "Not assigned"}</dd></div><div><dt>Subjects</dt><dd>{person.subject_count}</dd></div><div><dt>Type</dt><dd>{person.employment_type}</dd></div></dl>
                </article>
            ))}</section>}
            {showForm && <div className={styles.backdrop}><form className={styles.form} onSubmit={create}>
                <div className={styles.formHeader}><div><h2>Add faculty member</h2><p>Create a verified institute-specific employee record.</p></div><button type="button" onClick={() => setShowForm(false)}><X /></button></div>
                <label>Employee ID<input name="employee_id" required /></label>
                <label>Full name<input name="name" required /></label>
                <label>Designation<input name="designation" /></label>
                <label>Qualification<input name="qualification" /></label>
                <label>Email<input name="email" type="email" /></label>
                <label>Mobile<input name="mobile" inputMode="tel" /></label>
                <label>Employment type<select name="employment_type"><option>Permanent</option><option>Contract</option><option>Guest</option><option>Visiting</option></select></label>
                <label>Joining date<input name="joining_date" type="date" /></label>
                <div className={styles.actions}><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit">Create faculty</button></div>
            </form></div>}
        </main>
    );
}
