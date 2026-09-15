"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisStore } from "@/lib/lenisStore";

export default function RouteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip the very first run — SmoothScroll already handles the initial
    // hash scroll, and there's nothing stale to refresh on first load.
    if (!window.location.hash) {
      lenisStore.current?.scrollTo(0, { immediate: true });
    }

    const id = requestAnimationFrame(() => {
      ScrollTrigger.getAll().forEach((t) => t.refresh());
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
