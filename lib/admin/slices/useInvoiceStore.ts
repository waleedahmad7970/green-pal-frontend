// lib/admin/slices/useInvoiceStore.ts
import { create } from "zustand";
import { listInvoices, createInvoice, updateInvoice } from "@/lib/admin/services/invoices";
import type { Invoice, InvoiceStatus } from "@/lib/admin/types";
import toast from "react-hot-toast";

interface InvoiceState {
    invoices: Invoice[];
    loading: boolean;
    fetchInvoices: () => Promise<void>;
    addInvoice: (data: any) => Promise<void>;
    changeInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
    invoices: [],
    loading: false,

    fetchInvoices: async () => {
        set({ loading: true });
        try {
            const data = await listInvoices();
            set({ invoices: Array.isArray(data) ? data : [] });
        } catch (error) {
            toast.error("Failed to fetch invoices");
            set({ invoices: [] });
        } finally {
            set({ loading: false });
        }
    },

    addInvoice: async (data: any) => {
        try {
            await createInvoice(data);
            toast.success("Invoice created successfully");
            get().fetchInvoices();
        } catch (error) {
            toast.error("Failed to create invoice");
            throw error;
        }
    },

    changeInvoiceStatus: async (id: string, status: InvoiceStatus) => {
        try {
            await updateInvoice(id, { status });
            toast.success("Invoice status updated");
            get().fetchInvoices();
        } catch (error) {
            toast.error("Failed to update invoice status");
            throw error;
        }
    },
}));