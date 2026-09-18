"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const features = [
  {
    title: "Fast Charging",
    desc: "Power designed for modern phones and on-the-go use.",
    icon: (
      <svg
        className="w-8 h-8 md:w-10 md:h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "Easy to Use",
    desc: "A simple scan-rent-return experience.",
    icon: (
      <svg
        className="w-8 h-8 md:w-10 md:h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM15 15h6m-3-3v6"
        />
      </svg>
    ),
  },
  {
    title: "Portable",
    desc: "Take the power bank with you instead of waiting beside an outlet.",
    icon: (
      <svg
        className="w-8 h-8 md:w-10 md:h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5zM3 8.25h15A2.25 2.25 0 0120.25 10.5v3c0 1.243-1.007 2.25-2.25 2.25H3A2.25 2.25 0 01.75 13.5v-3A2.25 2.25 0 013 8.25z"
        />
      </svg>
    ),
  },
  {
    title: "Convenient",
    desc: "Designed for high-dwell locations where people already spend time.",
    icon: (
      <svg
        className="w-8 h-8 md:w-10 md:h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
  },
  {
    title: "Responsible Use",
    desc: "Reusable shared power banks reduce the need for one-time emergency chargers.",
    icon: (
      <svg
        className="w-8 h-8 md:w-10 md:h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
  {
    title: "Built for Venues",
    desc: "Add a practical customer amenity with a digital self-service experience.",
    icon: (
      <svg
        className="w-8 h-8 md:w-10 md:h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
        />
      </svg>
    ),
  },
];

export default function WhyGreenpal() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.children || [],
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );

      gsap.fromTo(
        gsap.utils.toArray(".bento-card"),
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch { }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-32 bg-surface border-t line-rule overflow-hidden transition-colors duration-300"
    >
      <div className="container-edit">
        <div
          ref={headingRef}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          {/* FIXED: Stripped text-ink so the heading inverts correctly */}
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight max-w-xl transition-colors duration-300">
            Why Greenpal
          </h2>
          <p className="font-body text-xl md:text-2xl text-muted leading-relaxed max-w-md md:pb-2 transition-colors duration-300">
            Portable charging built around everyday life.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`bento-card invisible relative p-8 md:p-10 border line-rule bg-card overflow-hidden group rounded-2xl transition-colors duration-300 ${i === 0 || i === 1
                  ? "md:col-span-1 lg:col-span-2"
                  : "col-span-1"
                }`}
            >
              {/* Premium Vertical Sweep (Strictly using bg-ink) */}
              <div className="absolute inset-0 bg-ink scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-[600ms] ease-signature pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* FIXED: Stripped text-ink from the icon wrapper */}
                <div className="mb-12 md:mb-16 group-hover:text-[#02d683] transition-colors duration-[600ms]">
                  {feature.icon}
                </div>

                <div>
                  {/* FIXED: Stripped text-ink from the title */}
                  <h3 className="font-display font-bold text-2xl md:text-3xl mb-3 group-hover:text-[#02d683] transition-colors duration-[600ms]">
                    {feature.title}
                  </h3>

                  {/* FIXED: Enforced group-hover:text-white since the sweep is always dark */}
                  <p className="font-body text-muted group-hover:text-white group-hover:opacity-90 leading-relaxed transition-all duration-[600ms]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
