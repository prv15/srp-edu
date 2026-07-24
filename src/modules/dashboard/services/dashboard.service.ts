import { dashboardData } from "../data/dashboardData";

export type InstituteCode =
    | "school"
    | "training"
    | "degree";

export function getDashboardData(
    institute: InstituteCode
) {
    return dashboardData[institute];
}