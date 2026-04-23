import type { InvoiceStatus } from "@/data/invoices";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
    paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    draft: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
};

const DOT_STYLES: Record<InvoiceStatus, string> = {
    paid: "bg-emerald-500",
    pending: "bg-amber-500",
    draft: "bg-zinc-500",
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
