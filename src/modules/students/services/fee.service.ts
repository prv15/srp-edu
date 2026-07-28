import { API_URL, ApiError, apiRequest } from "../../../services/api";

export type FeeReceiptSummary = {
    id: number;
    receipt_no: string;
    receipt_template: "UG" | "BBA_BCA";
    issued_at: string;
    payment_mode: string | null;
    transaction_id: string | null;
    paid_amount: string | number;
    balance_amount: string | number;
    remarks: string | null;
    session_name: string | null;
    semester_name: string | null;
};

export function getStudentFeeReceipts(
    instituteId: number,
    studentId: number,
    signal?: AbortSignal,
): Promise<FeeReceiptSummary[]> {
    return apiRequest<FeeReceiptSummary[]>("fees/receipts.php", {
        instituteId,
        query: { student_id: studentId },
        signal,
    });
}

export async function downloadFeeReceipt(
    instituteId: number,
    receipt: FeeReceiptSummary,
): Promise<void> {
    const url = new URL(`${API_URL}/fees/receipt.php`);
    url.searchParams.set("institute_id", String(instituteId));
    url.searchParams.set("receipt_id", String(receipt.id));

    const response = await fetch(url, {
        credentials: "include",
        headers: { Accept: "application/pdf" },
    });
    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new ApiError(payload?.message || "Unable to download fee receipt.", response.status);
    }

    const blobUrl = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `Fee-Receipt-${receipt.receipt_no.replace(/[^A-Za-z0-9_-]+/g, "-")}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);
}
