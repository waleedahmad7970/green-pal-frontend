// "use client";

// import Link from "next/link";
// import { notFound, useParams } from "next/navigation";

// // 1. Import your JSON catalog directly
// import { productData } from "../../../../data/products/products";

// // 2. Find the specific hardware model by its slug
// const getProduct = (slug: string) => {
//   const products = productData.products || [];
//   return products.find(
//     (p: any) => p.model.toLowerCase() === slug.toLowerCase(),
//   );
// };

// export default function ProductDetailPage() {
//   const params = useParams();
//   const slug = params?.slug as string;

//   const product = getProduct(slug);

//   if (!product) {
//     notFound();
//   }

//   return (
//     <main className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32">
//       <div className="container-edit max-w-6xl mx-auto">
//         {/* Breadcrumb Navigation */}
//         <Link
//           href="/products"
//           className="inline-flex items-center gap-2 text-sm font-body font-bold text-muted hover:text-signal transition-colors duration-300 mb-12 group"
//         >
//           <svg
//             className="w-4 h-4 transition-transform group-hover:-translate-x-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           Back to Hardware Catalog
//         </Link>

//         {/*
//           Four grid children instead of two nested columns, so mobile
//           (single column) can show them in a different order than desktop
//           without touching the desktop layout:

//             Mobile order:  Image -> Pricing/CTA -> Key metrics -> Specs
//             Desktop grid:  Image (row 1, left) + Key metrics (row 2, left)
//                            + Specs (row 3, left)
//                            Pricing (rows 1-3, right, sticky)
//         */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
//           {/* Product Image — shown first on mobile, right after the title */}
//           <div className="order-1 lg:order-none lg:col-span-7 xl:col-span-8 lg:row-start-1">
//             <div className="relative w-full bg-card border line-rule rounded-3xl p-8 flex items-center justify-center overflow-hidden aspect-video">
//               <img
//                 src={product?.image}
//                 alt={product.productName}
//                 className="w-full h-full object-contain"
//                 onError={(e) => {
//                   e.currentTarget.src =
//                     "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
//                 }}
//               />
//             </div>
//           </div>

//           {/* Pricing / CTA card — shown second on mobile (right after the image); sticky on desktop, spanning all three rows */}
//           <div className="order-2 lg:order-none lg:col-span-5 xl:col-span-4 lg:row-start-1 lg:row-span-3 w-full md:sticky top-32">
//             <div className="border line-rule bg-card rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5">
//               {/* Product Header Title & Description inside the right box */}
//               <div className="mb-8 pb-6 border-b line-rule">
//                 <p className="font-body text-xs font-bold uppercase tracking-widest text-signal mb-2">
//                   {product.category}
//                 </p>
//                 <h1 className="font-display font-extrabold text-2xl md:text-3xl mb-3 tracking-tight text-[rgb(var(--fg))]">
//                   Model {product.model}
//                 </h1>
//                 <p className="font-body text-xs md:text-sm text-muted leading-relaxed">
//                   {product.productName}. {product.functionalCharacteristics}
//                 </p>
//               </div>

//               {/* Dynamic Pricing Tiers from JSON */}
//               {/* {product.pricing && product.pricing.length > 0 && (
//                 <div className="mb-8 space-y-3">
//                   <p className="font-body text-xs font-bold uppercase tracking-wider text-muted border-b line-rule pb-2">
//                     Volume Tiers
//                   </p>
//                   {product.pricing.map((tier: any, i: number) => (
//                     <div
//                       key={i}
//                       className="flex justify-between items-center font-body text-sm"
//                     >
//                       <span className="text-muted">{tier.qty}</span>
//                       <span className="font-bold">
//                         ${tier.price.toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )} */}

//               <Link
//                 href="/contact"
//                 className="w-full inline-flex items-center justify-center px-8 py-5 rounded-full bg-signal font-display font-bold text-lg hover:scale-[1.02] transition-transform duration-300 mb-6 shadow-md text-ink cursor-pointer"
//               >
//                 Inquire for Order
//               </Link>

//               <div className="pt-6 border-t line-rule space-y-4">
//                 <div className="flex items-center gap-3 text-xs font-body text-muted">
//                   <svg
//                     className="w-4 h-4 text-signal shrink-0"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Custom ambient light logo available
//                 </div>
//                 <div className="flex items-center gap-3 text-xs font-body text-muted">
//                   <svg
//                     className="w-4 h-4 text-signal shrink-0"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Ships in 50-piece master cartons
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Key Metrics Bar — shown third on mobile, below pricing, above specs */}
//           <div className="order-3 lg:order-none lg:col-span-7 xl:col-span-8 lg:row-start-2">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="border line-rule rounded-2xl bg-card p-6">
//                 <p className="font-body text-xs font-bold uppercase tracking-wider text-muted mb-1">
//                   Capacity
//                 </p>
//                 <p className="font-display font-bold text-lg md:text-xl">
//                   {product.capacity || "N/A"}
//                 </p>
//               </div>
//               <div className="border line-rule rounded-2xl bg-card p-6">
//                 <p className="font-body text-xs font-bold uppercase tracking-wider text-muted mb-1">
//                   Battery
//                 </p>
//                 <p className="font-display font-bold text-lg md:text-xl">
//                   {product.batteryMaterial} ({product.batteryCycleTimes})
//                 </p>
//               </div>
//               <div className="border line-rule rounded-2xl bg-card p-6">
//                 <p className="font-body text-xs font-bold uppercase tracking-wider text-muted mb-1">
//                   Certification
//                 </p>
//                 <p className="font-display font-bold text-base md:text-lg truncate">
//                   {product.certification || "Standard"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Technical specifications — shown last on mobile */}
//           <div className="order-4 lg:order-none lg:col-span-7 xl:col-span-8 lg:row-start-3 space-y-12">
//             <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">
//               Technical Specifications
//             </h2>

//             {/* Hardware Specs Breakdown */}
//             <div className="border-t line-rule pt-8">
//               <h3 className="font-display font-bold text-xl md:text-2xl mb-4">
//                 Charging & Interfaces
//               </h3>
//               <ul className="space-y-3 font-body text-muted">
//                 <li>
//                   <strong>Input Interface:</strong> {product.inputInterface}
//                 </li>
//                 <li>
//                   <strong>Output Interface:</strong> {product.outputInterface}
//                 </li>
//                 <li>
//                   <strong>Input/Output Power:</strong> {product.inputOutput}
//                 </li>
//                 <li>
//                   <strong>Converter Efficiency:</strong>{" "}
//                   {product.converterEfficiency}
//                 </li>
//                 <li>
//                   <strong>Charge Time:</strong> {product.chargeTime}
//                 </li>
//               </ul>
//             </div>

//             <div className="border-t line-rule pt-8">
//               <h3 className="font-display font-bold text-xl md:text-2xl mb-4">
//                 Build & Safety
//               </h3>
//               <ul className="space-y-3 font-body text-muted">
//                 <li>
//                   <strong>Shell Material:</strong> {product.shellMaterial}
//                 </li>
//                 <li>
//                   <strong>Safety Testing:</strong> {product.safetyPerformance}
//                 </li>
//                 <li>
//                   <strong>Protections:</strong>{" "}
//                   {product.protection
//                     ? product.protection.join(", ")
//                     : "Standard BMS"}
//                 </li>
//               </ul>
//             </div>

//             <div className="border-t line-rule pt-8">
//               <h3 className="font-display font-bold text-xl md:text-2xl mb-4">
//                 Logistics & Dimensions
//               </h3>
//               <ul className="space-y-3 font-body text-muted">
//                 <li>
//                   <strong>Unit Size:</strong> {product.size}
//                 </li>
//                 <li>
//                   <strong>Unit Weight:</strong> {product.weight}
//                 </li>
//                 <li>
//                   <strong>Master Carton:</strong> {product.packageSize}
//                 </li>
//                 <li>
//                   <strong>Gross Weight:</strong> {product.grossWeight}
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

// 1. Import your JSON catalog directly
import { productData } from "../../../../data/products/products";

// 2. Find the specific hardware model by its slug
const getProduct = (slug: string) => {
  const products = productData.products || [];
  return products.find(
    (p: any) => p.model.toLowerCase() === slug.toLowerCase(),
  );
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  // Starting price from the lowest volume tier, if pricing data exists.
  // Falls back to a placeholder so the layout always has a price to show —
  // swap "900" for real data (or hide this block) once every product has
  // pricing.
  const startingPrice =
    product.pricing && product.pricing.length > 0
      ? product.pricing[product.pricing.length - 1].price.toFixed(2)
      : "900.00";

  // Spec rows for the "Features" panel. Where your product JSON already has
  // the field, it's used directly; where it doesn't (screen size/resolution/
  // network, slots), a dummy placeholder is shown instead — replace these
  // with real fields on productData once you have them.
  const features: { label: string; value: string | number }[] = [
    { label: "Slots", value: product.slots || "8" },

    // Using (product as any) for fields that aren't in your backend schema yet
    { label: "Capacity", value: (product as any).capacity || "N/A" },
    {
      label: "Battery",
      value: (product as any).batteryMaterial
        ? `${(product as any).batteryMaterial} (${(product as any).batteryCycleTimes})`
        : "N/A",
    },

    // Splitting the single database field into two UI rows safely
    {
      label: "Screen size",
      value: product.adsSizeAndResolution?.split(',')[0] || "10.1 inch"
    },
    {
      label: "Screen resolution",
      value: product.adsSizeAndResolution?.split(',')[1]?.trim() || "800 x 1080",
    },

    // Mapped to your actual backend schema fields
    { label: "Screen network", value: product.networkSupport || "WiFi" },
    { label: "Net Weight", value: product.weight || "~5.6 kg" },
    { label: "Dimension", value: product.packageSize || "24.5cm x 20cm x 42cm" },
    { label: "Material", value: product.material || "Fireproof ABS" },
    { label: "Input", value: product.powerInput || "100-240V 50-60Hz 4A Max" },
    { label: "Certification", value: product.certification || "Standard" },
  ];
  return (
    <main className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32">
      <div className="container-edit max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-body font-bold text-muted hover:text-signal transition-colors duration-300 mb-12 group"
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

        {/* Header: Title, price, description — full width, on top */}
        <div className="max-w-3xl mb-16">
          <p className="font-body text-sm font-bold uppercase tracking-widest text-signal mb-4">
            {product.category}
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl mb-6 tracking-tight text-[rgb(var(--fg))]">
            Model {product.model}
          </h1>
          <p className="font-display font-extrabold text-3xl md:text-4xl text-signal mb-6">
            ${startingPrice}
          </p>
          <p className="font-body text-lg text-muted leading-relaxed">
            {product.productName}. {product.functionalCharacteristics}
          </p>
        </div>

        {/* Body: Image (left) + Features spec list (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Product Image */}
          <div className="relative w-full bg-card border line-rule rounded-3xl p-8 flex items-center justify-center overflow-hidden aspect-square lg:aspect-auto lg:h-[560px]">
            <img
              src={product?.image}
              alt={product.productName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Features panel */}
          <div className="border line-rule bg-card rounded-3xl p-8 md:p-10">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-2 text-[rgb(var(--fg))]">
              Features
            </h2>

            <div className="divide-y divide-[rgb(var(--line))]">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between py-4 gap-6"
                >
                  <span className="font-body text-muted">{f.label}</span>
                  <span className="font-body font-bold text-signal text-right">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-8 py-5 rounded-full bg-signal font-display font-bold text-lg hover:scale-[1.02] transition-transform duration-300 mt-8 shadow-md text-ink cursor-pointer"
            >
              Inquire for Order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
