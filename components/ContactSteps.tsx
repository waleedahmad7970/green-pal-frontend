"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    n: "1",
    title: "We look at your footfall",
    copy: "Send over the venue and its peak traffic windows — we size the deployment to match.",
  },
  {
    n: "2",
    title: "We propose placement",
    copy: "A short plan showing where stations go, how many bays, and expected turnover.",
  },
  {
    n: "3",
    title: "We install and monitor",
    copy: "On-site setup, then fleet intelligence takes over — you get uptime reports, not surprises.",
  },
];

export default function ContactSteps() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".step-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
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
        <h2 className="font-display font-bold text-display-lg mb-16 max-w-xl">What happens next.</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n} className="step-card">
              <span className="font-display text-5xl font-extrabold accent block mb-6">{s.n}</span>
              <h3 className="font-display text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted font-body leading-relaxed">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
