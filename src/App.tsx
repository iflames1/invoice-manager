import { useState } from "react";

import { ChevronDownIcon, PlusIcon } from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { InvoiceList } from "@/components/invoice-list";
import { InvoiceForm } from "@/components/invoice-form";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { invoices, type Invoice, type InvoiceStatus } from "@/data/invoices";

const STATUS_OPTIONS: InvoiceStatus[] = ["draft", "pending", "paid"];

export function App() {
    const [selected, setSelected] = useState<Invoice | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus[]>([]);

    const open = selected !== null || isNew;
    //const open = true;

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setSelected(null);
            setIsNew(false);
        }
    };

    const toggleStatus = (status: InvoiceStatus) => {
        setStatusFilter((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    };

    const filtered =
        statusFilter.length === 0
            ? invoices
            : invoices.filter((invoice) =>
                  statusFilter.includes(invoice.status)
              );

    return (
        <div className="flex min-h-svh flex-col bg-12 md:flex-row">
            <Sidebar />

            <main className="flex w-full px-6 py-19">
                <div className="mx-auto flex max-w-[730px] flex-col gap-17">
                    <header className="flex items-center justify-between gap-10">
                        <div>
                            <h1 className="text-4xl font-bold">Invoices</h1>
                            <p className="mt-1.5 text-sm">
                                <span className="">There are </span>
                                {filtered.length}{" "}
                                <span className="">total</span> invoices
                            </p>
                        </div>

                        <div className="flex items-center gap-10">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="gap-3.5 font-bold"
                                    >
                                        <span className="">
                                            Filter by status
                                        </span>
                                        <ChevronDownIcon className="text-01" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <DropdownMenuCheckboxItem
                                            key={status}
                                            checked={statusFilter.includes(
                                                status
                                            )}
                                            onCheckedChange={() =>
                                                toggleStatus(status)
                                            }
                                            className="capitalize"
                                        >
                                            {status}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                onClick={() => {
                                    setIsNew(true);
                                    setSelected(null);
                                }}
                                className="h-12 gap-4 rounded-full bg-01 pr-4 pl-2 font-bold hover:bg-02"
                            >
                                <span className="flex size-8 items-center justify-center rounded-full bg-white py-2">
                                    <PlusIcon
                                        className="size-3"
                                        color="var(--01)"
                                    />
                                </span>
                                New Invoice{" "}
                            </Button>
                        </div>
                    </header>

                    <InvoiceList
                        invoices={filtered}
                        onSelect={(invoice) => {
                            setSelected(invoice);
                            setIsNew(false);
                        }}
                    />
                </div>
            </main>

            <Sheet open={open} onOpenChange={handleOpenChange}>
                <SheetContent
                    side="left"
                    showCloseButton={false}
                    className="flex h-svh min-w-[615px] overflow-hidden rounded-tr-[20px] rounded-br-[20px] border-none bg-12"
                >
                    <SheetTitle className="sr-only">
                        {isNew
                            ? "New Invoice"
                            : `Edit invoice ${selected?.id ?? ""}`}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        {isNew
                            ? "Create a new invoice"
                            : "Edit the details of this invoice"}
                    </SheetDescription>

                    <InvoiceForm invoice={selected} />

                    <footer className="flex items-center justify-end gap-2 bg-12 px-6 py-5 md:px-10">
                        {isNew ? (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleOpenChange(false)}
                                    className="h-12 rounded-full px-6 py-4.5"
                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="h-12 rounded-full bg-[#373b53] px-6 text-white hover:bg-[#0c0e16] dark:bg-[#0c0e16]"
                                >
                                    Save as Draft
                                </Button>
                                <Button className="h-12 rounded-full bg-[#7c5dfa] px-6 text-white hover:bg-[#9277ff]">
                                    Save &amp; Send
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleOpenChange(false)}
                                    className="h-12 rounded-full px-6"
                                >
                                    Cancel
                                </Button>
                                <Button className="h-12 rounded-full bg-01 px-6 text-white hover:bg-[#9277ff]">
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </footer>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default App;
