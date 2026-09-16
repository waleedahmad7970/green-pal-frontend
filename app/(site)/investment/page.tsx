"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import CTA from "@/components/CTA";
import { lenisStore } from "@/lib/lenisStore";

const investmentPlans = [
  {
    id: "mini",
    name: "GP Mini",
    bays: 5,
    roi: "8-12%",
    price: "$1,200",
    bestFor: "Cafes & Small Boutiques",
    image: "https://i.postimg.cc/gcB9LVMs/image-removebg-preview-(6).png"
  },
  {
    id: "gp10",
    name: "GP 10",
    bays: 10,
    roi: "10-14%",
    price: "$2,100",
    bestFor: "Restaurants & Bars",
    image: "https://i.postimg.cc/L6rrNHKb/image-removebg-preview-(5).png"
  },
  {
    id: "gp15",
    name: "GP 15",
    bays: 15,
    roi: "12-16%",
    price: "$3,000",
    bestFor: "Hotels & Lobbies",
    image: "https://i.postimg.cc/qBFYvkRj/image-removebg-preview-(1).png"
  },
  {
    id: "gp25",
    name: "GP 25",
    bays: 25,
    roi: "15-20%",
    price: "$4,800",
    bestFor: "Malls & Transit Hubs",
    image: "https://i.postimg.cc/NMfV5FmP/image-removebg-preview-(3).png"
  },
  {
    id: "gp45",
    name: "GP 45",
    bays: 45,
    roi: "18-24%",
    price: "$8,500",
    bestFor: "Stadiums & Universities",
    image: "https://i.postimg.cc/zvycFQd7/image-removebg-preview-(2).png"
  },
];

export default function InvestmentPlansPage() {
  const containerRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = investmentPlans.length;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".invest-panel");
      const totalWidth = (panels.length - 1) * 100;

      const tween = gsap.to(panels, {
        xPercent: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + sliderRef.current?.offsetWidth,
          anticipatePin: 1,
          onUpdate: (self) => {
            setActiveIndex(Math.round(self.progress * (panels.length - 1)));
          },
        }
      });

      stRef.current = tween.scrollTrigger ?? null;
    }, containerRef);

    return () => {
      try {
        ctx.revert();
      } catch {
        // DOM already torn down by navigation; nothing left to revert.
      }
    };
  }, []);

  const goToIndex = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const clamped = Math.max(0, Math.min(total - 1, i));
    const progress = clamped / (total - 1);
    const target = st.start + progress * (st.end - st.start);
    lenisStore.current?.scrollTo(target, { duration: 1 });
  };

  return (
    <main className="bg-surface overflow-x-hidden">

      {/* Intro Hero */}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-20 border-b line-rule">
        <h1 className="text-6xl md:text-9xl font-display font-extrabold mb-6 tracking-tight">
          The Lineup.
        </h1>
        <p className="text-xl text-muted font-body max-w-2xl mx-auto">
          Scroll to explore our partnership hardware and find the perfect fit for your high-traffic locations.
        </p>
      </section>

      {/* GSAP Horizontal Scroll Section */}
      <section ref={containerRef} className="h-screen bg-surface relative border-b line-rule">
        <div ref={sliderRef} className="flex h-full w-[500vw]">
          {investmentPlans.map((plan) => (
            <div
              key={plan.id}
              className="invest-panel w-screen h-full flex items-center justify-center px-6 md:px-20 relative"
            >
              {/* pb-32 reserves room at the bottom on mobile so this column's
                  content never collides with the fixed progress overlay
                  below — that overlap was the bug in the screenshot. */}
              <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center gap-4 md:gap-24 pb-32 md:pb-0 relative z-10">

                {/* Left: Product Image — shorter on mobile to leave more room */}
                <div className="w-full md:w-1/2 flex justify-center shrink-0">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="h-[22vh] md:h-[70vh] object-contain drop-shadow-xl"
                  />
                </div>

                {/* Right: Product Data */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <span className="text-signal font-bold tracking-widest text-xs md:text-sm uppercase mb-2 md:mb-4">
                    {plan.bestFor}
                  </span>

                  <h2 className="text-4xl md:text-8xl font-display font-bold mb-3 md:mb-6">
                    {plan.name}
                  </h2>

                  <div className="h-px w-full bg-current opacity-10 mb-4 md:mb-8" />

                  <div className="grid grid-cols-2 gap-4 md:gap-8 mb-5 md:mb-10">
                    <div>
                      <p className="text-muted text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">Capacity</p>
                      <p className="text-xl md:text-3xl font-display font-bold">{plan.bays} Bays</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">Price</p>
                      <p className="text-xl md:text-3xl font-display font-bold text-signal">{plan.price}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">Est. Annual ROI</p>
                      <p className="text-2xl md:text-4xl font-display font-bold">{plan.roi}</p>
                    </div>
                  </div>

                  <Link href={`/contact?plan=${plan.id}`} className="block w-fit">
                    <button className="relative overflow-hidden px-8 md:px-10 py-4 md:py-5 rounded-full border line-rule bg-card group transition-all duration-300 active:scale-95">
                      <div className="absolute inset-0 bg-ink scale-0 group-hover:scale-100 transition-transform duration-[600ms] ease-signature rounded-full origin-center" />
                      <span className="relative z-10 font-bold text-base md:text-lg transition-colors duration-500 group-hover:text-sand">
                        Invest in {plan.name}
                      </span>
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Scroll-progress UI — shrunk and pulled in tighter on mobile
            (bottom-3 instead of bottom-8, smaller buttons/gaps) so it sits
            below the reserved pb-32 space above instead of overlapping it. */}
        <div className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 md:gap-4 pointer-events-none">
          <div
            className="hidden md:flex flex-col items-center gap-1.5 transition-opacity duration-500"
            style={{ opacity: activeIndex === 0 ? 1 : 0 }}
          >
            <span className="text-[11px] font-body text-muted tracking-widest uppercase">
              Scroll for more
            </span>
            <svg
              className="w-4 h-4 text-muted animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          <div className="flex items-center gap-3 md:gap-5 pointer-events-auto">
            <button
              onClick={() => goToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous product"
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border line-rule flex items-center justify-center text-muted hover:bg-signal hover:text-ink hover:border-signal transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5 md:gap-2">
              {investmentPlans.map((plan, i) => (
                <button
                  key={plan.id}
                  onClick={() => goToIndex(i)}
                  aria-label={`Go to ${plan.name}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "1.25rem" : "0.375rem",
                    backgroundColor: i === activeIndex ? "rgb(var(--accent))" : "currentColor",
                    opacity: i === activeIndex ? 1 : 0.25,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => goToIndex(activeIndex + 1)}
              disabled={activeIndex === total - 1}
              aria-label="Next product"
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border line-rule flex items-center justify-center text-muted hover:bg-signal hover:text-ink hover:border-signal transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <span className="text-[10px] md:text-[11px] font-body text-muted tracking-wide">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </section>

      <CTA />

    </main>
  );
}