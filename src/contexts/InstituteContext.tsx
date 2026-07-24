/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { useAuth } from "../providers/AuthProvider";

export type InstituteType = "school" | "training" | "degree";

export interface Institute {
    id: number;
    code: InstituteType;
    name: string;
    shortName: string;
    academicYear: string;
    admissionSessions: string[];
}

const instituteMetadata: Record<InstituteType, Omit<Institute, "id" | "name">> = {
    school: {
        code: "school",
        shortName: "School",
        academicYear: "2026-2027",
        admissionSessions: ["Annual"],
    },
    training: {
        code: "training",
        shortName: "Training",
        academicYear: "2026-2027",
        admissionSessions: ["Annual"],
    },
    degree: {
        code: "degree",
        shortName: "Degree",
        academicYear: "2026-2027",
        admissionSessions: ["January", "July"],
    },
};

const unavailableInstitute: Institute = {
    id: 0,
    name: "No institute available",
    ...instituteMetadata.school,
};

interface InstituteContextType {
    institute: Institute;
    institutes: Institute[];
    setInstitute: (institute: Institute) => void;
    tenantVersion: number;
}

const InstituteContext = createContext<InstituteContextType | null>(null);

export function InstituteProvider({ children }: { children: ReactNode }) {
    const { institutes: authorizedInstitutes } = useAuth();
    const institutes = useMemo<Institute[]>(
        () => authorizedInstitutes.map(item => ({
            id: Number(item.id),
            name: item.name,
            ...instituteMetadata[item.code],
        })).filter(item => Number.isInteger(item.id) && item.id > 0),
        [authorizedInstitutes],
    );
    const [selectedCode, setSelectedCode] = useState<InstituteType>(
        () => (window.localStorage.getItem("tps.selectedInstitute") as InstituteType) || "school",
    );
    const [tenantVersion, setTenantVersion] = useState(0);
    const institute = institutes.find(item => item.code === selectedCode)
        || institutes[0]
        || unavailableInstitute;

    const setInstitute = (nextInstitute: Institute) => {
        if (!institutes.some(item => item.id === nextInstitute.id)) {
            throw new Error("You do not have access to this institute.");
        }
        setSelectedCode(nextInstitute.code);
        setTenantVersion(version => version + 1);
    };

    useEffect(() => {
        if (institute.id <= 0) return;
        window.localStorage.setItem("tps.selectedInstitute", institute.code);
        document.documentElement.dataset.institute = institute.code;
        window.dispatchEvent(new CustomEvent("tps:institute-change", {
            detail: { instituteId: institute.id, code: institute.code },
        }));
    }, [institute]);

    return (
        <InstituteContext.Provider value={{
            institute,
            institutes,
            setInstitute,
            tenantVersion,
        }}>
            {children}
        </InstituteContext.Provider>
    );
}

export function useInstitute() {
    const context = useContext(InstituteContext);
    if (!context) throw new Error("useInstitute must be used inside InstituteProvider");
    return context;
}
