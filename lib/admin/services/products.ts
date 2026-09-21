import apiClient from "@/lib/apiClient";
import { normalize, normalizeList } from "./utils";
import type { Product } from "../types";

export async function listProducts(): Promise<Product[]> {
  const response = await apiClient.get("/products");
  return normalizeList<Product>(response as any);
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const response = await apiClient.post("/products", data);
  return normalize<Product>(response as any);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const response = await apiClient.put(`/products/${id}`, data);
  return normalize<Product>(response as any);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
