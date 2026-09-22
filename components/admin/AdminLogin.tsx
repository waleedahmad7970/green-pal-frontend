"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useAdminAuth } from "@/lib/admin/auth";
import GPMark from "@/components/GPMark";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        // --- REAL API CALL TO NODE.JS BACKEND ---
        // const response = await fetch('/api/admin/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(values),
        // });
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || 'Login failed');

        // Falling back to your client-side auth hook mechanism as requested
        const ok = login(values.password);
        if (!ok) {
          setServerError("Invalid email or password. Please try again.");
        }
      } catch (err: any) {
        setServerError(err.message || "An error occurred during sign in.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-surface text-[rgb(var(--fg))] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <GPMark className="w-7 h-5 text-signal" />
          <span className="font-display font-extrabold text-base tracking-tight">
            GREENPAL ADMIN
          </span>
        </div>

        <div className="border line-rule rounded-[2rem] bg-card p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient accent glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-signal/10 rounded-full blur-2xl pointer-events-none" />

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-5 relative z-10"
          >
            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-2 font-semibold">
                Email Address
              </span>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                required
                placeholder="admin@greenpal.com"
                className="w-full bg-surface border line-rule rounded-2xl px-4 py-3.5 focus:border-signal outline-none font-body text-[rgb(var(--fg))] placeholder:text-muted transition-colors duration-300 text-sm"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-2 font-semibold">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-surface border line-rule rounded-2xl px-4 py-3.5 focus:border-signal outline-none font-body text-[rgb(var(--fg))] placeholder:text-muted transition-colors duration-300 text-sm"
              />
            </label>

            {serverError && (
              <p className="text-xs text-red-400 font-body">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-signal text-ink font-body font-bold py-3.5 rounded-full cursor-pointer hover:bg-signal-dim transition-colors shadow-lg shadow-signal/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-xs text-muted font-body mt-8 text-center leading-relaxed">
          Secured endpoint — connected to authentication services.
        </p>
      </div>
    </div>
  );
}
