import apiClient from "@/lib/apiClient";

export interface CustomPaymentLink {
  _id: string;
  url: string;
  title: string;
  description?: string;
  note?: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  reusable: boolean;
  status: "active" | "paid" | "cancelled";
  paidCount: number;
  createdAt: string;
}

export interface NewPaymentLink {
  title: string;
  amount: number;
  currency: "cad" | "usd";
  description?: string;
  note?: string;
  customerName?: string;
  customerEmail?: string;
  reusable: boolean;
}

const unwrap = (response: any) => {
  const body = response?.data || response;
  return body?.data || body;
};

export async function fetchPaymentLinks(): Promise<CustomPaymentLink[]> {
  const data = unwrap(await apiClient.get("/admin/payment-links"));
  return Array.isArray(data) ? data : [];
}

export async function createPaymentLink(payload: NewPaymentLink): Promise<CustomPaymentLink> {
  return unwrap(await apiClient.post("/admin/payment-links", payload));
}

export async function cancelPaymentLink(id: string): Promise<CustomPaymentLink> {
  return unwrap(await apiClient.patch(`/admin/payment-links/${id}/cancel`));
}
