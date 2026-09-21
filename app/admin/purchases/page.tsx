"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { listPurchases, createPurchase, updatePurchase } from "@/lib/admin/services/purchases";
import type { Purchase } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  StatusBadge,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

const PurchaseSchema = Yup.object().shape({
  supplier: Yup.string().required("Required"),
  item: Yup.string().required("Required"),
  quantity: Yup.number().positive("Must be positive").required("Required"),
  cost: Yup.number().positive("Must be positive").required("Required"),
});

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => listPurchases().then(setPurchases);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleCreate = async (values: any, { resetForm }: any) => {
    await createPurchase({
      supplier: values.supplier,
      item: values.item,
      quantity: parseInt(values.quantity, 10) || 0,
      cost: parseFloat(values.cost) || 0,
      purchasedAt: new Date().toISOString().slice(0, 10),
      received: false,
    });
    setModalOpen(false);
    resetForm();
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
        <Formik
          initialValues={{ supplier: "", item: "", quantity: "1", cost: "" }}
          validationSchema={PurchaseSchema}
          onSubmit={handleCreate}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormField label="Supplier">
                <Field name="supplier" className={inputClass} />
                <ErrorMessage name="supplier" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Item">
                <Field name="item" className={inputClass} />
                <ErrorMessage name="item" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Quantity">
                <Field name="quantity" type="number" className={inputClass} />
                <ErrorMessage name="quantity" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Cost (USD)">
                <Field name="cost" type="number" step="0.01" className={inputClass} />
                <ErrorMessage name="cost" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <PrimaryButton type="submit">
                Create purchase
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}
