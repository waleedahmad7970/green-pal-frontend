import type { Invoice } from "../types";
import apiClient from "../../apiClient";
import { normalize, normalizeList } from "./utils";

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
