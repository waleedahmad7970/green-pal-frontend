"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ContactIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-reveal",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }, ref);
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
    <section ref={ref} className="relative pt-40 pb-20 bg-ink text-sand overflow-hidden">
      <div className="absolute inset-0 gp-motif" aria-hidden="true" />
      <div className="container-edit relative grid lg:grid-cols-12 gap-10">
        <h1 className="contact-reveal font-display font-extrabold text-display-lg text-sand lg:col-span-8">
          Let's talk about your venue.
        </h1>
        <div className="contact-reveal lg:col-span-4 flex flex-col justify-end">
          <dl className="space-y-5 font-body text-sand/80 text-sm">
            <div>
              <dt className="text-sand/45 mb-1">Address</dt>
              <dd>374 Elmo Street, Main Boulevard, OT</dd>
            </div>
            <div>
              <dt className="text-sand/45 mb-1">Phone</dt>
              <dd>780-777-0519</dd>
            </div>
            <div>
              <dt className="text-sand/45 mb-1">Email</dt>
              <dd>hello@thegreenpal.ca</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
