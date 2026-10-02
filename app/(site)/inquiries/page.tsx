"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin/auth";
import { fetchMyInquiries, Inquiry } from "@/lib/site/services/inquiryService";

const statusStyles: Record<Inquiry["status"], { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "text-amber-500 bg-amber-500/10" },
  meeting_scheduled: { label: "Meeting scheduled", cls: "text-blue-500 bg-blue-500/10" },
  link_sent: { label: "Payment link sent", cls: "text-[#02d683] bg-[#02d683]/10" },
  completed: { label: "Completed", cls: "text-emerald-600 bg-emerald-500/10" },
  cancelled: { label: "Cancelled", cls: "text-red-500 bg-red-500/10" },
};

export default function MyInquiriesPage() {
  const { isAuthed } = useAdminAuth();
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !isAuthed) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const list = await fetchMyInquiries();
        setInquiries(list);
      } catch (err) {
        console.error("Failed to load inquiries:", err);
        setError("Could not load your inquiries. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [mounted, isAuthed]);

  return (
    <main className="min-h-screen bg-surface pt-28 pb-16">
      <div className="container-edit max-w-3xl">
        <h1 className="font-display font-bold text-3xl mb-2">My Inquiries</h1>
        <p className="font-body text-sm text-muted mb-8">
          Track your product inquiries and pay once we send your payment link.
        </p>

        {!mounted || loading ? (
          <p className="font-body text-sm text-muted animate-pulse">Loading…</p>
        ) : !isAuthed ? (
          <div className="bg-card border line-rule rounded-2xl p-8 text-center">
            <p className="font-body text-sm text-muted mb-4">
              Please sign in to see your inquiries.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm"
            >
              Sign in
            </Link>
          </div>
        ) : error ? (
          <p className="font-body text-sm text-red-500">{error}</p>
        ) : inquiries.length === 0 ? (
          <div className="bg-card border line-rule rounded-2xl p-8 text-center">
            <p className="font-body text-sm text-muted mb-4">
              You haven&apos;t made any inquiries yet.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {inquiries.map((q) => {
              const s = statusStyles[q.status] ?? statusStyles.pending;
              // Handle product type gracefully whether it's a populated object or string fallback
              const productName =
                typeof q.product === "object" && q.product !== null
                  ? q.product.name
                  : q.productName;

              return (
                <li key={q._id} className="bg-card border line-rule rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display font-bold text-base truncate">
                        {productName || "Product"}
                      </h2>
                      <p className="font-body text-xs text-muted mt-0.5">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}
                    >
                      {s.label}
                    </span>
                  </div>

                  <p className="font-body text-sm text-muted mt-3 whitespace-pre-wrap">
                    {q.message}
                  </p>

                  {q.status === "link_sent" && q.checkoutUrl && (
                    <div className="mt-4 pt-4 border-t line-rule flex items-center justify-between gap-4">
                      <div>
                        {q.customPrice ? (
                          <p className="font-display font-bold text-sm">
                            ${(q.customPrice / 100).toFixed(2)} USD
                          </p>
                        ) : null}
                        <p className="font-body text-xs text-muted">
                          The link is valid for 24 hours. If it has expired,{" "}
                          <Link href="/contact" className="underline">
                            contact us
                          </Link>
                          .
                        </p>
                      </div>
                      <a
                        href={q.checkoutUrl}
                        className="shrink-0 px-5 py-2.5 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm hover:bg-[#02bc73] transition-colors"
                      >
                        Pay Now
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}