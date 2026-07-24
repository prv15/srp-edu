import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInstitute } from "../../../../contexts/InstituteContext";
import { getStudents } from "../../services/student.service";
import type { Student } from "../../types/student";
import type { DataColumn } from "../../../../components/layout/DataTable";
import { Plus, Download } from "lucide-react";

import PageHeader from "../../../../components/layout/PageHeader";
import PageContent from "../../../../components/layout/PageContent";
import StatsGrid from "../../../../components/layout/StatsGrid";
import StatsCard from "../../../../components/layout/StatsCard";
import ActionBar from "../../../../components/layout/ActionBar";
import DataTable from "../../../../components/layout/DataTable";

import SearchField from "../../../../components/forms/SearchField";
import SelectField from "../../../../components/forms/SelectField";

import Button from "../../../../components/ui/Button";

import Badge from "../../../../components/ui/Badge";

import Avatar from "../../../../components/ui/Avatar";
import StudentPagination from "../../components/StudentPagination/StudentPagination";

export default function StudentList(){
    const { institute } = useInstitute();
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 25;

useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
        setLoading(true);
        setError("");
        try {
            const result = await getStudents(institute.id, controller.signal);

            setStudents(result);

        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            console.error("Failed to load students", error);
            setError(error instanceof Error ? error.message : "Unable to load students.");

        } finally {
            if (!controller.signal.aborted) setLoading(false);

        }

    }

    loadStudents();
    return () => controller.abort();

}, [institute.id]);

    const courses = useMemo(
        () => [...new Set(students.map(student => student.course).filter(Boolean))]
            .sort()
            .map(value => ({ label: value, value })),
        [students],
    );
    const academicYears = useMemo(
        () => [...new Set(students.map(student => student.academicYear).filter(Boolean) as string[])]
            .sort()
            .map(value => ({ label: value, value })),
        [students],
    );
    const visibleStudents = useMemo(() => {
        const needle = search.trim().toLocaleLowerCase();
        return students.filter(student => {
            const matchesSearch = !needle || [
                student.admissionNo,
                student.rollNo,
                student.firstName,
                student.lastName,
                student.fatherName,
                student.mobile,
                student.email,
                student.course,
                student.department,
                student.academicYear,
                student.status,
            ].some(value => String(value || "").toLocaleLowerCase().includes(needle));
            return matchesSearch
                && (!course || student.course === course)
                && (!academicYear || student.academicYear === academicYear);
        });
    }, [academicYear, course, search, students]);

    const today = new Date().toISOString().slice(0, 10);
    const pageCount = Math.max(1, Math.ceil(visibleStudents.length / pageSize));
    const safePage = Math.min(page, pageCount);
    const pagedStudents = visibleStudents.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
    );
    const columns: DataColumn<Student>[] = [

    {

        key: "student",

        title: "Student",
render: (row: Student) => (

    <div
        onClick={() => navigate(`/students/profile/${row.id}`)}
        style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer"
        }}
    >

                <Avatar
                    name={`${row.firstName} ${row.lastName}`}
                />

                <div>

                    <strong>

                        {row.firstName} {row.lastName}

                    </strong>

                    <div
                        style={{
                            fontSize: 12,
                            color: "#64748b",
                        }}
                    >

                        {row.admissionNo}

                    </div>

                </div>

            </div>

        ),

    },

    {

        key: "course",

        title: "Class",

    },

    {

        key: "fatherName",

        title: "Father",

    },

    {

        key: "mobile",

        title: "Mobile",

    },

    {

        key: "status",

        title: "Status",

        render: (row: Student) =>

            row.status === "Active" ? (

                <Badge variant="success">

                    Active

                </Badge>

            ) : (

                <Badge variant="danger">

                    {row.status}

                </Badge>

            ),

    },

];

    return(

        <>

            <PageHeader
    title={`${institute.name} Students`}
    description={`Manage all enrolled students of ${institute.name}`}
/>

            <PageContent>

                <StatsGrid>

                    <StatsCard

                        title="Students"

                        value={students.length}

                    />

                    <StatsCard

                        title="Boys"

                        value={students.filter(student => student.gender === "Male").length}

                    />

                    <StatsCard

                        title="Girls"

                        value={students.filter(student => student.gender === "Female").length}

                    />

                    <StatsCard

                        title="Today's Admission"

                        value={students.filter(student => student.admissionDate === today).length}

                    />

                </StatsGrid>

                <ActionBar

                    left={

                        <>

                            <SearchField
                                value={search}
                                onChange={event => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Admission no., roll no., name, mobile, course..."
                            />

                            <SelectField

                                label="Class"
                                value={course}
                                onChange={event => {
                                    setCourse(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="All courses"
                                options={courses}

                            />

                            <SelectField

                                label="Academic year"
                                value={academicYear}
                                onChange={event => {
                                    setAcademicYear(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="All academic years"
                                options={academicYears}

                            />

                        </>

                    }

                    right={

                        <>

                            <Button
                                variant="secondary"
                                icon={<Download size={18}/>}
                            >

                                Export

                            </Button>

                            <Button
                                icon={<Plus size={18}/>}
                            >

                                Add Student

                            </Button>

                        </>

                    }

                />

                <DataTable

                    columns={columns}

                    data={pagedStudents}
                    loading={loading}
                    emptyMessage={error || "No students match the selected filters."}

                />

                {!loading && !error && (
                    <StudentPagination
                        page={safePage}
                        pageSize={pageSize}
                        total={visibleStudents.length}
                        onPageChange={setPage}
                    />
                )}

            </PageContent>

        </>

    );

}
