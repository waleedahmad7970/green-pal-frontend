"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

// Replaced expertise with your new Blueprint content
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

export default function PowerBlueprints() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const track = trackRef.current;
        if (!track) return;
        const distance = track.scrollWidth - window.innerWidth;

        // Only trigger horizontal scroll if items overflow the screen width
        if (distance > 0) {
          const st = gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${distance + window.innerHeight * 0.5}`,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => setProgress(self.progress),
            },
          });

          return () => {
            st.scrollTrigger?.kill();
            st.kill();
          };
        }
      });
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {
        // DOM already torn down by navigation
      }
    };
  }, []);

  return (
    <section
      id="blueprints"
      ref={sectionRef}
      className="relative bg-ink text-sand overflow-hidden"
    >
      <div className="pt-24 md:pt-28 pb-10 container-edit">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
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
            <div className="h-px bg-sand/15 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-signal"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-sand/40 text-xs font-body mt-2">
              scroll to explore
            </p>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex flex-nowrap gap-6 md:gap-10 px-[clamp(1.25rem,5vw,5rem)] pb-20 w-max"
      >
        {blueprints.map((e) => {
          const Icon = iconMap[e.icon];
          return (
            <div
              key={e.title}
              className="w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[32vw] shrink-0 border-t border-signal/30 pt-8"
            >
              <Icon className="w-14 h-14 text-signal mb-8" />
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 text-sand">
                {e.title}
              </h3>
              <p className="text-signal/90 font-body text-sm mb-4 leading-relaxed">
                {e.metric}
              </p>
              <p className="text-sand/65 font-body leading-relaxed">{e.copy}</p>
            </div>
          );
        })}
      </div>

      {/* Footer CTA & Disclaimer */}
      <div className="container-edit pb-24 md:pb-32 flex flex-col items-start md:items-center text-left md:text-center">
        <a
          href="#"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-display font-bold text-lg hover:scale-105 transition-transform duration-300 mb-8"
        >
          Browse Greenpal Power Portfolio Blueprints
        </a>
        <p className="text-sand/40 font-body text-xs max-w-3xl leading-relaxed">
          Purchasing a blueprint is the purchase of a business-planning product
          only. It does not create an investment, ownership interest or
          profit-participation right in Greenpal Canada Ltd. or any station
          portfolio.
        </p>
      </div>
    </section>
  );
}
