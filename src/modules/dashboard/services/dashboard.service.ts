import { apiRequest } from "../../../services/api";
import type { DashboardOverview } from "../types/dashboard";

export async function getDashboardOverview(
    instituteId: number,
    signal?: AbortSignal,
): Promise<DashboardOverview> {
    const response = await apiRequest<Partial<DashboardOverview>>("dashboard/overview.php", {
        instituteId,
        signal,
    });

    // Keep the application usable while the DirectAdmin endpoint and Vercel
    // frontend are deployed independently. Missing fields remain honest zero
    // states until the matching API version is uploaded.
    return {
        stats: {
            students: Number(response.stats?.students) || 0,
            active_students: Number(response.stats?.active_students) || 0,
            admissions_this_year: Number(response.stats?.admissions_this_year) || 0,
            admissions_last_30_days: Number(response.stats?.admissions_last_30_days) || 0,
            gender_recorded: Number(response.stats?.gender_recorded) || 0,
            active_faculty: Number(response.stats?.active_faculty) || 0,
            active_courses: Number(response.stats?.active_courses) || 0,
            active_subjects: Number(response.stats?.active_subjects) || 0,
        },
        finance: {
            charged: Number(response.finance?.charged) || 0,
            collected: Number(response.finance?.collected) || 0,
            concessions: Number(response.finance?.concessions) || 0,
            refunded: Number(response.finance?.refunded) || 0,
            collected_today: Number(response.finance?.collected_today) || 0,
            outstanding: Number(response.finance?.outstanding) || 0,
        },
        attendance: {
            sessions: Number(response.attendance?.sessions) || 0,
            marked: Number(response.attendance?.marked) || 0,
            present: Number(response.attendance?.present) || 0,
            absent: Number(response.attendance?.absent) || 0,
            attendance_rate: Number(response.attendance?.attendance_rate) || 0,
            sessions_today: Number(response.attendance?.sessions_today) || 0,
        },
        examinations: {
            examinations: Number(response.examinations?.examinations) || 0,
            papers: Number(response.examinations?.papers) || 0,
            results: Number(response.examinations?.results) || 0,
            average_percentage: Number(response.examinations?.average_percentage) || 0,
        },
        recent_admissions: Array.isArray(response.recent_admissions) ? response.recent_admissions : [],
        distributions: {
            courses: Array.isArray(response.distributions?.courses) ? response.distributions.courses : [],
            sessions: Array.isArray(response.distributions?.sessions) ? response.distributions.sessions : [],
            gender: Array.isArray(response.distributions?.gender) ? response.distributions.gender : [],
        },
        data_quality: {
            total: Number(response.data_quality?.total) || 0,
            mobile: Number(response.data_quality?.mobile) || 0,
            email: Number(response.data_quality?.email) || 0,
            aadhaar: Number(response.data_quality?.aadhaar) || 0,
            registration: Number(response.data_quality?.registration) || 0,
            college_roll: Number(response.data_quality?.college_roll) || 0,
            blood_group: Number(response.data_quality?.blood_group) || 0,
        },
        activities: Array.isArray(response.activities) ? response.activities : [],
        generated_at: response.generated_at || new Date().toISOString(),
        refresh_after_seconds: Number(response.refresh_after_seconds) || 30,
    };
}
