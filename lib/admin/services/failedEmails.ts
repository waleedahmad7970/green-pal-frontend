import apiClient from "../../apiClient";

export interface FailedEmail {
  _id: string;
  to: string;
  subject: string;
  status: "pending" | "retrying" | "sent";
  retryCount: number;
  nextRetryAt: string;
  lastError: string | null;
  emailType: string;
  createdAt: string;
}

export interface FailedEmailResponse {
  emails: FailedEmail[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function listFailedEmails(page = 1, limit = 20, status?: string): Promise<FailedEmailResponse> {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status && status !== "all") {
      params.append("status", status);
    }
    const response = await apiClient.get(`/admin/emails?${params.toString()}`);
    return (response as any) || { emails: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 1 } };
  } catch (error) {
    console.error("🚨 Failed to list emails:", error);
    return { emails: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 1 } };
  }
}

export async function retryFailedEmail(emailId: string): Promise<void> {
  await apiClient.post(`/admin/emails/${emailId}/retry`);
}

export async function retryAllFailedEmails(): Promise<void> {
  await apiClient.post(`/admin/emails/retry-all`);
}

export async function deleteFailedEmail(emailId: string): Promise<void> {
  await apiClient.delete(`/admin/emails/${emailId}`);
}
