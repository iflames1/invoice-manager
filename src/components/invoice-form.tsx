import * as React from "react";
import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Trash2Icon } from "lucide-react";

import type { Invoice } from "@/data/invoices";
import {
    invoiceFormSchema,
    paymentTermsOptions,
    type InvoiceFormValues,
} from "@/lib/invoice-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function getFieldError(field: AnyFieldApi): string | null {
    if (!field.state.meta.isTouched && !field.state.meta.isBlurred) {
        return null;
    }
    const error = field.state.meta.errors?.[0];
    if (!error) return null;
    if (typeof error === "string") return error;
    if (typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    return null;
}

function FieldWrapper({
    label,
    htmlFor,
    error,
    className,
    children,
}: {
    label: string;
    htmlFor?: string;
    error: string | null;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn("grid gap-2", className)}>
            <div className="flex items-baseline justify-between gap-2">
                <Label
                    htmlFor={htmlFor}
                    className={cn(
                        "text-xs font-normal text-muted-foreground",
                        error && "text-destructive"
                    )}
                >
                    {label}
                </Label>
                {error && (
                    <span className="truncate text-xs font-medium text-destructive">
                        {error}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

function emptyAddress() {
    return { street: "", city: "", postCode: "", country: "" };
}

function emptyBillTo() {
    return {
        clientName: "",
        clientEmail: "",
        ...emptyAddress(),
    };
}

function emptyItem() {
    return {
        id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2),
        name: "",
        quantity: 1,
        price: 0,
    };
}

function toFormValues(invoice?: Invoice | null): InvoiceFormValues {
    if (!invoice) {
        return {
            billFrom: emptyAddress(),
            billTo: emptyBillTo(),
            issueDate: new Date(),
            paymentTerms: 30,
            description: "",
            items: [],
        };
    }

    return {
        billFrom: { ...invoice.billFrom },
        billTo: { ...invoice.billTo },
        issueDate: parseISO(invoice.issueDate),
        paymentTerms: invoice.paymentTerms,
        description: invoice.description,
        items: invoice.items.map((item) => ({ ...item })),
    };
}

export type InvoiceFormSaveMode = "draft" | "send";

export type InvoiceFormSubmit = (
    values: InvoiceFormValues,
    mode: InvoiceFormSaveMode
) => void;

type InvoiceFormProps = {
    invoice?: Invoice | null;
    mode: "create" | "edit";
    onSubmit: InvoiceFormSubmit;
    onCancel: () => void;
};

export function InvoiceForm({
    invoice,
    mode,
    onSubmit,
    onCancel,
}: InvoiceFormProps) {
    const saveModeRef = React.useRef<InvoiceFormSaveMode>("send");

    const form = useForm({
        defaultValues: toFormValues(invoice),
        validators: {
            onSubmit: ({ value }) => {
                if (saveModeRef.current === "draft") {
                    return undefined;
                }
                const result = invoiceFormSchema.safeParse(value);
                if (result.success) return undefined;
                const formErrors: Record<string, string> = {};
                for (const issue of result.error.issues) {
                    const key = issue.path.join(".");
                    if (!formErrors[key]) {
                        formErrors[key] = issue.message;
                    }
                }
                return { fields: formErrors };
            },
        },
        onSubmit: async ({ value }) => {
            onSubmit(value, saveModeRef.current);
        },
    });

    const formErrorMap = useStore(form.store, (state) => state.errorMap);
    const itemsErrorMessage = React.useMemo(() => {
        const submitErrors = formErrorMap.onSubmit;
        if (!submitErrors || typeof submitErrors !== "object") return null;
        const fields = (submitErrors as { fields?: Record<string, string> })
            .fields;
        return fields?.items ?? null;
    }, [formErrorMap]);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
        saveMode: InvoiceFormSaveMode
    ) => {
        event.preventDefault();
        event.stopPropagation();
        saveModeRef.current = saveMode;
        void form.handleSubmit();
    };

    const title =
        mode === "create" ? (
            "New Invoice"
        ) : (
            <>
                Edit <span className="text-muted-foreground">#</span>
                {invoice?.id}
            </>
        );

    return (
        <form
            onSubmit={(event) => handleSubmit(event, "send")}
            className="flex h-full flex-col bg-12"
        >
            <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6 md:px-10">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                    {title}
                </h2>

                <section className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-primary">
                        Bill From
                    </h3>

                    <form.Field name="billFrom.street">
                        {(field) => (
                            <FieldWrapper
                                label="Street Address"
                                htmlFor={field.name}
                                error={getFieldError(field)}
                            >
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={Boolean(getFieldError(field))}
                                />
                            </FieldWrapper>
                        )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <form.Field name="billFrom.city">
                            {(field) => (
                                <FieldWrapper
                                    label="City"
                                    htmlFor={field.name}
                                    error={getFieldError(field)}
                                >
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={Boolean(
                                            getFieldError(field)
                                        )}
                                    />
                                </FieldWrapper>
                            )}
                        </form.Field>
                        <form.Field name="billFrom.postCode">
                            {(field) => (
                                <FieldWrapper
                                    label="Post Code"
                                    htmlFor={field.name}
                                    error={getFieldError(field)}
                                >
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={Boolean(
                                            getFieldError(field)
                                        )}
                                    />
                                </FieldWrapper>
                            )}
                        </form.Field>
                        <form.Field name="billFrom.country">
                            {(field) => (
                                <FieldWrapper
                                    label="Country"
                                    htmlFor={field.name}
                                    error={getFieldError(field)}
                                    className="col-span-2 md:col-span-1"
                                >
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={Boolean(
                                            getFieldError(field)
                                        )}
                                    />
                                </FieldWrapper>
                            )}
                        </form.Field>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-primary">
                        Bill To
                    </h3>

                    <form.Field name="billTo.clientName">
                        {(field) => (
                            <FieldWrapper
                                label="Client's Name"
                                htmlFor={field.name}
                                error={getFieldError(field)}
                            >
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={Boolean(getFieldError(field))}
                                />
                            </FieldWrapper>
                        )}
                    </form.Field>

                    <form.Field name="billTo.clientEmail">
                        {(field) => (
                            <FieldWrapper
                                label="Client's Email"
                                htmlFor={field.name}
                                error={getFieldError(field)}
                            >
                                <Input
                                    id={field.name}
                                    type="email"
                                    placeholder="e.g. email@example.com"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={Boolean(getFieldError(field))}
                                />
                            </FieldWrapper>
                        )}
                    </form.Field>

                    <form.Field name="billTo.street">
                        {(field) => (
                            <FieldWrapper
                                label="Street Address"
                                htmlFor={field.name}
                                error={getFieldError(field)}
                            >
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={Boolean(getFieldError(field))}
                                />
                            </FieldWrapper>
                        )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <form.Field name="billTo.city">
                            {(field) => (
                                <FieldWrapper
                                    label="City"
                                    htmlFor={field.name}
                                    error={getFieldError(field)}
                                >
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={Boolean(
                                            getFieldError(field)
                                        )}
                                    />
                                </FieldWrapper>
                            )}
                        </form.Field>
                        <form.Field name="billTo.postCode">
                            {(field) => (
                                <FieldWrapper
                                    label="Post Code"
                                    htmlFor={field.name}
                                    error={getFieldError(field)}
                                >
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={Boolean(
                                            getFieldError(field)
                                        )}
                                    />
                                </FieldWrapper>
                            )}
                        </form.Field>
                        <form.Field name="billTo.country">
                            {(field) => (
                                <FieldWrapper
                                    label="Country"
                                    htmlFor={field.name}
                                    error={getFieldError(field)}
                                    className="col-span-2 md:col-span-1"
                                >
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={Boolean(
                                            getFieldError(field)
                                        )}
                                    />
                                </FieldWrapper>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <form.Field name="issueDate">
                            {(field) => (
                                <FieldWrapper
                                    label="Invoice Date"
                                    error={getFieldError(field)}
                                >
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-10 justify-start px-3 text-left font-normal"
                                                aria-invalid={Boolean(
                                                    getFieldError(field)
                                                )}
                                                onBlur={field.handleBlur}
                                            >
                                                <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                                                <span className="flex-1">
                                                    {field.state.value
                                                        ? format(
                                                              field.state.value,
                                                              "dd MMM yyyy"
                                                          )
                                                        : "Pick a date"}
                                                </span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align="start"
                                            className="w-auto p-0"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.state.value}
                                                onSelect={(date) => {
                                                    if (date)
                                                        field.handleChange(
                                                            date
                                                        );
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FieldWrapper>
                            )}
                        </form.Field>

                        <form.Field name="paymentTerms">
                            {(field) => (
                                <FieldWrapper
                                    label="Payment Terms"
                                    error={getFieldError(field)}
                                >
                                    <Select
                                        value={String(field.state.value)}
                                        onValueChange={(value) =>
                                            field.handleChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentTermsOptions.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={String(
                                                            option.value
                                                        )}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FieldWrapper>
                            )}
                        </form.Field>
                    </div>

                    <form.Field name="description">
                        {(field) => (
                            <FieldWrapper
                                label="Project Description"
                                htmlFor={field.name}
                                error={getFieldError(field)}
                            >
                                <Input
                                    id={field.name}
                                    placeholder="e.g. Graphic Design Service"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={Boolean(getFieldError(field))}
                                />
                            </FieldWrapper>
                        )}
                    </form.Field>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="font-heading text-base font-semibold text-muted-foreground">
                        Item List
                    </h3>

                    <form.Field name="items" mode="array">
                        {(itemsField) => (
                            <div className="flex flex-col gap-5">
                                {itemsField.state.value.map((_item, index) => (
                                    <div
                                        key={
                                            itemsField.state.value[index]?.id ??
                                            index
                                        }
                                        className="grid gap-3 md:grid-cols-12"
                                    >
                                        <form.Field
                                            name={`items[${index}].name`}
                                        >
                                            {(field) => (
                                                <FieldWrapper
                                                    label="Item Name"
                                                    htmlFor={field.name}
                                                    error={getFieldError(field)}
                                                    className="md:col-span-5"
                                                >
                                                    <Input
                                                        id={field.name}
                                                        value={
                                                            field.state.value
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        onChange={(e) =>
                                                            field.handleChange(
                                                                e.target.value
                                                            )
                                                        }
                                                        aria-invalid={Boolean(
                                                            getFieldError(field)
                                                        )}
                                                    />
                                                </FieldWrapper>
                                            )}
                                        </form.Field>
                                        <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3 md:col-span-7">
                                            <form.Field
                                                name={`items[${index}].quantity`}
                                            >
                                                {(field) => (
                                                    <FieldWrapper
                                                        label="Qty."
                                                        htmlFor={field.name}
                                                        error={getFieldError(
                                                            field
                                                        )}
                                                    >
                                                        <Input
                                                            id={field.name}
                                                            type="number"
                                                            min={1}
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            aria-invalid={Boolean(
                                                                getFieldError(
                                                                    field
                                                                )
                                                            )}
                                                            className="text-center"
                                                        />
                                                    </FieldWrapper>
                                                )}
                                            </form.Field>
                                            <form.Field
                                                name={`items[${index}].price`}
                                            >
                                                {(field) => (
                                                    <FieldWrapper
                                                        label="Price"
                                                        htmlFor={field.name}
                                                        error={getFieldError(
                                                            field
                                                        )}
                                                    >
                                                        <Input
                                                            id={field.name}
                                                            type="number"
                                                            step="0.01"
                                                            min={0}
                                                            value={
                                                                field.state
                                                                    .value
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            onChange={(e) =>
                                                                field.handleChange(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            aria-invalid={Boolean(
                                                                getFieldError(
                                                                    field
                                                                )
                                                            )}
                                                        />
                                                    </FieldWrapper>
                                                )}
                                            </form.Field>
                                            <form.Subscribe
                                                selector={(state) =>
                                                    state.values.items[index]
                                                }
                                            >
                                                {(item) => (
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-normal text-muted-foreground">
                                                            Total
                                                        </Label>
                                                        <div className="flex h-10 items-center text-sm font-semibold">
                                                            {item
                                                                ? (
                                                                      (Number(
                                                                          item.quantity
                                                                      ) || 0) *
                                                                      (Number(
                                                                          item.price
                                                                      ) || 0)
                                                                  ).toFixed(2)
                                                                : "0.00"}
                                                        </div>
                                                    </div>
                                                )}
                                            </form.Subscribe>
                                            <div className="pb-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    aria-label="Remove item"
                                                    onClick={() =>
                                                        itemsField.removeValue(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2Icon />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {itemsErrorMessage &&
                                    itemsField.state.value.length === 0 && (
                                        <p className="text-xs font-medium text-destructive">
                                            {itemsErrorMessage}
                                        </p>
                                    )}

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="h-12 w-full rounded-full"
                                    onClick={() =>
                                        itemsField.pushValue(emptyItem())
                                    }
                                >
                                    + Add New Item
                                </Button>
                            </div>
                        )}
                    </form.Field>
                </section>
            </div>

            <footer className="flex items-center justify-end gap-2 px-6 py-5 md:px-10">
                <form.Subscribe
                    selector={(state) => [state.isSubmitting] as const}
                >
                    {([isSubmitting]) => {
                        const existingStatus = invoice?.status;
                        const showDraftButtons =
                            mode === "create" || existingStatus === "draft";

                        return showDraftButtons ? (
                            <>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onCancel}
                                    className="h-12 rounded-full px-6"
                                    disabled={isSubmitting}
                                >
                                    {mode === "create" ? "Discard" : "Cancel"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="h-12 rounded-full px-6"
                                    disabled={isSubmitting}
                                    onClick={(event) => {
                                        saveModeRef.current = "draft";
                                        event.preventDefault();
                                        void form.handleSubmit();
                                    }}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-12 rounded-full px-6"
                                    disabled={isSubmitting}
                                >
                                    Save &amp; Send
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onCancel}
                                    className="h-12 rounded-full px-6"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-12 rounded-full px-6"
                                    disabled={isSubmitting}
                                >
                                    Save Changes
                                </Button>
                            </>
                        );
                    }}
                </form.Subscribe>
            </footer>
        </form>
    );
}
