"use client";

import { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAdminAuth } from "@/lib/admin/auth";
import GPMark from "@/components/GPMark";

export default function AdminLogin() {
  const router = useRouter();
  const { setAuth } = useAdminAuth(); // <--- Destructure setAuth here
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const response: any = await apiClient.post("/users/login", {
          email: values.email,
          password: values.password,
        });

        const token = response?.token;
        const userData = response?.data || response;

        if (token) {
          setAuth(token, userData); // <--- Now setAuth is defined and ready to use
          router.push("/admin");
        } else {
          setServerError("Invalid email or password. Please try again.");
        }
      } catch (err: any) {
        setServerError(
          typeof err === "string"
            ? err
            : err?.message ||
                "An error occurred during sign in. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-ink text-sand flex items-center justify-center px-6">
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
              Email
            </span>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
              placeholder="sameerkhan.prof@gmail.com"
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
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-sand/30 font-body">
            Don't have an account?{" "}
            <Link
              href="/admin/register"
              className="text-signal hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
