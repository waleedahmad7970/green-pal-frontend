import apiClient from "@/lib/apiClient";
import { Inquiry } from "@/lib/site/services/inquiryService";

export async function fetchAllInquiries(status?: string) {
  const url = status ? `/admin/inquiries?status=${status}` : "/admin/inquiries";
  const response = await apiClient.get(url);
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function updateInquiryStatus(id: string, status: string) {
  const response = await apiClient.patch(`/admin/inquiries/${id}/status`, { status });
  const body = response?.data || response;
  return body?.data || body;
}

export async function generateCheckoutLink(id: string, customPrice: number) {
  const response = await apiClient.post(`/admin/inquiries/${id}/checkout-link`, { customPrice });
  const body = response?.data || response;
  return body?.data || body;
}
