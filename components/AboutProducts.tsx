"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchProducts, Product } from "@/lib/site/services/productService";
import GPMark from "./GPMark";

// Varied layout patterns across 12-column grid for random-sized mosaic
const cellSpans = [
  "col-span-12 lg:col-span-8 h-[360px] sm:h-[460px] lg:h-[500px] border-b lg:border-b-0 lg:border-r",
  "col-span-12 sm:col-span-6 lg:col-span-4 h-[240px] sm:h-[300px] lg:h-[500px] border-b lg:border-b-0",
  "col-span-12 sm:col-span-6 lg:col-span-4 h-[260px] sm:h-[320px] border-b sm:border-b-0 sm:border-r",
  "col-span-12 sm:col-span-6 lg:col-span-4 h-[260px] sm:h-[320px] border-b sm:border-b-0 sm:border-r",
  "col-span-12 sm:col-span-6 lg:col-span-4 h-[260px] sm:h-[320px]",
  "col-span-12 sm:col-span-7 lg:col-span-7 h-[280px] sm:h-[340px] border-t sm:border-r",
  "col-span-12 sm:col-span-5 lg:col-span-5 h-[280px] sm:h-[340px] border-t",
];

export default function AboutProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exact API fetch hook from products page
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setAllProducts(data);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products from server. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Filter products that have image property from API
  const productsWithImages = allProducts.filter(
    (item) => typeof item.image === "string" && item.image.trim().length > 0
  );

  // Elite GSAP ScrollTrigger Entrance
  useEffect(() => {
    if (isLoading || productsWithImages.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>(".api-grid-cell"),
        {
          autoAlpha: 0,
          y: 40,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, [isLoading, productsWithImages]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-surface border-b line-rule overflow-hidden transition-colors duration-300"
    >
      <div className="container-edit">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border line-rule mb-5 transition-colors duration-300">
            <GPMark className="w-4 h-3 text-signal shrink-0" />
            <span className="font-body text-xs font-bold uppercase tracking-wider text-signal-dim dark:text-signal">
              Greenpal Pulse Range
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6 transition-colors duration-300">
            A Better Guest Experience
          </h2>
          <p className="font-body text-lg md:text-xl text-muted leading-relaxed transition-colors duration-300">
            From compact countertop stations to larger floor models, the Greenpal Pulse range fits different spaces and visitor needs. We help venues offer convenient charging, with station screens that can showcase their own promotions. Partnership options can also include rental revenue sharing.
          </p>
        </div>

        {/* Dynamic API Mosaic: Adapts automatically to Light and Dark mode using bg-card & line-rule */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border line-rule bg-card mb-16">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 sm:h-80 bg-surface-dim animate-pulse border line-rule"
              />
            ))}
          </div>
        ) : error && productsWithImages.length === 0 ? (
          <div className="border line-rule p-12 text-center text-muted mb-16 font-body">
            {error}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-12 gap-0 border line-rule bg-card mb-16 overflow-hidden rounded-none shadow-xl transition-colors duration-300"
          >
            {productsWithImages.map((item, idx) => {
              const spanClass = cellSpans[idx % cellSpans.length];
              return (
                <div
                  key={item._id || item.id || item.model || idx}
                  className={`api-grid-cell invisible ${spanClass} border line-rule bg-card p-6 sm:p-10 flex items-center justify-center relative overflow-hidden group hover:bg-surface-dim transition-colors duration-300`}
                >
                  <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-muted uppercase select-none z-10 transition-colors duration-300">
                    {String(idx + 1).padStart(2, "0")} // {item.model}
                  </span>

                  <img
                    src={item.image}
                    alt={item.productName || item.model}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Clear Venue Call-to-Action */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-body font-bold text-base hover:bg-signal-dim transition-all shadow-lg shadow-signal/15"
          >
            Host a Greenpal Station
          </Link>
        </div>
      </div>
    </section>
  );
}
