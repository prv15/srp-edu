import { apiRequest } from "../../../services/api";
import type { GlobalSearchResponse } from "./types";

export function searchEntireErp(
    instituteId: number,
    query: string,
    signal?: AbortSignal,
): Promise<GlobalSearchResponse> {
    return apiRequest<GlobalSearchResponse>("search/global.php", {
        instituteId,
        signal,
        query: {
            q: query,
            limit: 6,
        },
    });
}
