import type Lenis from "lenis";

export const lenisStore: { current: Lenis | null } = { current: null };

export function scrollToTarget(target: string | HTMLElement, offset = -88) {
  if (lenisStore.current) {
    lenisStore.current.scrollTo(target, { offset, duration: 1.2 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
