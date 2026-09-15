"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  isAuthed: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

// NOTE — placeholder auth only.
// This checks the password entirely client-side against
// NEXT_PUBLIC_ADMIN_DEMO_PASSWORD, which means the "password" ships in the
// JS bundle and offers no real security. It exists purely so the admin UI
// isn't wide open during development. When the backend exists, replace this
// with real authentication (e.g. NextAuth, a session cookie set by your API,
// etc.) and remove NEXT_PUBLIC_ADMIN_DEMO_PASSWORD entirely.
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD || "greenpal-admin";

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      login: (password: string) => {
        const ok = password === DEMO_PASSWORD;
        if (ok) set({ isAuthed: true });
        return ok;
      },
      logout: () => set({ isAuthed: false }),
    }),
    { name: "greenpal-admin-auth" }
  )
);
