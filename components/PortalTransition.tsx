"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MARK_PATH = "M4 20 L26 20 L26 6 L44 6 L30 24 L44 24 L20 44 L26 28 L4 28 Z";

export default function PortalTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const path = pathRef.current;
      if (!path) return;

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(fillPathRef.current, { autoAlpha: 0 });

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=220%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(path, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" })
          .to(labelRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.15")
          .to(fillPathRef.current, { autoAlpha: 1, duration: 0.3 }, "-=0.1")
          .to(
            svgWrapRef.current,
            { scale: 34, rotate: 12, duration: 1.4, ease: "power2.in" },
            "<"
          )
          .to(washRef.current, { autoAlpha: 1, duration: 0.6 }, "-=1.1")
          .to({}, { duration: 0.3 }) // brief hold at full wash
          .to(sectionRef.current, { autoAlpha: 0, duration: 0.5, ease: "power1.in" });
      });

      mm.add("(max-width: 767px)", () => {
        // Simpler, non-pinned version for small screens: quick draw-in only.
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power1.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "top 20%", scrub: true },
        });
        gsap.to(fillPathRef.current, {
          autoAlpha: 1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 30%", end: "top 5%", scrub: true },
        });
      });
    }, sectionRef);

    return () => {
      // Route changes can unmount this component mid-pin, after
      // ScrollTrigger has already restructured the DOM with a pin-spacer.
      // Kill every trigger this component owns and revert defensively so a
      // stale reference never throws during React's own cleanup.
      try {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === sectionRef.current)
          .forEach((t) => t.kill());
        ctx.revert();
      } catch {
        // DOM already torn down by navigation; nothing left to revert.
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] md:h-[100svh] bg-surface overflow-hidden flex items-center justify-center"
      aria-hidden="true"
    >
      <div ref={washRef} className="absolute inset-0 bg-ink invisible" />

      <p
        ref={labelRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-wide text-muted font-body"
      >
        keep scrolling
      </p>

      <div ref={svgWrapRef} className="relative w-28 md:w-40">
        <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
          <path ref={pathRef} d={MARK_PATH} stroke="rgb(var(--accent))" strokeWidth="2.4" strokeLinejoin="round" />
          <path ref={fillPathRef} d={MARK_PATH} fill="rgb(var(--accent))" />
        </svg>
      </div>
    </section>
  );
}
