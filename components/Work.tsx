"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { work } from "@/data/content";
import { IconAirport, IconRetail, IconTransit, IconVenue } from "./Icons";
import Image from "next/image";

const iconMap: Record<string, typeof IconAirport> = {
  airport: IconAirport,
  retail: IconRetail,
  transit: IconTransit,
  venue: IconVenue,
};

const treatments = [
  {
    bg: "bg-ink",
    fg: "text-signal",
    sub: "text-sand/60",
    border: "border-signal/20",
  },
  {
    bg: "bg-[#02D683]",
    fg: "text-ink",
    sub: "text-ink/70",
    border: "border-ink/20",
  },
  {
    bg: "bg-surface-dim",
    fg: "text-graphite",
    sub: "text-muted",
    border: "border-graphite/20",
  },
  {
    bg: "bg-ink",
    fg: "text-signal",
    sub: "text-sand/60",
    border: "border-signal/20",
  },
];

const cardImages = [
  "https://i.postimg.cc/RFV24K7Q/image.png",
  "https://i.postimg.cc/d0Hc75tj/image.png",
  "https://i.postimg.cc/zfN9293j/image.png",
  "https://i.postimg.cc/gchHrrgD/image.png",
  "https://i.postimg.cc/766tpD41/image.png",
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Smooth Pointer Drag States
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollerRef.current!.offsetLeft;
    scrollLeft.current = scrollerRef.current!.scrollLeft;

    // Capture pointer for flawless, stutter-free tracking
    scrollerRef.current?.setPointerCapture(e.pointerId);
    if (scrollerRef.current) {
      scrollerRef.current.style.scrollSnapType = "none";
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // Optimized drag coefficient
    scrollerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      scrollerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Catch if pointer capture was already released
    }
    if (scrollerRef.current) {
      scrollerRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-heading",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: (i % 3) * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 92%" },
          },
        );
      });
    }, sectionRef);
    return () => {
      try {
        ctx.revert();
      } catch {
        // DOM already torn down
      }
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-28 md:py-40 bg-surface select-none overflow-hidden"
    >
      <div className="container-edit mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 className="work-heading invisible font-display font-bold text-display-lg max-w-xl">
          Deployed and running.
        </h2>
        <p className="work-heading invisible text-muted font-body max-w-xs">
          Drag or scroll — a sample of live deployments.
        </p>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="no-scrollbar flex gap-6 md:gap-8 overflow-x-auto pl-[clamp(1.25rem,5vw,5rem)] pr-[clamp(1.25rem,5vw,5rem)] pb-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {work.map((w, i) => {
          const Icon = iconMap[w.icon] || iconMap.retail;
          const t = treatments[i % treatments.length];
          const imageSrc = cardImages[i % cardImages.length];

          return (
            <div
              key={w.title}
              className="work-card invisible snap-start shrink-0 w-[85vw] sm:w-[65vw] lg:w-[35vw] flex flex-col group rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 hover:-translate-y-1"
            >
              {/* Image Frame with Smooth Scale Effect */}
              <div className="relative border border-b-0 line-rule p-1 bg-surface-dim overflow-hidden rounded-t-2xl">
                <Image
                  alt={w.title || "Project Image"}
                  width={800}
                  height={450}
                  src={imageSrc}
                  draggable={false}
                  className="w-full h-auto aspect-video object-cover rounded-xl opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none"
                />

                {/* Live System Badge */}
                <div className="absolute top-5 right-5 bg-ink/90 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-signal/20 shadow-2xl">
                  <span className="w-2 h-2 rounded-full bg-[#02D683] animate-pulse shadow-[0_0_10px_#02D683]"></span>
                  <span className="text-[10px] text-signal font-mono uppercase tracking-widest leading-none mt-0.5">
                    Live
                  </span>
                </div>
              </div>

              {/* Data Segment & Micro-Interaction Footer */}
              <div
                className={`p-7 md:p-8 rounded-b-2xl flex flex-col justify-between grow border ${t.border} ${t.bg} ${t.fg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-widest opacity-80 flex items-center gap-2">
                      <Icon className="w-4 h-4 opacity-70" />
                      {w.place}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">
                      SYS_0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold mb-3 tracking-tight">
                    {w.title}
                  </h3>
                  <p
                    className={`font-body text-sm leading-relaxed ${t.sub} mb-6`}
                  >
                    {w.copy}
                  </p>
                </div>

                {/* Interactive Action Link with Sliding Arrow */}
                <div className="pt-4 border-t border-current/10 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-70">
                    View System Specs
                  </span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 font-bold text-lg">
                    →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="container-edit mt-10">
        <div className="hairline relative overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-signal transition-[width] duration-150 rounded-full"
            style={{ width: `${Math.max(progress * 100, 6)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
