"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/content";
import { IconStation, IconPowerBank, IconUtility } from "./Icons";

const iconMap: Record<string, typeof IconStation> = {
  station: IconStation,
  powerbank: IconPowerBank,
  utility: IconUtility,
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".service-row").forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%" },
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
    <section id="services" ref={sectionRef} className="relative py-28 md:py-40 bg-surface">
      <div className="container-edit">
        <h2 className="font-display font-bold text-display-lg mb-16 max-w-2xl">
          Three ways we put power back in reach.
        </h2>

        <div className="border-t line-rule">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon];
            const isActive = active === i;
            return (
              <div
                key={s.title}
                className="service-row group border-b line-rule py-9 md:py-11 cursor-default"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  <div
                    className="shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform duration-500 ease-signature"
                    style={{ transform: isActive ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)" }}
                  >
                    <Icon className={`w-full h-full transition-colors duration-300 ${isActive ? "text-signal" : "text-muted"}`} />
                  </div>

                  <h3 className="font-display text-2xl md:text-4xl font-semibold transition-colors duration-300 group-hover:accent md:w-[30%]">
                    {s.title}
                  </h3>
                  <p className="text-muted font-body leading-relaxed max-w-lg md:w-[38%]">{s.detail}</p>

                  <span className="font-display text-3xl md:text-4xl font-bold accent md:w-[12%] md:text-right">
                    {s.stat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
