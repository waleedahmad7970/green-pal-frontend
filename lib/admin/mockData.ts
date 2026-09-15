import type { Order, Location, Purchase, Invoice, MonthlyStat } from "./types";

export const seedLocations: Location[] = [
  { id: "loc_1", name: "Terminal 2 Departures", venue: "Metro International Airport", city: "Metro City", bays: 36, status: "live", installedAt: "2023-03-14" },
  { id: "loc_2", name: "Riverside Atrium", venue: "Riverside Shopping Centre", city: "Riverside", bays: 6, status: "live", installedAt: "2024-01-09" },
  { id: "loc_3", name: "Union Concourse", venue: "Union Station", city: "Union City", bays: 18, status: "live", installedAt: "2024-06-22" },
  { id: "loc_4", name: "Harborview Hall", venue: "Harborview Conference Centre", city: "Harborview", bays: 6, status: "installing", installedAt: "2026-09-01" },
];

export const seedOrders: Order[] = [
  { id: "ord_1001", customerName: "Jordan Blake", customerEmail: "jordan@example.com", locationId: "loc_1", item: "Power Bank Rental", amount: 6.5, status: "active", createdAt: "2026-09-10" },
  { id: "ord_1002", customerName: "Priya Shah", customerEmail: "priya@example.com", locationId: "loc_2", item: "Charging Session", amount: 3.0, status: "returned", createdAt: "2026-09-08" },
  { id: "ord_1003", customerName: "Sam Wu", customerEmail: "sam@example.com", locationId: "loc_3", item: "Utility Device", amount: 4.25, status: "pending", createdAt: "2026-09-12" },
  { id: "ord_1004", customerName: "Alicia Moreno", customerEmail: "alicia@example.com", locationId: "loc_1", item: "Power Bank Rental", amount: 6.5, status: "returned", createdAt: "2026-09-05" },
  { id: "ord_1005", customerName: "Tomas Reyes", customerEmail: "tomas@example.com", locationId: "loc_3", item: "Power Bank Rental", amount: 6.5, status: "cancelled", createdAt: "2026-09-11" },
];

export const seedPurchases: Purchase[] = [
  { id: "pur_501", supplier: "CellCore Manufacturing", item: "18650 Cell Packs", quantity: 500, cost: 4200, purchasedAt: "2026-08-20", received: true },
  { id: "pur_502", supplier: "Voltframe Metals", item: "Kiosk Chassis (Gen 3)", quantity: 12, cost: 18600, purchasedAt: "2026-09-01", received: false },
  { id: "pur_503", supplier: "TapPay Hardware", item: "NFC Payment Modules", quantity: 40, cost: 3100, purchasedAt: "2026-09-06", received: true },
];

export const seedInvoices: Invoice[] = [
  { id: "inv_9001", orderId: "ord_1001", customerName: "Jordan Blake", amount: 6.5, status: "paid", issuedAt: "2026-09-10", dueAt: "2026-09-17" },
  { id: "inv_9002", orderId: "ord_1002", customerName: "Priya Shah", amount: 3.0, status: "paid", issuedAt: "2026-09-08", dueAt: "2026-09-15" },
  { id: "inv_9003", orderId: "ord_1003", customerName: "Sam Wu", amount: 4.25, status: "sent", issuedAt: "2026-09-12", dueAt: "2026-09-19" },
  { id: "inv_9004", orderId: "ord_1005", customerName: "Tomas Reyes", amount: 6.5, status: "overdue", issuedAt: "2026-08-28", dueAt: "2026-09-04" },
];

export const seedMonthlyStats: MonthlyStat[] = [
  { month: "Apr", revenue: 18400, orders: 2100, uptime: 98.4 },
  { month: "May", revenue: 21200, orders: 2440, uptime: 98.9 },
  { month: "Jun", revenue: 23950, orders: 2680, uptime: 99.0 },
  { month: "Jul", revenue: 26100, orders: 2910, uptime: 98.7 },
  { month: "Aug", revenue: 28700, orders: 3120, uptime: 99.2 },
  { month: "Sep", revenue: 24300, orders: 2790, uptime: 99.2 },
];
