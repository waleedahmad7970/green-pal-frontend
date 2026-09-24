import { create } from "zustand";
import {
    listProducts,
    createProduct as apiCreateProduct,
    updateProduct as apiUpdateProduct,
    deleteProduct as apiDeleteProduct,
} from "@/lib/admin/services/products";
import type { Product } from "@/lib/admin/types";

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    createProduct: (data: any) => Promise<void>;
    updateProduct: (id: string, data: any) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,

    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const products = await listProducts();
            set({ products, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch products:", error);
            set({ isLoading: false });
        }
    },

    createProduct: async (data) => {
        await apiCreateProduct(data);
        await get().fetchProducts(); // Automatically updates the list
    },

    updateProduct: async (id, data) => {
        await apiUpdateProduct(id, data);
        await get().fetchProducts(); // Automatically updates the list
    },

    deleteProduct: async (id) => {
        await apiDeleteProduct(id);
        await get().fetchProducts(); // Automatically updates the list
    },
}));