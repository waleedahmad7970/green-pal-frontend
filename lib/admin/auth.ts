"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  isAuthed: boolean;
  token: string | null;
  user: any | null;
  setAuth: (token: string, user?: any) => void;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      token: null,
      user: null,
      setAuth: (token: string, user: any = null) => {
        // Save token to localStorage for apiClient to pick up
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        set({ isAuthed: true, token, user });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ isAuthed: false, token: null, user: null });
      },
    }),
    { name: "greenpal-admin-auth" },
  ),
);
