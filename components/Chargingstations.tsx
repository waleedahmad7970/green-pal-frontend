"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { scrollToTarget } from "@/lib/lenisStore";
import { useRouter } from "next/navigation";
// Updated with your live Postimg URLs

const products = [
  {
    model: "ZBJ-SP04-SP",
    name: "Shared Charging Station",
    bays: 1,
    image: "https://i.postimg.cc/qBFYvkRj/image-removebg-preview-(1).png",
  },
  {
    model: "ZBJ-SP08-SP",
    name: "Shared Charging Station",
    bays: 4,
    image: "https://i.postimg.cc/L6rrNHKb/image-removebg-preview-(5).png",
  },
  {
    model: "ZBJ-SP04-SP",
    name: "Shared Charging Station",
    bays: 12,
    image: "https://i.postimg.cc/qBFYvkRj/image-removebg-preview-(1).png",
  },
  {
    model: "ZBJ-SP04-SP",
    name: "Shared Charging Station",
    bays: 12,
    image: "https://i.postimg.cc/NMfV5FmP/image-removebg-preview-(3).png",
  },
  {
    model: "ZBJ-166",
    name: "Shared Charging Station",
    bays: 18,
    image: "https://i.postimg.cc/zvycFQd7/image-removebg-preview-(2).png",
  },
];
export default function ChargingStationsSpotlight() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Refs for handling drag/swipe logic
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const total = products.length;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      let offset = i - activeIndex;
      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      let xPos = offset * 110;
      let scale = 1;
      let opacity = 1;
      let zIndex = 10;

      if (offset !== 0) {
        scale = 0.8 - Math.abs(offset) * 0.15;
        opacity = 1 - Math.abs(offset) * 0.4;
        zIndex = 10 - Math.abs(offset);

        if (Math.abs(offset) === 2) {
          xPos = offset > 0 ? 190 : -190;
        }
      }

      gsap.to(card, {
        xPercent: xPos,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
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

      <div
        ref={containerRef}
        className="relative w-full max-w-[320px] h-[480px] md:h-[550px] mx-auto perspective-1000 touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {products.map((product, i) => (
          <div
            key={`${product.name}-${i}`}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-between rounded-2xl bg-surface p-6 shadow-2xl cursor-pointer will-change-transform border line-rule select-none"
            onClick={() => {
              if (!isDragging.current) {
                setActiveIndex(i);
              }
            }}
          >
            <div className="flex-1 w-full flex items-center justify-center relative pointer-events-none">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-xl select-none"
                draggable={false}
              />
            </div>

            <div className="mt-6 text-center w-full">
              <h3 className="font-display text-2xl md:text-3xl font-bold  mb-1">
                {product?.model}
              </h3>
              <p className="text-sm md:text-base text-muted font-body mb-4">
                Holds {product?.bays} power banks
              </p>

              <p className="text-sm md:text-base text-muted font-body mb-4">
                {product?.name}
              </p>

              <div
                className={`transition-opacity duration-500 ${activeIndex === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products`);
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

      {/* Controller Buttons */}
      {/* Controller Buttons */}
      <div className="mt-16 flex items-center gap-4 relative z-50">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border line-rule flex items-center justify-center text-muted hover:bg-signal hover:text-ink hover:border-signal transition-all duration-300"
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
          className="w-12 h-12 rounded-full border line-rule flex items-center justify-center text-muted hover:bg-signal hover:text-ink hover:border-signal transition-all duration-300"
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
