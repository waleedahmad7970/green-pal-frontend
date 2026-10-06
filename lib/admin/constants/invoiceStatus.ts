export const INVOICE_STATUSES = ["draft", "pending", "paid", "overdue", "cancelled"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];