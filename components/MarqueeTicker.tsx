"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { lenisStore } from "@/lib/lenisStore";

const WORDS = ["TRUST", "FAIRNESS", "ACCOUNTABILITY", "SERVICE"];

export default function OurApproach() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const halfWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -halfWidth,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    tweenRef.current = tween;

    let settleTimeout: ReturnType<typeof setTimeout>;
    let attachTimeout: ReturnType<typeof setTimeout>;
    const onScroll = (e: { velocity: number }) => {
      const boost = Math.min(Math.abs(e.velocity) * 0.6, 4);
      gsap.to(tween, { timeScale: 1 + boost, duration: 0.3, overwrite: true });
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        gsap.to(tween, { timeScale: 1, duration: 1.2, ease: "power2.out" });
      }, 220);
    };

    let attempts = 0;
    const tryAttach = () => {
      if (lenisStore.current) {
        lenisStore.current.on("scroll", onScroll);
      } else if (attempts < 30) {
        attempts += 1;
        attachTimeout = setTimeout(tryAttach, 100);
      }
    };
    tryAttach();

    return () => {
      tween.kill();
      clearTimeout(settleTimeout);
      clearTimeout(attachTimeout);
      lenisStore.current?.off("scroll", onScroll);
    };
  }, []);

  const loopContent = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

  return (
    <section className="bg-surface transition-colors duration-300 pt-24 md:pt-32">
      {/* Intro Text Section */}
      <div className="container-edit mb-16 md:mb-24 max-w-4xl">
        <h2 className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] dark:text-green-400 mb-6 transition-colors duration-300">
          Our approach
        </h2>
        {/* FIXED: Stripped text-ink and dark:text-white */}
        <h3 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight transition-colors duration-300">
          Built on Trust. Designed for Everyday Utility.
        </h3>
        {/* FIXED: Stripped dark:text-gray-400 so text-muted works naturally */}
        <p className="font-body text-lg md:text-xl text-muted leading-relaxed transition-colors duration-300">
          Greenpal combines practical charging technology with a service-first
          approach built around trust, fairness, accountability, respect and
          reliable service.
        </p>
      </div>

      {/* Marquee Section */}
      <div className="relative py-8 md:py-10 border-y line-rule overflow-hidden bg-surface transition-colors duration-300">
        <div ref={trackRef} className="flex whitespace-nowrap w-max">
          {loopContent.map((w, i) => (
            <span
              key={i}
              className="font-display font-extrabold text-4xl md:text-6xl mx-6 md:mx-10 flex items-center gap-6 md:gap-10 transition-colors duration-300"
            >
              {w}
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-signal inline-block" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
