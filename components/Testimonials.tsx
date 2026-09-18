"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/data/content";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-label",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
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

  const current = testimonials[index];

  return (
    <section ref={sectionRef} className="relative py-10 md:py-32 bg-surface">
      <div className="container-edit">
        <p className="testimonial-label invisible text-sm text-muted font-body mb-10">
          From the venues we're already in
        </p>
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-2xl md:text-4xl font-medium leading-snug mb-8">
                “{current.quote}”
              </p>
              <p className="text-muted font-body text-sm">
                {current.name} — {current.org}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "2rem" : "0.75rem",
                  backgroundColor: i === index ? "rgb(var(--accent))" : "rgb(var(--line))",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
