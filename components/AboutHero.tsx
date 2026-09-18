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

      // Desktop: Scroll-driven scrub animation
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=140%",
            scrub: 0.7,
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

      // Mobile: Smooth entrance animation on load
      mm.add("(max-width: 767px)", () => {
        const mobileTl = gsap.timeline({ defaults: { ease: "power2.out" } });

        mobileTl
          .fromTo(
            maskRef.current,
            { clipPath: "circle(15% at 50% 50%)" },
            { clipPath: "circle(75% at 50% 50%)", duration: 1.2, ease: "power2.inOut" }
          )
          .fromTo(
            labelRef.current,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.3 },
            0
          )
          .fromTo(
            copyRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            0.4
          );
      });
    }, sectionRef);

    return () => {
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
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
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

      {/* Adjusted alignment: items-end on mobile to push the text card down, items-center on desktop */}
      <div className="relative h-full flex items-end lg:items-center pb-12 lg:pb-0 z-20">
        <div ref={copyRef} className="container-edit grid lg:grid-cols-12 gap-10 invisible">
          <div className="lg:col-span-6 lg:col-start-7 bg-ink/90 lg:bg-transparent p-6 sm:p-8 lg:p-0 rounded-3xl border border-sand/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none shadow-2xl lg:shadow-none">
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-display-lg text-sand mb-4 lg:mb-6">
              A subsidiary built on one charter.
            </h1>
            <p className="text-sand/75 lg:text-sand/65 font-body text-sm sm:text-base leading-relaxed max-w-md mb-3 lg:mb-4">
              Greenpal operates under ANAH's core principles — Amanah, Ihsan, Adl, and Sidq —
              extended into the physical world of charging infrastructure.
            </p>
            <p className="text-sand/75 lg:text-sand/65 font-body text-sm sm:text-base leading-relaxed max-w-md">
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