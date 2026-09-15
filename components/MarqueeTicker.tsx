"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { lenisStore } from "@/lib/lenisStore";

const WORDS = ["TRUST", "EXCELLENCE", "JUSTICE", "HONESTY", "RESPECT", "ACCOUNTABILITY", "SERVICE"];

export default function MarqueeTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duplicate content once so the loop can wrap seamlessly.
    const halfWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -halfWidth,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    tweenRef.current = tween;

    // Nudge the marquee's timeScale up whenever Lenis reports scroll velocity,
    // and let it settle back to 1 — a small, real link to what you're doing.
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

    // SmoothScroll's effect can mount after this one, so poll briefly rather
    // than assuming lenisStore.current already exists.
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

  const loopContent = [...WORDS, ...WORDS];

  return (
    <div className="relative py-8 md:py-10 border-y line-rule overflow-hidden bg-surface">
      <div ref={trackRef} className="flex whitespace-nowrap w-max">
        {loopContent.map((w, i) => (
          <span
            key={i}
            className="font-display font-extrabold text-4xl md:text-6xl mx-6 md:mx-10 flex items-center gap-6 md:gap-10"
          >
            {w}
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-signal inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
