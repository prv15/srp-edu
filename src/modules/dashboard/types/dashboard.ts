export type DashboardStats = {
    students: number;
    active_students: number;
    admissions_this_year: number;
    gender_recorded: number;
};

export type RecentAdmission = {
    id: string | number;
    student_name: string;
    admission_no: string;
    admission_date?: string;
    status: string;
    course_name?: string;
    session_name?: string;
};

export type DashboardOverview = {
    stats: DashboardStats;
    recent_admissions: RecentAdmission[];
    generated_at: string;
};
