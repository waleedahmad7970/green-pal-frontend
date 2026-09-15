"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconEthics } from "./Icons";

const principles = [
  { term: "Amanah", meaning: "Trust" },
  { term: "Ihsan", meaning: "Excellence" },
  { term: "Adl", meaning: "Justice" },
  { term: "Sidq", meaning: "Honesty" },
];

export default function Elegance() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const words = textRef.current?.querySelectorAll(".word");
      gsap.fromTo(
        words || [],
        { opacity: 0.12, filter: "blur(4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );

      gsap.to(iconRef.current, {
        rotate: 340,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      gsap.utils.toArray<HTMLElement>(".principle-row").forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, x: -24 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%" },
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

  const sentence =
    "Greenpal is built on more than hardware. It is a standard of conduct carried through every station we place and every partner we serve.";

  return (
    <section id="elegance" ref={sectionRef} className="relative py-28 md:py-40 bg-surface overflow-hidden">
      <div
        ref={iconRef}
        className="absolute -left-24 -bottom-24 w-[42vw] max-w-[420px] opacity-[0.07] pointer-events-none"
      >
        <IconEthics className="w-full h-full" />
      </div>

      <div className="container-edit relative grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <p ref={textRef} className="font-display font-medium text-display-md leading-tight">
            {sentence.split(" ").map((w, i) => (
              <span key={i} className="word inline-block mr-[0.28em]">
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-end">
          <p className="text-sm text-muted mb-6 font-body">Held to the ANAH charter</p>
          <div className="flex flex-col">
            {principles.map((p) => (
              <div
                key={p.term}
                className="principle-row flex items-baseline justify-between py-4 border-t line-rule last:border-b"
              >
                <span className="font-display text-xl font-semibold">{p.term}</span>
                <span className="text-sm text-muted font-body">{p.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
