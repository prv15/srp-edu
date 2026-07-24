import { apiRequest } from "../../../services/api";
import type { DashboardOverview } from "../types/dashboard";

export function getDashboardOverview(
    instituteId: number,
    signal?: AbortSignal,
): Promise<DashboardOverview> {
    return apiRequest<DashboardOverview>("dashboard/overview.php", {
        instituteId,
        signal,
    });
}
