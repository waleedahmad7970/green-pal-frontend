"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const blueprints = [
  {
    slug: "ownership-series",
    series: "Series 01",
    title: "Ownership Series Blueprint",
    price: "$14",
    tagline:
      "Investor-funded planning models where the modeled investor owns the funded physical stations.",
    description:
      "Designed for individuals looking to understand direct asset-ownership structures. This blueprint models capital expenditure, station placement formulas, and expected revenue distributions.",
    highlights: [
      "Direct physical station ownership",
      "Detailed capital expenditure breakdown",
      "Modeled break-even analysis",
      "90-day launch framework",
    ],
    featured: true, // Highlights this row visually
  },
  {
    slug: "co-invest-series",
    series: "Series 02",
    title: "Co-Invest Series Blueprint",
    price: "$29",
    tagline:
      "50/50 contribution planning models where Greenpal matches the investor contribution.",
    description:
      "A balanced partnership planning structure. Greenpal matches your capital contribution while retaining management of underlying physical infrastructure and network logistics.",
    highlights: [
      "50/50 capital contribution mapping",
      "Greenpal-matched infrastructure asset model",
      "Operating framework & revenue splits",
      "Portfolio scaling guidelines",
    ],
    featured: false,
  },
  {
    slug: "transit-hub-blueprint",
    series: "Series 03",
    title: "Transit Hub Deployment Model",
    price: "$34",
    tagline:
      "High-volume commuter station layouts designed specifically for airports, train stations, and subways.",
    description:
      "Tailored for ultra-high traffic environments where dwell time is short and transaction velocity is high. Focuses on multi-tower clusters and rapid-swap inventory design.",
    highlights: [
      "High-velocity transaction modeling",
      "Multi-tower cluster economics",
      "Commuter peak-hour capacity metrics",
      "Security & municipal compliance notes",
    ],
    featured: false,
  },
  {
    slug: "hospitality-hospital-blueprint",
    series: "Series 04",
    title: "Hospitality & Healthcare Framework",
    price: "$39",
    tagline:
      "Specialized positioning for hotels, resorts, tourist hotspots, and large hospital complexes.",
    description:
      "Focuses on guest amenity optimization and extended dwell durations. Models concession agreements with facility management and premium support tiers.",
    highlights: [
      "Guest amenity ROI calculations",
      "Extended dwell-time optimization",
      "Facility revenue-share models",
      "White-glove installation frameworks",
    ],
    featured: false,
  },
  {
    slug: "campus-retail-blueprint",
    series: "Series 05",
    title: "Campus & Retail Ecosystem",
    price: "$44",
    tagline:
      "Student union, university campus, and major shopping mall multi-station network blueprints.",
    description:
      "Created for multi-building ecosystems with student and shopper foot traffic patterns. Analyzes student demographic usage habits and seasonal volume dips.",
    highlights: [
      "Multi-building routing architecture",
      "Seasonal foot traffic adjustments",
      "Student union placement strategy",
      "Campus partnership agreements",
    ],
    featured: false,
  },
  {
    slug: "enterprise-bundle",
    series: "Series 06",
    title: "Complete Portfolio Bundle",
    price: "$79",
    tagline:
      "The ultimate business-planning collection combining all series and deployment architectures.",
    description:
      "For comprehensive strategic evaluation. Compare capital structures side-by-side with full access to sensitivity analysis, multi-tier station layouts, and risk mitigation profiles.",
    highlights: [
      "Includes all 5 core series blueprints",
      "Side-by-side capital structure models",
      "Advanced sensitivity & risk modeling",
      "Comprehensive 3-year financial outlook",
    ],
    featured: true, // Highlights the flagship bundle row visually
  },
];

export default function ProductsPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Smooth staggered entrance animation across the rows
      gsap.fromTo(
        gsap.utils.toArray(".blueprint-row"),
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rowsRef.current,
            start: "top 80%",
          },
        },
      );
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <main
      ref={sectionRef}
      className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32"
    >
      <div className="container-edit max-w-6xl mx-auto">
        {/* Editorial Header */}
        <header className="mb-20 md:mb-28 max-w-3xl">
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] mb-4 transition-colors duration-300">
            Power Portfolio Blueprints
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight transition-colors duration-300">
            Engineered for Precision Planning.
          </h1>
          <p className="font-body text-lg md:text-xl text-muted leading-relaxed transition-colors duration-300">
            Structured business-planning products detailing station layouts,
            financial pro formas, break-even timelines, and risk mitigation
            frameworks before capital deployment.
          </p>
        </header>

        {/* Multi-Row Editorial Layout */}
        <div ref={rowsRef} className="flex flex-col gap-8 md:gap-12">
          {blueprints.map((item) => (
            <Link
              href={`/products/${item.slug}`}
              key={item.slug}
              className={`blueprint-row invisible flex flex-col lg:flex-row items-stretch justify-between border line-rule bg-card rounded-3xl p-8 md:p-12 transition-colors duration-300 group ${
                item.featured
                  ? "lg:items-center bg-card/80 border-[#02d683]/40"
                  : ""
              }`}
            >
              {/* Left Column: Core Info */}
              <div className="lg:max-w-xl flex flex-col justify-between mb-8 lg:mb-0">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-body text-xs font-bold uppercase tracking-wider text-muted px-3 py-1 rounded-full border line-rule">
                      {item.series}
                    </span>
                    {item.featured && (
                      <span className="font-body text-xs font-bold uppercase tracking-wider text-[#02d683] px-3 py-1 rounded-full bg-[#02d683]/10">
                        Featured Model
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-3xl md:text-4xl mb-3 text-ink dark:text-white transition-colors duration-300 group-hover:text-[#02d683]">
                    {item.title}
                  </h3>
                  <p className="font-body text-base font-semibold text-ink/80 dark:text-gray-300 mb-4 transition-colors duration-300">
                    {item.tagline}
                  </p>
                  <p className="font-body text-sm md:text-base text-muted leading-relaxed transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Middle/Right Column: Highlights & Price Action */}
              <div className="lg:max-w-md flex flex-col justify-between lg:border-l lg:border-r line-rule lg:px-10 my-6 lg:my-0">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Key Scope Deliverables:
                </p>
                <ul className="space-y-2 mb-6">
                  {item.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-xs font-body text-muted"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#02d683]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Price and Action */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center pt-6 lg:pt-0 border-t lg:border-t-0 line-rule shrink-0">
                <span className="font-display font-bold text-3xl md:text-4xl text-ink dark:text-white mb-0 lg:mb-6 transition-colors duration-300">
                  {item.price}
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-body font-bold text-ink dark:text-white group-hover:text-[#02d683] transition-colors duration-300">
                  View Blueprint
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-20 border line-rule rounded-3xl p-8 md:p-12 bg-card text-center max-w-4xl mx-auto">
          <h4 className="font-display font-bold text-xl mb-3 text-ink dark:text-white">
            Informational Planning Products
          </h4>
          <p className="font-body text-sm text-muted leading-relaxed max-w-2xl mx-auto">
            Purchasing a blueprint provides structured operational and financial
            models for informational planning only. It does not constitute an
            investment, ownership interest, or profit-participation right in
            Greenpal Canada Ltd. or any specific station portfolio.
          </p>
        </div>
      </div>
    </main>
  );
}
