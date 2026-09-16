"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconStation } from "./Icons";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=140%",
            scrub: 0.7,
            // pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          maskRef.current,
          { clipPath: "circle(8% at 50% 50%)" },
          { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut" },
          0
        )
          .fromTo(labelRef.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 0.05)
          .fromTo(copyRef.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: "power2.out" }, 0.45);
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(maskRef.current, { clipPath: "circle(75% at 50% 50%)" });
        gsap.set(copyRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(labelRef.current, { autoAlpha: 0 });
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
    <section ref={sectionRef} className="relative h-[100svh] bg-ink overflow-hidden pt-20">
      <div
        ref={labelRef}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <p className="font-body text-sand/40 text-sm tracking-wide">keep scrolling</p>
      </div>

      <div
        ref={maskRef}
        className="absolute inset-0 flex items-center justify-center bg-surface-dim"
        style={{ clipPath: "circle(8% at 50% 50%)" }}
      >
        <IconStation className="w-[40vw] max-w-[280px] text-signal opacity-90" />
      </div>

      <div className="relative h-full flex items-center">
        <div ref={copyRef} className="container-edit grid lg:grid-cols-12 gap-10 invisible">
          <div className="lg:col-span-6 lg:col-start-7">
            <h1 className="font-display font-bold text-display-lg text-sand mb-6">
              A subsidiary built on one charter.
            </h1>
            <p className="text-sand/65 font-body leading-relaxed max-w-md mb-4">
              Greenpal operates under ANAH's core principles — Amanah, Ihsan, Adl, and Sidq —
              extended into the physical world of charging infrastructure.
            </p>
            <p className="text-sand/65 font-body leading-relaxed max-w-md">
              We started with one observation: a dead phone interrupts more travel plans and
              meetings than almost anything else in a modern terminal. We design for that single
              moment of relief.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
