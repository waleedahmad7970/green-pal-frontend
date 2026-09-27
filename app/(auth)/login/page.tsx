"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { login } from "@/lib/site/services/auth";
import { useAdminAuth } from "@/lib/admin/auth";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const setAuth = useAdminAuth((s) => s.setAuth);
    const [error, setError] = useState("");

    // --- Submit Handler placed above ---
    const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
        setError("");
        try {
            const data = await login(values.email, values.password);

            if (data?.token) {
                // The response is flat ({ _id, name, email, token, ... }),
                // not nested under a "user" key — data.user was always
                // undefined, which is why the store ended up with user: null
                // even on a successful login. Destructure token out and
                // treat everything else as the user object.
                const { token, ...user } = data;
                setAuth(token, user);
            }

            router.push(redirectTo);
        } catch (err: any) {
            const message = err?.response?.data?.message || "Invalid email or password.";

            // Route to the relevant field inline when identifiable, same
            // pattern as the register page — otherwise fall back to the
            // banner (e.g. a generic "Invalid email or password" doesn't
            // clearly belong to just one field, so it stays as a banner).
            const lower = message.toLowerCase();
            if (lower.includes("email") && !lower.includes("password")) {
                setFieldError("email", message);
            } else if (lower.includes("password") && !lower.includes("email")) {
                setFieldError("password", message);
            } else {
                setError(message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // --- Field Renderer Helper with optional right element (e.g. Forgot Password link) ---
    const renderField = (
        name: string,
        label: string,
        type = "text",
        placeholder = "",
        rightElement?: React.ReactNode
    ) => (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <label className="text-[10px] text-muted font-body uppercase tracking-wider">
                    {label}
                </label>
                {rightElement}
            </div>
            <Field
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full bg-surface border line-rule rounded-full px-5 py-3.5 text-ink dark:text-sand placeholder:text-muted text-sm font-body focus:border-signal outline-none transition-colors"
            />
            <ErrorMessage name={name} component="div" className="text-red-400 text-xs mt-1 pl-3" />
        </div>
    );

    return (
        <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-28 md:py-36">
            <div className="w-full max-w-md bg-card border line-rule rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="mb-8 text-center">
                    <p className="font-body text-xs font-bold uppercase tracking-widest text-signal mb-2">
                        Welcome Back
                    </p>
                    <h1 className="font-display font-extrabold text-3xl tracking-tight text-ink dark:text-sand">
                        Sign in to Greenpal
                    </h1>
                </div>

                {/* Error Message Alert — only for errors not routed to a specific field */}
                {error && (
                    <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-body text-center">
                        {error}
                    </div>
                )}

                {/* Formik Wrapper */}
                <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5 font-body">
                            {renderField("email", "Email Address", "email", "name@example.com")}

                            {renderField(
                                "password",
                                "Password",
                                "password",
                                "••••••••",
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-signal hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 py-4 rounded-full bg-signal text-ink font-display font-bold text-base hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? "Signing in..." : "Sign In"}
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Footer switch */}
                <p className="text-center font-body text-sm text-muted mt-8">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-bold text-ink dark:text-sand hover:text-signal transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-surface flex items-center justify-center">
                    <p className="text-muted font-body text-sm animate-pulse">Loading...</p>
                </main>
            }
        >
            <LoginForm />
        </Suspense>
    );
}