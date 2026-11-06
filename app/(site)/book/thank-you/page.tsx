"use client";

import Link from "next/link";

export default function DepositThankYouPage() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card border line-rule p-8 rounded-3xl text-center shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#02d683]/15 text-[#02d683] flex items-center justify-center mx-auto mb-4 text-xl font-bold">
          ✓
        </div>
        <h1 className="font-display font-bold text-2xl mb-2">
          Initial Payment received
        </h1>
        <p className="font-body text-sm text-muted mb-8 leading-relaxed">
          Thank you. A confirmation email is on its way, and our team will
          contact you shortly with the next steps.
        </p>
        <Link
          href="/"
          className="block w-full py-3.5 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm tracking-wide transition-all hover:bg-[#02bc73] shadow-md"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
