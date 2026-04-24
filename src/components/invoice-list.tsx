import { ChevronRightIcon, FileTextIcon } from "lucide-react";

import {
    getInvoiceDueDate,
    getInvoiceTotal,
    type Invoice,
} from "@/data/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

type InvoiceListProps = {
    invoices: Invoice[];
    onSelect: (invoice: Invoice) => void;
};

export function InvoiceList({ invoices, onSelect }: InvoiceListProps) {
    if (invoices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card px-6 py-20 text-center">
                <div className="flex size-12 items-center justify-center rounded-full">
                    <FileTextIcon />
                </div>
                <h2 className="font-heading text-lg font-semibold">
                    There is nothing here
                </h2>
                <p className="max-w-xs text-sm text-muted-foreground">
                    Create a new invoice, or try adjusting your filters to find
                    what you are looking for.
                </p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-4">
            {invoices.map((invoice) => (
                <li key={invoice.id}>
                    <button
                        onClick={() => onSelect(invoice)}
                        className="group grid w-full cursor-pointer grid-cols-2 items-center gap-4 rounded-lg bg-03 px-8 py-4 text-left shadow-sm transition hover:border-primary focus-visible:border-primary focus-visible:outline-none md:grid-cols-[1fr_1.2fr_1.2fr_1.2fr_120px_24px]"
                    >
                        <div className="font-bold">
                            <span className="text-07">#</span>
                            {invoice.id}
                        </div>

                        <div className="hidden text-sm md:block">
                            <span>Due </span>
                            {formatDate(getInvoiceDueDate(invoice))}
                        </div>

                        <div className="hidden text-sm md:block">
                            {invoice.billTo.clientName || "—"}
                        </div>

                        <div className="order-3 col-span-2 text-lg font-semibold md:order-0 md:col-span-1 md:text-right md:text-base">
                            {formatCurrency(getInvoiceTotal(invoice))}
                        </div>

                        <div className="order-2 flex justify-end md:order-0 md:justify-start">
                            <StatusBadge status={invoice.status} />
                        </div>

                        <div className="col-span-2 flex flex-col gap-1 text-sm md:hidden">
                            <span>
                                Due {formatDate(getInvoiceDueDate(invoice))}
                            </span>
                            <span>{invoice.billTo.clientName || "—"}</span>
                        </div>

                        <ChevronRightIcon className="hidden size-5 text-01 md:block" />
                    </button>
                </li>
            ))}
        </ul>
    );
}
