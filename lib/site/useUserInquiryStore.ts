import { create } from "zustand";
import { createInquiry, fetchMyInquiries, Inquiry } from "@/lib/site/services/inquiryService";
import toast from "react-hot-toast";

interface UserInquiryState {
  inquiries: Inquiry[];
  isLoading: boolean;
  fetchInquiries: () => Promise<void>;
  createInquiry: (productId: string, message: string) => Promise<void>;
}

export const useUserInquiryStore = create<UserInquiryState>((set, get) => ({
  inquiries: [],
  isLoading: false,

  fetchInquiries: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchMyInquiries();
      set({ inquiries: Array.isArray(data) ? data : [] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch inquiries");
      set({ inquiries: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createInquiry: async (productId: string, message: string) => {
    try {
      await createInquiry(productId, message);
      toast.success("Inquiry submitted successfully!");
      get().fetchInquiries();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit inquiry");
      throw error;
    }
  },
}));
