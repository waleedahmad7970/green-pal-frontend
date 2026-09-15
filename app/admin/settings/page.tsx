import { PageHeader } from "@/components/admin/ui";

// Server component on purpose: it can safely check STRIPE_SECRET_KEY exists
// without ever sending its value to the browser. Only a boolean crosses
// the server/client boundary.
export default function AdminSettingsPage() {
  const hasSecretKey = Boolean(process.env.STRIPE_SECRET_KEY);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  const maskedPublishable = publishableKey
    ? `${publishableKey.slice(0, 10)}••••••••${publishableKey.slice(-4)}`
    : null;

  return (
    <div>
      <PageHeader title="Settings" description="Payment configuration and backend connection status." />

      <div className="grid gap-6 max-w-2xl">
        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-sand mb-1">Stripe</h3>
          <p className="text-sand/50 text-sm font-body mb-5">
            Keys are read from environment variables, never entered here — see{" "}
            <code className="text-signal">.env.local.example</code> in the project root.
          </p>

          <div className="space-y-3 font-body text-sm">
            <div className="flex items-center justify-between border-b border-sand/10 pb-3">
              <span className="text-sand/60">Publishable key</span>
              <span className={maskedPublishable ? "text-sand" : "text-red-300"}>
                {maskedPublishable || "Not configured"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sand/60">Secret key</span>
              <span className={hasSecretKey ? "text-signal" : "text-red-300"}>
                {hasSecretKey ? "Configured" : "Not configured"}
              </span>
            </div>
          </div>

          <p className="text-sand/35 text-xs font-body mt-5 leading-relaxed">
            No API routes call Stripe yet — <code>lib/stripe/server.ts</code> and{" "}
            <code>lib/stripe/client.ts</code> are scaffolded and ready for when checkout or
            billing endpoints are built against your backend.
          </p>
        </section>

        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-sand mb-1">Backend connection</h3>
          <p className="text-sand/50 text-sm font-body mb-4">
            Orders, locations, purchases, and invoices are currently stored locally in your
            browser (mock data) — there is no backend wired up yet.
          </p>
          <div className="flex items-center justify-between font-body text-sm border-t border-sand/10 pt-3">
            <span className="text-sand/60">API base URL</span>
            <span className="text-red-300">Not configured</span>
          </div>
          <p className="text-sand/35 text-xs font-body mt-4 leading-relaxed">
            Every read/write in this admin panel goes through{" "}
            <code className="text-signal">lib/admin/api.ts</code>. Once your backend exists,
            each function there gets rewritten to call <code>fetch()</code> against it — no
            page component needs to change.
          </p>
        </section>

        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-sand mb-1">Admin access</h3>
          <p className="text-sand/50 text-sm font-body leading-relaxed">
            The login on this panel is a placeholder client-side password check (
            <code className="text-signal">lib/admin/auth.ts</code>), meant only to keep the
            panel from being wide open during development. Replace it with real
            server-side authentication before this goes anywhere near production.
          </p>
        </section>
      </div>
    </div>
  );
}
