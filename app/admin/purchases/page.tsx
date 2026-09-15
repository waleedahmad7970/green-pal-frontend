"use client";

import { useEffect, useState } from "react";
import { listPurchases, createPurchase, updatePurchase } from "@/lib/admin/api";
import type { Purchase } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  StatusBadge,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ supplier: "", item: "", quantity: "1", cost: "" });

  const refresh = () => listPurchases().then(setPurchases);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPurchase({
      supplier: form.supplier,
      item: form.item,
      quantity: parseInt(form.quantity, 10) || 0,
      cost: parseFloat(form.cost) || 0,
      purchasedAt: new Date().toISOString().slice(0, 10),
      received: false,
    });
    setModalOpen(false);
    setForm({ supplier: "", item: "", quantity: "1", cost: "" });
    refresh();
  };

  const toggleReceived = async (p: Purchase) => {
    await updatePurchase(p.id, { received: !p.received });
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="Purchases"
        description="Hardware and parts ordered from suppliers."
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New purchase</PrimaryButton>}
      />

      {loading ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Purchase</th>
                <th className="p-4 font-normal">Supplier</th>
                <th className="p-4 font-normal">Item</th>
                <th className="p-4 font-normal">Qty</th>
                <th className="p-4 font-normal">Cost</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-sand/5 last:border-0">
                  <td className="p-4 text-sand/70">{p.id}</td>
                  <td className="p-4 text-sand">{p.supplier}</td>
                  <td className="p-4 text-sand/70">{p.item}</td>
                  <td className="p-4 text-sand/70">{p.quantity}</td>
                  <td className="p-4 text-sand/70">${p.cost.toLocaleString()}</td>
                  <td className="p-4 text-sand/50">{p.purchasedAt}</td>
                  <td className="p-4">
                    <button onClick={() => toggleReceived(p)}>
                      <StatusBadge status={p.received ? "received" : "pending"} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New purchase">
        <form onSubmit={handleCreate}>
          <FormField label="Supplier">
            <input required className={inputClass} value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </FormField>
          <FormField label="Item">
            <input required className={inputClass} value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} />
          </FormField>
          <FormField label="Quantity">
            <input required type="number" className={inputClass} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </FormField>
          <FormField label="Cost (USD)">
            <input required type="number" step="0.01" className={inputClass} value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </FormField>
          <PrimaryButton type="submit">Create purchase</PrimaryButton>
        </form>
      </AdminModal>
    </div>
  );
}
