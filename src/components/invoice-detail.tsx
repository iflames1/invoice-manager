import { ChevronLeftIcon } from "lucide-react";

import {
    getInvoiceDueDate,
    getInvoiceTotal,
    type Invoice,
} from "@/data/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

type InvoiceDetailProps = {
    invoice: Invoice;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onMarkAsPaid: () => void;
};

export function InvoiceDetail({
    invoice,
    onBack,
    onEdit,
    onDelete,
    onMarkAsPaid,
}: InvoiceDetailProps) {
    const total = getInvoiceTotal(invoice);
    const dueDate = getInvoiceDueDate(invoice);
    const canMarkAsPaid = invoice.status === "pending";

    return (
        <div className="flex w-full flex-col gap-6">
            <Button
                variant="ghost"
                onClick={onBack}
                className="w-fit gap-6 px-2 font-semibold"
            >
                <ChevronLeftIcon className="text-primary" />
                Go back
            </Button>

            <section className="flex flex-col items-stretch justify-between gap-5 rounded-[8px] bg-03 px-8 py-6 shadow-sm md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>
                    <StatusBadge status={invoice.status} />
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Button
                        variant="secondary"
                        onClick={onEdit}
                        className="rounded-full px-6"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        className="rounded-full px-6 text-white"
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={onMarkAsPaid}
                        disabled={!canMarkAsPaid}
                        className="rounded-full px-6"
                    >
                        Mark as Paid
                    </Button>
                </div>
            </section>

            <section className="flex flex-col gap-8 rounded-[8px] bg-card p-6 shadow-sm md:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-heading text-lg font-bold">
                            <span className="text-muted-foreground">#</span>
                            {invoice.id}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {invoice.description || "—"}
                        </p>
                    </div>
                    <address className="flex flex-col text-sm text-muted-foreground not-italic md:text-right">
                        <span>{invoice.billFrom.street}</span>
                        <span>{invoice.billFrom.city}</span>
                        <span>{invoice.billFrom.postCode}</span>
                        <span>{invoice.billFrom.country}</span>
                    </address>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground">
                                Invoice Date
                            </span>
                            <span className="font-heading text-base font-bold">
                                {formatDate(invoice.issueDate)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground">
                                Payment Due
                            </span>
                            <span className="font-heading text-base font-bold">
                                {formatDate(dueDate)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground">
                            Bill To
                        </span>
                        <span className="font-heading text-base font-bold">
                            {invoice.billTo.clientName || "—"}
                        </span>
                        <address className="flex flex-col text-sm text-muted-foreground not-italic">
                            <span>{invoice.billTo.street}</span>
                            <span>{invoice.billTo.city}</span>
                            <span>{invoice.billTo.postCode}</span>
                            <span>{invoice.billTo.country}</span>
                        </address>
                    </div>

                    <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                        <span className="text-xs text-muted-foreground">
                            Sent to
                        </span>
                        <span className="font-heading text-base font-bold break-all">
                            {invoice.billTo.clientEmail || "—"}
                        </span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[8px] bg-04">
                    <table className="hidden w-full md:table">
                        <thead>
                            <tr className="text-xs text-muted-foreground">
                                <th className="px-6 pt-6 pb-4 text-left font-normal">
                                    Item Name
                                </th>
                                <th className="px-6 pt-6 pb-4 text-center font-normal">
                                    QTY.
                                </th>
                                <th className="px-6 pt-6 pb-4 text-right font-normal">
                                    Price
                                </th>
                                <th className="px-6 pt-6 pb-4 text-right font-normal">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-3 text-sm font-semibold">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-3 text-center text-sm font-semibold text-muted-foreground">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm font-semibold text-muted-foreground">
                                        {formatCurrency(item.price)}
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm font-semibold">
                                        {formatCurrency(
                                            item.quantity * item.price
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr aria-hidden>
                                <td className="h-4" colSpan={4} />
                            </tr>
                        </tbody>
                    </table>

                    <ul className="flex flex-col gap-4 p-6 md:hidden">
                        {invoice.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">
                                        {item.name}
                                    </span>
                                    <span className="text-sm font-semibold text-muted-foreground">
                                        {item.quantity} x{" "}
                                        {formatCurrency(item.price)}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold">
                                    {formatCurrency(item.quantity * item.price)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center justify-between bg-08 px-6 py-5 text-white">
                        <span className="text-sm">Amount Due</span>
                        <span className="font-heading text-lg font-bold md:text-2xl">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>
            </section>

            <footer className="sticky bottom-0 -mx-6 flex items-center justify-end gap-2 border-t bg-card px-6 py-4 md:hidden">
                <Button
                    variant="secondary"
                    onClick={onEdit}
                    className="rounded-full px-5"
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    onClick={onDelete}
                    className="rounded-full bg-destructive px-5 text-white hover:bg-destructive/90"
                >
                    Delete
                </Button>
                <Button
                    onClick={onMarkAsPaid}
                    disabled={!canMarkAsPaid}
                    className="rounded-full px-5"
                >
                    Mark as Paid
                </Button>
            </footer>
        </div>
    );
}
