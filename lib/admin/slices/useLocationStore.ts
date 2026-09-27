// lib/admin/slices/useLocationStore.ts
import { create } from "zustand";
import {
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    LocationItem
} from "@/lib/admin/services/locations";
import toast from "react-hot-toast";

interface LocationState {
    locations: LocationItem[];
    isLoading: boolean;
    fetchLocations: () => Promise<void>;
    createLocation: (data: LocationItem) => Promise<void>;
    updateLocation: (id: string, data: Partial<LocationItem>) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    locations: [],
    isLoading: false,

    fetchLocations: async () => {
        set({ isLoading: true });
        try {
            const locationArray = await fetchLocations();
            set({ locations: Array.isArray(locationArray) ? locationArray : [] });
        } catch (error) {
            toast.error("Failed to fetch locations");
            set({ locations: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    createLocation: async (data: LocationItem) => {
        try {
            await createLocation(data);
            toast.success("Location created successfully");
            get().fetchLocations();
        } catch (error) {
            toast.error("Failed to create location");
            throw error;
        }
    },

    updateLocation: async (id: string, data: Partial<LocationItem>) => {
        try {
            await updateLocation(id, data);
            toast.success("Location updated successfully");
            get().fetchLocations();
        } catch (error) {
            toast.error("Failed to update location");
            throw error;
        }
    },

    deleteLocation: async (id: string) => {
        try {
            await deleteLocation(id);
            toast.success("Location deleted successfully");
            get().fetchLocations();
        } catch (error) {
            toast.error("Failed to delete location");
            throw error;
        }
    },
}));