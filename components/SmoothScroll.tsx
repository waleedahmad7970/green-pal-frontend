"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // Add this import
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisStore } from "@/lib/lenisStore";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname(); // Track the current page route

  useEffect(() => {
    // ... [KEEP YOUR EXISTING GSAP/LENIS SETUP CODE EXACTLY THE SAME] ...
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

  // ADD THIS NEW EFFECT to handle Next.js page changes properly
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  return <div id="smooth-root">{children}</div>;
}