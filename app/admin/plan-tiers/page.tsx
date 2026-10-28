"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PageHeader, AdminModal, FormField, PrimaryButton, inputClass } from "@/components/admin/ui";
import { usePlanTierStore } from "@/lib/admin/slices/usePlanTierStore";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/admin/services/upload";
import { PlanTier } from "@/lib/admin/services/planTierService";

const emptyTier = {
  name: "",
  slug: "",
  subtitle: "",
  price: "",
  slots: 8,
  sortOrder: 0,
  popular: false,
  image: "",
  blurb: "",
  features: [
    "You pay one time: $",
    "We buy your station and place it",
    "It gets its own number — yours",
    "50% of the net rental revenue, paid monthly",
  ],
  specs: {
    dimensions: "",
    weight: "",
    screen: "",
    formFactor: "",
    bestFor: "",
  },
  isActive: true,
};

const PlanTierSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  slug: Yup.string()
    .trim()
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .required("Slug is required"),
  subtitle: Yup.string().trim(),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  slots: Yup.number()
    .oneOf([8, 12, 24, 48], "Slots must be 8, 12, 24, or 48")
    .required("Slots selection is required"),
  sortOrder: Yup.number().typeError("Must be a number").required("Sort order is required"),
  popular: Yup.boolean(),
  image: Yup.string(),
  blurb: Yup.string().trim(),
  features: Yup.array().of(Yup.string().trim()),
  specs: Yup.object().shape({
    dimensions: Yup.string().trim(),
    weight: Yup.string().trim(),
    screen: Yup.string().trim(),
    formFactor: Yup.string().trim(),
    bestFor: Yup.string().trim(),
  }),
});

const renderField = (name: string, label: string, type = "text", placeholder = "") => (
  <div className="space-y-1">
    <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
      {label}
    </label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
    />
    <ErrorMessage name={name} component="div" className="text-red-400 text-xs mt-1" />
  </div>
);

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export default function AdminPlanTiersPage() {
  const {
    tiers,
    isLoading,
    fetchTiers,
    createTier,
    updateTier,
    deleteTier,
    toggleTier,
    generatePaymentLink,
  } = usePlanTierStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Link generation modal state (similar to products inquiry flow)
  const [linkModalTier, setLinkModalTier] = useState<PlanTier | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  const filteredTiers = Array.isArray(tiers)
    ? tiers.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleOpenAdd = () => {
    setEditingTier(null);
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tier: PlanTier) => {
    setEditingTier({
      ...tier,
      features: Array.isArray(tier.features) && tier.features.length > 0 ? tier.features : [""],
      specs: {
        dimensions: tier.specs?.dimensions || "",
        weight: tier.specs?.weight || "",
        screen: tier.specs?.screen || "",
        formFactor: tier.specs?.formFactor || "",
        bestFor: tier.specs?.bestFor || "",
      },
    });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to soft delete the tier "${name}"?`)) {
      try {
        await deleteTier(id);
      } catch (err) {
        // handled
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleTier(id);
    } catch (err) {
      // handled
    }
  };

  const handleOpenLinkModal = (tier: PlanTier) => {
    setLinkModalTier(tier);
    setCustomPrice(tier.price.toString());
    setCustomerEmail("");
    setCustomerName("");
    setGeneratedUrl(null);
  };

  const handleGeneratePaymentLink = async () => {
    if (!linkModalTier) return;
    setIsGenerating(true);
    try {
      const result = await generatePaymentLink(linkModalTier._id as string, {
        customerEmail: customerEmail.trim() || undefined,
        customerName: customerName.trim() || undefined,
        customPrice: customPrice ? parseFloat(customPrice) : undefined,
      });
      setGeneratedUrl(result.url);
    } catch (err) {
      // handled
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Payment link copied to clipboard!");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadToS3 = async (setFieldValue: any) => {
    if (!selectedFile) return toast.error("Please select a file to upload");

    setIsUploading(true);
    try {
      const { url } = await uploadImage(selectedFile, "products");

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
    // Only the fields the backend (Joi) accepts
    const payload: any = {
      slug: String(values.slug).trim().toLowerCase(),
      name: String(values.name).trim(),
      subtitle: values.subtitle || "",
      price: Number(values.price),
      slots: Number(values.slots),
      popular: !!values.popular,
      image: values.image || "",
      blurb: values.blurb || "",
      features: (values.features || [])
        .map((f: string) => f.trim())
        .filter(Boolean),
      specs: {
        dimensions: values.specs?.dimensions || "",
        weight: values.specs?.weight || "",
        screen: values.specs?.screen || "",
        formFactor: values.specs?.formFactor || "",
        bestFor: values.specs?.bestFor || "",
      },
      sortOrder: Number(values.sortOrder),
      isActive: !!values.isActive,
    };

    try {
      if (editingTier) {
        const id = editingTier._id || editingTier.id;
        // updatePlanTierJoi requires _id in the body
        await updateTier(id, { ...payload, _id: id });
      } else {
        await createTier(payload);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save plan tier:", error);
    }
  };

  return (
    <div>
      <PageHeader
        title="Plan Tiers"
        description="Manage the 4 investment tiers (Pulse 8, 12, 24, 48), station specs, and generate payment links for customers after meetings."
      />

      <div className="grid gap-6 max-w-[1400px]">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <input
            type="text"
            placeholder="Search tiers by name, slug or subtitle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-96 bg-sand/[0.04] border border-sand/10 rounded-xl px-4 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
          />
          <button
            onClick={handleOpenAdd}
            className="bg-sand text-black px-5 py-2 rounded-xl font-display font-semibold hover:bg-white transition-colors whitespace-nowrap"
          >
            + Add Plan Tier
          </button>
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <section className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-sand/10 pb-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-sand">
                  {editingTier ? `Edit Tier: ${editingTier.name}` : "New Plan Tier"}
                </h3>
                <p className="text-sand/50 text-xs mt-0.5">
                  Investment tier station details and revenue share package
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-sand/50 hover:text-sand text-sm font-body px-3 py-1 rounded border border-sand/10 hover:border-sand/30"
              >
                Close
              </button>
            </div>

            <Formik
              initialValues={editingTier || emptyTier}
              validationSchema={PlanTierSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form className="space-y-8">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Basic Information
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                          Name *
                        </label>
                        <Field
                          name="name"
                          type="text"
                          placeholder="e.g. Pulse 8"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = e.target.value;
                            setFieldValue("name", val);
                            if (!editingTier) {
                              setFieldValue("slug", generateSlug(val));
                            }
                          }}
                          className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {renderField("slug", "Slug * (auto-generated, editable)", "text", "e.g. pulse-8")}
                      {renderField("subtitle", "Subtitle", "text", "e.g. A compact beginning")}

                      <div className="space-y-1">
                        <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                          Slots * (Dropdown)
                        </label>
                        <Field
                          as="select"
                          name="slots"
                          className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
                        >
                          <option value={8} className="bg-ink text-sand">8 Slots</option>
                          <option value={12} className="bg-ink text-sand">12 Slots</option>
                          <option value={24} className="bg-ink text-sand">24 Slots</option>
                          <option value={48} className="bg-ink text-sand">48 Slots</option>
                        </Field>
                        <ErrorMessage name="slots" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {renderField("price", "Price ($ USD) *", "number", "e.g. 500")}
                      {renderField("sortOrder", "Sort Order *", "number", "1")}

                      <div className="flex items-center gap-3 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-sand font-body">
                          <Field
                            type="checkbox"
                            name="popular"
                            className="w-4 h-4 rounded border-sand/20 text-signal focus:ring-signal bg-black/20"
                          />
                          <span>Recommended Tier</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-sand font-body">
                          <Field
                            type="checkbox"
                            name="isActive"
                            className="w-4 h-4 rounded border-sand/20 text-signal focus:ring-signal bg-black/20"
                          />
                          <span>Active / Published</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                        Blurb
                      </label>
                      <Field
                        as="textarea"
                        rows={2}
                        name="blurb"
                        placeholder="e.g. 8 power banks. Good for small busy places."
                        className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Tier Hardware Image
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        {values.image ? (
                          <div className="flex items-center gap-3 bg-black/20 border border-sand/10 rounded-lg p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={values.image}
                              alt="Station preview"
                              className="h-16 w-16 object-contain rounded border border-sand/10 bg-black/20 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-signal font-body">Image set</p>
                              <p className="text-[10px] text-sand/40 font-body truncate" title={values.image}>
                                {values.image}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFieldValue("image", "")}
                              className="text-xs text-red-400 hover:underline shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="bg-black/20 border border-dashed border-sand/20 rounded-lg p-4 text-center">
                            <p className="text-xs text-sand/40 font-body">No custom image uploaded yet (will use vector graphic fallback if empty)</p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 mt-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="text-xs text-sand/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sand/10 file:text-sand hover:file:bg-sand/20 cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => handleUploadToS3(setFieldValue)}
                            disabled={!selectedFile || isUploading}
                            className="bg-sand/10 border border-sand/20 text-sand text-xs py-2 px-4 rounded-lg hover:bg-sand/20 transition-colors disabled:opacity-50"
                          >
                            {isUploading ? "Uploading to S3..." : "Upload Selected File to S3"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider block mb-1">
                          Or enter manual image path / URL
                        </label>
                        <Field
                          name="image"
                          type="text"
                          placeholder="/stations/pulse-8.png or https://..."
                          className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
                        />
                        <p className="text-[11px] text-sand/40 mt-1">
                          You can also use static path e.g. <span className="font-mono text-signal">/stations/pulse-8.png</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Package Features (Bullet Points)
                    </h4>
                    <FieldArray name="features">
                      {({ push, remove }) => (
                        <div className="space-y-3">
                          {values.features && values.features.length > 0 ? (
                            values.features.map((_: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-sand/40 font-mono text-xs w-6">{index + 1}.</span>
                                <Field
                                  name={`features.${index}`}
                                  type="text"
                                  placeholder="Feature line description"
                                  className="flex-1 bg-black/20 border border-sand/10 rounded-lg px-3 py-2 text-sand text-sm font-body focus:border-signal outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg border border-red-400/20"
                                >
                                  Remove
                                </button>
                              </div>
                            ))
                          ) : null}
                          <button
                            type="button"
                            onClick={() => push("")}
                            className="mt-2 text-xs text-signal hover:underline flex items-center gap-1 font-body"
                          >
                            + Add Feature Line
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Five Specs */}
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Hardware Specifications (5 Specs Fields)
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {renderField("specs.dimensions", "Dimensions", "text", "280 x 215 x 180 mm")}
                      {renderField("specs.weight", "Weight", "text", "5.2 kg")}
                      {renderField("specs.screen", "Display Screen", "text", "LED Status Matrix")}
                      {renderField("specs.formFactor", "Form Factor", "text", "Countertop Compact")}
                      <div className="sm:col-span-2">
                        {renderField("specs.bestFor", "Best For", "text", "Boutique cafes, salons, specialty bakeries & intimate lounges")}
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-4 border-t border-sand/10 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-6 py-2.5 rounded-lg border border-sand/20 font-body text-sm text-sand/70 hover:bg-sand/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="bg-signal text-black px-8 py-2.5 rounded-lg font-body font-medium hover:bg-signal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingTier ? "Save Plan Tier" : "Create Plan Tier"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        )}

        {/* Tiers Table */}
        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          {isLoading && !tiers.length ? (
            <div className="p-8 text-center text-sand/50 font-body text-sm">Loading plan tiers...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-sand/10 bg-black/20">
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Tier / Image</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Slots</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Sort</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Active</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Payment Link</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-sand/10">
                {filteredTiers.length > 0 ? (
                  filteredTiers.map((tier) => (
                    <tr key={tier._id || tier.id} className="hover:bg-sand/[0.02] transition-colors">
                      {/* Name & Image */}
                      <td className="p-4 text-sand">
                        <div className="flex items-center gap-3">
                          {tier.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={tier.image}
                              alt={tier.name}
                              className="h-12 w-12 object-contain bg-black/20 rounded border border-sand/10 p-1"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-signal/10 border border-signal/30 flex items-center justify-center font-mono text-xs text-signal">
                              {tier.slots}p
                            </div>
                          )}
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <span>{tier.name}</span>
                              {tier.popular && (
                                <span className="text-[10px] bg-signal text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <div className="text-sand/50 text-xs mt-0.5 font-mono">{tier.slug}</div>
                            <div className="text-sand/40 text-xs truncate max-w-xs">{tier.subtitle}</div>
                          </div>
                        </div>
                      </td>

                      {/* Slots */}
                      <td className="p-4 text-sand font-mono">{tier.slots} slots</td>

                      {/* Price */}
                      <td className="p-4 text-sand">
                        <span className="font-display font-bold text-base text-signal">
                          ${tier.price}
                        </span>
                        <span className="text-sand/50 text-xs ml-1">one-time</span>
                      </td>

                      {/* Sort Order */}
                      <td className="p-4 text-sand font-mono">{tier.sortOrder ?? 0}</td>

                      {/* Active Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(tier._id as string)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tier.isActive
                            ? "bg-signal/20 text-signal border border-signal/40 hover:bg-signal/30"
                            : "bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400/20"
                            }`}
                          title="Click to toggle active status"
                        >
                          {tier.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Generate / Email Payment Link on demand */}
                      <td className="p-4 text-xs">
                        <button
                          onClick={() => handleOpenLinkModal(tier)}
                          className="bg-signal text-black text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-signal/80 transition-colors"
                        >
                          Generate & Email Link
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(tier)}
                          className="text-sand/60 hover:text-signal transition-colors text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tier._id as string, tier.name)}
                          className="text-sand/60 hover:text-red-400 transition-colors text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sand/50">
                      No plan tiers found matching &quot;{searchQuery}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* Generate & Email Payment Link Modal */}
      {linkModalTier && (
        <AdminModal
          open={!!linkModalTier}
          onClose={() => setLinkModalTier(null)}
          title={`Generate Payment Link: ${linkModalTier.name}`}
        >
          <div className="space-y-4">
            <FormField label="Customer Email (Optional - will email link directly)">
              <input
                type="email"
                placeholder="investor@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Customer Name (Optional)">
              <input
                type="text"
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Price (USD)">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <p className="text-sand/40 text-xs font-body">
              This creates a secure Stripe Checkout session. If customer email is specified, the payment link will be automatically emailed to them with full instructions.
            </p>

            {generatedUrl && (
              <div className="p-3 bg-black/40 border border-signal/40 rounded-lg space-y-2">
                <p className="text-xs text-signal font-medium">Link Generated Successfully:</p>
                <p className="text-xs text-sand/80 font-mono break-all bg-black/30 p-2 rounded">
                  {generatedUrl}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedUrl)}
                    className="px-3 py-1 bg-signal text-black rounded text-xs font-medium hover:bg-signal/80"
                  >
                    Copy Link
                  </button>
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 border border-sand/20 text-sand text-xs rounded hover:bg-sand/10"
                  >
                    Open Link ↗
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2">
              <PrimaryButton
                onClick={handleGeneratePaymentLink}
                disabled={isGenerating || !customPrice || parseFloat(customPrice) <= 0}
              >
                {isGenerating
                  ? "Generating..."
                  : customerEmail
                    ? "Generate & Email to Customer"
                    : "Generate Link"}
              </PrimaryButton>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
