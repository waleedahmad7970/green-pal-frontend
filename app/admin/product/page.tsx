"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/admin/ui";
import { useProductStore } from "@/lib/admin/slices/useProductStore";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/admin/services/upload";

const emptyProduct = {
  model: "",
  productName: "",
  category: "Power Bank",
  image: "",
  colors: "",
  capacity: "",
  inputOutput: "",
  shellMaterial: "",
  outputInterface: "",
  inputInterface: "",
  protection: "",
  converterEfficiency: "",
  chargeTime: "",
  batteryCycleTimes: "",
  batteryMaterial: "",
  maxChargeDischargeCurrent: "",
  certification: "",
  safetyPerformance: "",
  functionalCharacteristics: "",
  size: "",
  weight: "",
  packageSize: "",
  grossWeight: "",
  price: "",
};

const ProductSchema = Yup.object().shape({
  model: Yup.string().required("Model is required"),
  productName: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.string().required("You must upload an image to S3 first"),
  colors: Yup.string().required("Colors are required"),
  capacity: Yup.string().required("Capacity is required"),
  price: Yup.number().typeError("Must be a number").required("Required"),
  // pricing: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       qty: Yup.string().required("Required"),
  //       price: Yup.number().typeError("Must be a number").required("Required"),
  //     })
  //   )
  //   .min(1, "At least one pricing tier is required")
  //   .required("Pricing is required"),
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

export default function AdminProductsPage() {
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = Array.isArray(products)
    ? products.filter(
      (p: any) =>
        p.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct({
      ...product,
      colors: product.colors?.join(", ") || "",
      protection: product.protection?.join(", ") || "",
    });
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
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
    const formattedValues = {
      ...values,
      colors: typeof values.colors === "string"
        ? values.colors.split(",").map((s: string) => s.trim()).filter(Boolean)
        : values.colors,
      protection: typeof values.protection === "string"
        ? values.protection.split(",").map((s: string) => s.trim()).filter(Boolean)
        : values.protection,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, formattedValues);
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
        description="Manage hardware specifications, power bank details, and tiered volume pricing."
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
            + Add Product
          </button>
        </div>

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
              {({ values, isSubmitting, errors, setFieldValue }) => (
                <Form className="space-y-8">
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Basic Info
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("model", "Model *", "text", "e.g. PS886")}
                      {renderField("productName", "Product Name *", "text", "Shared Power Bank")}
                      {renderField("category", "Category *", "text", "Power Bank")}

                      <div className="space-y-2">
                        <label className="text-[10px] text-sand/60 font-body uppercase tracking-wider">
                          Product Image *
                        </label>

                        {values.image ? (
                          <div className="flex items-center gap-3 bg-black/20 border border-sand/10 rounded-lg p-2">
                            <img
                              src={values.image}
                              alt="Product preview"
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
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Technical Specs
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("colors", "Colors (Comma separated) *", "text", "Yellow, Black, Gray")}
                      {renderField("capacity", "Capacity *", "text", "6000mAh")}
                      {renderField("inputOutput", "Input/Output", "text", "5V/2A (Max)")}
                      {renderField("shellMaterial", "Shell Material", "text", "V0 Fireproof")}
                      {renderField("outputInterface", "Output Interface", "text", "Lightning/Micro/Type-C")}
                      {renderField("inputInterface", "Input Interface", "text", "Type-C / Contact PIN")}
                      {renderField("converterEfficiency", "Converter Efficiency", "text", "≥80%")}
                      {renderField("chargeTime", "Charge Time", "text", "3.5 Hours")}
                      {renderField("batteryCycleTimes", "Battery Cycle Times", "text", "300 Times")}
                      {renderField("batteryMaterial", "Battery Material", "text", "Polymer")}
                      {renderField("maxChargeDischargeCurrent", "Max Current", "text", "0.5C")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Protection & Compliance
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {renderField("protection", "Protections (Comma separated)", "text", "Overcharge, Short-circuit")}
                      {renderField("certification", "Certification", "text", "CE/FCC/RoHS/MSDS")}
                      {renderField("safetyPerformance", "Safety Performance", "text", "Crash test/Free fall")}
                    </div>
                    <div className="mt-4">
                      {renderField("functionalCharacteristics", "Functional Characteristics", "text", "BMS, Ambient light logo customization")}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Dimensions & Packaging
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("size", "Size", "text", "14.1*6.8*1.7cm")}
                      {renderField("weight", "Weight", "text", "0.18kg (1pcs)")}
                      {renderField("packageSize", "Package Size", "text", "34*16.5*21cm (50pcs)")}
                      {renderField("grossWeight", "Gross Weight", "text", "9.68kg (50pcs)")}
                    </div>
                  </div>

                  {/* <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Volume Pricing Tiers *
                    </h4>
                    {typeof errors.price === "string" && (
                      <div className="text-red-400 text-xs mb-2">{errors.price}</div>
                    )}
                    <FieldArray name="price">
                      {({ remove, push }) => (
                        <div className="space-y-3 max-w-2xl">
                          {values.price.length > 0 &&
                            values.price.map((tier: any, index: number) => (
                              <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                  {renderField(`price.${index}.qty`, `Quantity Range *`, "text", "1-999 PCS")}
                                </div>
                                <div className="flex-1">
                                  {renderField(`price.${index}.price`, `Price ($) *`, "number", "9.6")}
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
                            + Add price Tier
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div> */}
                  <div>
                    <h4 className="text-sand font-display font-medium mb-3 border-l-2 border-signal pl-2">
                      Product Price
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {renderField("price", "Total Price *", "number")}

                    </div>
                  </div>

                  <div className="pt-4 border-t border-sand/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading || !values.image}
                      className="bg-signal text-black px-8 py-3 rounded-lg font-body font-medium hover:bg-signal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {editingProduct ? "Save Product Settings" : "Create Product"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        )}

        <section className="bg-sand/[0.04] border border-sand/10 rounded-xl overflow-x-auto">
          {isLoading && !products.length ? (
            <div className="p-8 text-center text-sand/50 font-body text-sm">Loading products...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-sand/10 bg-black/20">
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Model</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Capacity</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider">Base Price</th>
                  <th className="p-4 text-xs font-body text-sand/50 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-sand/10">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-sand/[0.02] transition-colors">
                      <td className="p-4 text-signal font-medium whitespace-nowrap">{product.model}</td>
                      <td className="p-4 text-sand">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img src={product.image} alt={product.model} className="h-10 w-10 object-contain bg-black/20 rounded border border-sand/10" />
                          )}
                          <div>
                            <div className="font-medium">{product.productName}</div>
                            <div className="text-sand/50 text-xs mt-1">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sand/80">{product.capacity}</td>
                      <td className="p-4 text-sand/80">
                        {/* {product.pricing?.length > 0 ? `$${product.pricing[0].price}` : "N/A"} */}
                        {product?.price || "N/A"}
                      </td>
                      <td className="p-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="text-sand/60 hover:text-signal transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id as string)} className="text-sand/60 hover:text-red-400 transition-colors"
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