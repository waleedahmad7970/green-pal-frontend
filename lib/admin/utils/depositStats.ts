import type { Deposit } from "@/lib/admin/services/depositAdminService";

export interface DepositStats {
  count: number;
  amount: number;
  byType: Record<"franchise" | "coinvestment" | "premium" | "franchise_full" | "coinvest_stake", { count: number; amount: number }>;
  byStatus: Record<string, { count: number; amount: number }>;
}

export const DEPOSIT_STATUS_ORDER = ["paid", "contacted", "converted", "cancelled"];

// Deposits are non-refundable, so every deposit counts toward the amount,
// including ones later marked "cancelled". Deposits are NOT added to order
// revenue (they become an order later and would be counted twice).
export function computeDepositStats(deposits: Deposit[]): DepositStats {
  const stats: DepositStats = {
    count: 0,
    amount: 0,
    byType: { franchise: { count: 0, amount: 0 }, coinvestment: { count: 0, amount: 0 }, premium: { count: 0, amount: 0 }, franchise_full: { count: 0, amount: 0 }, coinvest_stake: { count: 0, amount: 0 } },
    byStatus: Object.fromEntries(DEPOSIT_STATUS_ORDER.map((s) => [s, { count: 0, amount: 0 }])),
  };

  for (const d of deposits) {
    // Internal test payments are listed in the table but never counted in totals
    if (d.depositType === "test") continue;

    stats.count += 1;
    stats.amount += d.amount;

    const t = stats.byType[d.depositType as "franchise" | "coinvestment" | "premium" | "franchise_full" | "coinvest_stake"];
    if (t) {
      t.count += 1;
      t.amount += d.amount;
    }

    const s = (stats.byStatus[d.status] ||= { count: 0, amount: 0 });
    s.count += 1;
    s.amount += d.amount;
  }
  return stats;
}
