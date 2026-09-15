"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisStore } from "@/lib/lenisStore";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;
    lenisStore.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // If the page loaded with a hash (e.g. arriving at /#team from another
    // page), scroll to it once layout has settled instead of leaving Lenis
    // fighting the browser's native jump.
    if (window.location.hash) {
      const id = window.location.hash;
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.querySelector(id);
          if (el) lenis.scrollTo(el as HTMLElement, { offset: -88, immediate: true });
        }, 60);
      });
    }

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisStore.current = null;
    };
  }, []);

  return <div id="smooth-root">{children}</div>;
}
