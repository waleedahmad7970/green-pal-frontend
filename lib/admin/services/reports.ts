import type { MonthlyStat } from "../types";
import { listOrders } from "./orders";

export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  // Aggregated from live orders.
  // Backend currently has no dedicated stats endpoint.
  const orders = await listOrders();

  const map = new Map<
    string,
    {
      revenue: number;
      orders: number;
    }
  >();

  for (const order of orders) {
    const month = order.createdAt?.slice(0, 7) ?? "Unknown";

    const existing = map.get(month) ?? {
      revenue: 0,
      orders: 0,
    };

    map.set(month, {
      revenue: existing.revenue + (order.amount ?? 0),
      orders: existing.orders + 1,
    });
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { revenue, orders }]) => ({
      month,
      revenue,
      orders,
      uptime: 99,
    }));
}
