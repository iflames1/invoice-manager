import type { InvoiceStatus } from "@/data/invoices";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
    paid: "bg-[#33D69F]/5 text-[#33D69F] dark:text-[#33D69F]",
    pending: "bg-[#FF8F00]/5 text-[#FF8F00] dark:text-[##FF8F00]",
    draft: "bg-05/5 text-05 dark:text-05",
};

const DOT_STYLES: Record<InvoiceStatus, string> = {
    paid: "bg-[#33D69F]",
    pending: "bg-[#FF8F00]",
    draft: "bg-05",
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
    paid: "Paid",
    pending: "Pending",
    draft: "Draft",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
    return (
        <span
            className={cn(
                "inline-flex w-26 items-center justify-center gap-2 rounded-[6px] px-3 py-2 font-bold",
                STATUS_STYLES[status]
            )}
        >
            <span className={cn("size-2 rounded-full", DOT_STYLES[status])} />
            {STATUS_LABELS[status]}
        </span>
    );
}
