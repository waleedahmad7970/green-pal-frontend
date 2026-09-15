import { useEffect, useLayoutEffect } from "react";

// GSAP's ScrollTrigger `pin: true` physically re-parents the pinned element
// into a "pin-spacer" wrapper div, outside React's own bookkeeping. If that
// cleanup (which un-wraps the spacer) runs in a normal useEffect, it fires
// AFTER React has already removed DOM nodes during a route change — and
// since GSAP moved the node somewhere React didn't expect, React's
// removeChild throws "NotFoundError: node is not a child of this node."
// useLayoutEffect's cleanup runs synchronously during the same commit,
// before React's own DOM removal, so GSAP always un-wraps first.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
