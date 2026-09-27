import { create } from "zustand";
import {
    listPlans,
    createPlan as apiCreatePlan,
    updatePlan as apiUpdatePlan,
    deletePlan as apiDeletePlan,
} from "@/lib/admin/services/plans";
import type { Plan } from "@/lib/admin/types";

interface PlanStore {
    plans: Plan[];
    isLoading: boolean;
    fetchPlans: () => Promise<void>;
    createPlan: (data: any) => Promise<void>;
    updatePlan: (id: string, data: any) => Promise<void>;
    deletePlan: (id: string) => Promise<void>;
}

export const usePlanStore = create<PlanStore>((set, get) => ({
    plans: [],
    isLoading: false,

    fetchPlans: async () => {
        set({ isLoading: true });
        try {
            const plans = await listPlans();
            set({ plans, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch plans:", error);
            set({ isLoading: false });
        }
    },

    createPlan: async (data) => {
        await apiCreatePlan(data);
        await get().fetchPlans(); // Automatically updates the list
    },

    updatePlan: async (id, data) => {
        await apiUpdatePlan(id, data);
        await get().fetchPlans(); // Automatically updates the list
    },

    deletePlan: async (id) => {
        await apiDeletePlan(id);
        await get().fetchPlans(); // Automatically updates the list
    },
}));