import { create } from "zustand";
import {
    listLocations,
    createLocation as apiCreateLocation,
    updateLocation as apiUpdateLocation,
    deleteLocation as apiDeleteLocation,
} from "@/lib/admin/services/locations";
import type { Location } from "@/lib/admin/types";

interface LocationStore {
    locations: Location[];
    isLoading: boolean;
    fetchLocations: () => Promise<void>;
    createLocation: (data: Omit<Location, "id">) => Promise<void>;
    updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
    locations: [],
    isLoading: false,

    fetchLocations: async () => {
        set({ isLoading: true });
        try {
            const locations = await listLocations();
            set({ locations, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch locations:", error);
            set({ isLoading: false });
        }
    },

    createLocation: async (data) => {
        await apiCreateLocation(data);
        await get().fetchLocations(); // Auto-refresh the list
    },

    updateLocation: async (id, data) => {
        await apiUpdateLocation(id, data);
        await get().fetchLocations(); // Auto-refresh the list
    },

    deleteLocation: async (id) => {
        await apiDeleteLocation(id);
        await get().fetchLocations(); // Auto-refresh the list
    },
}));