import { useState } from "react";
import {
    Download,
    Smartphone,
    CreditCard,
    Landmark,
    Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    downloadFeeReceipt,
    type FeeReceiptSummary,
} from "../../../services/fee.service";
import styles from "./PaymentHistory.module.css";

function paymentIcon(method: string | null) {
    switch (method) {
        case "UPI":
            return <Smartphone size={18} />;
        case "Card":
            return <CreditCard size={18} />;
        case "Cash":
            return <Wallet size={18} />;
        default:
            return <Landmark size={18} />;
    }
}

function formattedDate(value: string): string {
    const date = new Date(value);
    return Number.isFinite(date.getTime())
        ? new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date)
        : value;
}

export default function PaymentHistory({
    receipts,
    instituteId,
    loading,
    error,
}: {
    receipts: FeeReceiptSummary[];
    instituteId: number;
    loading: boolean;
    error: string;
}) {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const download = async (receipt: FeeReceiptSummary) => {
        setDownloadingId(receipt.id);
        try {
            await downloadFeeReceipt(instituteId, receipt);
            toast.success("Fee receipt downloaded.");
        } catch (cause) {
            toast.error(cause instanceof Error ? cause.message : "Unable to download receipt.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h2>Payment Receipts</h2>
                    <span>Official computer-generated fee receipts</span>
                </div>
            </div>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Receipt</th>
                            <th>Date</th>
                            <th>Session</th>
                            <th>Method</th>
                            <th>Paid Amount</th>
                            <th>Balance</th>
                            <th>Receipt PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={7} className={styles.state}>Loading fee receipts…</td></tr>
                        )}
                        {!loading && error && (
                            <tr><td colSpan={7} className={styles.error}>{error}</td></tr>
                        )}
                        {!loading && !error && receipts.length === 0 && (
                            <tr>
                                <td colSpan={7} className={styles.state}>
                                    No issued fee receipts are available for this student.
                                </td>
                            </tr>
                        )}
                        {!loading && !error && receipts.map(receipt => (
                            <tr key={receipt.id}>
                                <td><strong>{receipt.receipt_no}</strong></td>
                                <td>{formattedDate(receipt.issued_at)}</td>
                                <td>{receipt.session_name || receipt.semester_name || "-"}</td>
                                <td>
                                    <div className={styles.method}>
                                        {paymentIcon(receipt.payment_mode)}
                                        {receipt.payment_mode || "-"}
                                    </div>
                                </td>
                                <td>₹{Number(receipt.paid_amount).toLocaleString("en-IN")}</td>
                                <td>₹{Number(receipt.balance_amount).toLocaleString("en-IN")}</td>
                                <td>
                                    <button
                                        type="button"
                                        className={styles.download}
                                        disabled={downloadingId === receipt.id}
                                        onClick={() => void download(receipt)}
                                        aria-label={`Download receipt ${receipt.receipt_no}`}
                                    >
                                        <Download size={16} />
                                        {downloadingId === receipt.id ? "Preparing…" : "Download"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
