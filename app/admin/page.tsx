"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO, isValid, startOfMonth, endOfMonth, subMonths } from "date-fns";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { listOrders } from "@/lib/admin/services/orders";
import { listInvoices } from "@/lib/admin/services/invoices";
import {
  getSummary, getInquiriesList, getLocationsList, type Summary,
} from "@/lib/admin/services/dashboard";
import { PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";

const money = (n: number) =>
  `$${(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const ymd = (d: Date) => format(d, "yyyy-MM-dd");

const card = "bg-sand/[0.04] border border-sand/10 rounded-xl p-6";
const axis = { stroke: "rgba(246,243,236,0.4)", fontSize: 12, tickLine: false, axisLine: false } as const;
const tip = {
  contentStyle: { background: "#04231A", border: "1px solid rgba(246,243,236,0.15)", borderRadius: 8 },
  labelStyle: { color: "#F6F3EC" },
};

// pull the list out of whatever the old services return
const asList = (r: any): any[] => {
  const v = r?.data ?? r;
  return Array.isArray(v) ? v : [];
};

function ActionRow({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-3 border-b border-sand/5 last:border-0 hover:bg-sand/[0.03] px-2 rounded"
    >
      <span className="text-sm text-sand/80 font-body">{label}</span>
      <span className={`text-sm font-semibold ${count > 0 ? "text-[#02D683]" : "text-sand/30"}`}>{count}</span>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<Summary | null>(null);
  const [month, setMonth] = useState<Summary | null>(null);
  const [lastMonth, setLastMonth] = useState<Summary | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    const now = new Date();
    const lm = subMonths(now, 1);

    (async () => {
      // allSettled: if one call fails, the rest of the page still loads
      const [t, m, l, o, inv, inq, loc] = await Promise.allSettled([
        getSummary(ymd(now), ymd(now)),
        getSummary(ymd(startOfMonth(now)), ymd(now)),
        getSummary(ymd(startOfMonth(lm)), ymd(endOfMonth(lm))),
        listOrders(),
        listInvoices(),
        getInquiriesList(),
        getLocationsList(),
      ]);
      if (!alive) return;

      const val = <T,>(r: PromiseSettledResult<T>, name: string): T | null => {
        if (r.status === "fulfilled") return r.value;
        console.error(`Dashboard: ${name} failed`, r.reason);
        return null;
      };

      setToday(val(t, "today summary"));
      setMonth(val(m, "month summary"));
      setLastMonth(val(l, "last month summary"));
      setOrders(
        asList(val(o, "orders")).map((x: any) => ({ ...x, id: x._id || x.id, amount: x.total || x.amount || 0 }))
      );
      setInvoices(asList(val(inv, "invoices")).map((x: any) => ({ ...x, id: x._id || x.id })));
      setInquiries(val(inq, "inquiries") ?? []);
      setLocations(val(loc, "locations") ?? []);
      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  // ---- Revenue this month vs last month (completed orders only) ----
  const revenueDelta = (() => {
    if (!month || !lastMonth || !lastMonth.totalRevenue) return undefined;
    const diff = ((month.totalRevenue - lastMonth.totalRevenue) / lastMonth.totalRevenue) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}% vs last month`;
  })();

  // ---- Locations (replaces the fake 99% uptime) ----
  const live = locations.filter((x) => x.status === "live").length;
  const installing = locations.filter((x) => x.status === "installing").length;
  const offline = locations.filter((x) => x.status === "offline").length;

  // ---- Invoices: your statuses are draft/pending/paid/overdue/cancelled ----
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + (i.amount || 0), 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  // ---- Needs your action ----
  const pendingInquiries = inquiries.filter((i) => i.status === "pending").length;
  const meetingInquiries = inquiries.filter((i) => i.status === "meeting_scheduled").length;
  const unpaidLinks = inquiries.filter((i) => i.status === "link_sent").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter((o) => o.status === "processing").length;

  // ---- Last 6 months, completed orders only (so it matches the reports page) ----
  const chart = Array.from({ length: 6 }, (_, k) => {
    const key = format(subMonths(new Date(), 5 - k), "yyyy-MM");
    return { month: key, revenue: 0, orders: 0 };
  });
  for (const o of orders) {
    if (o.status !== "completed") continue;
    const d = parseISO(o.createdAt);
    if (!isValid(d)) continue;
    const row = chart.find((c) => c.month === format(d, "yyyy-MM"));
    if (row) { row.revenue += o.amount; row.orders += 1; }
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview across every location and order." />

      {loading ? (
        <div className="p-8 text-center text-sand/40 font-body text-sm">Loading dashboard data…</div>
      ) : (
        <>
          {/* Today */}
          <p className="text-xs uppercase tracking-wide text-sand/40 font-body mb-3">Today</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Sale amount today" value={today ? money(today.totalRevenue) : "—"} />
            <StatCard label="Number of sales today" value={today ? String(today.totalSales) : "—"} />
            <StatCard label="Products sold today" value={today ? String(today.productSales) : "—"} />
            <StatCard label="Plans sold today" value={today ? String(today.planSales) : "—"} />
          </div>

          {/* This month */}
          <p className="text-xs uppercase tracking-wide text-sand/40 font-body mb-3">This month</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Revenue this month" value={month ? money(month.totalRevenue) : "—"} delta={revenueDelta} />
            <StatCard label="Sales this month" value={month ? String(month.totalSales) : "—"} />
            <StatCard
              label="Locations live"
              value={locations.length ? `${live} of ${locations.length}` : "—"}
              delta={locations.length ? `${installing} installing · ${offline} offline` : undefined}
            />
            <StatCard
              label="Outstanding invoices"
              value={money(outstanding)}
              delta={overdueCount ? `${overdueCount} overdue` : undefined}
            />
          </div>

          {/* Needs action + split */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className={card}>
              <h3 className="font-display text-lg font-semibold text-sand mb-3">Needs your action</h3>
              <ActionRow label="Inquiries waiting for reply" count={pendingInquiries} href="/admin/inquiries" />
              <ActionRow label="Inquiries with meeting scheduled" count={meetingInquiries} href="/admin/inquiries" />
              <ActionRow label="Payment links sent, not paid yet" count={unpaidLinks} href="/admin/inquiries" />
              <ActionRow label="Orders pending" count={pendingOrders} href="/admin/orders" />
              <ActionRow label="Orders processing" count={processingOrders} href="/admin/orders" />
              <ActionRow label="Overdue invoices" count={overdueCount} href="/admin/invoices" />
            </div>

            <div className={card}>
              <h3 className="font-display text-lg font-semibold text-sand mb-3">Products vs plans (this month)</h3>
              {month ? (
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="text-left text-sand/40 border-b border-sand/10">
                      <th className="pb-3 font-normal">Type</th>
                      <th className="pb-3 font-normal">Sales</th>
                      <th className="pb-3 font-normal">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="text-sand/80">
                    <tr className="border-b border-sand/5">
                      <td className="py-3">Products</td><td>{month.productSales}</td><td>{money(month.productRevenue)}</td>
                    </tr>
                    <tr className="border-b border-sand/5">
                      <td className="py-3">Plans</td><td>{month.planSales}</td><td>{money(month.planRevenue)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold">Total</td>
                      <td className="font-semibold">{month.totalSales}</td>
                      <td className="font-semibold">{money(month.totalRevenue)}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-sand/40">Could not load.</p>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className={card}>
              <h3 className="font-display text-lg font-semibold text-sand mb-6">Revenue, last 6 months</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chart}>
                  <CartesianGrid stroke="rgba(246,243,236,0.08)" vertical={false} />
                  <XAxis dataKey="month" {...axis} />
                  <YAxis {...axis} width={50} />
                  <Tooltip {...tip} formatter={(v: number) => money(v)} />
                  <Line type="monotone" dataKey="revenue" stroke="#02D683" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={card}>
              <h3 className="font-display text-lg font-semibold text-sand mb-6">Sales, last 6 months</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chart}>
                  <CartesianGrid stroke="rgba(246,243,236,0.08)" vertical={false} />
                  <XAxis dataKey="month" {...axis} />
                  <YAxis {...axis} width={50} allowDecimals={false} />
                  <Tooltip {...tip} />
                  <Bar dataKey="orders" name="Sales" fill="#02D683" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent orders */}
          <div className={card}>
            <h3 className="font-display text-lg font-semibold text-sand mb-4">Recent orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left text-sand/40 border-b border-sand/10">
                    <th className="pb-3 pr-4 font-normal">Date</th>
                    <th className="pb-3 pr-4 font-normal">Customer</th>
                    <th className="pb-3 pr-4 font-normal">Item</th>
                    <th className="pb-3 pr-4 font-normal">Amount</th>
                    <th className="pb-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={5} className="py-4 text-center text-sand/40">No recent orders found.</td></tr>
                  ) : (
                    orders.slice(0, 5).map((o) => {
                      const d = parseISO(o.createdAt);
                      return (
                        <tr key={o.id} className="border-b border-sand/5">
                          <td className="py-3 pr-4 text-sand/70">{isValid(d) ? format(d, "dd MMM, hh:mm a") : "—"}</td>
                          <td className="py-3 pr-4 text-sand">{o.customerName}</td>
                          <td className="py-3 pr-4 text-sand/70">{o.item}</td>
                          <td className="py-3 pr-4 text-sand/70">{money(o.amount)}</td>
                          <td className="py-3"><StatusBadge status={o.status} /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}