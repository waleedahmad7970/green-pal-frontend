"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
            {/* Decorative top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />

            {/* Animated Checkmark Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <svg
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-gray-900 mb-3">
                Payment Successful!
            </h1>
            <p className="text-gray-500 font-body text-sm sm:text-base mb-8">
                Thank you for your purchase. We've received your payment and are processing your Greenpal order.
            </p>

            {/* Order Reference Block */}
            {sessionId && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <p className="text-[11px] text-gray-400 font-body uppercase tracking-widest mb-1 font-semibold">
                            Order Reference
                        </p>
                        <p className="text-sm font-mono text-gray-800 truncate max-w-[200px] sm:max-w-[250px]">
                            {sessionId}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 px-3 py-1 rounded-md text-xs font-semibold text-green-600 shadow-sm">
                        Paid
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <Link
                    href="/"
                    className="flex items-center justify-center w-full bg-gray-900 text-white px-6 py-3.5 rounded-xl font-body font-medium hover:bg-gray-800 transition-colors shadow-md"
                >
                    Return to Dashboard
                </Link>
                <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center w-full bg-white border border-gray-200 text-gray-600 px-6 py-3.5 rounded-xl font-body font-medium hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Receipt
                </button>
            </div>
        </motion.div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-green-100 selection:text-green-900">
            <Suspense fallback={
                <div className="text-gray-400 font-body animate-pulse">Verifying payment...</div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}