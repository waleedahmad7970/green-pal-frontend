"use client";

import { useEffect, useState } from "react";
import { useInvoiceStore } from "@/lib/admin/slices/useInvoiceStore";
import { listOrders } from "@/lib/admin/services/orders";
import type { Order } from "@/lib/admin/types";
import {
  PageHeader,
} from "@/components/admin/ui";
import { safeFormatDate } from "@/lib/helpers/helper";

export default function AdminInvoicesPage() {
  const { invoices, loading, fetchInvoices, } = useInvoiceStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchInvoices();
    listOrders().then((res) => {
      const orderData = (res as any)?.data || res || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    }).catch(console.error);
  }, [fetchInvoices]);



  const total = invoices.reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices, $${total?.toFixed(2)} total.`}
      />

      {loading && invoices.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Invoice ID</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Amount</th>
                <th className="p-4 font-normal">Issued</th>
                <th className="p-4 font-normal">Due</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i: any) => {
                const invId = i._id || i.id || "";
                return (
                  <tr key={invId} className="border-b border-sand/5 last:border-0">
                    <td className="p-4 text-sand/70 font-mono text-xs">{invId.slice(-6)}</td>
                    <td className="p-4 text-sand">{i?.customerName}</td>
                    <td className="p-4 text-sand/70">${(i?.amount || 0)?.toFixed(2)}</td>
                    <td className="p-4 text-sand/50">{safeFormatDate(i?.issuedAt)}</td>
                    <td className="p-4 text-sand/50">{safeFormatDate(i?.dueAt)}</td>
                    <td className="p-4">
                      <span className="text-xs capitalize px-2.5 py-1 rounded-full border border-sand/15 text-sand/80">
                        {i?.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}