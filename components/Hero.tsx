"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GPMark from "./GPMark";
import { stats2 } from "@/data/content";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const motifRef = useRef<HTMLDivElement>(null);
  const markWrapRef = useRef<HTMLDivElement>(null);
  const markInnerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll(".reveal-line");

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        lines || [],
        { yPercent: 115, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.1 },
      )
        .fromTo(
          subRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.6",
        )
        .fromTo(
          markWrapRef.current,
          { autoAlpha: 0, scale: 0.82, rotate: -8 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 1.3,
            ease: "expo.out",
          },
          "-=1",
        )
        .fromTo(
          statsRef.current?.querySelectorAll(".stat-cell") || [],
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.5",
        );

      // Three independent parallax speeds tied to the same scroll range —
      // this is what makes it read as depth rather than one element drifting.
      gsap.to(motifRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(markWrapRef.current, {
        yPercent: 42,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(headlineRef.current, {
        yPercent: -26,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Mouse-reactive tilt on the GP mark — subtle, capped, and skipped on touch.
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (!isTouch) {
        const onMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(markInnerRef.current, {
            rotateY: x * 10,
            rotateX: -y * 10,
            duration: 0.9,
            ease: "power3.out",
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
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
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-surface"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={motifRef}
        className="absolute inset-0 gp-motif"
        aria-hidden="true"
      />

      <div
        ref={markWrapRef}
        className="absolute -right-16 sm:-right-8 top-[14%] w-[62vw] max-w-[720px] pointer-events-none invisible"
      >
        <div
          ref={markInnerRef}
          className="accent"
          style={{ transformStyle: "preserve-3d" }}
        >
          <GPMark className="w-full h-full drop-shadow-[0_30px_60px_rgba(2,214,131,0.18)]" />
        </div>
      </div>

      <div className="container-edit relative pb-12 md:pb-16 pt-32">
        <div ref={headlineRef} className="overflow-hidden">
          <div className="overflow-hidden">
            <h1 className="reveal-line font-display font-extrabold text-display-xl">
              Stay Charged. ,
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="reveal-line font-display font-extrabold text-display-xl">
              Keep<span className="accent">Moving.</span>
            </h1>
          </div>
          {/* <div className="overflow-hidden">
            <h1 className="reveal-line font-display font-extrabold text-display-xl">
              move.
            </h1>
          </div> */}
        </div>

        <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <p
            ref={subRef}
            className="font-body text-lg md:text-xl text-muted max-w-md invisible"
          >
            Rent a Greenpal power bank in seconds and take your charge with you.
            Simple portable charging for the places where people shop, eat,
            work, wait and play.
          </p>
          <a
            href="/contact"
            className="group inline-flex items-center gap-3 font-body text-base border-b line-rule pb-1 w-fit shrink-0"
          >
            Talk to us
            <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-12" />
          </a>
        </div>
      </div>

      <div className="relative border-t line-rule">
        <div
          ref={statsRef}
          className="container-edit grid grid-cols-2 md:grid-cols-4 gap-6 py-8"
        >
          {stats2.map((s) => (
            <div key={s.label} className="stat-cell invisible">
              <div className="font-display text-2xl md:text-3xl font-bold">
                {/* {s.value} */}
                {s.label}
                <span className="accent mt-1">{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
