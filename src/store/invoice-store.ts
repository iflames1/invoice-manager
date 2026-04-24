import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  seedInvoices,
  type Invoice,
  type InvoiceStatus,
} from "@/data/invoices"
import { generateInvoiceId } from "@/lib/invoice-id"

type NewInvoicePayload = Omit<Invoice, "id" | "createdAt" | "status"> & {
  status: Extract<InvoiceStatus, "draft" | "pending">
}

type UpdateInvoicePayload = Omit<Invoice, "id" | "createdAt">

type InvoiceState = {
  invoices: Invoice[]
  createInvoice: (payload: NewInvoicePayload) => Invoice
  updateInvoice: (id: string, payload: UpdateInvoicePayload) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      invoices: seedInvoices,
      createInvoice: (payload) => {
        const invoice: Invoice = {
          ...payload,
          id: generateInvoiceId(),
          createdAt: new Date().toISOString(),
        }

        set((state) => ({ invoices: [invoice, ...state.invoices] }))
        return invoice
      },
      updateInvoice: (id, payload) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...payload, id } : invoice
          ),
        }))
      },
      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }))
      },
      markAsPaid: (id) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id && invoice.status === "pending"
              ? { ...invoice, status: "paid" }
              : invoice
          ),
        }))
      },
    }),
    {
      name: "invoice-manager:invoices",
      version: 1,
    }
  )
)
