"use client";

import { useTableSort, SortTh, type SortAccessors } from "@/components/admin/sort";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";
import {
  fetchDeposits,
  updateDeposit,
  DEPOSIT_STATUSES,
  type Deposit,
  type DepositStatus,
} from "@/lib/admin/services/depositAdminService";

// Badge shown for each deposit type (keys match depositType saved by the backend)
const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  franchise: { label: "Franchise", className: "bg-violet-400/15 text-violet-300" },
  coinvestment: { label: "Co-Investment", className: "bg-sky-400/15 text-sky-300" },
  premium: { label: "Premium", className: "bg-emerald-400/15 text-emerald-300" },
  franchise_full: { label: "Franchisee Full", className: "bg-rose-400/15 text-rose-300" },
  coinvest_stake: { label: "Co-Invest 25%", className: "bg-orange-400/15 text-orange-300" },
  stations_2x12: { label: "2x 12-Slot", className: "bg-cyan-400/15 text-cyan-300" },
  custom: { label: "Custom", className: "bg-fuchsia-400/15 text-fuchsia-300" },
  test: { label: "Test", className: "bg-amber-400/15 text-amber-300" },
};

const money = (d: Deposit) =>
  `$${d.amount.toFixed(2)} ${(d.currency || "cad").toUpperCase()}`;

const depositSort: SortAccessors<Deposit> = {
  id: (d) => d._id.slice(-6),
  customer: (d) => d.customerName,
  type: (d) => d.depositType,
  reference: (d) => d.reference,
  amount: (d) => d.amount,
  date: (d) => new Date(d.paidAt || d.createdAt).getTime(),
  status: (d) => d.status,
};

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setDeposits(await fetchDeposits(filterStatus || undefined));
    } catch {
      toast.error("Failed to fetch deposits");
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: string, status: DepositStatus) => {
    try {
      await updateDeposit(id, { status });
      toast.success("Deposit status updated");
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const visible = filterType ? deposits.filter((d) => d.depositType === filterType) : deposits;

  // Deposits are non-refundable, so every payment counts as received,
  // including ones whose deal was later marked cancelled.
  // Internal test payments stay in the table but are never counted in the cards.
  const counted = visible.filter((d) => d.depositType !== "test");
  const received = counted.reduce((sum, d) => sum + d.amount, 0);
  const awaitingContact = counted.filter((d) => d.status === "paid").length;
  const { sorted: sortedDeposits, sort, toggle } = useTableSort(visible, depositSort);

  return (
    <div>
      <PageHeader
        title="Deposits"
        description="Initial deposits paid through the QR codes and payment links. All deposits are non-refundable."
        action={
          <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent text-sm font-body border border-sand/15 rounded-lg px-3 py-2 outline-none cursor-pointer text-sand"
          >
            <option value="" className="bg-ink">All types</option>
            <option value="franchise" className="bg-ink">Franchise</option>
            <option value="coinvestment" className="bg-ink">Co-Investment</option>
            <option value="premium" className="bg-ink">Premium</option>
            <option value="franchise_full" className="bg-ink">Franchisee Full Payment</option>
            <option value="coinvest_stake" className="bg-ink">Co-Invest 25% Stake</option>
            <option value="stations_2x12" className="bg-ink">2x 12-Slot Stations</option>
            <option value="custom" className="bg-ink">Custom (admin links)</option>
            <option value="test" className="bg-ink">Test</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm font-body border border-sand/15 rounded-lg px-3 py-2 outline-none cursor-pointer text-sand"
          >
            <option value="" className="bg-ink">All statuses</option>
            {DEPOSIT_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-ink">
                {s}
              </option>
            ))}
          </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Deposits" value={String(counted.length)} />
        <StatCard label="Total received (CAD)" value={`$${received.toFixed(2)}`} />
        <StatCard
          label="Not contacted yet"
          value={String(awaitingContact)}
          delta={awaitingContact ? "needs follow-up" : undefined}
        />
      </div>

      {loading && visible.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">Loading deposits…</p>
      ) : visible.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">No deposits found.</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <SortTh label="ID" sortKey="id" sort={sort} onSort={toggle} />
                <SortTh label="Customer" sortKey="customer" sort={sort} onSort={toggle} />
                <SortTh label="Deposit" sortKey="type" sort={sort} onSort={toggle} />
                <SortTh label="Package / machine" sortKey="reference" sort={sort} onSort={toggle} />
                <SortTh label="Amount" sortKey="amount" sort={sort} onSort={toggle} />
                <SortTh label="Date" sortKey="date" sort={sort} onSort={toggle} />
                <SortTh label="Status" sortKey="status" sort={sort} onSort={toggle} />
                <th className="p-4 font-normal">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {sortedDeposits.map((d) => (
                <tr key={d._id} className="border-b border-sand/5 last:border-0">
                  <td className="p-4 text-sand/70 font-mono text-xs">{d._id.slice(-6)}</td>
                  <td className="p-4 text-sand">
                    {d.customerName}
                    <div className="text-sand/40 text-xs">{d.customerEmail}</div>
                    {d.customerPhone && (
                      <div className="text-sand/40 text-xs">{d.customerPhone}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body font-semibold whitespace-nowrap ${
                        TYPE_BADGE[d.depositType]?.className || "bg-sand/10 text-sand/60"
                      }`}
                    >
                      {TYPE_BADGE[d.depositType]?.label || d.label}
                    </span>
                    <div className="text-sand/40 text-xs mt-1">{d.label}</div>
                  </td>
                  <td className="p-4 text-sand/70">{d.reference || "—"}</td>
                  <td className="p-4 text-sand/70 whitespace-nowrap">{money(d)}</td>
                  <td className="p-4 text-sand/50 text-xs whitespace-nowrap">
                    {new Date(d.paidAt || d.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                      <StatusBadge status={d.status} />
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d._id, e.target.value as DepositStatus)}
                        className="bg-transparent text-xs font-body border border-sand/15 rounded-full px-2.5 py-1 outline-none cursor-pointer text-sand"
                      >
                        {DEPOSIT_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-ink">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-4">
                    {d.paymentDetails?.receiptUrl ? (
                      <a
                        href={d.paymentDetails.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-signal text-xs hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-sand/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
