import type { Order, Location, Purchase, Invoice, MonthlyStat } from "./types";
import { useAdminData } from "./store";
import { seedMonthlyStats } from "./mockData";

// Simulated network latency so loading states in the UI get exercised now,
// not discovered for the first time when a real backend is wired in.
const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Orders -----------------------------------------------------------
export async function listOrders(): Promise<Order[]> {
  await delay();
  return useAdminData.getState().orders;
}

export async function createOrder(input: Omit<Order, "id" | "createdAt">): Promise<Order> {
  await delay();
  const order: Order = { ...input, id: id("ord"), createdAt: new Date().toISOString().slice(0, 10) };
  const { orders, setOrders } = useAdminData.getState();
  setOrders([order, ...orders]);
  return order;
}

export async function updateOrder(orderId: string, patch: Partial<Order>): Promise<void> {
  await delay();
  const { orders, setOrders } = useAdminData.getState();
  setOrders(orders.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
}

export async function deleteOrder(orderId: string): Promise<void> {
  await delay();
  const { orders, setOrders } = useAdminData.getState();
  setOrders(orders.filter((o) => o.id !== orderId));
}

// ---- Locations ----------------------------------------------------------
export async function listLocations(): Promise<Location[]> {
  await delay();
  return useAdminData.getState().locations;
}

export async function createLocation(input: Omit<Location, "id">): Promise<Location> {
  await delay();
  const location: Location = { ...input, id: id("loc") };
  const { locations, setLocations } = useAdminData.getState();
  setLocations([location, ...locations]);
  return location;
}

export async function updateLocation(locationId: string, patch: Partial<Location>): Promise<void> {
  await delay();
  const { locations, setLocations } = useAdminData.getState();
  setLocations(locations.map((l) => (l.id === locationId ? { ...l, ...patch } : l)));
}

export async function deleteLocation(locationId: string): Promise<void> {
  await delay();
  const { locations, setLocations } = useAdminData.getState();
  setLocations(locations.filter((l) => l.id !== locationId));
}

// ---- Purchases ----------------------------------------------------------
export async function listPurchases(): Promise<Purchase[]> {
  await delay();
  return useAdminData.getState().purchases;
}

export async function createPurchase(input: Omit<Purchase, "id">): Promise<Purchase> {
  await delay();
  const purchase: Purchase = { ...input, id: id("pur") };
  const { purchases, setPurchases } = useAdminData.getState();
  setPurchases([purchase, ...purchases]);
  return purchase;
}

export async function updatePurchase(purchaseId: string, patch: Partial<Purchase>): Promise<void> {
  await delay();
  const { purchases, setPurchases } = useAdminData.getState();
  setPurchases(purchases.map((p) => (p.id === purchaseId ? { ...p, ...patch } : p)));
}

// ---- Invoices -----------------------------------------------------------
export async function listInvoices(): Promise<Invoice[]> {
  await delay();
  return useAdminData.getState().invoices;
}

export async function createInvoice(input: Omit<Invoice, "id">): Promise<Invoice> {
  await delay();
  const invoice: Invoice = { ...input, id: id("inv") };
  const { invoices, setInvoices } = useAdminData.getState();
  setInvoices([invoice, ...invoices]);
  return invoice;
}

export async function updateInvoice(invoiceId: string, patch: Partial<Invoice>): Promise<void> {
  await delay();
  const { invoices, setInvoices } = useAdminData.getState();
  setInvoices(invoices.map((i) => (i.id === invoiceId ? { ...i, ...patch } : i)));
}

// ---- Reporting ------------------------------------------------------------
export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  await delay();
  // Static for now — a real backend would aggregate this from orders/invoices.
  return seedMonthlyStats;
}
