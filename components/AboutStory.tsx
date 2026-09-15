"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const milestones = [
  {
    year: "2021",
    title: "Founded in a terminal",
    copy: "Afraz Ahmad missed a boarding call while hunting for an outlet. Greenpal's first sketch was drawn on a napkin that same night.",
  },
  {
    year: "2022",
    title: "First kiosk installed",
    copy: "A single station placed in a regional airport lounge, serviced by hand every evening for the first six months.",
  },
  {
    year: "2023",
    title: "Fleet intelligence goes live",
    copy: "Remote bay monitoring replaced manual checks, cutting reported faults by more than half in the first quarter.",
  },
  {
    year: "2024",
    title: "ANAH charter adopted",
    copy: "Greenpal formally joined ANAH, adopting Amanah, Ihsan, Adl, and Sidq as binding operating principles.",
  },
  {
    year: "2025",
    title: "340+ stations live",
    copy: "Deployed across airports, transit hubs, and retail centres, with a third-generation chassis in production.",
  },
];

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".milestone-row").forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, x: -20 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 82%" },
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
    <section ref={sectionRef} className="relative py-28 md:py-40 bg-surface">
      <div className="container-edit">
        <h2 className="font-display font-bold text-display-lg mb-16 max-w-2xl">
          Five years, one charter.
        </h2>

        <div className="relative pl-10 md:pl-14">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-line-light" />
          <div
            ref={lineRef}
            className="absolute left-0 top-2 bottom-2 w-px bg-signal origin-top"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="flex flex-col gap-14">
            {milestones.map((m) => (
              <div key={m.year} className="milestone-row relative">
                <span className="absolute -left-10 md:-left-14 top-1 w-2.5 h-2.5 rounded-full bg-signal" />
                <p className="font-display text-sm text-signal mb-2 font-semibold">{m.year}</p>
                <h3 className="font-display text-2xl font-semibold mb-2">{m.title}</h3>
                <p className="text-muted font-body leading-relaxed max-w-lg">{m.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
