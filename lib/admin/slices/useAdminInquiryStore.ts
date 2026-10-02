import { create } from "zustand";
import { fetchAllInquiries, updateInquiryStatus, generateCheckoutLink } from "@/lib/admin/services/inquiryAdminService";
import { Inquiry } from "@/lib/site/services/inquiryService";
import toast from "react-hot-toast";

interface AdminInquiryState {
  inquiries: Inquiry[];
  isLoading: boolean;
  fetchInquiries: (status?: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  generateLink: (id: string, customPrice: number) => Promise<void>;
}

export const useAdminInquiryStore = create<AdminInquiryState>((set, get) => ({
  inquiries: [],
  isLoading: false,

  fetchInquiries: async (status?: string) => {
    set({ isLoading: true });
    try {
      const data = await fetchAllInquiries(status);
      set({ inquiries: Array.isArray(data) ? data : [] });
    } catch (error: any) {
      toast.error("Failed to fetch inquiries");
      set({ inquiries: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success("Inquiry status updated");
      get().fetchInquiries();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
      throw error;
    }
  },

  generateLink: async (id: string, customPrice: number) => {
    try {
      await generateCheckoutLink(id, customPrice);
      toast.success("Checkout link generated");
      get().fetchInquiries();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to generate checkout link");
      throw error;
    }
  },
}));
