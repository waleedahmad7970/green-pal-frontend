"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { listInvoices, createInvoice, updateInvoice } from "@/lib/admin/services/invoices";
import { listOrders } from "@/lib/admin/services/orders";
import type { Invoice, InvoiceStatus, Order } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

const InvoiceSchema = Yup.object().shape({
  orderId: Yup.string().required("Required"),
});

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => listInvoices().then(setInvoices);

  useEffect(() => {
    Promise.all([listInvoices(), listOrders()]).then(([i, o]) => {
      setInvoices(i);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (values: any, { resetForm }: any) => {
    const order = orders.find((o) => o.id === values.orderId);
    if (!order) return;
    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 7);
    await createInvoice({
      orderId: order.id,
      customerName: order.customerName,
      amount: order.amount,
      status: "draft",
      issuedAt: today.toISOString().slice(0, 10),
      dueAt: due.toISOString().slice(0, 10),
    });
    setModalOpen(false);
    resetForm();
    refresh();
  };

  const handleStatusChange = async (invoiceId: string, status: InvoiceStatus) => {
    await updateInvoice(invoiceId, { status });
    refresh();
  };

  const total = invoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices, $${total.toFixed(2)} total.`}
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New invoice</PrimaryButton>}
      />

      {loading ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Invoice</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Amount</th>
                <th className="p-4 font-normal">Issued</th>
                <th className="p-4 font-normal">Due</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-b border-sand/5 last:border-0">
                  <td className="p-4 text-sand/70">{i.id}</td>
                  <td className="p-4 text-sand">{i.customerName}</td>
                  <td className="p-4 text-sand/70">${i.amount.toFixed(2)}</td>
                  <td className="p-4 text-sand/50">{i.issuedAt}</td>
                  <td className="p-4 text-sand/50">{i.dueAt}</td>
                  <td className="p-4">
                    <select
                      value={i.status}
                      onChange={(e) => handleStatusChange(i.id, e.target.value as InvoiceStatus)}
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

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New invoice">
        <Formik
          initialValues={{ orderId: orders[0]?.id ?? "" }}
          validationSchema={InvoiceSchema}
          onSubmit={handleCreate}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <FormField label="From order">
                <Field as="select" name="orderId" className={inputClass}>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id} className="bg-ink">
                      {o.id} — {o.customerName} (${o.amount.toFixed(2)})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="orderId" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <PrimaryButton type="submit">
                Create invoice
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}
