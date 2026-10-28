// lib/admin/services/planTierService.ts
import apiClient from "@/lib/apiClient";

export interface PlanTierSpecs {
  dimensions: string;
  weight: string;
  screen: string;
  formFactor: string;
  bestFor: string;
}

export interface PlanTier {
  _id?: string;
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  slots: 8 | 12 | 24 | 48 | number;
  popular?: boolean;
  image: string;
  blurb: string;
  features: string[];
  specs: PlanTierSpecs;
  sortOrder: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchAdminPlanTiers(): Promise<PlanTier[]> {
  const response = await apiClient.get("/plan-tiers/admin/all");
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function fetchAdminPlanTierById(id: string): Promise<PlanTier> {
  const response = await apiClient.get(`/plan-tiers/${id}`);
  const body = response?.data || response;
  return body?.data || body;
}

export async function createPlanTier(data: Partial<PlanTier>): Promise<PlanTier> {
  const response = await apiClient.post("/plan-tiers", data);
  const body = response?.data || response;
  return body?.data || body;
}

export async function updatePlanTier(id: string, data: Partial<PlanTier>): Promise<PlanTier> {
  const response = await apiClient.put(`/plan-tiers/${id}`, data);
  const body = response?.data || response;
  return body?.data || body;
}

export async function togglePlanTier(id: string): Promise<PlanTier> {
  const response = await apiClient.patch(`/plan-tiers/${id}/toggle`);
  const body = response?.data || response;
  return body?.data || body;
}

export async function deletePlanTier(id: string): Promise<any> {
  const response = await apiClient.delete(`/plan-tiers/${id}`);
  return response?.data || response;
}

export interface GenerateLinkParams {
  customerEmail?: string;
  customerName?: string;
  customPrice?: number;
}

export async function generatePlanTierPaymentLink(
  id: string,
  params?: GenerateLinkParams
): Promise<{ url: string; sessionId: string; price: number }> {
  const response = await apiClient.post(`/plan-tiers/${id}/payment-link`, params || {});
  const body = response?.data || response;
  return body?.data || body;
}
