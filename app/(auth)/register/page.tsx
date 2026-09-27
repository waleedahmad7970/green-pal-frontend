"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "@/lib/site/services/auth";
import { useAdminAuth } from "@/lib/admin/auth";

// --- Frontend Validation Schema ---
const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Please provide a valid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAdminAuth((s) => s.setAuth);
    const [serverError, setServerError] = useState("");

    const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
        setServerError("");
        try {
            // Fixed call order: register(name, email, password), matching the
            // service function's actual parameter order. This used to pass
            // (values.name, values.email, values.password) into a function
            // expecting (email, name, password) — silently swapping the two
            // fields in every request.
            const data = await register(values.name, values.email, values.password);

            if (data?.token) {
                // Same fix as the login page: the response is flat
                // ({ _id, name, email, token, ... }), not nested under a
                // "user" key, so data.user was always undefined.
                const { token, ...user } = data;
                setAuth(token, user);
            }

            router.push("/");
        } catch (err: any) {
            const message = err?.response?.data?.message || "Failed to create account. Please try again.";

            // Route the backend error to the field it's actually about, so it
            // renders inline via <ErrorMessage> like a normal validation error,
            // instead of only ever showing as a generic banner. Falls back to
            // the banner for anything that isn't clearly about one field (e.g.
            // a network/server outage message).
            const lower = message.toLowerCase();
            if (lower.includes("email")) {
                setFieldError("email", message);
            } else if (lower.includes("password")) {
                setFieldError("password", message);
            } else if (lower.includes("name")) {
                setFieldError("name", message);
            } else {
                setServerError(message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (name: string, label: string, type = "text", placeholder = "") => (
        <div className="space-y-1">
            <label className="text-[10px] text-muted font-body uppercase tracking-wider">
                {label}
            </label>
            <Field
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full bg-surface border line-rule rounded-full px-5 py-3.5 text-ink dark:text-sand placeholder:text-muted text-sm font-body focus:border-signal outline-none transition-colors"
            />
            {/* Shows both client-side Yup errors AND backend errors routed
                here via setFieldError above — Formik treats them the same way */}
            <ErrorMessage name={name} component="div" className="text-red-400 text-xs mt-1 pl-5" />
        </div>
    );

    return (
        <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-28 md:py-36">
            <div className="w-full max-w-md bg-card border line-rule rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">

                <div className="mb-8 text-center">
                    <p className="font-body text-xs font-bold uppercase tracking-widest text-signal mb-2">
                        Get Started
                    </p>
                    <h1 className="font-display font-extrabold text-3xl tracking-tight text-ink dark:text-sand">
                        Create an Account
                    </h1>
                </div>

                {/* Only shows for errors that couldn't be routed to a specific field */}
                {serverError && (
                    <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-body text-center">
                        {serverError}
                    </div>
                )}

                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5 font-body">
                            {renderField("name", "Full Name", "text", "Sameer Khan")}
                            {renderField("email", "Email Address", "email", "name@example.com")}
                            {renderField("password", "Password", "password", "••••••••")}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 py-4 rounded-full bg-signal text-ink font-display font-bold text-base hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? "Creating account..." : "Sign Up"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p className="text-center font-body text-sm text-muted mt-8">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-ink dark:text-sand hover:text-signal transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}