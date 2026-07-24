import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { BookOpen, Building2, CalendarRange, GraduationCap, Plus, X } from "lucide-react";
import { useInstitute } from "../../../contexts/InstituteContext";
import { useAuth } from "../../../providers/AuthProvider";
import { apiRequest } from "../../../services/api";
import styles from "./AcademicCatalog.module.css";

type Department = {
    id: number;
    name: string;
    code?: string;
    student_count: number;
};

type Course = {
    id: number;
    course_name: string;
    duration?: number;
    status: number;
    department_name?: string;
    student_count: number;
};

type Session = {
    id: number;
    session_name: string;
    start_year?: number;
    end_year?: number;
    status: string;
    student_count: number;
};

type Catalog = {
    departments: Department[];
    courses: Course[];
    sessions: Session[];
    semesters: Array<{
        id: number; course_id: number; semester_no: number; name: string; admission_session: string;
        status: string; course_name: string; subject_count: number;
    }>;
    subjects: Array<{
        id: number; code: string; name: string; paper_category?: string;
        paper_title?: string; delivery_type: string; max_cia_marks?: number;
        course_name: string; semester_name: string;
    }>;
    affiliations: Array<{ name: string; authority_type: string; affiliation_no?: string }>;
};

type View = "courses" | "departments" | "sessions" | "semesters" | "subjects";

export default function AcademicCatalog({ view }: { view: View }) {
    const { institute } = useInstitute();
    return (
        <AcademicCatalogContent
            key={`${institute.id}-${view}`}
            view={view}
            institute={institute}
        />
    );
}

function AcademicCatalogContent({
    view,
    institute,
}: {
    view: View;
    institute: ReturnType<typeof useInstitute>["institute"];
}) {
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [saving, setSaving] = useState(false);
    const { can } = useAuth();

    const load = useCallback((signal?: AbortSignal) => {
        return apiRequest<Catalog>("academics/catalog.php", {
            instituteId: institute.id,
            signal,
        }).then(setCatalog);
    }, [institute.id]);

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal).catch(cause => {
            if (cause instanceof DOMException && cause.name === "AbortError") return;
            setError(cause instanceof Error ? cause.message : "Academic data is unavailable.");
        });
        return () => controller.abort();
    }, [load]);

    async function createAcademicItem(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setSaving(true);
        setError("");
        try {
            await apiRequest("academics/catalog.php", {
                instituteId: institute.id,
                method: "POST",
                body: {
                    action: view === "courses" ? "create_course" : "create_subject",
                    ...Object.fromEntries(form.entries()),
                },
            });
            setShowCreate(false);
            await load();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Unable to save academic item.");
        } finally {
            setSaving(false);
        }
    }

    const configuration = {
        courses: {
            title: "Courses",
            description: `Programmes configured for ${institute.name}`,
            icon: GraduationCap,
        },
        departments: {
            title: "Departments",
            description: `Academic departments and enrolled students in ${institute.name}`,
            icon: Building2,
        },
        sessions: {
            title: "Academic Sessions",
            description: `Cohorts and academic periods for ${institute.name}`,
            icon: CalendarRange,
        },
        semesters: {
            title: "Semesters & Sections",
            description: `University semester structure and teaching groups for ${institute.name}`,
            icon: CalendarRange,
        },
        subjects: {
            title: "Subjects & Papers",
            description: `CBCS paper catalogue configured for ${institute.name}`,
            icon: BookOpen,
        },
    }[view];
    const Icon = configuration.icon;

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headingIcon}><Icon size={24} /></div>
                <div className={styles.headingCopy}>
                    <span>Academics</span>
                    <h1>{configuration.title}</h1>
                    <p>{configuration.description}</p>
                </div>
                {can("academics.manage") && (view === "courses" || view === "subjects") && (
                    <button className={styles.addButton} onClick={() => setShowCreate(true)}>
                        <Plus size={17} /> Add {view === "courses" ? "course" : "subject"}
                    </button>
                )}
            </header>

            {catalog?.affiliations.length ? (
                <section className={styles.affiliation}>
                    <GraduationCap size={18} />
                    <span>Affiliated authority</span>
                    <strong>{catalog.affiliations.map(item => item.name).join(", ")}</strong>
                </section>
            ) : null}

            {error && <div className={styles.error} role="alert">{error}</div>}
            {!catalog && !error && <div className={styles.skeleton}><i /><i /><i /></div>}

            {catalog && view === "departments" && (
                <CatalogGrid empty="No departments are configured for this institute.">
                    {catalog.departments.map(item => (
                        <article className={styles.card} key={item.id}>
                            <Building2 size={20} />
                            <div><h2>{item.name}</h2><p>{item.code || "Department"}</p></div>
                            <strong>{Number(item.student_count).toLocaleString("en-IN")} <small>students</small></strong>
                        </article>
                    ))}
                </CatalogGrid>
            )}

            {catalog && view === "courses" && (
                <CatalogGrid empty="No courses are configured for this institute.">
                    {catalog.courses.map(item => (
                        <article className={styles.card} key={item.id}>
                            <BookOpen size={20} />
                            <div>
                                <h2>{item.course_name}</h2>
                                <p>{item.department_name || "Department not assigned"} · {item.duration ? `${item.duration} years` : "Duration not set"}</p>
                            </div>
                            <strong>{Number(item.student_count).toLocaleString("en-IN")} <small>students</small></strong>
                        </article>
                    ))}
                </CatalogGrid>
            )}

            {catalog && view === "sessions" && (
                <CatalogGrid empty="No academic sessions are configured for this institute.">
                    {catalog.sessions.map(item => (
                        <article className={styles.card} key={item.id}>
                            <CalendarRange size={20} />
                            <div>
                                <h2>{item.session_name}</h2>
                                <p>{item.start_year && item.end_year ? `${item.start_year} to ${item.end_year}` : "Dates not set"} · {item.status}</p>
                            </div>
                            <strong>{Number(item.student_count).toLocaleString("en-IN")} <small>students</small></strong>
                        </article>
                    ))}
                </CatalogGrid>
            )}

            {catalog && view === "semesters" && (
                <CatalogGrid empty="No semester structure is configured for this institute.">
                    {catalog.semesters.map(item => (
                        <article className={styles.card} key={item.id}>
                            <CalendarRange size={20} />
                            <div>
                                <h2>{item.course_name} · {item.name}</h2>
                                <p>{item.admission_session} admission cycle · {item.status}</p>
                            </div>
                            <strong>{Number(item.subject_count).toLocaleString("en-IN")} <small>papers</small></strong>
                        </article>
                    ))}
                </CatalogGrid>
            )}

            {catalog && view === "subjects" && (
                catalog.subjects.length ? (
                    <section className={styles.tableWrap}>
                        <table>
                            <thead><tr><th>Code</th><th>Subject / paper</th><th>Category</th><th>Programme</th><th>Semester</th><th>Type</th><th>CIA marks</th></tr></thead>
                            <tbody>{catalog.subjects.map(item => (
                                <tr key={item.id}>
                                    <td><code>{item.code}</code></td>
                                    <td><strong>{item.name}</strong><small>{item.paper_title}</small></td>
                                    <td>{item.paper_category || "—"}</td>
                                    <td>{item.course_name}</td>
                                    <td>{item.semester_name}</td>
                                    <td>{item.delivery_type}</td>
                                    <td>{item.max_cia_marks ?? "—"}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </section>
                ) : <section className={styles.empty}><BookOpen size={28} /><h2>No subjects configured</h2><p>Subjects will appear here after an approved curriculum is added.</p></section>
            )}

            {showCreate && catalog && (
                <div className={styles.backdrop}>
                    <form className={styles.form} onSubmit={createAcademicItem}>
                        <div className={styles.formHeader}>
                            <div>
                                <h2>Add {view === "courses" ? "course" : "subject"}</h2>
                                <p>This record will belong only to {institute.name}.</p>
                            </div>
                            <button type="button" aria-label="Close" onClick={() => setShowCreate(false)}><X /></button>
                        </div>
                        {view === "courses" ? (
                            <>
                                <label>Course / programme name<input name="course_name" required placeholder="e.g. Bachelor of Business Administration" /></label>
                                <label>Department<select name="department_id" required defaultValue=""><option value="" disabled>Select department</option>{catalog.departments.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                                <label>Duration in years<input name="duration" type="number" min="1" max="8" required /></label>
                                <p className={styles.formNote}>Semesters and January/July cycles are generated automatically for Degree and Training colleges. School programmes use the annual cycle.</p>
                            </>
                        ) : (
                            <>
                                <label>Programme and semester<select name="semester_id" required defaultValue=""><option value="" disabled>Select semester</option>{catalog.semesters.map(item => <option key={item.id} value={item.id}>{item.course_name} · {item.name}</option>)}</select></label>
                                <label>Subject code<input name="code" required placeholder="e.g. U11012" /></label>
                                <label>Subject name<input name="name" required /></label>
                                <label>Paper category<select name="paper_category" defaultValue=""><option value="">Not specified</option>{["MJC","MIC","MDC","SEC","VAC","AEC"].map(value => <option key={value}>{value}</option>)}</select></label>
                                <label className={styles.full}>Paper / topic title<input name="paper_title" /></label>
                                <label>Delivery type<select name="delivery_type"><option>Theory</option><option>Practical</option><option>Theory and Practical</option></select></label>
                                <label>Credits<input name="credits" type="number" min="0" step=".5" /></label>
                                <label>Maximum CIA marks<input name="max_cia_marks" type="number" min="0" step=".01" /></label>
                                <label>Maximum university marks<input name="max_university_marks" type="number" min="0" step=".01" /></label>
                            </>
                        )}
                        <div className={styles.formActions}>
                            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button type="submit" disabled={saving}>{saving ? "Saving…" : `Create ${view === "courses" ? "course" : "subject"}`}</button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

function CatalogGrid({
    children,
    empty,
}: {
    children: ReactNode[];
    empty: string;
}) {
    return children.length
        ? <section className={styles.grid}>{children}</section>
        : <section className={styles.empty}><BookOpen size={28} /><h2>Nothing configured yet</h2><p>{empty}</p></section>;
}
