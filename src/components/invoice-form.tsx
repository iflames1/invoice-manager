import { CalendarIcon, Trash2Icon } from "lucide-react";

import type { Invoice } from "@/data/invoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type InvoiceFormProps = {
    invoice?: Invoice | null;
};

export function InvoiceForm({ invoice }: InvoiceFormProps) {
    const isNew = !invoice;

    return (
        <div className="flex flex-1 flex-col gap-11.5 overflow-y-auto px-8 py-15">
            <div>
                <h2 className="text-2xl font-bold">
                    {isNew ? (
                        "New Invoice"
                    ) : (
                        <>
                            Edit{" "}
                            <span className="text-muted-foreground">#</span>
                            {invoice?.id}
                        </>
                    )}
                </h2>
            </div>

            <section className="flex flex-col gap-6">
                <h3 className="font-bold text-01">Bill From</h3>

                <div className="grid gap-2">
                    <Label>Street Address</Label>
                    <Input defaultValue={invoice?.billFrom.street ?? ""} />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="grid gap-2">
                        <Label>City</Label>
                        <Input defaultValue={invoice?.billFrom.city ?? ""} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Post Code</Label>
                        <Input
                            defaultValue={invoice?.billFrom.postCode ?? ""}
                        />
                    </div>
                    <div className="col-span-2 grid gap-2 md:col-span-1">
                        <Label>Country</Label>
                        <Input defaultValue={invoice?.billFrom.country ?? ""} />
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <h3 className="font-bold text-01">Bill To</h3>

                <div className="grid gap-2">
                    <Label>Client's Name</Label>
                    <Input defaultValue={invoice?.client ?? ""} />
                </div>

                <div className="grid gap-2">
                    <Label>Client's Email</Label>
                    <Input
                        type="email"
                        placeholder="e.g. email@example.com"
                        defaultValue={invoice?.email ?? ""}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Street Address</Label>
                    <Input defaultValue={invoice?.billTo.street ?? ""} />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="grid gap-2">
                        <Label>City</Label>
                        <Input defaultValue={invoice?.billTo.city ?? ""} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Post Code</Label>
                        <Input defaultValue={invoice?.billTo.postCode ?? ""} />
                    </div>
                    <div className="col-span-2 grid gap-2 md:col-span-1">
                        <Label>Country</Label>
                        <Input defaultValue={invoice?.billTo.country ?? ""} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Invoice Date</Label>
                        <div className="relative">
                            <Input
                                defaultValue={
                                    invoice?.issueDate ?? "21 Aug 2021"
                                }
                            />
                            <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Payment Terms</Label>
                        <Select
                            defaultValue={
                                invoice?.paymentTerms ?? "Net 30 Days"
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Net 1 Day">
                                    Net 1 Day
                                </SelectItem>
                                <SelectItem value="Net 7 Days">
                                    Net 7 Days
                                </SelectItem>
                                <SelectItem value="Net 14 Days">
                                    Net 14 Days
                                </SelectItem>
                                <SelectItem value="Net 30 Days">
                                    Net 30 Days
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Project Description</Label>
                    <Input
                        placeholder="e.g. Graphic Design Service"
                        defaultValue={invoice?.description ?? ""}
                    />
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <h3 className="font-bold text-01">Item List</h3>

                <div className="flex flex-col gap-4">
                    {(invoice?.items ?? []).map((item) => {
                        const total = item.quantity * item.price;
                        return (
                            <div
                                key={item.id}
                                className="grid gap-3 md:grid-cols-12"
                            >
                                <div className="grid gap-2 md:col-span-5">
                                    <Label>Item Name</Label>
                                    <Input defaultValue={item.name} />
                                </div>
                                <div className="grid grid-cols-4 gap-3 md:col-span-7">
                                    <div className="grid gap-2">
                                        <Label>Qty.</Label>
                                        <Input
                                            type="number"
                                            defaultValue={item.quantity}
                                            className="text-center"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            defaultValue={item.price}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Total</Label>
                                        <div className="flex h-9 items-center text-sm font-semibold">
                                            {total.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-center pb-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            aria-label="Remove item"
                                        >
                                            <Trash2Icon />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Button
                    variant="secondary"
                    className="h-12 w-full rounded-full p-4"
                >
                    + Add New Item
                </Button>
            </section>
        </div>
    );
}
