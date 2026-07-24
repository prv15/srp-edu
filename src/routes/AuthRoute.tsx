import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function AuthRoute() {
    const { user, loading } = useAuth();
    if (loading) return <div role="status">Loading TPS Education Cloud…</div>;
    return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
