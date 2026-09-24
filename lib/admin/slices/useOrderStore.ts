import { create } from "zustand";
import { listOrders, createOrder, updateOrder } from "@/lib/admin/services/orders";
import type { Order, OrderStatus } from "@/lib/admin/types";

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchOrders: () => Promise<void>;
    addOrder: (orderData: Partial<Order>) => Promise<void>;
    changeOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const data = await listOrders();
            // Handle response wrapping gracefully
            const ordersList = Array.isArray(data) ? data : data?.data || [];
            set({ orders: ordersList, loading: false });
        } catch (err: any) {
            set({
                error: err?.message || "Failed to fetch orders",
                loading: false,
            });
        }
    },

    addOrder: async (orderData) => {
        set({ loading: true, error: null });
        try {
            await createOrder(orderData);
            await get().fetchOrders(); // Refresh list after creation
        } catch (err: any) {
            set({
                error: err?.message || "Failed to create order",
                loading: false,
            });
        }
    },

    changeOrderStatus: async (orderId, status) => {
        try {
            // Optimistic update
            set((state) => ({
                orders: state.orders.map((o) =>
                    (o._id === orderId || o.id === orderId) ? { ...o, status } : o
                ),
            }));
            await updateOrder(orderId, { status });
        } catch (err: any) {
            // Revert/refresh on failure
            await get().fetchOrders();
            set({ error: err?.message || "Failed to update order status" });
        }
    },
}));