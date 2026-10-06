import { parse, addDays } from "date-fns";
import apiClient from "@/lib/apiClient";

// Gets the real data out of the response, however apiClient wraps it
const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;
const toList = (res: any): any[] => {
    const v = unwrap(res);
    return Array.isArray(v) ? v : [];
};

export interface Summary {
    totalOrders: number;
    totalSales: number;
    totalRevenue: number;
    productSales: number;
    productRevenue: number;
    planSales: number;
    planRevenue: number;
    pendingCount: number;
    processingCount: number;
}

// fromDate / toDate are 'yyyy-MM-dd' (inclusive)
export async function getSummary(fromDate: string, toDate: string): Promise<Summary> {
    const from = parse(fromDate, "yyyy-MM-dd", new Date());
    const to = addDays(parse(toDate, "yyyy-MM-dd", new Date()), 1);
    const res = await apiClient.get(
        `/orders/report/summary?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`
    );
    return unwrap(res);
}

export async function getInquiriesList(): Promise<any[]> {
    return toList(await apiClient.get("/admin/inquiries"));
}

export async function getLocationsList(): Promise<any[]> {
    return toList(await apiClient.get("/locations"));
}