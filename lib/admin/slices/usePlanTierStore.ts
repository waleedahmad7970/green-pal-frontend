// lib/admin/slices/usePlanTierStore.ts
import { create } from "zustand";
import {
  fetchAdminPlanTiers,
  createPlanTier,
  updatePlanTier,
  deletePlanTier,
  togglePlanTier,
  generatePlanTierPaymentLink,
  GenerateLinkParams,
  PlanTier,
} from "@/lib/admin/services/planTierService";
import toast from "react-hot-toast";

interface PlanTierState {
  tiers: PlanTier[];
  isLoading: boolean;
  fetchTiers: () => Promise<void>;
  createTier: (data: Partial<PlanTier>) => Promise<void>;
  updateTier: (id: string, data: Partial<PlanTier>) => Promise<void>;
  deleteTier: (id: string) => Promise<void>;
  toggleTier: (id: string) => Promise<void>;
  generatePaymentLink: (id: string, params?: GenerateLinkParams) => Promise<{ url: string; sessionId: string; price: number }>;
}

export const usePlanTierStore = create<PlanTierState>((set, get) => ({
  tiers: [],
  isLoading: false,

  fetchTiers: async () => {
    set({ isLoading: true });
    try {
      const list = await fetchAdminPlanTiers();
      set({ tiers: Array.isArray(list) ? list : [] });
    } catch (error) {
      toast.error("Failed to fetch plan tiers");
      set({ tiers: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createTier: async (data: Partial<PlanTier>) => {
    try {
      await createPlanTier(data);
      toast.success("Plan tier created successfully");
      await get().fetchTiers();
    } catch (error: any) {
      throw error;
    }
  },

  updateTier: async (id: string, data: Partial<PlanTier>) => {
    try {
      await updatePlanTier(id, data);
      toast.success("Plan tier updated successfully");
      await get().fetchTiers();
    } catch (error: any) {
      throw error;
    }
  },

  deleteTier: async (id: string) => {
    try {
      await deletePlanTier(id);
      toast.success("Plan tier deleted successfully");
      await get().fetchTiers();
    } catch (error: any) {
      throw error;
    }
  },

  toggleTier: async (id: string) => {
    try {
      await togglePlanTier(id);
      toast.success("Plan tier status updated");
      await get().fetchTiers();
    } catch (error: any) {
      throw error;
    }
  },

  generatePaymentLink: async (id: string, params?: GenerateLinkParams) => {
    try {
      const result = await generatePlanTierPaymentLink(id, params);
      toast.success(params?.customerEmail ? "Payment link emailed to customer!" : "Payment link generated successfully!");
      return result;
    } catch (error: any) {
      throw error;
    }
  },
}));
