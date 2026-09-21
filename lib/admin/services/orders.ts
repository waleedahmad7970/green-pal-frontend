import type { Order } from "../types";
import apiClient from "../../apiClient";
import { normalize, normalizeList } from "./utils";

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
