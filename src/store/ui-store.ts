import { create } from "zustand"

import type { InvoiceStatus } from "@/data/invoices"

type UIState = {
  selectedInvoiceId: string | null
  formMode: "closed" | "create" | "edit"
  deleteTargetId: string | null
  statusFilter: InvoiceStatus[]

  viewInvoice: (id: string) => void
  goBackToList: () => void

  openCreate: () => void
  openEdit: (id: string) => void
  closeForm: () => void

  promptDelete: (id: string) => void
  cancelDelete: () => void

  toggleStatusFilter: (status: InvoiceStatus) => void
  clearStatusFilter: () => void
}

export const useUIStore = create<UIState>((set) => ({
  selectedInvoiceId: null,
  formMode: "closed",
  deleteTargetId: null,
  statusFilter: [],

  viewInvoice: (id) => set({ selectedInvoiceId: id }),
  goBackToList: () => set({ selectedInvoiceId: null }),

  openCreate: () => set({ formMode: "create" }),
  openEdit: (id) => set({ formMode: "edit", selectedInvoiceId: id }),
  closeForm: () => set({ formMode: "closed" }),

  promptDelete: (id) => set({ deleteTargetId: id }),
  cancelDelete: () => set({ deleteTargetId: null }),

  toggleStatusFilter: (status) =>
    set((state) => ({
      statusFilter: state.statusFilter.includes(status)
        ? state.statusFilter.filter((s) => s !== status)
        : [...state.statusFilter, status],
    })),
  clearStatusFilter: () => set({ statusFilter: [] }),
}))
