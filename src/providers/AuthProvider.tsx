/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { authRequest, setCsrfToken } from "../services/api";

export type AuthInstitute = {
    id: number;
    code: "school" | "training" | "degree";
    name: string;
};

type AuthUser = {
    id: number;
    name: string;
    email: string;
    employee_id?: string;
    role_code: string;
    role_name: string;
};

type SessionData = {
    user: AuthUser;
    institutes: AuthInstitute[];
    permissions: string[];
    csrf_token: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    institutes: AuthInstitute[];
    permissions: string[];
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    can: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);

    const applySession = useCallback((data: SessionData | null) => {
        setCsrfToken(data?.csrf_token || "");
        setSession(data);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        authRequest<SessionData>("auth/me.php", { signal: controller.signal })
            .then(applySession)
            .catch(() => applySession(null))
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [applySession]);

    const login = useCallback(async (email: string, password: string) => {
        const result = await authRequest<{ csrf_token: string }>("auth/login.php", {
            method: "POST",
            body: { email, password },
        });
        setCsrfToken(result.csrf_token);
        applySession(await authRequest<SessionData>("auth/me.php"));
    }, [applySession]);

    const logout = useCallback(async () => {
        await authRequest("auth/logout.php", { method: "POST", body: {} });
        applySession(null);
    }, [applySession]);

    const value = useMemo<AuthContextValue>(() => ({
        user: session?.user || null,
        institutes: session?.institutes || [],
        permissions: session?.permissions || [],
        loading,
        login,
        logout,
        can: permission =>
            session?.permissions.includes("*")
            || session?.permissions.includes(permission)
            || false,
    }), [loading, login, logout, session]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider.");
    return context;
}
