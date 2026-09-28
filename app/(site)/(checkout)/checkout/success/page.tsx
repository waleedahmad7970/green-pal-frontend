"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDownload = async () => {
    if (!sessionId) return;
    try {
      setDownloading(true);
      setErrorMessage("");

      // Calls your backend endpoint to fetch the S3 signed URL
      const response: any = await apiClient.get(
        `/payments/download?session_id=${sessionId}`,
      );
      const downloadUrl = response.data?.data?.url || response?.url;

      if (downloadUrl) {
        // Opens the S3 link in a brand new browser tab
        window.open(downloadUrl, "_blank");
      } else {
        setErrorMessage(
          "Download link is being prepared. Please also check your email inbox.",
        );
      }
    } catch (err) {
      console.error("Failed to fetch download link:", err);
      setErrorMessage(
        "Could not fetch download link right now. Check your email for the secure link.",
      );
    } finally {
      setDownloading(false);
    }
  };

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
        Payment Verified & Paid
      </div>

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3 tracking-tight">
        Order Successful!
      </h1>
      <p className="text-gray-500 font-body text-sm sm:text-base mb-6 leading-relaxed">
        Thank you for your investment. Your payment has been successfully
        processed.
      </p>

      {/* Email & Delivery Notice Box */}
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
          <span>Blueprint Dispatched to Your Email</span>
        </div>
        <p className="text-xs text-gray-500 font-body leading-relaxed pl-7">
          We have sent your confirmation email and secure PDF download link to
          your inbox. You can also download your blueprint directly using the
          button below.
        </p>
      </div>

      {errorMessage && (
        <p className="text-xs text-amber-600 font-body mb-4 bg-amber-50 p-3 rounded-xl">
          {errorMessage}
        </p>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Download PDF Button (30-min expiring link) */}
        <button
          onClick={handleDownload}
          disabled={downloading || !sessionId}
          className="flex items-center justify-center gap-2 w-full bg-[#02d683] text-gray-900 px-6 py-4 rounded-2xl font-display font-bold text-sm tracking-wide hover:bg-[#02bc73] transition-colors shadow-lg shadow-[#02d683]/20 disabled:opacity-75 cursor-pointer"
        >
          {downloading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Generating Secure Link...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download Blueprint PDF (30-min Link)</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/investment"
            className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-body text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            More Blueprints
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-body text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
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
