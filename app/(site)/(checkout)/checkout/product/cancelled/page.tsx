"use client";

import Link from "next/link";

export default function CheckoutProductCancelledPage() {
    return (
        <main className="min-h-screen bg-surface flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-card border line-rule p-8 rounded-3xl text-center shadow-xl">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    !
                </div>
                <h1 className="font-display font-bold text-2xl mb-2">
                    Payment Cancelled
                </h1>
                <p className="font-body text-sm text-muted mb-8 leading-relaxed">
                    Your payment was cancelled and no charges were made. Your payment link stays valid until it expires, so you can reopen it from your email and try again. If it has expired or you need help, contact us and we&apos;ll send you a new one.
                </p>
                <div className="space-y-3">
                    <Link
                        href="/contact"
                        className="block w-full py-3.5 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm tracking-wide transition-all hover:bg-[#02bc73] shadow-md"
                    >
                        Contact Us
                    </Link>
                    <Link
                        href="/products"
                        className="block w-full py-3.5 rounded-full border line-rule font-display font-bold text-sm tracking-wide transition-all hover:bg-black/5"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </main>
    );
}