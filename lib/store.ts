"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "greenpal-theme" }
  )
);

interface NavState {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
}));
