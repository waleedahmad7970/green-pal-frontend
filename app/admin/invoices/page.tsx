"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useInvoiceStore } from "@/lib/admin/slices/useInvoiceStore";
import { listOrders } from "@/lib/admin/services/orders";
import type { InvoiceStatus, Order } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";
import { format, parseISO } from "date-fns";
import { safeFormatDate } from "@/lib/helpers/helper";

const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

const InvoiceSchema = Yup.object().shape({
  orderId: Yup.string().required("Required"),
});

export default function AdminInvoicesPage() {
  const { invoices, loading, fetchInvoices, addInvoice, changeInvoiceStatus } = useInvoiceStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
    listOrders().then((res) => {
      const orderData = (res as any)?.data || res || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    }).catch(console.error);
  }, [fetchInvoices]);

  const handleCreate = async (values: any, { resetForm }: any) => {
    const order = orders.find((o: any) => (o._id || o.id) === values.orderId);
    if (!order) return;

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 7);

    await addInvoice({
      orderId: order._id || order.id,
      customerName: order.customerName,
      amount: order.total,
      status: "draft",
      issuedAt: today.toISOString().slice(0, 10),
      dueAt: due.toISOString().slice(0, 10),
    });
    setModalOpen(false);
    resetForm();
  };

  const total = invoices.reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices, $${total?.toFixed(2)} total.`}
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New invoice</PrimaryButton>}
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
                    <td>{safeFormatDate(i?.dueAt)}</td>                    <td className="p-4">
                      <select
                        value={i?.status}
                        onChange={(e) => changeInvoiceStatus(invId, e.target.value as InvoiceStatus)}
                        className="bg-transparent text-xs font-body border border-sand/15 rounded-full px-2.5 py-1 outline-none cursor-pointer"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-ink">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New invoice">
        <Formik
          initialValues={{ orderId: orders[0]?._id || orders[0]?.id || "" }}
          validationSchema={InvoiceSchema}
          onSubmit={handleCreate}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <FormField label="From order">
                <Field as="select" name="orderId" className={inputClass}>
                  {orders.map((o: any) => {
                    const ordId = o._id || o.id;
                    return (
                      <option key={ordId} value={ordId} className="bg-ink">
                        {ordId.slice(-6)} — {o.customerName} (${(o.amount || o.total || 0).toFixed(2)})
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage name="orderId" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create invoice"}
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}