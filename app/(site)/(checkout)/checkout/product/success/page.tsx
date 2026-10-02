"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Short reference the customer can quote to support (last 8 chars of the Stripe session)
  const reference = sessionId ? sessionId.slice(-8).toUpperCase() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden"
    >
      {/* Decorative top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-[#02d683]" />

      {/* Big Animated Checkmark Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-24 h-24 bg-emerald-50 text-[#02d683] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
      >
        <svg
          className="w-12 h-12"
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

      {/* Status Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
        <span className="w-2 h-2 rounded-full bg-[#02d683] animate-pulse" />
        Payment Received
      </div>

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 tracking-tight">
        Order Successful!
      </h1>
      <p className="text-gray-500 font-body text-sm sm:text-base mb-6 leading-relaxed">
        Thank you for your purchase. Your payment has been successfully
        processed.
      </p>

      {/* Email & Next Steps Box */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 text-left space-y-2">
        <div className="flex items-center gap-2 text-gray-900 font-display font-bold text-sm">
          <svg
            className="w-5 h-5 text-[#02d683] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Confirmation Sent to Your Email</span>
        </div>
        <p className="text-xs text-gray-500 font-body leading-relaxed pl-7">
          We&apos;ve sent your order confirmation to your inbox. If you
          don&apos;t see it within a few minutes, check your spam folder. Our
          team will be in touch shortly with the next steps for your product.
        </p>
      </div>

      {reference && (
        <p className="text-xs text-gray-400 font-mono mb-6">
          Reference: <span className="text-gray-600">{reference}</span>
        </p>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/"
          className="flex items-center justify-center bg-gray-900 text-white px-4 py-3 rounded-2xl font-body text-xs font-semibold hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-body text-xs font-semibold hover:bg-gray-50 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </motion.div>
  );
}

export default function CheckoutProductSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-emerald-100 selection:text-emerald-900">
      <Suspense
        fallback={
          <div className="text-gray-400 font-mono text-sm animate-pulse">
            Verifying secure payment session...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}