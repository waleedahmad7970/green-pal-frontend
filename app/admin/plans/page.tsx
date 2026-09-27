"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/admin/ui";
import { usePlanStore } from "@/lib/admin/slices/usePlanStore";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/admin/services/upload";

const emptyPlan = {
  model: "",
  productName: "",
  category: "",
  image: "",
  pdfKey: "", // Added to store the S3 PDF file key/path
  slug: "",
  series: "",
  portfolioTag: "",
  subtitle: "",
  whatsInside: "",
  slots: "",
  stationColor: "",
  maxPower: "",
  networkSupport: "",
  material: "",
  powerInput: "",
  powerProtection: "",
  certification: "",
  singlePowerOutput: "",
  adsSizeAndResolution: "",
  temperature: "",
  workingHumidity: "",
  paymentMethods: "",
  functionalCharacteristics: "",
  weight: "",
  singleGrossWeight: "",
  packageSize: "",
  pricing: [],
};

const PlanSchema = Yup.object().shape({
  model: Yup.string().required("Model is required"),
  productName: Yup.string().required("Plan name is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.string().required("You must upload an image to S3 first"),
  pdfKey: Yup.string().required("You must upload a PDF blueprint file to S3 first"),
  slug: Yup.string().required(""),
  series: Yup.string().required(""),
  portfolioTag: Yup.string().required(""),
  subtitle: Yup.string().required(""),
  slots: Yup.number()
    .min(0, "Cannot be negative")
    .typeError("Must be a number")
    .required("Total slots is required"),
  stationColor: Yup.string().required("Colors are required"),
  maxPower: Yup.string().required("Max power is required"),
  networkSupport: Yup.string().required("Network support is required"),
  material: Yup.string().required("Material is required"),
  powerInput: Yup.string().required("Power input is required"),
  powerProtection: Yup.string().required("Power protection is required"),
  certification: Yup.string().required("Certification is required"),
  singlePowerOutput: Yup.string().required("Single power output is required"),
  adsSizeAndResolution: Yup.string().required("Screen size/res is required"),
  temperature: Yup.string().required("Working temperature is required"),
  workingHumidity: Yup.string().required("Working humidity is required"),
  paymentMethods: Yup.string().required("Payment methods are required"),
  functionalCharacteristics: Yup.string().required("Functional characteristics are required"),
  weight: Yup.string().required("Weight is required"),
  singleGrossWeight: Yup.string().required("Gross weight is required"),
  packageSize: Yup.string().required("Package size is required"),
  pricing: Yup.array()
    .of(
      Yup.object().shape({
        qty: Yup.string().required("Required"),
        price: Yup.number().typeError("Must be a number").required("Required"),
      })
    )
    .min(1, "At least one pricing tier is required")
    .required("Pricing is required"),
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

export default function AdminPlansPage() {
  const { plans, isLoading, fetchPlans, createPlan, updatePlan, deletePlan } = usePlanStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  // Image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // PDF upload states
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [isPdfUploading, setIsPdfUploading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = plans.filter(
    (p: any) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setSelectedFile(null);
    setSelectedPdfFile(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan({
      ...plan,
      stationColor: plan.stationColor?.join(", ") || "",
      paymentMethods: plan.paymentMethods?.join(", ") || "",
      whatsInside: plan.whatsInside?.join(", ") || "",
    });
    setSelectedFile(null);
    setSelectedPdfFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      await deletePlan(id);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedPdfFile(file);
  };

  const handleUploadToS3 = async (setFieldValue: any) => {
    if (!selectedFile) return toast.error("Please select an image file to upload");

    setIsUploading(true);
    try {
      const res: any = await uploadImage(selectedFile, "plans");
      const url = typeof res === "string" ? res : res?.url;

      if (!url || !url.startsWith("http")) {
        toast.error("Upload succeeded but no valid image URL was returned");
        return;
      }

      setFieldValue("image", url);
      toast.success("Image successfully uploaded to S3!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed. Check your backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePdfUploadToS3 = async (setFieldValue: any) => {
    if (!selectedPdfFile) return toast.error("Please select a PDF file to upload");

    setIsPdfUploading(true);
    try {
      const res: any = await uploadImage(selectedPdfFile, "plans-pdf" as any);
      // Extracts either the direct S3 key or extracts it from the returned URL/object
      const key = res?.key || (typeof res === "string" ? res : res?.url);

      if (!key) {
        toast.error("PDF upload failed to return a valid key");
        return;
      }

      setFieldValue("pdfKey", key);
      toast.success("PDF blueprint successfully uploaded to S3!");
    } catch (error) {
      console.error("PDF Upload failed:", error);
      toast.error("PDF upload failed. Check your backend.");
    } finally {
      setIsPdfUploading(false);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const formattedValues = {
      ...values,
      stationColor: values.stationColor
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      paymentMethods: values.paymentMethods
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      whatsInside: typeof values.whatsInside === "string"
        ? values.whatsInside.split(",").map((s: string) => s.trim()).filter(Boolean)
        : values.whatsInside,
    };

    try {
      if (editingPlan) {
        await updatePlan(editingPlan._id || editingPlan.id, formattedValues);
      } else {
        await createPlan(formattedValues);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save plan:", error);
    }
  };

  return (
    <div>
      <PageHeader
        title="Plans"
        description="Manage full plan specifications, imagery, PDF blueprints, and tiered pricing."
      />

      <div className="grid gap-6 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-96 bg-sand/[0.04] border border-sand/10 rounded-xl px-4 py-2 text-sand text-sm font-body focus:border-signal outline-none transition-colors"
          />
          <button
            onClick={handleOpenAdd}
            className="bg-sand text-black px-5 py-2 rounded-xl font-display font-semibold hover:bg-white transition-colors whitespace-nowrap"
          >
            + Add Plan
          </button>
        </div>

        {isFormOpen && (
          <section className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-sand/10 pb-4">
              <h3 className="font-display text-xl font-semibold text-sand">
                {editingPlan ? "Edit Plan Specifications" : "New Plan"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-sand/50 hover:text-sand text-sm font-body"
              >
                Close
              </button>
            </div>

            <Formik
              initialValues={editingPlan || emptyPlan}
              validationSchema={PlanSchema}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting, errors, setFieldValue }) => (
                <Form className="space-y-8">
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Basic Info & Files
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {renderField("model", "Model *")}
                      {renderField("productName", "Plan Name *")}
                      {renderField("category", "Category *")}

                      {/* Image Upload Block */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                          Plan Image *
                        </label>

                        {values.image ? (
                          <div className="flex items-center gap-3 bg-black/20 border border-sand/10 rounded-lg p-2">
                            <img
                              src={values.image}
                              alt="Current plan image"
                              className="h-14 w-14 object-contain rounded border border-sand/10 bg-black/20 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs text-signal font-body">Image attached</p>
                              <p className="text-[10px] text-sand/40 font-body truncate" title={values.image}>
                                {values.image}
                              </p>
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
                            className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-1.5 text-sand text-sm font-body file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-signal file:text-black cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => handleUploadToS3(setFieldValue)}
                            disabled={!selectedFile || isUploading}
                            className="bg-signal text-black px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-signal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploading ? "Uploading Image..." : "Upload Selected Image"}
                          </button>
                        </div>
                        <Field type="hidden" name="image" />
                        <ErrorMessage name="image" component="div" className="text-red-400 text-xs mt-1" />
                      </div>

                      {/* PDF Blueprint Upload Block */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                          Blueprint PDF File *
                        </label>

                        {values.pdfKey ? (
                          <div className="flex items-center justify-between bg-black/20 border border-sand/10 rounded-lg p-2.5">
                            <span className="text-xs text-signal font-body truncate" title={values.pdfKey}>
                              Attached: {values.pdfKey}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-black/20 border border-dashed border-sand/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-sand/40 font-body">No PDF blueprint uploaded yet</p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfSelect}
                            className="w-full bg-black/20 border border-sand/10 rounded-lg px-3 py-1.5 text-sand text-sm font-body file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-signal file:text-black cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => handlePdfUploadToS3(setFieldValue)}
                            disabled={!selectedPdfFile || isPdfUploading}
                            className="bg-signal text-black px-4 py-2 rounded-lg text-sm font-body font-semibold hover:bg-signal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPdfUploading ? "Uploading PDF..." : "Upload Selected PDF"}
                          </button>
                        </div>
                        <Field type="hidden" name="pdfKey" />
                        <ErrorMessage name="pdfKey" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Blueprint & Co-Investment Details
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {renderField("slug", "Slug (e.g., co-invest-2500)", "text", "co-invest-2500-diversified")}
                      {renderField("series", "Series", "text", "GREENPAL CO-INVEST SERIES")}
                      {renderField("portfolioTag", "Portfolio Tag", "text", "GREENPAL POWER PORTFOLIO")}
                      {renderField("subtitle", "Subtitle / Summary Description", "text", "$5,000 Total Portfolio...")}
                      {renderField("whatsInside", "What's Inside (Comma separated bullets)", "text", "Startup cost breakdown, Revenue-sharing model")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Technical Specs
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("slots", "Total Slots *", "number")}
                      {renderField("maxPower", "Max Power *")}
                      {renderField("powerInput", "Power Input *")}
                      {renderField("singlePowerOutput", "Single Power Output *")}
                      {renderField("networkSupport", "Network Support (4G/WiFi) *")}
                      {renderField("material", "Material *")}
                      {renderField("powerProtection", "Power Protection *")}
                      {renderField("certification", "Certification (CE/FCC/RoHS) *")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Physical & Environment
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("adsSizeAndResolution", "Ads Screen Size/Res *")}
                      {renderField("temperature", "Working Temp *")}
                      {renderField("workingHumidity", "Working Humidity *")}
                      {renderField("weight", "Net Weight *")}
                      {renderField("singleGrossWeight", "Gross Weight *")}
                      {renderField("packageSize", "Package Size *")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Features & Options
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {renderField("stationColor", "Colors (Comma separated) *", "text", "e.g., Black, White")}
                      {renderField("paymentMethods", "Payment Methods (Comma separated) *", "text", "e.g., Credit Card, PayPal")}
                      {renderField("functionalCharacteristics", "Functional Characteristics *")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Tiered Pricing *
                    </h4>
                    {typeof errors.pricing === "string" && (
                      <div className="text-red-400 text-xs mb-2">
                        {errors.pricing}
                      </div>
                    )}
                    <FieldArray name="pricing">
                      {({ remove, push }) => (
                        <div className="space-y-3 max-w-2xl">
                          {values.pricing.length > 0 &&
                            values.pricing.map((tier: any, index: number) => (
                              <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                  {renderField(`pricing.${index}.qty`, `Quantity Label *`)}
                                </div>
                                <div className="flex-1">
                                  {renderField(`pricing.${index}.price`, `Price ($) *`, "number")}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="mt-6 text-red-400 hover:text-red-300 text-sm font-body px-2"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          <button
                            type="button"
                            onClick={() => push({ qty: "", price: "" })}
                            className="bg-black/20 border border-sand/10 text-sand/80 px-4 py-2 rounded-lg text-sm font-body hover:bg-sand/10 transition-colors"
                          >
                            + Add Pricing Tier
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="pt-4 border-t border-sand/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading || isPdfUploading || !values.image || !values.pdfKey}
                      className="bg-signal text-black px-8 py-3 rounded-lg font-body font-medium hover:bg-signal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {editingPlan ? "Save Plan Settings" : "Create Plan"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        )}

        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          {isLoading && !plans.length ? (
            <div className="p-8 text-center text-sand/50 font-body text-sm">Loading plans...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-sand/10 bg-black/20">
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">
                    Slots
                  </th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">
                    Starting Price
                  </th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-sand/10">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan: any) => (
                    <tr
                      key={plan._id || plan.id}
                      className="hover:bg-sand/[0.02] transition-colors"
                    >
                      <td className="p-4 text-signal font-medium whitespace-nowrap">
                        {plan.model}
                      </td>
                      <td className="p-4 text-sand">
                        <div className="flex items-center gap-3">
                          {plan.image && (
                            <img src={plan.image} alt={plan.model} className="h-10 w-10 object-contain bg-black/20 rounded border border-sand/10" />
                          )}
                          <div>
                            <div className="font-medium">{plan.productName}</div>
                            <div className="text-sand/50 text-xs mt-1">
                              {plan.category} {plan.pdfKey ? "• PDF Attached" : "• No PDF"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sand/80">{plan.slots}</td>
                      <td className="p-4 text-sand/80">
                        {plan.pricing?.length > 0
                          ? `$${plan.pricing[0].price}`
                          : "N/A"}
                      </td>
                      <td className="p-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="text-sand/60 hover:text-signal transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id || plan.id)}
                          className="text-sand/60 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sand/50">
                      No plans found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}