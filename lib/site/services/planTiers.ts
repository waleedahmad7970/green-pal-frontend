// lib/site/services/planTiers.ts
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
  slots: 8 | 12 | 24 | 48;
  popular?: boolean;
  image: string;
  blurb: string;
  features: string[];
  specs: PlanTierSpecs;
  sortOrder: number;
  isActive?: boolean;
}

export async function fetchPlanTiers(): Promise<PlanTier[]> {
  const response = await apiClient.get("/plan-tiers");
  const body = response?.data || response;
  const target = body?.data || body;
  return Array.isArray(target) ? target : [];
}

export async function fetchPlanTierBySlug(slug: string): Promise<PlanTier | null> {
  const response = await apiClient.get(`/plan-tiers/slug/${slug}`);
  const body = response?.data || response;
  return body?.data || body || null;
}
