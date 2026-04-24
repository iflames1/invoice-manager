import type { InvoiceStatus } from "@/lib/invoice-schema"

export type { InvoiceStatus } from "@/lib/invoice-schema"

export type InvoiceItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type InvoiceAddress = {
  street: string
  city: string
  postCode: string
  country: string
}

export type Invoice = {
  id: string
  createdAt: string
  status: InvoiceStatus
  billFrom: InvoiceAddress
  billTo: InvoiceAddress & {
    clientName: string
    clientEmail: string
  }
  issueDate: string
  paymentTerms: number
  description: string
  items: InvoiceItem[]
}

export function getInvoiceTotal(invoice: Pick<Invoice, "items">) {
  return invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )
}

export function getInvoiceDueDate(invoice: Pick<Invoice, "issueDate" | "paymentTerms">) {
  const issue = new Date(invoice.issueDate)
  issue.setDate(issue.getDate() + invoice.paymentTerms)
  return issue.toISOString()
}

const defaultBillFrom: InvoiceAddress = {
  street: "19 Union Terrace",
  city: "London",
  postCode: "E1 3EZ",
  country: "United Kingdom",
}

export const seedInvoices: Invoice[] = [
  {
    id: "RT3080",
    createdAt: "2021-08-18T10:00:00.000Z",
    status: "paid",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "Jensen Huang",
      clientEmail: "jensenh@mail.com",
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    issueDate: "2021-07-20T00:00:00.000Z",
    paymentTerms: 30,
    description: "Graphic Design",
    items: [
      { id: "1", name: "Banner Design", quantity: 1, price: 156 },
      { id: "2", name: "Email Design", quantity: 2, price: 822.45 },
    ],
  },
  {
    id: "XM9141",
    createdAt: "2021-08-21T10:00:00.000Z",
    status: "pending",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "Alex Grim",
      clientEmail: "alexgrim@mail.com",
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    issueDate: "2021-08-21T00:00:00.000Z",
    paymentTerms: 30,
    description: "Graphic Design",
    items: [
      { id: "1", name: "Banner Design", quantity: 1, price: 156 },
      { id: "2", name: "Email Design", quantity: 2, price: 200 },
    ],
  },
  {
    id: "RG0314",
    createdAt: "2021-09-24T10:00:00.000Z",
    status: "paid",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "John Morrison",
      clientEmail: "john@mail.com",
      street: "79 Dover Road",
      city: "Westhall",
      postCode: "IP19 3PF",
      country: "United Kingdom",
    },
    issueDate: "2021-09-01T00:00:00.000Z",
    paymentTerms: 30,
    description: "Brand Identity",
    items: [{ id: "1", name: "Brand Guidelines", quantity: 1, price: 14002.33 }],
  },
  {
    id: "RT2080",
    createdAt: "2021-09-12T10:00:00.000Z",
    status: "pending",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "Alysa Werner",
      clientEmail: "alysa@mail.com",
      street: "46 Abbey Row",
      city: "Cambridge",
      postCode: "CB5 6EG",
      country: "United Kingdom",
    },
    issueDate: "2021-09-12T00:00:00.000Z",
    paymentTerms: 30,
    description: "Logo Re-design",
    items: [{ id: "1", name: "Logo Redesign", quantity: 1, price: 102.04 }],
  },
  {
    id: "AA1449",
    createdAt: "2021-09-14T10:00:00.000Z",
    status: "pending",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "Mellisa Clarke",
      clientEmail: "mellisa@mail.com",
      street: "54 Park Avenue",
      city: "Manchester",
      postCode: "M1 2DE",
      country: "United Kingdom",
    },
    issueDate: "2021-09-14T00:00:00.000Z",
    paymentTerms: 30,
    description: "Website Design",
    items: [{ id: "1", name: "Website Design", quantity: 1, price: 4032.33 }],
  },
  {
    id: "TY9141",
    createdAt: "2021-10-01T10:00:00.000Z",
    status: "pending",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "Thomas Wayne",
      clientEmail: "thomas@dc.com",
      street: "1007 Mountain Drive",
      city: "Gotham",
      postCode: "GT1 1GT",
      country: "United States",
    },
    issueDate: "2021-10-01T00:00:00.000Z",
    paymentTerms: 30,
    description: "Security System Consultation",
    items: [{ id: "1", name: "Consultation", quantity: 1, price: 6155.91 }],
  },
  {
    id: "FV2353",
    createdAt: "2021-10-13T10:00:00.000Z",
    status: "draft",
    billFrom: defaultBillFrom,
    billTo: {
      clientName: "Anita Wainwright",
      clientEmail: "anita@mail.com",
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    issueDate: "2021-10-13T00:00:00.000Z",
    paymentTerms: 30,
    description: "",
    items: [{ id: "1", name: "Design Work", quantity: 1, price: 3102.04 }],
  },
]
