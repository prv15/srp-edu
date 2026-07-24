export type DashboardStats = {
    students: number;
    active_students: number;
    admissions_this_year: number;
    admissions_last_30_days: number;
    gender_recorded: number;
    active_faculty: number;
    active_courses: number;
    active_subjects: number;
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

export type DistributionItem = {
    id?: number;
    label: string;
    value: number;
};

export type ActivityItem = {
    id: string;
    activity_type: "admission" | "fee" | "attendance" | "result" | "faculty";
    title: string;
    detail: string;
    occurred_at: string;
};

export type DashboardOverview = {
    stats: DashboardStats;
    finance: {
        charged: number; collected: number; concessions: number;
        refunded: number; collected_today: number; outstanding: number;
    };
    attendance: {
        sessions: number; marked: number; present: number; absent: number;
        attendance_rate?: number; sessions_today: number;
    };
    examinations: {
        examinations: number; papers: number; results: number; average_percentage?: number;
    };
    recent_admissions: RecentAdmission[];
    distributions: {
        courses: DistributionItem[];
        sessions: DistributionItem[];
        gender: DistributionItem[];
    };
    data_quality: {
        total: number; mobile: number; email: number; aadhaar: number;
        registration: number; college_roll: number; blood_group: number;
    };
    activities: ActivityItem[];
    generated_at: string;
    refresh_after_seconds: number;
};
