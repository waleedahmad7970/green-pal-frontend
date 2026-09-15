"use client";

import { useState } from "react";
import { useAdminAuth } from "@/lib/admin/auth";
import GPMark from "@/components/GPMark";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(password);
    setError(!ok);
  };

  return (
    <div className="min-h-screen bg-ink text-sand flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <GPMark className="w-7 h-5 text-signal" />
          <span className="font-display font-extrabold text-base tracking-tight">GREENPAL ADMIN</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-sm text-sand/45 mb-2 font-body">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-sand/5 border border-sand/15 focus:border-signal outline-none rounded-lg px-4 py-3 font-body text-sand transition-colors duration-300"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400 font-body">Incorrect password. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full bg-signal text-ink font-body font-medium py-3 rounded-lg"
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-sand/30 font-body mt-8 text-center leading-relaxed">
          Demo gate only — checked client-side. Replace with real
          authentication once the backend is connected.
        </p>
      </div>
    </div>
  );
}
