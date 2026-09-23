"use client";

import { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import GPMark from "@/components/GPMark";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);

      if (values.password !== values.confirmPassword) {
        setServerError("Passwords do not match.");
        setSubmitting(false);
        return;
      }

      try {
        // Calling your backend registration endpoint
        await apiClient.post("/users/register", {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        // Success toast and response unwrapping are handled globally by apiClient!
      } catch (err: any) {
        setServerError(err || "Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-ink text-sand flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <GPMark className="w-7 h-5 text-signal" />
          <span className="font-display font-extrabold text-base tracking-tight">
            GREENPAL ADMIN
          </span>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-sm text-sand/45 mb-2 font-body">
              Full Name
            </span>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
              placeholder="Sameer Khan"
              className="w-full bg-sand/5 border border-sand/15 focus:border-signal outline-none rounded-lg px-4 py-3 font-body text-sand transition-colors duration-300"
            />
          </label>

          <label className="block">
            <span className="block text-sm text-sand/45 mb-2 font-body">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
              placeholder="admin@greenpal.com"
              className="w-full bg-sand/5 border border-sand/15 focus:border-signal outline-none rounded-lg px-4 py-3 font-body text-sand transition-colors duration-300"
            />
          </label>

          <label className="block">
            <span className="block text-sm text-sand/45 mb-2 font-body">
              Password
            </span>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-sand/5 border border-sand/15 focus:border-signal outline-none rounded-lg px-4 py-3 font-body text-sand transition-colors duration-300"
            />
          </label>

          <label className="block">
            <span className="block text-sm text-sand/45 mb-2 font-body">
              Confirm Password
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-sand/5 border border-sand/15 focus:border-signal outline-none rounded-lg px-4 py-3 font-body text-sand transition-colors duration-300"
            />
          </label>

          {serverError && (
            <p className="text-sm text-red-400 font-body">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-signal text-ink font-body font-medium py-3 rounded-lg disabled:opacity-50 cursor-pointer transition-opacity"
          >
            {formik.isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-sand/30 font-body">
            Already have an account?{" "}
            <Link href="/admin/login" className="text-signal hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
