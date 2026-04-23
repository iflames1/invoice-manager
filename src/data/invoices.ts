export type InvoiceStatus = "paid" | "pending" | "draft"

export type InvoiceItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type Invoice = {
  id: string
  due: string
  client: string
  email: string
  amount: number
  status: InvoiceStatus
  billFrom: {
    street: string
    city: string
    postCode: string
    country: string
  }
  billTo: {
    street: string
    city: string
    postCode: string
    country: string
  }
  issueDate: string
  paymentTerms: string
  description: string
  items: InvoiceItem[]
}

export const invoices: Invoice[] = [
  {
    id: "RT3080",
    due: "19 Aug 2021",
    client: "Jensen Huang",
    email: "jensenh@mail.com",
    amount: 1800.9,
    status: "paid",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    issueDate: "21 Aug 2021",
    paymentTerms: "Net 30 Days",
    description: "Graphic Design",
    items: [
      { id: "1", name: "Banner Design", quantity: 1, price: 156 },
      { id: "2", name: "Email Design", quantity: 2, price: 200 },
    ],
  },
  {
    id: "XM9141",
    due: "20 Sep 2021",
    client: "Alex Grim",
    email: "alexgrim@mail.com",
    amount: 556.0,
    status: "pending",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    issueDate: "21 Aug 2021",
    paymentTerms: "Net 30 Days",
    description: "Website Redesign",
    items: [
      { id: "1", name: "Banner Design", quantity: 1, price: 156 },
      { id: "2", name: "Email Design", quantity: 2, price: 200 },
    ],
  },
  {
    id: "RG0314",
    due: "01 Oct 2021",
    client: "John Morrison",
    email: "john@mail.com",
    amount: 14002.33,
    status: "paid",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "79 Dover Road",
      city: "Westhall",
      postCode: "IP19 3PF",
      country: "United Kingdom",
    },
    issueDate: "01 Sep 2021",
    paymentTerms: "Net 30 Days",
    description: "Brand Identity",
    items: [{ id: "1", name: "Brand Guidelines", quantity: 1, price: 14002.33 }],
  },
  {
    id: "RT2080",
    due: "12 Oct 2021",
    client: "Alysa Werner",
    email: "alysa@mail.com",
    amount: 102.04,
    status: "pending",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "46 Abbey Row",
      city: "Cambridge",
      postCode: "CB5 6EG",
      country: "United Kingdom",
    },
    issueDate: "12 Sep 2021",
    paymentTerms: "Net 30 Days",
    description: "Logo Re-design",
    items: [{ id: "1", name: "Logo Redesign", quantity: 1, price: 102.04 }],
  },
  {
    id: "AA1449",
    due: "14 Oct 2021",
    client: "Mellisa Clarke",
    email: "mellisa@mail.com",
    amount: 4032.33,
    status: "pending",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "54 Park Avenue",
      city: "Manchester",
      postCode: "M1 2DE",
      country: "United Kingdom",
    },
    issueDate: "14 Sep 2021",
    paymentTerms: "Net 30 Days",
    description: "Website Design",
    items: [{ id: "1", name: "Website Design", quantity: 1, price: 4032.33 }],
  },
  {
    id: "TY9141",
    due: "31 Oct 2021",
    client: "Thomas Wayne",
    email: "thomas@dc.com",
    amount: 6155.91,
    status: "pending",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "1007 Mountain Drive",
      city: "Gotham",
      postCode: "GT1 1GT",
      country: "United States",
    },
    issueDate: "01 Oct 2021",
    paymentTerms: "Net 30 Days",
    description: "Security System Consultation",
    items: [{ id: "1", name: "Consultation", quantity: 1, price: 6155.91 }],
  },
  {
    id: "FV2353",
    due: "12 Nov 2021",
    client: "Anita Wainwright",
    email: "anita@mail.com",
    amount: 3102.04,
    status: "draft",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    issueDate: "13 Oct 2021",
    paymentTerms: "Net 30 Days",
    description: "",
    items: [{ id: "1", name: "Design Work", quantity: 1, price: 3102.04 }],
  },
]
