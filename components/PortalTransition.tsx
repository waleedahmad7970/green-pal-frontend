"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MARK_PATH = "M249.84,89.07l37.86-65.17c3.91-6.72-.94-15.15-8.72-15.15h-148.25l-33.01,60.5c-2.85,4.86-8.05,7.84-13.68,7.84h-1.44c-5.66,0-10.97-2.68-14.34-7.23l-11.85-16.04L10.37,133.46c-6.5,11.24-4.64,25.44,4.54,34.63l59.08,59.1c5.21,5.21,12.27,8.14,19.64,8.14h65.87c3.96,0,7.63-2.11,9.62-5.54l44.85-77.27h-.01l8.85-15.31c1.44-2.49-.36-5.59-3.23-5.59h-71.96c-3.55,0-6.81,1.98-8.44,5.14l-5.44,10.53c-1.66,3.21-4.97,5.23-8.59,5.23h-47.34c-11.38,0-18.76-11.99-13.64-22.15l11.42-22.65c4.62-8.3,13.37-13.44,22.87-13.44h142.36c3.72,0,7.16-1.98,9.03-5.2Z M130.73,313.24l74.75-120.67c2.18-3.51,6.01-5.65,10.15-5.65h121.33c2.67,0,5.28-.8,7.5-2.28l109.86-73.74-77,134.29c-1.53,2.67-4.37,4.32-7.45,4.32h-122.04c-2.56,0-5.08.66-7.32,1.92l-109.78,61.82Z M335.3,169.65l98.58-62.56c11.98-7.6,6.59-26.13-7.59-26.13h-146.13c-7.36,0-14.17,3.92-17.85,10.3l-28.47,49.2c-.89,1.54.22,3.47,2,3.47h107.57c1.08,0,1.82,1.1,1.42,2.1l-9.52,23.62Z M546.99,193.62c0,1.32,1.1,2.2,2.42,2.2h10.54c1.32,0,2.2-.88,2.2-2.2v-5.93h-3.68l-2.64-36.68h63.42v89.17h-48.1l-4.61-12.52c-2.63,7.25-9.66,12.52-17.79,12.52h-39.53c-10.54,0-19.11-8.56-19.11-18.89v-111.57c0-10.32,8.56-18.89,19.11-18.89h90.93c10.54,0,19.11,8.56,19.11,18.89v34.92l-57.1,2.42v-9.66c0-1.32-.88-2.2-2.2-2.2h-10.54c-1.32,0-2.42.88-2.42,2.2v56.22Z M628.46,90.84h110.03c10.54,0,19.11,8.56,19.11,18.89v63.25c0,10.54-8.57,19.77-19.11,21.09l-2.42.44,21.52,45.68h-57.1l-10.54-39.53-4.61.66v38.88h-56.88V90.84ZM700.5,155.85v-18.45c0-1.32-.88-2.2-2.2-2.2h-12.96v25.48l12.96-2.42c1.32-.22,2.2-1.1,2.2-2.42Z M766.83,90.84h105.42v44.36h-48.54v8.13h42.17l-1.32,44.36h-40.85v8.13h48.54v44.36h-105.42V90.84Z M881.47,90.84h105.42v44.36h-48.54v8.13h42.17l-1.32,44.36h-40.85v8.13h48.54v44.36h-105.42V90.84Z M1125.25,240.18h-57.1l-15.15-52.49v52.49h-56.88V90.84h56.88l15.15,52.49v-52.49h57.1v149.35Z M1134.47,90.84h110.04c10.76,0,19.11,5.49,19.11,15.81v70.5c0,10.54-8.57,20.42-19.11,22.18l-53.15,9v31.85h-56.88V90.84ZM1191.36,135.2v28.77l12.96-2.19c1.32-.22,2.2-1.32,2.2-2.64v-22.18c0-1.1-.88-1.76-2.2-1.76h-12.96Z M1288.71,90.84h72.04l32.28,149.35h-56.88l-1.76-14.72h-19.11l-1.98,14.72h-56.88l32.29-149.35ZM1329.79,187.47l-5.05-39.97-4.83,39.97h9.88Z M1397.06,90.84h56.88v104.98h39.53l-2.42,44.36h-94V90.84Z";

export default function PortalTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
        // The outer <section> is a tall (320vh) scroll track; the inner
        // content div is CSS `sticky` (see JSX). That's what holds it in
        // view during the animation — pin:false with no sticky wrapper
        // does nothing, since nothing tells the browser to keep the
        // content from scrolling normally.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom", // matches the outer section's height below
            scrub: 0.6,
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
          // Fade the sticky CONTENT (not the outer track) so it's already
          // invisible by the time the outer track's range ends and the
          // sticky content un-sticks — no dead scroll, no visible pop.
          .to(contentRef.current, { autoAlpha: 0, duration: 0.5, ease: "power1.in" });
      });

      mm.add("(max-width: 767px)", () => {
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
      try {
        ctx.revert();
      } catch {
        // DOM already torn down by navigation; nothing left to revert.
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[70vh] md:h-[320vh]" aria-hidden="true">
      <div
        ref={contentRef}
        className="md:sticky md:top-0 h-[70vh] md:h-[100svh] bg-surface overflow-hidden flex items-center justify-center"
      >
        <div ref={washRef} className="absolute inset-0 bg-ink invisible" />

        <p
          ref={labelRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-wide text-muted font-body"
        >
          keep scrolling
        </p>

        <div ref={svgWrapRef} className="relative w-11/12 max-w-[800px]">
          <svg viewBox="0 0 1500 322" fill="none" className="w-full h-full">
            <path ref={pathRef} d={MARK_PATH} stroke="#02d683" strokeWidth="4" strokeLinejoin="round" />
            <path ref={fillPathRef} d={MARK_PATH} fill="#02d683" />
          </svg>
        </div>
      </div>
    </section>
  );
}