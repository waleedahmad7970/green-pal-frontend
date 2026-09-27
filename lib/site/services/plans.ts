import apiClient from "@/lib/apiClient";
import { Plan } from "@/lib/admin/types";
import { normalize, normalizeList } from "@/lib/admin/services/utils";

export async function listPlans(): Promise<Plan[]> {
  const response = await apiClient.get("/plans");
  return normalizeList<Plan>(response as any);
}

export async function createPlan(
  data: Omit<Plan, "id">,
): Promise<Plan> {
  const response = await apiClient.post("/plans", data);
  return normalize<Plan>(response as any);
}

export async function updatePlan(
  id: string,
  data: Partial<Plan>,
): Promise<Plan> {
  const response = await apiClient.put(`/plans/${id}`, data);
  return normalize<Plan>(response as any);
}

export async function deletePlan(id: string): Promise<void> {
  await apiClient.delete(`/plans/${id}`);
}