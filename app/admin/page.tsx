"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getMonthlyStats } from "@/lib/admin/services/reports";
import { listOrders } from "@/lib/admin/services/orders";
import { listInvoices } from "@/lib/admin/services/invoices";
import type { MonthlyStat, Order, Invoice } from "@/lib/admin/types";
import { PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<MonthlyStat[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // Fix 1: Initialize loading as true so state is reflected during fetch
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [statsRes, ordersRes, invoicesRes] = await Promise.all([
          getMonthlyStats(),
          listOrders(),
          listInvoices(),
        ]);

        if (isMounted) {
          setStats(statsRes || []);


          const rawOrders = (ordersRes as any)?.data || ordersRes || [];

          const mappedOrders = rawOrders.map((o: any) => ({
            ...o,
            id: o._id || o.id,
            amount: o.total || o.amount || 0, // Map backend 'total' to frontend 'amount'
          }));
          setOrders(mappedOrders);

          const rawInvoices = (invoicesRes as any)?.data || invoicesRes || [];
          const mappedInvoices = rawInvoices.map((i: any) => ({
            ...i,
            id: i._id || i.id,
          }));
          setInvoices(mappedInvoices);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);
  // Fix 2: Safe reference & dynamic percentage change calculation
  const latest = stats.length > 0 ? stats[stats.length - 1] : null;
  const previous = stats.length > 1 ? stats[stats.length - 2] : null;

  const revenueDelta = (() => {
    if (!latest?.revenue || !previous?.revenue) return undefined;
    const diff = ((latest.revenue - previous.revenue) / previous.revenue) * 100;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}% vs last month`;
  })();

  // Fix 3: Fallback calculation for outstanding invoices
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview across every location and order."
      />

      {loading ? (
        <div className="p-8 text-center text-sand/40 font-body text-sm">
          Loading dashboard data…
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              label="Revenue this month"
              value={latest?.revenue != null ? `$${latest.revenue.toLocaleString()}` : "—"}
              delta={revenueDelta}
            />
            <StatCard
              label="Orders this month"
              value={latest?.orders != null ? latest.orders.toLocaleString() : "—"}
            />
            <StatCard
              label="Fleet uptime"
              value={latest?.uptime != null ? `${latest.uptime}%` : "—"}
            />
            <StatCard
              label="Outstanding invoices"
              value={`$${outstanding.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-sand mb-6">
                Revenue, last 6 months
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats}>
                  <CartesianGrid
                    stroke="rgba(246,243,236,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(246,243,236,0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(246,243,236,0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#04231A",
                      border: "1px solid rgba(246,243,236,0.15)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#F6F3EC" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#02D683"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-sand mb-6">
                Orders, last 6 months
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats}>
                  <CartesianGrid
                    stroke="rgba(246,243,236,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(246,243,236,0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(246,243,236,0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#04231A",
                      border: "1px solid rgba(246,243,236,0.15)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#F6F3EC" }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#02D683"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-sand mb-4">
              Recent orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left text-sand/40 border-b border-sand/10">
                    <th className="pb-3 pr-4 font-normal">Order</th>
                    <th className="pb-3 pr-4 font-normal">Customer</th>
                    <th className="pb-3 pr-4 font-normal">Item</th>
                    <th className="pb-3 pr-4 font-normal">Amount</th>
                    <th className="pb-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-sand/40"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((o: any) => (
                      <tr key={o.id} className="border-b border-sand/5">
                        <td className="py-3 pr-4 text-sand/70">{o.id}</td>
                        <td className="py-3 pr-4 text-sand">
                          {o.customerName}
                        </td>
                        <td className="py-3 pr-4 text-sand/70">{o.item}</td>
                        <td className="py-3 pr-4 text-sand/70">
                          ${(o.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={o.status} />
                        </td>
                      </tr>
                    ))
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