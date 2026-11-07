"use client";

import { useTableSort, SortTh, type SortAccessors } from "@/components/admin/sort";

import { useEffect, useState } from "react";
import { useInvoiceStore } from "@/lib/admin/slices/useInvoiceStore";
import { listOrders } from "@/lib/admin/services/orders";
import type { Order } from "@/lib/admin/types";
import {
  PageHeader,
} from "@/components/admin/ui";
import { safeFormatDate } from "@/lib/helpers/helper";

const invoiceSort: SortAccessors<any> = {
  id: (i) => (i._id || i.id || "").slice(-6),
  customer: (i) => i?.customerName,
  amount: (i) => i?.amount || 0,
  issued: (i) => (i?.issuedAt ? new Date(i.issuedAt).getTime() : null),
  due: (i) => (i?.dueAt ? new Date(i.dueAt).getTime() : null),
  status: (i) => i?.status,
};

export default function AdminInvoicesPage() {
  const { invoices, loading, fetchInvoices, } = useInvoiceStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const { sorted: sortedInvoices, sort, toggle } = useTableSort(invoices as any[], invoiceSort);

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
                <SortTh label="Invoice ID" sortKey="id" sort={sort} onSort={toggle} />
                <SortTh label="Customer" sortKey="customer" sort={sort} onSort={toggle} />
                <SortTh label="Amount" sortKey="amount" sort={sort} onSort={toggle} />
                <SortTh label="Issued" sortKey="issued" sort={sort} onSort={toggle} />
                <SortTh label="Due" sortKey="due" sort={sort} onSort={toggle} />
                <SortTh label="Status" sortKey="status" sort={sort} onSort={toggle} />
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.map((i: any) => {
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