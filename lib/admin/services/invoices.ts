// lib/admin/services/invoices.ts
import apiClient from "@/lib/apiClient";

export async function listInvoices() {
  const response = await apiClient.get("/invoices");
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function createInvoice(data: any) {
  const response = await apiClient.post("/invoices", data);
  const body = response?.data || response;
  return body?.data || body;
}

export async function updateInvoice(id: string, data: any) {
  const response = await apiClient.put(`/invoices/${id}`, data);
  const body = response?.data || response;
  return body?.data || body;
}