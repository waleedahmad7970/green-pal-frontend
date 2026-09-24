"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/admin/ui";
import { useProductStore } from "@/lib/admin/slices/useProductStore";

// Empty form state matching the schema
const emptyProduct = {
  model: "",
  productName: "",
  category: "",
  image: "",
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

// --- UPDATED YUP SCHEMA: ALL FIELDS REQUIRED ---
const ProductSchema = Yup.object().shape({
  model: Yup.string().required("Model is required"),
  productName: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.string().required("Image URL is required"),
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

// Helper to render standard fields cleanly
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

export default function AdminProductsPage() {
  // Pull state and actions directly from Zustand
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();

  // Local UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(
    (p: any) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    // Convert arrays back to comma-separated strings for the UI inputs
    setEditingProduct({
      ...product,
      stationColor: product.stationColor?.join(", ") || "",
      paymentMethods: product.paymentMethods?.join(", ") || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    // Convert comma-separated UI strings back to arrays for the database
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
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formattedValues);
      } else {
        await createProduct(formattedValues);
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage full product specifications and tiered pricing."
      />

      <div className="grid gap-6 max-w-[1400px]">
        {/* Top Actions */}
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
            + Add Product
          </button>
        </div>

        {/* Form Overlay/Section */}
        {isFormOpen && (
          <section className="bg-sand/[0.04] border border-sand/10 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-sand/10 pb-4">
              <h3 className="font-display text-xl font-semibold text-sand">
                {editingProduct ? "Edit Product Specifications" : "New Product"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-sand/50 hover:text-sand text-sm font-body"
              >
                Close
              </button>
            </div>

            <Formik
              initialValues={editingProduct || emptyProduct}
              validationSchema={ProductSchema}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting, errors }) => (
                <Form className="space-y-8">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Basic Info
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("model", "Model *")}
                      {renderField("productName", "Product Name *")}
                      {renderField("category", "Category *")}
                      {renderField("image", "Image URL *")}
                    </div>
                  </div>

                  {/* Technical Specs */}
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

                  {/* Physical & Environmental */}
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

                  {/* Features & Options */}
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

                  {/* Tiered Pricing */}
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

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-sand/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-signal text-black px-8 py-3 rounded-lg font-body font-medium hover:bg-signal/80 transition-colors disabled:opacity-50"
                    >
                      {editingProduct ? "Save Product Settings" : "Create Product"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        )}

        {/* Product Table */}
        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          {isLoading && !products.length ? (
            <div className="p-8 text-center text-sand/50 font-body text-sm">Loading products...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-sand/10 bg-black/20">
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">
                    Product
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
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-sand/[0.02] transition-colors"
                    >
                      <td className="p-4 text-signal font-medium whitespace-nowrap">
                        {product.model}
                      </td>
                      <td className="p-4 text-sand">
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-sand/50 text-xs mt-1">
                          {product.category}
                        </div>
                      </td>
                      <td className="p-4 text-sand/80">{product.slots}</td>
                      <td className="p-4 text-sand/80">
                        {product.pricing?.length > 0
                          ? `$${product.pricing[0].price}`
                          : "N/A"}
                      </td>
                      <td className="p-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="text-sand/60 hover:text-signal transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                      No products found matching "{searchQuery}"
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