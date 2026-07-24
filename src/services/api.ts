const DEFAULT_API_URL = "https://thetechservices.in/srp-edu/api/v1";

export const API_URL = (
    window.TPS_CONFIG?.API_URL
    || import.meta.env.VITE_API_URL
    || DEFAULT_API_URL
).replace(/\/+$/, "");

let csrfToken = "";

export function setCsrfToken(token: string): void {
    csrfToken = token;
}

export class ApiError extends Error {
    readonly status: number;
    readonly details?: unknown;

    constructor(
        message: string,
        status: number,
        details?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

type ApiEnvelope<T> = {
    success: boolean;
    message?: string;
    data: T;
};

type RequestOptions = Omit<RequestInit, "body"> & {
    instituteId: number;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
};

export async function apiRequest<T>(
    path: string,
    { instituteId, body, query, headers, ...options }: RequestOptions,
): Promise<T> {
    if (!Number.isInteger(instituteId) || instituteId <= 0) {
        throw new ApiError("A valid institute is required.", 400);
    }

    const url = new URL(
        `${API_URL}/${path.replace(/^\/+/, "")}`,
        window.location.origin,
    );
    url.searchParams.set("institute_id", String(instituteId));
    Object.entries(query || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    const response = await fetch(url, {
        ...options,
        credentials: "include",
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
            Accept: "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new ApiError(
            payload?.message || `Request failed (${response.status}).`,
            response.status,
            payload,
        );
    }

    const envelope = payload as ApiEnvelope<T>;
    if (!envelope?.success) {
        throw new ApiError(envelope?.message || "Request failed.", response.status, payload);
    }

    return envelope.data;
}

export async function authRequest<T>(
    path: string,
    options: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
    const response = await fetch(`${API_URL}/${path.replace(/^\/+/, "")}`, {
        ...options,
        credentials: "include",
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        headers: {
            Accept: "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
            ...options.headers,
        },
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
        throw new ApiError(payload?.message || "Request failed.", response.status, payload);
    }
    return payload.data as T;
}
