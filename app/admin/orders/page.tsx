"use client";

import { useEffect, useState } from "react";
import { listOrders, createOrder, updateOrder, listLocations } from "@/lib/admin/api";
import type { Order, OrderStatus, Location } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

const statuses: OrderStatus[] = ["pending", "active", "returned", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    locationId: "",
    item: "Power Bank Rental" as Order["item"],
    amount: "",
    status: "pending" as OrderStatus,
  });

  const refresh = () => listOrders().then(setOrders);

  useEffect(() => {
    Promise.all([listOrders(), listLocations()]).then(([o, l]) => {
      setOrders(o);
      setLocations(l);
      setForm((f) => ({ ...f, locationId: l[0]?.id ?? "" }));
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder({
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      locationId: form.locationId,
      item: form.item,
      amount: parseFloat(form.amount) || 0,
      status: form.status,
    });
    setModalOpen(false);
    setForm({ customerName: "", customerEmail: "", locationId: locations[0]?.id ?? "", item: "Power Bank Rental", amount: "", status: "pending" });
    refresh();
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrder(orderId, { status });
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Every rental, charging session, and utility device order."
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New order</PrimaryButton>}
      />

      {loading ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Order</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Item</th>
                <th className="p-4 font-normal">Amount</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-sand/5 last:border-0">
                  <td className="p-4 text-sand/70">{o.id}</td>
                  <td className="p-4 text-sand">
                    {o.customerName}
                    <div className="text-sand/40 text-xs">{o.customerEmail}</div>
                  </td>
                  <td className="p-4 text-sand/70">{o.item}</td>
                  <td className="p-4 text-sand/70">${o.amount.toFixed(2)}</td>
                  <td className="p-4 text-sand/50">{o.createdAt}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      className="bg-transparent text-xs font-body border border-sand/15 rounded-full px-2.5 py-1 outline-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="bg-ink">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New order">
        <form onSubmit={handleCreate}>
          <FormField label="Customer name">
            <input required className={inputClass} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </FormField>
          <FormField label="Customer email">
            <input required type="email" className={inputClass} value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
          </FormField>
          <FormField label="Location">
            <select className={inputClass} value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })}>
              {locations.map((l) => (
                <option key={l.id} value={l.id} className="bg-ink">
                  {l.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Item">
            <select
              className={inputClass}
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value as Order["item"] })}
            >
              <option className="bg-ink">Power Bank Rental</option>
              <option className="bg-ink">Charging Session</option>
              <option className="bg-ink">Utility Device</option>
            </select>
          </FormField>
          <FormField label="Amount (USD)">
            <input required type="number" step="0.01" className={inputClass} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </FormField>
          <PrimaryButton type="submit">Create order</PrimaryButton>
        </form>
      </AdminModal>
    </div>
  );
}
