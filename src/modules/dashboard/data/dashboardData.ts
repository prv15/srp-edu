export interface DashboardStats {

    students:number;

    faculty:number;

    admissions:number;

    attendance:number;

}

export interface UpcomingEvent{

    title:string;

    date:string;

    category:string;

}

export interface DashboardData{

    institute:string;

    session:string;

    stats:DashboardStats;

    events:UpcomingEvent[];

}

export const dashboardData={

    school:{

        institute:"SRP School",

        session:"2026-27",

        stats:{

            students:5462,

            faculty:228,

            admissions:154,

            attendance:96.4

        },

        events:[

            {

                title:"Unit Test Begins",

                date:"15 Jul",

                category:"Exam"

            },

            {

                title:"PTM Meeting",

                date:"18 Jul",

                category:"Parents"

            },

            {

                title:"Science Exhibition",

                date:"25 Jul",

                category:"Event"

            }

        ]

    },

    training:{

        institute:"SRP Teachers Training College",

        session:"2026-27",

        stats:{

            students:842,

            faculty:46,

            admissions:82,

            attendance:94.8

        },

        events:[

            {

                title:"Teaching Practice",

                date:"16 Jul",

                category:"Practical"

            },

            {

                title:"Internal Assessment",

                date:"21 Jul",

                category:"Exam"

            }

        ]

    },

    degree:{

        institute:"SRPB Degree College",

        session:"2026-27",

        stats:{

            students:3214,

            faculty:112,

            admissions:118,

            attendance:91.6

        },

        events:[

            {

                title:"Semester Examination",

                date:"20 Jul",

                category:"University"

            },

            {

                title:"NSS Camp",

                date:"28 Jul",

                category:"Activity"

            }

        ]

    }

}