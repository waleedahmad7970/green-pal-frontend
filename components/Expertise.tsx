"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  IconHardware,
  IconFleet,
  IconPayments,
  IconOps,
  IconEthics,
} from "./Icons";

const iconMap: Record<string, typeof IconHardware> = {
  hardware: IconHardware,
  fleet: IconFleet,
  payments: IconPayments,
  ops: IconOps,
  ethics: IconEthics,
};

const blueprints = [
  {
    title: "Ownership Series",
    metric:
      "Investor-funded planning models where the modeled investor owns the funded physical stations.",
    copy: "Shows investment amount, station mix, ownership, modeled economics and launch framework.",
    icon: "ops",
  },
  {
    title: "Co-Invest Series",
    metric:
      "50/50 contribution planning models where Greenpal matches the investor contribution and owns the physical assets.",
    copy: "Shows your contribution, total portfolio size, station mix, modeled economics and operating framework.",
    icon: "fleet",
  },
  {
    title: "What's Inside",
    metric: "Business-planning blueprints from $14.",
    copy: "Capital breakdown, revenue model, break-even, sensitivity, ROI/payback, 3-year outlook, 90-day roadmap, reporting, risk and due diligence.",
    icon: "hardware",
  },
];

// Below this width we fall back to native touch scrolling (overflow-x-auto)
// and skip all the JS drag / auto-scroll logic entirely.
const DESKTOP_MIN_WIDTH = 900;

// How fast the track auto-advances, in pixels per second.
const AUTO_SCROLL_SPEED = 40;

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export default function PowerBlueprints() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Interaction state
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0); // current translateX applied to the track (<= 0)
  const maxDistance = useRef(0); // how far the track can travel (scrollWidth - visible width)
  const isDesktop = useRef(false);

  // Move the track to a given x (clamped) and update the progress bar.
  // This ONLY transforms the track element — it never touches window scroll.
  const applyX = useCallback((x: number) => {
    const clamped = clamp(x, -maxDistance.current, 0);
    currentX.current = clamped;
    if (trackRef.current) {
      gsap.set(trackRef.current, { x: clamped });
    }
    setProgress(maxDistance.current > 0 ? -clamped / maxDistance.current : 0);
  }, []);

  // Recalculate available drag distance (on mount + resize).
  const measure = useCallback(() => {
    isDesktop.current = window.innerWidth >= DESKTOP_MIN_WIDTH;

    if (!isDesktop.current || !trackRef.current || !containerRef.current) {
      maxDistance.current = 0;
      applyX(0);
      return;
    }

    const trackWidth = trackRef.current.scrollWidth;
    const containerWidth = containerRef.current.clientWidth;
    maxDistance.current = Math.max(trackWidth - containerWidth, 0);

    // Re-clamp current position in case the viewport changed size.
    applyX(currentX.current);
  }, [applyX]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop.current) return; // mobile uses native touch scrolling
    isDragging.current = true;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isDesktop.current) return;
    const deltaX = e.clientX - startX.current;
    startX.current = e.clientX;
    applyX(currentX.current + deltaX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);

    // Self-contained auto-scroll: nudges the track transform on every frame.
    // It never calls window.scrollBy, so the page's vertical scroll is
    // completely unaffected. It pauses on hover/drag and stops (rather than
    // looping) once the end of the track is reached.
    const tick = (_time: number, deltaTimeMs: number) => {
      if (
        !isDesktop.current ||
        isDragging.current ||
        isHovered.current ||
        maxDistance.current <= 0
      ) {
        return;
      }
      if (currentX.current <= -maxDistance.current) return; // fully scrolled, stop
      const step = (AUTO_SCROLL_SPEED * deltaTimeMs) / 1000;
      applyX(currentX.current - step);
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("resize", measure);
      gsap.ticker.remove(tick);
    };
  }, [measure, applyX]);

  return (
    <div>
      <section
        id="blueprints"
        ref={sectionRef}
        className="relative bg-ink text-sand overflow-x-hidden select-none"
      >
        <div className="pt-24 md:pt-28 pb-10 container-edit">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse"></span>
                <span className="text-[10px] text-signal font-mono uppercase tracking-widest">
                  Interactive Blueprints
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-display-lg text-sand tracking-tight">
                Power Portfolio Blueprints
              </h2>
              <p className="text-sand font-body text-lg font-medium mt-6">
                Explore a Greenpal Business Blueprint Before You Build.
              </p>
              <p className="text-sand/60 font-body mt-2 leading-relaxed">
                Downloadable planning products that explain portfolio
                configuration, capital structure, revenue assumptions, operating
                costs, break-even, sensitivity, projected ROI/payback, 3-year
                outlook, launch planning, reporting, risk and due diligence.
              </p>
            </div>
            <div className="hidden md:block w-40 shrink-0 mb-2">
              <div className="h-px bg-sand/15 relative overflow-hidden rounded-full">
                <div
                  className="absolute inset-y-0 left-0 bg-signal transition-[width] duration-150 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-sand/40 text-xs font-body mt-2">
                drag to explore
              </p>
            </div>
          </div>
        </div>

        {/* Draggable Track Container — self-contained, no page scroll involved */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
          className="w-full overflow-x-auto md:overflow-hidden no-scrollbar cursor-grab active:cursor-grabbing touch-pan-y"
        >
          <div
            ref={trackRef}
            className="flex flex-nowrap gap-6 md:gap-8 px-[clamp(1.25rem,5vw,5rem)] pb-20 w-max"
          >
            {blueprints.map((e, index) => {
              const Icon = iconMap[e.icon];
              return (
                <div
                  key={e.title}
                  className="w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[38vw] shrink-0 bg-surface-dim/40 backdrop-blur-md border border-signal/15 p-8 md:p-10 rounded-2xl flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-signal/40 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-3 rounded-xl bg-signal/10 border border-signal/20 inline-block">
                        <Icon className="w-8 h-8 text-signal" />
                      </div>
                      <span className="text-xs font-mono text-sand/30 tracking-widest">
                        BP_0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 text-sand group-hover:text-signal transition-colors">
                      {e.title}
                    </h3>
                    <p className="text-signal/90 font-body text-sm mb-4 leading-relaxed font-medium">
                      {e.metric}
                    </p>
                    <p className="text-sand/65 font-body text-sm leading-relaxed">
                      {e.copy}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-sand/10 flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-sand/40">
                      Verified Blueprint Spec
                    </span>
                    <span className="text-signal text-lg font-bold transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container-edit pb-24 md:pb-32 flex flex-col items-start md:items-center text-left md:text-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-display font-bold text-lg hover:scale-105 transition-transform duration-300 mb-8 shadow-lg shadow-signal/10"
          >
            Browse Greenpal Power Portfolio Blueprints
          </a>
          <p className="text-sand/40 font-body text-xs max-w-3xl leading-relaxed">
            Purchasing a blueprint is the purchase of a business-planning
            product only. It does not create an investment, ownership interest
            or profit-participation right in Greenpal Canada Ltd. or any station
            portfolio.
          </p>
        </div>
      </section>
    </div>
  );
}
