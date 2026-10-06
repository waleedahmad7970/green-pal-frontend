import { parse, addDays } from "date-fns";
import type { MonthlyStat } from "../types";
import { listOrders } from "./orders";
import apiClient from "@/lib/apiClient";

export type SaleType = "product" | "plan";

export interface OrderRow {
  id: string;
  createdAt: string;
  paidAt: string | null;
  customerName: string;
  customerEmail: string;
  item: string;
  type: SaleType;
  quantity: number;
  total: number;
  status: string;
  isPaid: boolean;
  location: string;
  paymentMethod: string;
  cardBrand: string;
  last4: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  receiptUrl: string;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  byType: Record<SaleType, { sales: number; units: number; revenue: number }>;
  statuses: Record<string, { count: number; amount: number }>;
  topItems: { item: string; type: SaleType; units: number; sales: number; revenue: number }[];
  orders: OrderRow[];
}

// Gets the real data out of the response, however apiClient wraps it
const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;

// fromDate / toDate are 'yyyy-MM-dd' (inclusive), in the viewer's own timezone
export async function getSalesStats(fromDate: string, toDate: string): Promise<SalesStats> {
  const from = parse(fromDate, "yyyy-MM-dd", new Date());
  const to = addDays(parse(toDate, "yyyy-MM-dd", new Date()), 1);
  const q = `?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`;

  const [summaryRes, itemsRes, listRes] = await Promise.all([
    apiClient.get(`/orders/report/summary${q}`),
    apiClient.get(`/orders/report/items${q}`),
    apiClient.get(`/orders/report/list${q}`),
  ]);

  const s = unwrap(summaryRes);

  return {
    totalSales: s.totalSales,
    totalRevenue: s.totalRevenue,
    totalOrders: s.totalOrders,
    byType: {
      product: { sales: s.productSales, units: s.productUnits, revenue: s.productRevenue },
      plan: { sales: s.planSales, units: s.planUnits, revenue: s.planRevenue },
    },
    statuses: {
      pending: { count: s.pendingCount, amount: s.pendingAmount },
      processing: { count: s.processingCount, amount: s.processingAmount },
      completed: { count: s.completedCount, amount: s.completedAmount },
      cancelled: { count: s.cancelledCount, amount: s.cancelledAmount },
    },
    topItems: unwrap(itemsRes),
    orders: unwrap(listRes),
  };
}

// Kept so other pages that import it keep working
export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  const orders = await listOrders();
  const map = new Map<string, { revenue: number; orders: number }>();

  for (const order of orders) {
    const month = order.createdAt?.slice(0, 7) ?? "Unknown";
    const existing = map.get(month) ?? { revenue: 0, orders: 0 };
    map.set(month, {
      revenue: existing.revenue + (order.total ?? 0),
      orders: existing.orders + 1,
    });
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { revenue, orders }]) => ({ month, revenue, orders, uptime: 99 }));
}