"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { listOrders, createOrder, updateOrder } from "@/lib/admin/services/orders";
import { listLocations } from "@/lib/admin/services/locations";
import type { Order, OrderStatus, Location } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

const statuses: OrderStatus[] = ["pending", "active", "returned", "cancelled"];

const OrderSchema = Yup.object().shape({
  customerName: Yup.string().required("Required"),
  customerEmail: Yup.string().email("Invalid email").required("Required"),
  locationId: Yup.string().required("Required"),
  item: Yup.string().required("Required"),
  amount: Yup.number().positive("Must be positive").required("Required"),
  status: Yup.string().required("Required"),
});

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => listOrders().then(setOrders);

  useEffect(() => {
    Promise.all([listOrders(), listLocations()]).then(([o, l]) => {
      setOrders(o);
      setLocations(l);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (values: any, { resetForm }: any) => {
    await createOrder({
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      locationId: values.locationId,
      item: values.item,
      amount: parseFloat(values.amount) || 0,
      status: values.status,
    });
    setModalOpen(false);
    resetForm();
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
        <Formik
          initialValues={{
            customerName: "",
            customerEmail: "",
            locationId: locations[0]?.id ?? "",
            item: "Power Bank Rental" as Order["item"],
            amount: "",
            status: "pending" as OrderStatus,
          }}
          validationSchema={OrderSchema}
          onSubmit={handleCreate}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <FormField label="Customer name">
                <Field name="customerName" className={inputClass} />
                <ErrorMessage name="customerName" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Customer email">
                <Field name="customerEmail" type="email" className={inputClass} />
                <ErrorMessage name="customerEmail" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Location">
                <Field as="select" name="locationId" className={inputClass}>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id} className="bg-ink">
                      {l.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="locationId" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Item">
                <Field as="select" name="item" className={inputClass}>
                  <option value="Power Bank Rental" className="bg-ink">Power Bank Rental</option>
                  <option value="Charging Session" className="bg-ink">Charging Session</option>
                  <option value="Utility Device" className="bg-ink">Utility Device</option>
                </Field>
                <ErrorMessage name="item" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Amount (USD)">
                <Field name="amount" type="number" step="0.01" className={inputClass} />
                <ErrorMessage name="amount" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <PrimaryButton type="submit">
                Create order
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}
