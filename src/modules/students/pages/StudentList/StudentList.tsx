import { useState, useEffect } from "react";
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

export default function StudentList(){
    const { institute } = useInstitute();
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

    async function loadStudents() {

        try {

            const result = await getStudents(institute.id);

            setStudents(result);

        } catch (error) {

            console.error("Failed to load students", error);

        } finally {

            setLoading(false);

        }

    }

    loadStudents();

}, [institute.id]);
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

if (loading) {

    return (

        <PageContent>

            <h3>Loading students...</h3>

        </PageContent>

    );

}

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

                        value={18}

                    />

                </StatsGrid>

                <ActionBar

                    left={

                        <>

                            <SearchField/>

                            <SelectField

                                label="Class"

                                options={[]}

                            />

                            <SelectField

                                label="Section"

                                options={[]}

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

                    data={students}

                />

            </PageContent>

        </>

    );

}