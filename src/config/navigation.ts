import type { LucideIcon } from "lucide-react";

import {
    LayoutDashboard,
    UserPlus,
    Users,
    GraduationCap,
    CalendarDays,
    ClipboardCheck,
    FileCheck,
    IndianRupee,
    Library,
    Building2,
    Bus,
    Boxes,
    MessageSquare,
    BarChart3,
    Settings,
} from "lucide-react";

export interface NavigationChild {

    title: string;

    path: string;

}

export interface NavigationItem {

    title: string;

    icon: LucideIcon;

    path?: string;

    children?: NavigationChild[];

}

export const navigation: NavigationItem[] = [

    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },

    {
        title: "Admissions",
        icon: UserPlus,

        children: [

            {
                title: "New Admission",
                path: "/admissions/new",
            },

            {
                title: "Admission List",
                path: "/admissions",
            },

            {
                title: "Import Admissions",
                path: "/admissions/import",
            },

            {
                title: "Admission Enquiry",
                path: "/admissions/enquiry",
            },

        ],
    },

    {
        title: "Students",
        icon: Users,

        children: [

            {
                title: "Student List",
                path: "/students",
            },

            {
                title: "Promotions",
                path: "/students/promotions",
            },

            {
                title: "Transfer Certificates",
                path: "/students/tc",
            },

            {
                title: "Alumni",
                path: "/students/alumni",
            },

        ],
    },

    {
        title: "Faculty",
        icon: GraduationCap,

        children: [

            {
                title: "Faculty List",
                path: "/faculty",
            },

            {
                title: "Departments",
                path: "/faculty/departments",
            },

            {
                title: "Timetable",
                path: "/faculty/timetable",
            },

        ],
    },

    {
        title: "Academics",
        icon: CalendarDays,

        children: [

            {
                title: "Courses",
                path: "/academics/courses",
            },

            {
                title: "Subjects",
                path: "/academics/subjects",
            },

            {
                title: "Semesters & Sections",
                path: "/academics/semesters",
            },

        ],
    },

    {
        title: "Attendance",
        icon: ClipboardCheck,
        path: "/attendance",
    },

    {
        title: "Examinations",
        icon: FileCheck,
        path: "/examinations",
    },

    {
        title: "Fees",
        icon: IndianRupee,
        path: "/fees",
    },

    {
        title: "Library",
        icon: Library,
        path: "/library",
    },

    {
        title: "Hostel",
        icon: Building2,
        path: "/hostel",
    },

    {
        title: "Transport",
        icon: Bus,
        path: "/transport",
    },

    {
        title: "Inventory",
        icon: Boxes,
        path: "/inventory",
    },

    {
        title: "Communication",
        icon: MessageSquare,
        path: "/communication",
    },

    {
        title: "Reports",
        icon: BarChart3,
        path: "/reports",
    },

    {
        title: "Settings",
        icon: Settings,
        path: "/settings",
    },

];
