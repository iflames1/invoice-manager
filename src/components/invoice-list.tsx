import { ChevronRightIcon } from "lucide-react";

import type { Invoice } from "@/data/invoices";
import { StatusBadge } from "@/components/status-badge";

type InvoiceListProps = {
    invoices: Invoice[];
    onSelect: (invoice: Invoice) => void;
};

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
    }).format(amount);
}

export function InvoiceList({ invoices, onSelect }: InvoiceListProps) {
    return (
        <ul className="flex flex-col gap-4">
            {invoices.map((invoice) => (
                <li key={invoice.id}>
                    <button
                        onClick={() => onSelect(invoice)}
                        className="grid w-full cursor-pointer grid-cols-[80px_116px_1fr_1fr_140px] items-center justify-between gap-4 rounded-lg bg-03 px-8 py-4 text-left"
                    >
                        <div className="font-bold">
                            <span className="text-muted-foreground">#</span>
                            {invoice.id}
                        </div>

                        <div className="text-sm font-medium">
                            Due {invoice.due}
                        </div>

                        <div className="text-sm font-medium">
                            {invoice.client}
                        </div>

                        <div className="text-right font-bold">
                            {formatAmount(invoice.amount)}
                        </div>

                        <div className="flex items-center justify-end gap-5">
                            <StatusBadge status={invoice.status} />

                            <ChevronRightIcon
                                className="size-5"
                                color="var(--01)"
                            />
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}
