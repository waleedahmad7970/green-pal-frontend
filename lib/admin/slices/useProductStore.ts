// lib/admin/slices/useProductStore.ts
import { create } from "zustand";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product
} from "@/lib/admin/services/productService";
import toast from "react-hot-toast";

interface ProductState {
    products: Product[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    createProduct: (data: Product) => Promise<void>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoading: false,

    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const productArray = await fetchProducts();
            set({ products: Array.isArray(productArray) ? productArray : [] });
        } catch (error) {
            toast.error("Failed to fetch products");
            set({ products: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    createProduct: async (data: Product) => {
        try {
            await createProduct(data);
            toast.success("Product created successfully");
            get().fetchProducts();
        } catch (error) {
            toast.error("Failed to create product");
            throw error;
        }
    },

    updateProduct: async (id: string, data: Partial<Product>) => {
        try {
            await updateProduct(id, data);
            toast.success("Product updated successfully");
            get().fetchProducts();
        } catch (error) {
            toast.error("Failed to update product");
            throw error;
        }
    },

    deleteProduct: async (id: string) => {
        try {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
            get().fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
            throw error;
        }
    },
}));