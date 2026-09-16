"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { expertise } from "@/data/content";
import { IconHardware, IconFleet, IconPayments, IconOps, IconEthics } from "./Icons";

const iconMap: Record<string, typeof IconHardware> = {
  hardware: IconHardware,
  fleet: IconFleet,
  payments: IconPayments,
  ops: IconOps,
  ethics: IconEthics,
};

export default function Expertise() {
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

        const st = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance + window.innerHeight * 0.5}`,
            scrub: 0.6,
            // pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });

        return () => {
          st.scrollTrigger?.kill();
          st.kill();
        };
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
    <section id="expertise" ref={sectionRef} className="relative bg-ink text-sand overflow-hidden">
      <div className="pt-24 md:pt-28 pb-10 container-edit">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-display-lg text-sand">Our expertise.</h2>
            <p className="text-sand/60 font-body mt-4 max-w-md">
              Five disciplines held under one roof, so a kiosk is never the weak link in someone's
              day.
            </p>
          </div>
          <div className="hidden md:block w-40 shrink-0">
            <div className="h-px bg-sand/15 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-signal"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-sand/40 text-xs font-body mt-2">scroll to explore</p>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex flex-nowrap gap-6 md:gap-10 px-[clamp(1.25rem,5vw,5rem)] pb-24 md:pb-32 w-max"
      >
        {expertise.map((e) => {
          const Icon = iconMap[e.icon];
          return (
            <div
              key={e.title}
              className="w-[80vw] sm:w-[60vw] md:w-[32vw] lg:w-[26vw] shrink-0 border-t border-signal/30 pt-8"
            >
              <Icon className="w-14 h-14 text-signal mb-8" />
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 text-sand">{e.title}</h3>
              <p className="text-signal/80 font-body text-sm mb-4">{e.metric}</p>
              <p className="text-sand/65 font-body leading-relaxed">{e.copy}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
