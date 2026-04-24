import { z } from "zod"

export const invoiceStatusSchema = z.enum(["draft", "pending", "paid"])

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postCode: z.string().min(1, "Post code is required"),
  country: z.string().min(1, "Country is required"),
})

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  price: z.coerce
    .number({ message: "Price is required" })
    .nonnegative("Price must be 0 or greater")
    .refine((value) => value > 0, "Price must be greater than 0"),
})

export const paymentTermsOptions = [
  { value: 1, label: "Net 1 Day" },
  { value: 7, label: "Net 7 Days" },
  { value: 14, label: "Net 14 Days" },
  { value: 30, label: "Net 30 Days" },
] as const

export const invoiceFormSchema = z.object({
  billFrom: addressSchema,
  billTo: z.object({
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z
      .string()
      .min(1, "Client email is required")
      .email("Must be a valid email"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postCode: z.string().min(1, "Post code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  issueDate: z.date({ message: "Issue date is required" }),
  paymentTerms: z.coerce.number().int().positive(),
  description: z.string().min(1, "Project description is required"),
  items: z
    .array(itemSchema)
    .min(1, "At least one item is required"),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>
