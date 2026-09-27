"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/site/services/productService";
import type { Product } from "@/lib/admin/types";

// How many cards are visible at once, based on viewport width.
const getItemsPerView = () => {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1280) return 5; // xl+
  if (window.innerWidth >= 1024) return 3; // lg
  if (window.innerWidth >= 768) return 2; // md
  return 1; // mobile
};

export default function ChargingStationsSpotlight() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Refs for handling drag/swipe logic
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products for spotlight:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Recompute how many cards fit on resize (mobile <-> tablet <-> desktop)
  useEffect(() => {
    const update = () => setItemsPerView(getItemsPerView());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Highest valid starting index — stops the track from sliding past the
  // point where the last card is fully visible (no half-empty trailing gap).
  const maxIndex = Math.max(products.length - itemsPerView, 0);

  // If itemsPerView changes (window resized) or product count changes,
  // make sure activeIndex is still in range.
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= maxIndex;

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  // --- DRAG HANDLERS ---
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 10) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }

    dragStartX.current = null;

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  if (isLoading) {
    return (
      <section className="relative py-10 md:py-10 bg-surface min-h-screen flex items-center justify-center">
        <p className="text-muted font-body animate-pulse">Loading hardware lineup...</p>
      </section>
    );
  }

  if (!products.length) return null;

  const itemWidthPercent = 100 / itemsPerView;

  return (
    <section className="relative py-10 md:py-10 bg-surface overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-16 relative z-50 pointer-events-none">
        <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight text-ink pointer-events-auto">
          Our Hardware Lineup.
        </h2>
        <p className="text-muted font-body text-lg max-w-xl mx-auto pointer-events-auto">
          A size for every space. Swipe or click to explore.
        </p>
      </div>

      {/*
        Responsive track: shows 1 card on mobile, 2 on tablet, 3 on desktop
        (instead of a fixed 320px single-card column that left huge empty
        space on wider screens). Each card's outer wrapper takes exactly
        (100 / itemsPerView)% of the track width, with padding for the gap
        between cards, so the percentage-based translateX math stays exact.
      */}
      <div
        className="relative w-full max-w-[320px] md:max-w-3xl lg:max-w-5xl xl:max-w-full mx-auto h-[480px] md:h-[580px] xl:h-[540px] overflow-hidden touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * itemWidthPercent}%)` }}
        >
          {products.map((product, i) => (
            <div
              key={`${product.model}-${i}`}
              className="h-full shrink-0 px-2 md:px-3"
              style={{ width: `${itemWidthPercent}%` }}
            >
              <div className="h-full flex flex-col !bg-white items-center justify-between rounded-2xl bg-surface p-6  border line-rule select-none">
                <div className="flex-1 w-full flex items-center justify-center relative pointer-events-none">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div className="mt-6 text-center w-full">
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-1">
                    {product.model}
                  </h3>

                  {(product as any).slots ? (
                    <p className="text-sm md:text-base text-muted font-body mb-4">
                      Holds {(product as any).slots} power banks
                    </p>
                  ) : null}

                  <p className="text-sm md:text-base text-muted font-body mb-4">
                    {product.productName}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product.model.toLowerCase()}`);
                    }}
                    className="px-6 py-2.5 rounded-full bg-signal text-ink font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Explore Specs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="mt-16 flex items-center gap-4 relative z-50">
        <button
          onClick={handlePrev}
          disabled={atStart}
          className="w-12 h-12 rounded-full border line-rule flex items-center justify-center text-muted hover:bg-signal hover:text-ink hover:border-signal transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous station"
        >
          <svg
            className="stroke-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          disabled={atEnd}
          className="w-12 h-12 rounded-full border line-rule flex items-center justify-center text-muted hover:bg-signal hover:text-ink hover:border-signal transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Next station"
        >
          <svg
            className="stroke-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}