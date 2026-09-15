
import type {
  Order,
  Location,
  Purchase,
  Invoice,
  MonthlyStat,
} from "./types";
import apiClient from "../apiClient";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Converts MongoDB `_id` into the frontend `id` field.
 */
function normalize<T>(doc: unknown): T {
  const value = doc as Record<string, unknown>;

  const { _id, id, ...rest } = value;

  return {
    ...rest,
    id: String(_id ?? id ?? ""),
  } as T;
}

/**
 * Normalizes a list of MongoDB documents.
 */
function normalizeList<T>(docs: unknown[]): T[] {
  return docs.map((doc) => normalize<T>(doc));
}

// ============================================================================
// Orders
// ============================================================================

export async function listOrders(): Promise<Order[]> {
  const response = await apiClient.get("/orders");

  return normalizeList<Order>(response.data);
}

export async function createOrder(
  input: Omit<Order, "id" | "createdAt">
): Promise<Order> {
  const response = await apiClient.post("/orders", input);

  return normalize<Order>(response.data);
}

export async function updateOrder(
  orderId: string,
  patch: Partial<Order>
): Promise<void> {
  await apiClient.put(`/orders/${orderId}`, patch);
}

export async function deleteOrder(orderId: string): Promise<void> {
  await apiClient.delete(`/orders/${orderId}`);
}

// ============================================================================
// Locations
// ============================================================================

export async function listLocations(): Promise<Location[]> {
  const response = await apiClient.get("/locations");

  return normalizeList<Location>(response.data);
}

export async function createLocation(
  input: Omit<Location, "id">
): Promise<Location> {
  const response = await apiClient.post("/locations", input);

  return normalize<Location>(response.data);
}

export async function updateLocation(
  locationId: string,
  patch: Partial<Location>
): Promise<void> {
  await apiClient.put(`/locations/${locationId}`, patch);
}

export async function deleteLocation(locationId: string): Promise<void> {
  await apiClient.delete(`/locations/${locationId}`);
}

// ============================================================================
// Purchases
// ============================================================================

export async function listPurchases(): Promise<Purchase[]> {
  const response = await apiClient.get("/purchases");

  return normalizeList<Purchase>(response.data);
}

export async function createPurchase(
  input: Omit<Purchase, "id">
): Promise<Purchase> {
  const response = await apiClient.post("/purchases", input);

  return normalize<Purchase>(response.data);
}

export async function updatePurchase(
  purchaseId: string,
  patch: Partial<Purchase>
): Promise<void> {
  await apiClient.put(`/purchases/${purchaseId}`, patch);
}

// ============================================================================
// Invoices
// ============================================================================

export async function listInvoices(): Promise<Invoice[]> {
  const response = await apiClient.get("/invoices");

  return normalizeList<Invoice>(response.data);
}

export async function createInvoice(
  input: Omit<Invoice, "id">
): Promise<Invoice> {
  const response = await apiClient.post("/invoices", input);

  return normalize<Invoice>(response.data);
}

export async function updateInvoice(
  invoiceId: string,
  patch: Partial<Invoice>
): Promise<void> {
  await apiClient.put(`/invoices/${invoiceId}`, patch);
}

// ============================================================================
// Reporting
// ============================================================================

export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  // Aggregated from live orders.
  // Backend currently has no dedicated stats endpoint.
  const orders = await listOrders();

  const map = new Map<
    string,
    {
      revenue: number;
      orders: number;
    }
  >();

  for (const order of orders) {
    const month = order.createdAt?.slice(0, 7) ?? "Unknown";

    const existing = map.get(month) ?? {
      revenue: 0,
      orders: 0,
    };

    map.set(month, {
      revenue: existing.revenue + (order.amount ?? 0),
      orders: existing.orders + 1,
    });
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { revenue, orders }]) => ({
      month,
      revenue,
      orders,
      uptime: 99,
    }));
}

