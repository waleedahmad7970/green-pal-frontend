"use client";

import { useEffect, useState } from "react";
import { listLocations, createLocation, updateLocation } from "@/lib/admin/api";
import type { Location, LocationStatus } from "@/lib/admin/types";
import {
  PageHeader,
  PrimaryButton,
  StatusBadge,
  AdminModal,
  FormField,
  inputClass,
} from "@/components/admin/ui";

const statuses: LocationStatus[] = ["live", "installing", "offline"];

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", venue: "", city: "", bays: "6" });

  const refresh = () => listLocations().then(setLocations);

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLocation({
      name: form.name,
      venue: form.venue,
      city: form.city,
      bays: parseInt(form.bays, 10) || 0,
      status: "installing",
      installedAt: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(false);
    setForm({ name: "", venue: "", city: "", bays: "6" });
    refresh();
  };

  const handleStatusChange = async (locationId: string, status: LocationStatus) => {
    await updateLocation(locationId, { status });
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="Locations"
        description="Every deployed and in-progress station."
        action={<PrimaryButton onClick={() => setModalOpen(true)}>New location</PrimaryButton>}
      />

      {loading ? (
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
                onChange={(e) => handleStatusChange(l.id, e.target.value as LocationStatus)}
                className="w-full bg-transparent text-xs font-body border border-sand/15 rounded-lg px-2.5 py-1.5 outline-none"
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
        <form onSubmit={handleCreate}>
          <FormField label="Station name">
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Venue">
            <input required className={inputClass} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </FormField>
          <FormField label="City">
            <input required className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </FormField>
          <FormField label="Charging bays">
            <input required type="number" className={inputClass} value={form.bays} onChange={(e) => setForm({ ...form, bays: e.target.value })} />
          </FormField>
          <PrimaryButton type="submit">Create location</PrimaryButton>
        </form>
      </AdminModal>
    </div>
  );
}
