"use client";

import { useEffect, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { getSalesStats, type SalesStats, type SaleType } from "@/lib/admin/services/reports";
import { PageHeader } from "@/components/admin/ui";

const money = (n: number) =>
  `$${(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const fmtDate = (s: string | null) => {
  if (!s) return "";
  const d = parseISO(s);
  return isValid(d) ? format(d, "dd MMM yyyy, hh:mm a") : "";
};

const typeLabel: Record<SaleType, string> = { product: "Product", plan: "Plan" };
const STATUSES = ["pending", "processing", "completed", "cancelled"];

const card = "bg-sand/[0.04] border border-sand/10 rounded-xl p-6";
const th = "text-left text-xs uppercase tracking-wide text-sand/40 font-body pb-3 pr-4 whitespace-nowrap";
const td = "py-2.5 pr-4 text-sm text-sand/80 font-body border-t border-sand/10 whitespace-nowrap";

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className={card}>
      <p className="text-xs uppercase tracking-wide text-sand/40 font-body mb-2">{label}</p>
      <p className="font-display text-3xl font-bold text-sand">{value}</p>
      {sub && <p className="text-sm text-sand/50 font-body mt-1">{sub}</p>}
    </div>
  );
}

// ---- CSV helpers ----
const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function downloadCsv(filename: string, rows: unknown[][]) {
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());
  const [data, setData] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!from || !to || from > to) return;
    setLoading(true);
    setError("");
    getSalesStats(from, to)
      .then(setData)
      .catch((e) => setError(e?.message || "Failed to load reports"))
      .finally(() => setLoading(false));
  }, [from, to]);

  const rangeLabel = from === to ? from : `${from}_to_${to}`;

  const exportOrders = () => {
    if (!data) return;
    const head = [
      "Order ID", "Created", "Paid at", "Customer", "Email", "Item", "Type", "Qty", "Total (USD)",
      "Status", "Paid", "Location", "Payment method", "Card brand", "Card last4",
      "Stripe session", "Stripe payment intent", "Receipt URL",
    ];
    const body = data.orders.map((o) => [
      o.id, fmtDate(o.createdAt), fmtDate(o.paidAt), o.customerName, o.customerEmail, o.item,
      typeLabel[o.type], o.quantity, o.total.toFixed(2), o.status, o.isPaid ? "Yes" : "No",
      o.location, o.paymentMethod, o.cardBrand, o.last4, o.stripeSessionId, o.stripePaymentIntentId, o.receiptUrl,
    ]);
    downloadCsv(`orders_${rangeLabel}.csv`, [head, ...body]);
  };

  const exportSummary = () => {
    if (!data) return;
    const rows: unknown[][] = [
      ["Report range", from, to],
      [],
      ["Summary", "Count", "Units", "Revenue (USD)"],
      ["Total sales (completed)", data.totalSales, "", data.totalRevenue.toFixed(2)],
      ["Products", data.byType.product.sales, data.byType.product.units, data.byType.product.revenue.toFixed(2)],
      ["Plans", data.byType.plan.sales, data.byType.plan.units, data.byType.plan.revenue.toFixed(2)],
      ["All orders (any status)", data.totalOrders],
      [],
      ["Status", "Orders", "Amount (USD)"],
      ...STATUSES.map((s) => [s, data.statuses[s]?.count ?? 0, (data.statuses[s]?.amount ?? 0).toFixed(2)]),
      [],
      ["Item", "Type", "Units", "Sales", "Revenue (USD)"],
      ...data.topItems.map((i) => [i.item, typeLabel[i.type], i.units, i.sales, i.revenue.toFixed(2)]),
    ];
    downloadCsv(`summary_${rangeLabel}.csv`, rows);
  };

  return (
    <div>
      <PageHeader title="Reports" description="Sales for products and plans. Pick a date range and download as CSV." />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm text-sand/60">From</label>
        <input
          type="date"
          value={from}
          max={to}
          onChange={(e) => setFrom(e.target.value)}
          className="bg-sand/[0.04] border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm"
        />
        <label className="text-sm text-sand/60">To</label>
        <input
          type="date"
          value={to}
          min={from}
          onChange={(e) => setTo(e.target.value)}
          className="bg-sand/[0.04] border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm"
        />
        <button
          onClick={() => { setFrom(todayStr()); setTo(todayStr()); }}
          className="text-sm text-[#02D683] cursor-pointer"
        >
          Today
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={exportSummary}
            disabled={!data}
            className="px-4 py-2 rounded-lg border border-sand/20 text-sand text-sm disabled:opacity-40 cursor-pointer"
          >
            Download summary CSV
          </button>
          <button
            onClick={exportOrders}
            disabled={!data}
            className="px-4 py-2 rounded-lg bg-[#02D683] text-black font-semibold text-sm disabled:opacity-40 cursor-pointer"
          >
            Download orders CSV
          </button>
        </div>
      </div>

      {loading && <p className="text-sand/40 font-body text-sm">Loading…</p>}
      {error && <p className="text-red-400 font-body text-sm">{error}</p>}

      {!loading && data && (
        <div className="grid gap-6">
          {/* Counts */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total sale amount" value={money(data.totalRevenue)} sub="Completed orders only" />
            <Stat label="Number of sales" value={data.totalSales} sub={`${data.totalOrders} orders in total`} />
            <Stat
              label="Products sold"
              value={data.byType.product.sales}
              sub={`${data.byType.product.units} units · ${money(data.byType.product.revenue)}`}
            />
            <Stat
              label="Plans sold"
              value={data.byType.plan.sales}
              sub={`${data.byType.plan.units} units · ${money(data.byType.plan.revenue)}`}
            />
          </div>

          {/* Status + items */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={card}>
              <h3 className="font-display text-lg font-semibold text-sand mb-4">Order status</h3>
              <table className="w-full">
                <thead>
                  <tr><th className={th}>Status</th><th className={th}>Orders</th><th className={th}>Amount</th></tr>
                </thead>
                <tbody>
                  {STATUSES.map((s) => (
                    <tr key={s}>
                      <td className={`${td} capitalize`}>{s}</td>
                      <td className={td}>{data.statuses[s]?.count ?? 0}</td>
                      <td className={td}>{money(data.statuses[s]?.amount ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`${card} overflow-x-auto`}>
              <h3 className="font-display text-lg font-semibold text-sand mb-4">Items sold</h3>
              {data.topItems.length === 0 ? (
                <p className="text-sm text-sand/40">No completed sales.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={th}>Item</th><th className={th}>Type</th>
                      <th className={th}>Units</th><th className={th}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topItems.map((i) => (
                      <tr key={`${i.type}-${i.item}`}>
                        <td className={td}>{i.item}</td>
                        <td className={td}>{typeLabel[i.type]}</td>
                        <td className={td}>{i.units}</td>
                        <td className={td}>{money(i.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Every order */}
          <div className={`${card} overflow-x-auto`}>
            <h3 className="font-display text-lg font-semibold text-sand mb-4">All orders ({data.orders.length})</h3>
            {data.orders.length === 0 ? (
              <p className="text-sm text-sand/40">No orders in this range.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    {["Created", "Customer", "Item", "Type", "Qty", "Total", "Status", "Paid", "Location", "Card", "Receipt"].map((h) => (
                      <th key={h} className={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((o) => (
                    <tr key={o.id}>
                      <td className={td}>{fmtDate(o.createdAt)}</td>
                      <td className={td}>
                        {o.customerName}<br />
                        <span className="text-xs text-sand/40">{o.customerEmail}</span>
                      </td>
                      <td className={td}>{o.item}</td>
                      <td className={td}>{typeLabel[o.type]}</td>
                      <td className={td}>{o.quantity}</td>
                      <td className={td}>{money(o.total)}</td>
                      <td className={`${td} capitalize`}>{o.status}</td>
                      <td className={td}>{o.isPaid ? "Yes" : "No"}</td>
                      <td className={td}>{o.location || "—"}</td>
                      <td className={td}>{o.cardBrand ? `${o.cardBrand} ••${o.last4}` : "—"}</td>
                      <td className={td}>
                        {o.receiptUrl ? (
                          <a href={o.receiptUrl} target="_blank" rel="noreferrer" className="text-[#02D683]">Open</a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}