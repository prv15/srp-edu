import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../modules/auth/pages/Login";
import AppLayout from "../layouts/AppLayout";

import Dashboard from "../modules/dashboard/pages/Dashboard";

// Students
import StudentList from "../modules/students/pages/StudentList";
import StudentProfile from "../modules/students/pages/StudentProfile";

// Admissions
import NewAdmission from "../modules/admissions/pages/NewAdmission";
import SchoolAdmission from "../modules/admissions/pages/SchoolAdmission";
import DegreeAdmission from "../modules/admissions/pages/DegreeAdmission";
import TrainingAdmission from "../modules/admissions/pages/TrainingAdmission";
import ImportStudents from "../modules/admissions/pages/ImportStudents";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import AcademicCatalog from "../modules/academics/pages/AcademicCatalog";
import FacultyDirectory from "../modules/faculty/pages/FacultyDirectory";
import ExaminationOverview from "../modules/examinations/pages/ExaminationOverview";

export default function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route element={<AuthRoute />}>
                    <Route path="/" element={<Login />} />
                </Route>

                {/* Protected Layout */}

                <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>

                    {/* Dashboard */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    {/* Students */}

                    <Route
                        path="/students"
                        element={<StudentList />}
                    />

                    <Route
                        path="/students/profile/:id"
                        element={<StudentProfile />}
                    />

                    {/* Admissions */}

                    <Route
                        path="/admissions/new"
                        element={<NewAdmission />}

                    />

                    <Route
                        path="/admissions/school"
                        element={<SchoolAdmission />}
                    />

                    <Route
                        path="/admissions/degree"
                        element={<DegreeAdmission />}
                    />

                    <Route
                        path="/admissions/training"
                        element={<TrainingAdmission />}
                    />

                    <Route
                        path="/admissions/import"
                        element={<ImportStudents />}
                    />

                    <Route path="/academics/courses" element={<AcademicCatalog view="courses" />} />
                    <Route path="/academics/subjects" element={<AcademicCatalog view="subjects" />} />
                    <Route path="/academics/semesters" element={<AcademicCatalog view="semesters" />} />
                    <Route path="/faculty" element={<FacultyDirectory />} />
                    <Route path="/faculty/departments" element={<AcademicCatalog view="departments" />} />
                    <Route path="/examinations" element={<ExaminationOverview />} />

                </Route>
                </Route>

                {/* Unknown Routes */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}
