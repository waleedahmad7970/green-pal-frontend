"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { listLocations } from "@/lib/admin/services/locations";
import type { OrderStatus, Location } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";
import { useOrderStore } from "@/lib/admin/slices/useOrderStore";

const statuses: OrderStatus[] = ["pending", "paid", "active", "returned", "cancelled"];

const OrderSchema = Yup.object().shape({
  customerName: Yup.string().required("Required"),
  customerEmail: Yup.string().email("Invalid email").required("Required"),
  locationId: Yup.string().required("Required"),
  item: Yup.string().required("Required"),
  total: Yup.number().positive("Must be positive").required("Required"),
  status: Yup.string().required("Required"),
});

export default function AdminOrdersPage() {
  const { orders, loading, fetchOrders, addOrder, changeOrderStatus } = useOrderStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    listLocations().then(setLocations).catch(console.error);
  }, [fetchOrders]);

  const handleCreate = async (values: any, { resetForm }: any) => {
    await addOrder({
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      locationId: values.locationId,
      item: values.item,
      total: parseFloat(values.total) || 0,
      status: values.status,
    });
    setModalOpen(false);
    resetForm();
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Every rental, charging session, and utility device order."
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New order</PrimaryButton>}
      />

      {loading && orders.length === 0 ? (
        <p className="text-sand/40 font-body text-sm">Loading orders…</p>
      ) : (
        <div className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-sand/40 border-b border-sand/10">
                <th className="p-4 font-normal">Order ID</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Item</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal">Payment</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const orderId = o._id || o.id || "";
                return (
                  <tr key={orderId} className="border-b border-sand/5 last:border-0">
                    <td className="p-4 text-sand/70 font-mono text-xs">{orderId.slice(-6)}</td>
                    <td className="p-4 text-sand">
                      {o.customerName}
                      <div className="text-sand/40 text-xs">{o.customerEmail}</div>
                    </td>
                    <td className="p-4 text-sand/70">{o.item}</td>
                    <td className="p-4 text-sand/70">${(o.total ?? 0).toFixed(2)}</td>
                    <td className="p-4">
                      {o.isPaid ? (
                        <span className="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          Paid {o.paymentDetails?.last4 ? `(••• ${o.paymentDetails.last4})` : ""}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sand/50 text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => changeOrderStatus(orderId, e.target.value as OrderStatus)}
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

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New order">
        <Formik
          initialValues={{
            customerName: "",
            customerEmail: "",
            locationId: locations[0]?.id ?? "",
            item: "Power Bank Rental",
            total: "",
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
              <FormField label="Total (USD)">
                <Field name="total" type="number" step="0.01" className={inputClass} />
                <ErrorMessage name="total" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create order"}
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}