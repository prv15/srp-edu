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

export default function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Protected Layout */}

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