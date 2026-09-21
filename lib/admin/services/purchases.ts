import type { Purchase } from "../types";
import apiClient from "../../apiClient";
import { normalize, normalizeList } from "./utils";

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
