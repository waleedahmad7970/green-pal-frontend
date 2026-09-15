"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { work } from "@/data/content";
import { IconAirport, IconRetail, IconTransit, IconVenue } from "./Icons";

const iconMap: Record<string, typeof IconAirport> = {
  airport: IconAirport,
  retail: IconRetail,
  transit: IconTransit,
  venue: IconVenue,
};

// Alternates through the brand's actual approved logo lockups (dark-green-on-signal,
// signal-on-dark-green, sand) so cards read as distinct, not one repeated tile.
const treatments = [
  { bg: "bg-ink", fg: "text-signal", sub: "text-sand/55" },
  { bg: "bg-[#02D683]", fg: "text-ink", sub: "text-ink/60" },
  { bg: "bg-surface-dim", fg: "text-graphite", sub: "text-muted" },
  { bg: "bg-ink", fg: "text-signal", sub: "text-sand/55" },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-heading",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: (i % 3) * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 92%" },
          }
        );
      });
    }, sectionRef);
    return () => {
      // Route changes can unmount this component mid-pin, after
      // ScrollTrigger has already restructured the DOM with a pin-spacer.
      // Revert defensively so a stale reference never throws during
      // React's own cleanup.
      try {
        ctx.revert();
      } catch {
        // DOM already torn down by navigation; nothing left to revert.
      }
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative py-28 md:py-40 bg-surface">
      <div className="container-edit mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 className="work-heading invisible font-display font-bold text-display-lg max-w-xl">
          Deployed and running.
        </h2>
        <p className="work-heading invisible text-muted font-body max-w-xs">
          Drag or scroll — a sample of live sites.
        </p>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-6 overflow-x-auto pl-[clamp(1.25rem,5vw,5rem)] pr-[clamp(1.25rem,5vw,5rem)] pb-4 snap-x snap-mandatory"
      >
        {work.map((w, i) => {
          const Icon = iconMap[w.icon];
          const t = treatments[i % treatments.length];
          return (
            <div
              key={w.title}
              className="work-card invisible snap-start shrink-0 w-[82vw] sm:w-[60vw] lg:w-[30vw] border line-rule"
            >
              <div className={`aspect-[4/3] ${t.bg} flex flex-col justify-between p-7`}>
                <Icon className={`w-12 h-12 ${t.fg}`} />
                <span className={`font-display text-3xl font-bold ${t.fg}`}>{w.stat}</span>
              </div>
              <div className="p-7 bg-card">
                <p className="text-xs text-muted font-body mb-2">{w.place}</p>
                <h3 className="font-display text-xl font-semibold mb-3">{w.title}</h3>
                <p className="text-muted font-body text-sm leading-relaxed">{w.copy}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="container-edit mt-10">
        <div className="hairline relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-signal transition-[width] duration-150"
            style={{ width: `${Math.max(progress * 100, 6)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
