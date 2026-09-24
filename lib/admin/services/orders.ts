import type { Order } from "../types";
import apiClient from "../../apiClient";
import { normalize, normalizeList } from "./utils";

export async function listOrders(): Promise<Order[]> {
  try {
    const response = await apiClient.get("/orders");
    console.log("1. RAW RESPONSE FROM API:", response);

    // If apiClient already extracted the data, 'response' IS the payload.
    // Otherwise, we look inside response.data
    const payload = response.data !== undefined ? response.data : response;

    // Now extract the actual array from your ApiResponse wrapper
    const ordersArray = Array.isArray(payload.data) ? payload.data : payload;

    console.log("2. EXTRACTED ORDERS ARRAY:", ordersArray);

    return normalizeList<Order>(ordersArray || []);
  } catch (error) {
    console.error("🚨 API CLIENT ERROR:", error);
    return [];
  }
}
export async function createOrder(
  input: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<Order> {
  const response = await apiClient.post("/orders", input);
  // Ensure we grab the newly created order object from the backend wrapper
  return normalize<Order>(response.data.data || response.data);
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