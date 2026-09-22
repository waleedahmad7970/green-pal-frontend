"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const steps = [
  {
    id: 1,
    subtitle: "STEP 1",
    title: "Scan",
    description: "Scan the QR code on a Greenpal station.",
    // Greenpal Image (GP Mini)
    image: "https://i.postimg.cc/gcB9LVMs/image-removebg-preview-(6).png",
  },
  {
    id: 2,
    subtitle: "STEP 2",
    title: "Rent",
    description:
      "Unlock a portable power bank and keep using your phone while you move.",
    // Greenpal Image (GP 10)
    image: "https://i.postimg.cc/L6rrNHKb/image-removebg-preview-(5).png",
  },
  {
    id: 3,
    subtitle: "STEP 3",
    title: "Return",
    description:
      "Return the power bank to a compatible Greenpal station when you're done.",
    // Greenpal Image (GP Tower)
    image: "https://i.postimg.cc/qBFYvkRj/image-removebg-preview-(1).png",
  },
];

const AUTO_PLAY_DURATION = 7; // Seconds per step

export default function HowItWorksAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const isManuallyClicked = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (progressTween.current) progressTween.current.kill();

      gsap.set(".accordion-progress", { scaleX: 0, scaleY: 0 });

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // DESKTOP: Vertical progress bar filling from top to bottom
        gsap.set(`.progress-${activeIndex}`, {
          scaleX: 1,
          scaleY: 0,
          transformOrigin: "top center",
        });
        progressTween.current = gsap.to(`.progress-${activeIndex}`, {
          scaleY: 1,
          duration: AUTO_PLAY_DURATION,
          ease: "none",
          onComplete: () => setActiveIndex((prev) => (prev + 1) % steps.length),
        });
      });

      mm.add("(max-width: 767px)", () => {
        // MOBILE: Horizontal progress bar filling from left to right
        gsap.set(`.progress-${activeIndex}`, {
          scaleY: 1,
          scaleX: 0,
          transformOrigin: "left center",
        });
        progressTween.current = gsap.to(`.progress-${activeIndex}`, {
          scaleX: 1,
          duration: AUTO_PLAY_DURATION,
          ease: "none",
          onComplete: () => setActiveIndex((prev) => (prev + 1) % steps.length),
        });
      });

      if (isManuallyClicked.current) {
        progressTween.current?.restart();
        isManuallyClicked.current = false;
      }
    });

    return () => ctx.revert();
  }, [activeIndex]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    isManuallyClicked.current = true;
    setActiveIndex(index);
  };

  return (
    <section className="relative py-10 md:py-14 bg-surface overflow-hidden">
      <div className="container-edit">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-display font-bold text-5xl md:text-6xl mb-3 tracking-tight text-ink">
            How It Works
          </h2>
          <p className="text-muted font-body text-xl md:text-2xl">
            Stay powered up while on the go.
          </p>
        </div>

        {/* Expanding Accordion Container */}
        <div className="flex flex-col md:flex-row w-full h-[700px] md:h-[600px] gap-4 md:gap-6">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;

            return (
              <div
                key={step.id}
                onClick={() => handleTabClick(i)}
                className={`group relative overflow-hidden rounded-[2rem] border line-rule transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer
                                    ${
                                      isActive
                                        ? "flex-[4] md:flex-[5] bg-surface shadow-2xl"
                                        : "flex-[0.8] md:flex-[0.7] bg-ink/5 hover:bg-ink/10 shadow-sm"
                                    }`}
              >
                {/* 
                                  --- 1. THE TAB (Always Visible) ---
                                */}
                <div className="absolute top-0 left-0 w-full md:w-20 h-[72px] md:h-full border-b md:border-b-0 md:border-r line-rule bg-surface z-20 flex flex-row md:flex-col items-center justify-between p-5 md:py-8">
                  {/* Tab Header (Number + Title for Mobile) */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-display text-xl md:text-2xl font-bold transition-colors duration-500 ${isActive ? "text-signal" : "text-muted group-hover:text-ink"}`}
                    >
                      0{step.id}
                    </span>
                    {/* Mobile Only: Show the title next to the number so it doesn't look empty */}
                    <span
                      className={`md:hidden font-display text-lg font-bold transition-colors duration-500 ${isActive ? "text-ink" : "text-muted group-hover:text-ink"}`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {/* GSAP Progress Track */}
                  <div className="relative flex-1 w-full md:w-1 h-1 md:h-full ml-4 md:ml-0 md:mt-6 bg-ink/10 rounded-full overflow-hidden">
                    <div
                      className={`accordion-progress progress-${i} absolute top-0 left-0 w-full h-full bg-signal rounded-full`}
                    />
                  </div>
                </div>

                {/* 
                                  --- 2. THE EXPANDED CONTENT ---
                                */}
                <div
                  className={`absolute inset-0 pt-[72px] md:pt-0 md:pl-20 flex flex-col md:flex-row w-full md:w-[1000px] transition-opacity duration-500 z-10
                                    ${isActive ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"}
                                `}
                >
                  {/* Left Side: Solid Text Card */}
                  <div className="w-full md:w-[320px] shrink-0 p-6 md:p-12 flex flex-col justify-center bg-surface h-[45%] md:h-full border-b md:border-b-0 md:border-r line-rule">
                    {/* Hide subtitle and title on mobile since it's already in the tab header now */}
                    <div className="hidden md:block">
                      <span className="text-signal font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">
                        {step.subtitle}
                      </span>
                      <h3 className="text-ink font-display text-4xl md:text-5xl font-extrabold mb-6 leading-[1.05] tracking-tight pr-4">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-muted font-body text-base md:text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Right Side: Product Image */}
                  <div className="flex-1 w-full h-[55%] md:h-full relative flex items-center justify-center bg-[#f9f9f6] dark:bg-ink">
                    <img
                      src={step.image}
                      alt={step.title}
                      // Changed to object-contain and added padding so your transparent PNGs look like product showcases
                      className={`absolute inset-0 w-full h-full object-contain p-8 md:p-12 drop-shadow-2xl transition-transform duration-[1200ms] ease-out ${isActive ? "scale-100" : "scale-110"}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
