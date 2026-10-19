"use client";

import Link from "next/link";
import GPMark from "./GPMark";

export default function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-surface overflow-hidden transition-colors duration-300">
      {/* Subtle brand line motif */}
      <div className="absolute inset-0 gp-motif pointer-events-none" aria-hidden="true" />

      {/* Soft gradient ambient glow */}
      <div
        className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-signal/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-edit relative z-10">
        <div className="max-w-4xl">
          {/* Brand & Location Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card border line-rule mb-8 transition-colors duration-300">
            <GPMark className="w-5 h-4 text-signal shrink-0" />
            <span className="font-body text-xs md:text-sm font-medium tracking-wide">
              Edmonton-Based · Canadian Shared Portable Charging
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-6 transition-colors duration-300">
            Greenpal is bringing shared portable charging to the places people shop, eat, work and spend time.
          </h1>

          {/* Body Intro */}
          <p className="font-body text-base sm:text-xl text-muted leading-relaxed max-w-3xl mb-10 transition-colors duration-300">
            Our Greenpal Pulse stations let customers rent a power bank, charge on the move and return it when they are done.
          </p>

          {/* CTA Link Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-signal text-ink font-body font-semibold text-base hover:bg-signal-dim transition-all duration-200 shadow-lg shadow-signal/15"
            >
              Host a Greenpal Station
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border line-rule bg-card text-muted hover:text-signal hover:border-signal font-body font-medium text-base transition-colors"
            >
              How It Works ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}