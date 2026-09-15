"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { getMonthlyStats } from "@/lib/admin/api";
import type { MonthlyStat } from "@/lib/admin/types";
import { PageHeader } from "@/components/admin/ui";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<MonthlyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonthlyStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader title="Reports" description="Uptime and revenue-vs-orders trends across the fleet." />

      {loading ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="grid gap-6">
          <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-sand mb-6">Fleet uptime</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats}>
                <defs>
                  <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#02D683" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#02D683" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(246,243,236,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(246,243,236,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[95, 100]} stroke="rgba(246,243,236,0.4)" fontSize={12} tickLine={false} axisLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: "#04231A", border: "1px solid rgba(246,243,236,0.15)", borderRadius: 8 }}
                  labelStyle={{ color: "#F6F3EC" }}
                />
                <Area type="monotone" dataKey="uptime" stroke="#02D683" strokeWidth={2.5} fill="url(#uptimeFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-sand mb-6">Revenue vs. orders</h3>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={stats}>
                <CartesianGrid stroke="rgba(246,243,236,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(246,243,236,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="rgba(246,243,236,0.4)" fontSize={12} tickLine={false} axisLine={false} width={50} />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(246,243,236,0.4)" fontSize={12} tickLine={false} axisLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: "#04231A", border: "1px solid rgba(246,243,236,0.15)", borderRadius: 8 }}
                  labelStyle={{ color: "#F6F3EC" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-geist-sans)" }} />
                <Bar yAxisId="left" dataKey="revenue" fill="#02D683" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#F6F3EC" strokeWidth={2} dot={false} name="Orders" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
