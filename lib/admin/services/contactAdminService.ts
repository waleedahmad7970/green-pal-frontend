import apiClient from "@/lib/apiClient";

export type ContactStatus = "unread" | "read" | "replied";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  availability?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export const CONTACT_STATUSES: ContactStatus[] = ["unread", "read", "replied"];

export async function fetchContacts(status?: string): Promise<ContactMessage[]> {
  const url = status ? `/admin/contacts?status=${status}` : "/admin/contacts";
  const response = await apiClient.get(url);
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const response = await apiClient.patch(`/admin/contacts/${id}`, { status });
  const body = response?.data || response;
  return body?.data || body;
}
