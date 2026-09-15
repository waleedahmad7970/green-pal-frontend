"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, Location, Purchase, Invoice } from "./types";
import { seedOrders, seedLocations, seedPurchases, seedInvoices } from "./mockData";

interface AdminDataState {
  orders: Order[];
  locations: Location[];
  purchases: Purchase[];
  invoices: Invoice[];
  setOrders: (orders: Order[]) => void;
  setLocations: (locations: Location[]) => void;
  setPurchases: (purchases: Purchase[]) => void;
  setInvoices: (invoices: Invoice[]) => void;
}

// This store is the ENTIRE "database" for the admin panel right now — it's
// only here because there's no backend yet. Every read/write in lib/admin/api.ts
// goes through this store. When the real backend is ready, api.ts's functions
// get rewritten to call `fetch()` instead, and this file (plus mockData.ts)
// can be deleted; no page component needs to change.
export const useAdminData = create<AdminDataState>()(
  persist(
    (set) => ({
      orders: seedOrders,
      locations: seedLocations,
      purchases: seedPurchases,
      invoices: seedInvoices,
      setOrders: (orders) => set({ orders }),
      setLocations: (locations) => set({ locations }),
      setPurchases: (purchases) => set({ purchases }),
      setInvoices: (invoices) => set({ invoices }),
    }),
    { name: "greenpal-admin-data" }
  )
);
