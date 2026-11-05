import apiClient from "@/lib/apiClient";

export type DepositStatus = "paid" | "contacted" | "converted" | "cancelled";

export interface Deposit {
  _id: string;
  depositType: string;
  label: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  reference?: string;
  amount: number;
  currency: string;
  nonRefundable: boolean;
  status: DepositStatus;
  notes?: string;
  paymentDetails?: { receiptUrl?: string; stripeSessionId?: string };
  paidAt?: string;
  createdAt: string;
}

export const DEPOSIT_STATUSES: DepositStatus[] = ["paid", "contacted", "converted", "cancelled"];

export async function fetchDeposits(status?: string): Promise<Deposit[]> {
  const url = status ? `/admin/deposits?status=${status}` : "/admin/deposits";
  const response = await apiClient.get(url);
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function updateDeposit(id: string, patch: { status?: DepositStatus; notes?: string }) {
  const response = await apiClient.patch(`/admin/deposits/${id}`, patch);
  const body = response?.data || response;
  return body?.data || body;
}
