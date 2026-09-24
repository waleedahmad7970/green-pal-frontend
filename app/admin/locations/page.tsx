"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocationStore } from "@/lib/admin/slices/useLocationStore";
import type { LocationStatus } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  StatusBadge,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

const statuses: LocationStatus[] = ["live", "installing", "offline"];

const LocationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  venue: Yup.string().required("Required"),

  city: Yup.string().required("Required"),
  bays: Yup.number().positive("Must be positive").required("Required"),
});

export default function AdminLocationsPage() {
  // Pull state and actions directly from Zustand
  const { locations, isLoading, fetchLocations, createLocation, updateLocation } = useLocationStore();

  // Keep UI-only state local
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleCreate = async (values: any, { resetForm }: any) => {
    await createLocation({
      name: values.name,
      venue: values.venue,
      city: values.city,
      bays: parseInt(values.bays, 10) || 0,
      status: "installing",
      installedAt: new Date().toISOString().slice(0, 10),
      image: "",
    });
    setModalOpen(false);
    resetForm();
    // No need to call refresh manually; Zustand does it automatically
  };

  const handleStatusChange = async (locationId: string, name: string, status: LocationStatus) => {
    await updateLocation(locationId, { name, status });
  };

  return (
    <div>
      <PageHeader
        title="Locations"
        description="Every deployed and in-progress station."
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New location</PrimaryButton>}
      />

      {isLoading && !locations.length ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {locations.map((l) => (
            <div key={l.id} className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-sand">{l.name}</h3>
                  <p className="text-sand/50 text-sm font-body">{l.venue}</p>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <div className="flex items-center justify-between text-sm font-body text-sand/60 mb-4">
                <span>{l.city}</span>
                <span>{l.bays} bays</span>
              </div>
              <select
                value={l.status}
                onChange={(e) => handleStatusChange(l.id, l.name, e.target.value as LocationStatus)} className="w-full bg-transparent text-xs font-body border border-sand/15 rounded-lg px-2.5 py-1.5 outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-ink">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New location">
        <Formik
          initialValues={{ name: "", venue: "", city: "", bays: "6" }}
          validationSchema={LocationSchema}
          onSubmit={handleCreate}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormField label="Station name">
                <Field name="name" className={inputClass} />
                <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Venue">
                <Field name="venue" className={inputClass} />
                <ErrorMessage name="venue" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="City">
                <Field name="city" className={inputClass} />
                <ErrorMessage name="city" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <FormField label="Charging bays">
                <Field name="bays" type="number" className={inputClass} />
                <ErrorMessage name="bays" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create location"}
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}