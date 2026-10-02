import apiClient from "@/lib/apiClient";

export interface Inquiry {
  _id: string;
  user: any;
  product: any;
  productName: string;
  message: string;
  status: 'pending' | 'meeting_scheduled' | 'link_sent' | 'completed' | 'cancelled';
  customPrice?: number;
  stripeSessionId?: string;
  checkoutUrl?: string;
  createdAt: string;
}

export async function createInquiry(productId: string, message: string) {
  const response = await apiClient.post("/inquiries", { productId, message });
  const body = response?.data || response;
  return body?.data || body;
}

export async function fetchMyInquiries() {
  const response = await apiClient.get("/inquiries/me");
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}
