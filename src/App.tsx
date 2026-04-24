import * as React from "react";
import { ChevronDownIcon, PlusIcon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { InvoiceList } from "@/components/invoice-list";
import { InvoiceDetail } from "@/components/invoice-detail";
import {
    InvoiceForm,
    type InvoiceFormSaveMode,
} from "@/components/invoice-form";
import { DeleteInvoiceDialog } from "@/components/delete-invoice-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import { useInvoiceStore } from "@/store/invoice-store";
import { useUIStore } from "@/store/ui-store";
import type { InvoiceStatus } from "@/data/invoices";
import type { InvoiceFormValues } from "@/lib/invoice-schema";

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
];

function resolveStatus(
    saveMode: InvoiceFormSaveMode,
    existingStatus?: InvoiceStatus
): InvoiceStatus {
    if (saveMode === "draft") {
        return "draft";
    }
    if (existingStatus && existingStatus !== "draft") {
        return existingStatus;
    }
    return "pending";
}

function formValuesToBasePayload(values: InvoiceFormValues) {
    return {
        billFrom: values.billFrom,
        billTo: values.billTo,
        issueDate: values.issueDate.toISOString(),
        paymentTerms: values.paymentTerms,
        description: values.description ?? "",
        items: values.items ?? [],
    };
}

export function App() {
    const invoices = useInvoiceStore((state) => state.invoices);
    const createInvoice = useInvoiceStore((state) => state.createInvoice);
    const updateInvoice = useInvoiceStore((state) => state.updateInvoice);
    const markAsPaid = useInvoiceStore((state) => state.markAsPaid);

    const selectedInvoiceId = useUIStore((state) => state.selectedInvoiceId);
    const formMode = useUIStore((state) => state.formMode);
    const statusFilter = useUIStore((state) => state.statusFilter);
    const viewInvoice = useUIStore((state) => state.viewInvoice);
    const goBackToList = useUIStore((state) => state.goBackToList);
    const openCreate = useUIStore((state) => state.openCreate);
    const openEdit = useUIStore((state) => state.openEdit);
    const closeForm = useUIStore((state) => state.closeForm);
    const promptDelete = useUIStore((state) => state.promptDelete);
    const toggleStatusFilter = useUIStore((state) => state.toggleStatusFilter);

    const selectedInvoice = React.useMemo(
        () =>
            selectedInvoiceId
                ? (invoices.find(
                      (invoice) => invoice.id === selectedInvoiceId
                  ) ?? null)
                : null,
        [invoices, selectedInvoiceId]
    );

    const filteredInvoices = React.useMemo(() => {
        if (statusFilter.length === 0) return invoices;
        return invoices.filter((invoice) =>
            statusFilter.includes(invoice.status)
        );
    }, [invoices, statusFilter]);

    const handleFormSubmit = (
        values: InvoiceFormValues,
        mode: InvoiceFormSaveMode
    ) => {
        const base = formValuesToBasePayload(values);

        if (formMode === "create") {
            const invoice = createInvoice({
                ...base,
                status: resolveStatus(mode) as "draft" | "pending",
            });
            closeForm();
            viewInvoice(invoice.id);
            return;
        }

        if (formMode === "edit" && selectedInvoice) {
            updateInvoice(selectedInvoice.id, {
                ...base,
                status: resolveStatus(mode, selectedInvoice.status),
            });
            closeForm();
        }
    };

    const sheetOpen = formMode !== "closed";
    const handleSheetOpenChange = (next: boolean) => {
        if (!next) closeForm();
    };

    const sheetInvoice = formMode === "edit" ? selectedInvoice : null;

    return (
        <div className="flex min-h-svh flex-col bg-12 lg:flex-row">
            <Sidebar />

            <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8 md:py-14 lg:px-10">
                {selectedInvoice ? (
                    <InvoiceDetail
                        invoice={selectedInvoice}
                        onBack={goBackToList}
                        onEdit={() => openEdit(selectedInvoice.id)}
                        onDelete={() => promptDelete(selectedInvoice.id)}
                        onMarkAsPaid={() => markAsPaid(selectedInvoice.id)}
                    />
                ) : (
                    <>
                        <header className="flex items-center justify-between gap-4">
                            <div>
                                <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                                    Invoices
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    <span className="hidden md:inline">
                                        There are{" "}
                                    </span>
                                    {filteredInvoices.length}{" "}
                                    <span className="hidden md:inline">
                                        total
                                    </span>{" "}
                                    invoices
                                </p>
                            </div>

                            <div className="flex items-center gap-3 md:gap-6">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="font-semibold"
                                        >
                                            <span className="hidden md:inline">
                                                Filter by status
                                            </span>
                                            <span className="md:hidden">
                                                Filter
                                            </span>
                                            <ChevronDownIcon className="text-01" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="end"
                                        className="w-44 p-4"
                                    >
                                        <div className="flex flex-col gap-3">
                                            {STATUS_OPTIONS.map((option) => {
                                                const id = `filter-${option.value}`;
                                                const checked =
                                                    statusFilter.includes(
                                                        option.value
                                                    );
                                                return (
                                                    <div
                                                        key={option.value}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <Checkbox
                                                            id={id}
                                                            checked={checked}
                                                            onCheckedChange={() =>
                                                                toggleStatusFilter(
                                                                    option.value
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={id}
                                                            className="cursor-pointer text-sm font-semibold"
                                                        >
                                                            {option.label}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Button
                                    onClick={openCreate}
                                    className="h-12 rounded-full bg-01 pr-5 pl-2 font-semibold text-white"
                                >
                                    <span className="flex size-8 items-center justify-center rounded-full bg-white text-01">
                                        <PlusIcon className="size-4" />
                                    </span>
                                    New{" "}
                                    <span className="hidden md:inline">
                                        Invoice
                                    </span>
                                </Button>
                            </div>
                        </header>

                        <InvoiceList
                            invoices={filteredInvoices}
                            onSelect={(invoice) => viewInvoice(invoice.id)}
                        />
                    </>
                )}
            </main>

            <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
                <SheetContent
                    side="left"
                    showCloseButton={false}
                    overlayClassName="top-16 left-0 right-0 bottom-0 lg:top-0 lg:left-26"
                    className="flex h-auto flex-col gap-0 rounded-none bg-12 p-0 data-[side=left]:top-16 data-[side=left]:bottom-0 data-[side=left]:h-auto data-[side=left]:w-full data-[side=left]:max-w-none data-[side=left]:sm:max-w-none md:data-[side=left]:max-w-xl lg:data-[side=left]:top-0 lg:data-[side=left]:left-26 lg:data-[side=left]:max-w-2xl lg:data-[side=left]:rounded-r-2xl"
                >
                    <SheetTitle className="sr-only">
                        {formMode === "create"
                            ? "New Invoice"
                            : `Edit invoice ${sheetInvoice?.id ?? ""}`}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        {formMode === "create"
                            ? "Create a new invoice"
                            : "Edit the details of this invoice"}
                    </SheetDescription>

                    {sheetOpen && (
                        <InvoiceForm
                            key={sheetInvoice?.id ?? "new"}
                            mode={formMode === "create" ? "create" : "edit"}
                            invoice={sheetInvoice}
                            onSubmit={handleFormSubmit}
                            onCancel={closeForm}
                        />
                    )}
                </SheetContent>
            </Sheet>

            <DeleteInvoiceDialog />
        </div>
    );
}

export default App;
