"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconEthics, IconHardware, IconFleet, IconPayments } from "./Icons";

const values = [
  {
    icon: IconEthics,
    term: "Amanah",
    meaning: "Trust",
    copy: "Every claim on a kiosk screen matches what the hardware actually does.",
  },
  {
    icon: IconHardware,
    term: "Ihsan",
    meaning: "Excellence",
    copy: "Three chassis revisions, each one tested past what any warranty requires.",
  },
  {
    icon: IconFleet,
    term: "Adl",
    meaning: "Justice",
    copy: "The same uptime standard applies to a flagship mall unit and a single airport kiosk.",
  },
  {
    icon: IconPayments,
    term: "Sidq",
    meaning: "Honesty",
    copy: "Pricing shown at the kiosk is the pricing charged — no fees revealed after payment.",
  },
];

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".value-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, scale: 0.9, y: 20 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: (i % 4) * 0.08,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: card, start: "top 88%" },
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
    <section ref={sectionRef} className="relative py-28 md:py-40 bg-surface-dim">
      <div className="container-edit">
        <h2 className="font-display font-bold text-display-lg mb-16 max-w-2xl">
          What the charter asks of us.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.term} className="value-card bg-card border line-rule p-8">
              <v.icon className="w-12 h-12 text-signal mb-8" />
              <h3 className="font-display text-xl font-semibold mb-1">{v.term}</h3>
              <p className="text-sm text-signal font-body mb-4">{v.meaning}</p>
              <p className="text-muted font-body text-sm leading-relaxed">{v.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
