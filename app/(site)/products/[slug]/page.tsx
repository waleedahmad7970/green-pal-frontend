"use client";

import { Product } from "@/lib/admin/types";
import { fetchProducts } from "@/lib/site/services/productService";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real products from backend and find the matching model
  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const products = await fetchProducts();
        const found = products.find(
          (p: any) => p.model.toLowerCase() === slug.toLowerCase()
        );
        if (found) {
          setProduct(found);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface pt-36 pb-32 flex items-center justify-center">
        <div className="animate-pulse font-body text-muted text-lg">
          Loading product details...
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  // Comprehensive feature spec rows combining backend data and UI fields.
  // Field mappings corrected to match the actual extended Product schema —
  // charging-station specs live on networkSupport/material/powerInput, not
  // the power-bank fields (inputOutput/shellMaterial/inputInterface) that
  // were being reused here before.
  const features: { label: string; value: string | number }[] = [
    { label: "Slots", value: (product as any).slots || "8" },
    { label: "Capacity", value: (product as any).capacity || "N/A" },
    {
      label: "Battery",
      value: (product as any).batteryMaterial
        ? `${(product as any).batteryMaterial} (${(product as any).batteryCycleTimes})`
        : "N/A",
    },
    {
      label: "Screen size",
      value: (product as any).adsSizeAndResolution?.split(",")[0] || "10.1 inch",
    },
    {
      label: "Screen resolution",
      value: (product as any).adsSizeAndResolution?.split(",")[1]?.trim() || "800 x 1080",
    },
    { label: "Screen network", value: (product as any).networkSupport || "WiFi" },
    { label: "Net Weight", value: product.weight || "~5.6 kg" },
    { label: "Dimension", value: product.packageSize || "24.5cm x 20cm x 42cm" },
    { label: "Material", value: (product as any).material || (product as any).shellMaterial || "Fireproof ABS" },
    { label: "Input", value: (product as any).powerInput || (product as any).inputInterface || "100-240V 50-60Hz 4A Max" },
    { label: "Certification", value: product.certification || "Standard" },
  ];

  return (
    <main className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32">
      <div className="container-edit max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb Navigation — tap-highlight removed so mobile doesn't flash gray on tap */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-body font-bold text-muted hover:text-[#02d683] transition-colors duration-300 mb-12 group touch-manipulation [-webkit-tap-highlight-color:transparent]"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Hardware Catalog
        </Link>

        {/* E-commerce 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Single Product Image */}
          <div className="lg:col-span-6 relative w-full bg-card border line-rule rounded-3xl p-8 flex items-center justify-center overflow-hidden aspect-square lg:sticky lg:top-32 shadow-sm">
            <img
              src={product.image}
              alt={product.productName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Right Column: Title, Description, Specifications Panel & Inquiry Button */}
          <div className="lg:col-span-6 flex flex-col space-y-8">

            {/* Title & Description Header */}
            <div>
              <p className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] mb-3">
                {product.category}
              </p>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-4 tracking-tight text-[rgb(var(--fg))]">
                Model {product.model}
              </h1>
              <p className="font-body text-lg text-muted leading-relaxed">
                {product.productName}. {product.functionalCharacteristics}
              </p>
            </div>

            {/* Features & Specifications Panel */}
            <div className="rounded-3xl shadow-sm">
              <h2 className="font-display font-bold text-2xl mb-6 text-[rgb(var(--fg))]">
                Technical Specifications
              </h2>

              <div className="divide-y divide-[rgb(var(--line))]">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between py-4 gap-6"
                  >
                    <span className="font-body text-muted text-sm">{f.label}</span>
                    <span className="font-body font-bold text-[#02d683] text-right text-sm">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Inquiry Button — tap-highlight removed */}
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center px-8 py-5 rounded-full bg-[#02d683] font-display font-bold text-lg hover:scale-[1.02] transition-transform duration-300 mt-8 shadow-md text-ink cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent]"
              >
                Inquire for order
              </Link>
            </div>

            {/* Delivery Information Summary Box */}
            <div className="border line-rule bg-card rounded-3xl p-6 space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-base text-[rgb(var(--fg))]">Wholesale Shipping & Logistics</h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Hardware pricing is determined by volume tiers. Minimum order quantities apply for custom ambient light logo manufacturing. All units ship fully certified (CE/FCC/RoHS) in standard 50-piece master cartons.
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}