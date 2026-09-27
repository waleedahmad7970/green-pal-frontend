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
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/admin/services/upload";

const statuses: LocationStatus[] = ["live", "installing", "offline"];

const emptyLocation = {
  name: "",
  venue: "",
  image: "",
  city: "",
  address: "",
  bays: 6,
  status: "installing" as LocationStatus,
  installedAt: new Date().toISOString().slice(0, 10),
  lat: "",
  lng: "",
};

const LocationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  venue: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  bays: Yup.number().positive("Must be positive").required("Required"),
  status: Yup.string().oneOf(["live", "installing", "offline"]).required("Required"),
  installedAt: Yup.string().required("Required"),
  lat: Yup.number().typeError("Must be a number").optional(),
  lng: Yup.number().typeError("Must be a number").optional(),
});

export default function AdminLocationsPage() {
  const { locations, isLoading, fetchLocations, createLocation, updateLocation, deleteLocation } = useLocationStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);

  // S3 Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (loc: any) => {
    setEditingLocation({
      ...loc,
      lat: loc.coordinates?.lat ?? "",
      lng: loc.coordinates?.lng ?? "",
    });
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteLocation(id);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadToS3 = async (setFieldValue: any) => {
    if (!selectedFile) return toast.error("Please select a file to upload");

    setIsUploading(true);
    try {
      const { url } = await uploadImage(selectedFile, "locations" as any);
      if (typeof url !== "string" || !url.startsWith("http")) {
        toast.error("Upload succeeded but no valid image URL was returned");
        return;
      }

      setFieldValue("image", url);
      toast.success("Image successfully uploaded to S3!");
    } catch (error) {
      toast.error("Upload failed. Check your backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const formattedData = {
      name: values.name,
      venue: values.venue,
      image: values.image || "",
      city: values.city,
      address: values.address,
      bays: parseInt(values.bays, 10) || 0,
      status: values.status,
      installedAt: values.installedAt,
      coordinates: {
        lat: values.lat !== "" ? parseFloat(values.lat) : undefined,
        lng: values.lng !== "" ? parseFloat(values.lng) : undefined,
      },
    };

    if (editingLocation) {
      const id = editingLocation._id || editingLocation.id;
      await updateLocation(id, formattedData);
    } else {
      await createLocation(formattedData);
    }

    setModalOpen(false);
    resetForm();
    setEditingLocation(null);
  };

  const handleStatusChange = async (locationId: string, name: string, status: LocationStatus) => {
    await updateLocation(locationId, { name, status });
  };

  return (
    <div>
      <PageHeader
        title="Locations"
        description="Every deployed and in-progress station."
        action={<PrimaryButton onClick={handleOpenAdd}>New location</PrimaryButton>}
      />

      {isLoading && !locations.length ? (
        <p className="text-sand/40 font-body text-sm">Loading…</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {locations.map((l) => {
            const locId = l._id || l.id!;
            return (
              <div key={locId} className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  {l.image && (
                    <img src={l.image} alt={l.name} className="w-full h-36 object-cover rounded-lg mb-4 border border-sand/10 bg-black/20" />
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-sand">{l.name}</h3>
                      <p className="text-sand/50 text-sm font-body">{l.venue}</p>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-sand/70 text-xs font-body mb-2">{l.address}, {l.city}</p>
                  <div className="flex items-center justify-between text-sm font-body text-sand/60 mb-4">
                    <span>Installed: {l.installedAt || "N/A"}</span>
                    <span>{l.bays} bays</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-sand/10">
                  <select
                    value={l.status}
                    onChange={(e) => handleStatusChange(locId, l.name, e.target.value as LocationStatus)}
                    className="w-full bg-transparent text-xs font-body border border-sand/15 rounded-lg px-2.5 py-2 outline-none text-sand"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="bg-ink">
                        {s}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-3 text-xs font-body">
                    <button onClick={() => handleOpenEdit(l)} className="text-sand/60 hover:text-signal transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(locId)} className="text-sand/60 hover:text-red-400 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingLocation ? "Edit Location" : "New location"}>
        <Formik
          initialValues={editingLocation || emptyLocation}
          validationSchema={LocationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
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

              <FormField label="Address">
                <Field name="address" className={inputClass} />
                <ErrorMessage name="address" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Charging bays">
                  <Field name="bays" type="number" className={inputClass} />
                  <ErrorMessage name="bays" component="div" className="text-red-400 text-xs mt-1" />
                </FormField>

                <FormField label="Status">
                  <Field as="select" name="status" className={inputClass + " bg-ink text-sand"}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-400 text-xs mt-1" />
                </FormField>
              </div>

              <FormField label="Installed At (YYYY-MM-DD)">
                <Field name="installedAt" className={inputClass} />
                <ErrorMessage name="installedAt" component="div" className="text-red-400 text-xs mt-1" />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Latitude">
                  <Field name="lat" type="number" step="any" className={inputClass} placeholder="37.7749" />
                  <ErrorMessage name="lat" component="div" className="text-red-400 text-xs mt-1" />
                </FormField>
                <FormField label="Longitude">
                  <Field name="lng" type="number" step="any" className={inputClass} placeholder="-122.4194" />
                  <ErrorMessage name="lng" component="div" className="text-red-400 text-xs mt-1" />
                </FormField>
              </div>

              {/* S3 Image Upload Section */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                  Location Image
                </label>

                {values.image ? (
                  <div className="flex items-center gap-3 bg-black/25 border border-sand/10 rounded-lg p-2">
                    <img src={values.image} alt="Location preview" className="h-12 w-12 object-cover rounded border border-sand/10" />
                    <div className="min-w-0">
                      <p className="text-xs text-signal font-body">Image attached</p>
                      <p className="text-[10px] text-sand/40 font-body truncate">{values.image}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/20 border border-dashed border-sand/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-sand/40 font-body">No image uploaded yet</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-1.5 text-sand text-sm font-body focus:border-signal outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-signal file:text-black cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleUploadToS3(setFieldValue)}
                    disabled={!selectedFile || isUploading}
                    className="bg-signal text-black px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-signal/80 transition-colors disabled:bg-sand/10 disabled:text-sand/40 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading to S3..." : values.image ? "Upload New Image" : "Upload Selected File"}
                  </button>
                </div>
                <Field type="hidden" name="image" />
                <ErrorMessage name="image" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              <div className="pt-4 border-t border-sand/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sand/60 hover:text-sand text-sm font-body"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? "Saving..." : editingLocation ? "Update location" : "Create location"}
                </PrimaryButton>
              </div>
            </Form>
          )}
        </Formik>
      </AdminModal>
    </div>
  );
}