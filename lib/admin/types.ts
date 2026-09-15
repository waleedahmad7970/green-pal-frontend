export type OrderStatus = "pending" | "active" | "returned" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  locationId: string;
  item: "Power Bank Rental" | "Charging Session" | "Utility Device";
  amount: number;
  status: OrderStatus;
  createdAt: string; // ISO date
}

export type LocationStatus = "live" | "installing" | "offline";

export interface Location {
  id: string;
  name: string;
  venue: string;
  city: string;
  bays: number;
  status: LocationStatus;
  installedAt: string;
}

export interface Purchase {
  id: string;
  supplier: string;
  item: string;
  quantity: number;
  cost: number;
  purchasedAt: string;
  received: boolean;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
}

export interface MonthlyStat {
  month: string;
  revenue: number;
  orders: number;
  uptime: number;
}
