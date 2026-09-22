"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productData } from "../../../data/products/products";

export default function ProductsPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // 1. Extract products array from the exported object
  const allProducts = productData.products || [];

  // State for Search, Filter, and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  // Dynamically get unique categories for the filter buttons
  const categories = useMemo(() => {
    const cats = allProducts?.map((p) => p.category);
    return ["All", ...Array.from(new Set(cats))];
  }, [allProducts]);

  // Filter the products based on search and category
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, allProducts]);

  // Slice the filtered array to only show the loaded amount
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Reset pagination when user searches or filters
  useEffect(() => {
    setVisibleCount(8);
  }, [searchTerm, activeCategory]);

  // GSAP Animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (visibleProducts.length > 0) {
        gsap.fromTo(
          gsap.utils.toArray(".hardware-card"),
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
            },
          },
        );
      }
    }, gridRef);

    return () => {
      ctx.revert();
    };
  }, [visibleProducts]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <main
      ref={sectionRef}
      className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32"
    >
      <div className="container-edit max-w-7xl mx-auto">
        <header className="mb-16 max-w-3xl">
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] mb-4 transition-colors duration-300">
            Greenpal Hardware
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight transition-colors duration-300">
            Commercial Charging Solutions.
          </h1>
          <p className="font-body text-lg md:text-xl text-muted leading-relaxed transition-colors duration-300">
            Explore our industrial-grade shared power banks and peripherals.
          </p>
        </header>

        {/* --- Search & Filter Slider Section --- */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by model or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-full bg-card border line-rule font-body focus:outline-none focus:border-[#02d683] transition-colors"
            />
          </div>

          {/* Category Filter Slider (Horizontally scrollable on mobile, wrapping on desktop) */}
          <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-6 py-2.5 rounded-full font-body text-sm font-bold transition-colors ${
                  activeCategory === cat
                    ? "bg-[#02d683] text-ink border-[#02d683]"
                    : "bg-card border line-rule text-muted hover:border-[#02d683]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Products Grid --- */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16"
        >
          {visibleProducts.length > 0 ? (
            visibleProducts.map((item) => (
              <Link
                href={`/products/${item.model.toLowerCase()}`}
                key={item.model}
                className="hardware-card invisible flex flex-col border line-rule bg-card rounded-3xl overflow-hidden transition-all duration-300 group hover:border-[#02d683] hover:-translate-y-1 hover:shadow-xl shadow-black/5"
              >
                <div className="relative aspect-square w-full bg-surface border-b line-rule p-8 flex items-center justify-center overflow-hidden">
                  <img
                    src={`${item.image}`}
                    alt={item.productName}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div className="flex flex-col flex-grow p-6 md:p-8">
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-2xl group-hover:text-[#02d683] transition-colors mb-1">
                      {item.model}
                    </h3>
                    <p className="font-body text-sm text-muted">
                      {item.productName}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-8 mt-auto">
                    <li className="flex items-center gap-2 text-xs font-body text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#02d683] shrink-0" />
                      <span className="truncate">
                        {item.capacity
                          ? `${item.capacity} Capacity`
                          : "Station Unit"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs font-body text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#02d683] shrink-0" />
                      <span className="truncate">
                        {item.outputInterface
                          ? `Outputs: ${item.outputInterface}`
                          : "Multi-Slot Cabinet"}
                      </span>
                    </li>
                  </ul>

                  <div className="flex items-center justify-between pt-5 border-t line-rule">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-5 h-8 rounded-full bg-surface border line-rule text-xs font-mono uppercase tracking-widest font-bold group-hover:bg-[#02d683] group-hover:border-[#02d683] group-hover:text-ink transition-colors"
                    >
                      Inquire for order
                    </Link>
                    <span className="w-8 h-8 rounded-full bg-surface border line-rule flex items-center justify-center group-hover:bg-[#02d683] group-hover:border-[#02d683] group-hover:text-ink transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="font-display text-2xl mb-2">No products found</h3>
              <p className="font-body text-muted">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* --- Load More Button --- */}
        {hasMore && (
          <div className="flex justify-center mb-16">
            <button
              onClick={handleLoadMore}
              className="px-8 py-4 rounded-full bg-card border line-rule font-body font-bold hover:border-[#02d683] hover:text-[#02d683] transition-colors"
            >
              Load More Products
            </button>
          </div>
        )}

        <div className="mt-20 border line-rule rounded-3xl p-8 md:p-12 bg-card text-center max-w-4xl mx-auto">
          <h4 className="font-display font-bold text-xl mb-3">
            Wholesale Procurement & Logistics
          </h4>
          <p className="font-body text-sm text-muted leading-relaxed max-w-2xl mx-auto">
            Hardware pricing is determined by volume tiers. Minimum order
            quantities apply for custom ambient light logo manufacturing. All
            units ship fully certified (CE/FCC/RoHS) in standard 50-piece master
            cartons.
          </p>
        </div>
      </div>
    </main>
  );
}
