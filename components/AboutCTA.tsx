"use client";

import Link from "next/link";
import GPMark from "./GPMark";

export default function AboutCTA() {
  return (
    <section className="relative py-24 md:py-36 bg-ink text-sand overflow-hidden">
      {/* GP bolt motif background */}
      <div className="absolute inset-0 gp-motif pointer-events-none" aria-hidden="true" />

      {/* Subtle ambient glow */}
      <div
        className="absolute bottom-0 right-1/3 w-[500px] h-[300px] bg-signal/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-edit relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ink-soft/80 border border-signal/20 mb-8 backdrop-blur-sm">
            <GPMark className="w-5 h-4 text-signal shrink-0" />
            <span className="font-body text-xs md:text-sm font-medium tracking-wide text-sand/90">
              For Canadian Venues & Businesses
            </span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-sand tracking-tight leading-[1.08] mb-6">
            Bring Greenpal to Your Location
          </h2>

          <p className="font-body text-lg sm:text-xl text-sand/80 leading-relaxed mb-10 max-w-2xl">
            Offer convenient portable charging to your guests, showcase your promotions on station screens, and participate in revenue sharing.
          </p>

          {/* One primary CTA button */}
          <div className="mb-14">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-body font-bold text-lg hover:bg-signal-dim transition-all duration-200 shadow-xl shadow-signal/20"
            >
              Host a Greenpal Station
            </Link>
          </div>

          {/* Contact and Corporate Info */}
          <div className="pt-8 border-t border-sand/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm font-body text-sand/70">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-semibold text-sand">GREENPAL CANADA LTD.</span>
              <span className="hidden sm:inline text-sand/30">|</span>
              <a
                href="mailto:info@thegreenpal.ca"
                className="hover:text-signal transition-colors underline-offset-4 hover:underline"
              >
                info@thegreenpal.ca
              </a>
              <span className="hidden sm:inline text-sand/30">|</span>
              <a
                href="https://thegreenpal.ca"
                target="_blank"
                rel="noreferrer"
                className="hover:text-signal transition-colors"
              >
                thegreenpal.ca
              </a>
            </div>
            <div className="text-sand/50 text-xs">
              Edmonton, Alberta, Canada
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
