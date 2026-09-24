

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { plans } from "@/data/plans/plans";
import apiClient from "@/lib/apiClient";

const planImages = [
  "https://i.postimg.cc/RFV24K7Q/image.png",
  "https://i.postimg.cc/d0Hc75tj/image.png",
  "https://i.postimg.cc/zfN9293j/image.png",
  "https://i.postimg.cc/gchHrrgD/image.png",
  "https://i.postimg.cc/766tpD41/image.png",
];

export default function InvestmentPlansPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSeries, setActiveSeries] = useState("All");

  const seriesList = useMemo(() => {
    const series = plans.map((p: any) => p.series).filter(Boolean);
    return ["All", ...Array.from(new Set(series))];
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan: any) => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeries =
        activeSeries === "All" || plan.series === activeSeries;

      return matchesSearch && matchesSeries;
    });
  }, [searchTerm, activeSeries]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (filteredPlans.length > 0) {
        gsap.fromTo(
          gsap.utils.toArray(".plan-card"),
          { autoAlpha: 0, y: 35 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
            },
          },
        );
      }
    }, gridRef);

    return () => {
      ctx.revert();
    };
  }, [filteredPlans]);

  const handleBuy = async ({ productId }: { productId: string }) => {
    try {
      const response: any = await apiClient.post("/payments/checkout", {
        productId: productId,
        quantity: 1
      });


      console.log("response", response)

      const redirectUrl = response.data?.data?.url || response?.url;

      // This is the line that physically teleports the browser to Stripe
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("Could not find checkout URL in response", response);
      }
    } catch (error) {
      console.error("Checkout failed", error);
    }
  }

  return (
    <main
      ref={sectionRef}
      className="min-h-screen bg-surface transition-colors duration-300 pt-32 md:pt-40 pb-36"
    >
      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        <header className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#02d683]/10 border border-[#02d683]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#02d683] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#02d683]">
              Verified Digital Blueprints
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
            Investment Blueprints.
          </h1>
          <p className="font-body text-lg md:text-xl text-muted leading-relaxed">
            Explore institutional-grade business plans, financial projections,
            and multi-location deployment strategies.
          </p>
        </header>

        {/* --- Search & Series Filter Section --- */}
        <div className="mb-14 space-y-6">
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by plan title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-card border line-rule font-body focus:outline-none focus:border-[#02d683] transition-colors shadow-sm text-sm"
            />
          </div>

          {/* Series Filter Tabs */}
          <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {seriesList?.map((seriesName: string) => (
              <button
                key={seriesName}
                onClick={() => setActiveSeries(seriesName)}
                className={`shrink-0 px-6 py-2.5 rounded-full font-body text-sm font-bold transition-all ${activeSeries === seriesName
                  ? "bg-[#02d683] text-ink border-[#02d683] shadow-lg shadow-[#02d683]/20"
                  : "bg-card border line-rule text-muted hover:border-[#02d683]"
                  }`}
              >
                {seriesName === "All"
                  ? "All Series"
                  : seriesName.replace("GREENPAL ", "")}
              </button>
            ))}
          </div>
        </div>

        {/* --- Card Grid Matching Reference Layout --- */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-20"
        >
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan: any, i: number) => {
              const thumbnail = planImages[i % planImages.length];
              const isCoInvest = plan.series.includes("CO-INVEST");

              // Format station setup items from useOfFunds if available
              const stationSetupText =
                plan.useOfFunds?.items
                  ?.map((item: any) => item.item)
                  .join(" + ") || plan.subtitle;

              return (
                <div
                  key={plan.id}
                  className="plan-card invisible flex flex-col justify-between border line-rule bg-card rounded-2xl overflow-hidden transition-all duration-300 group hover:border-[#02d683] hover:-translate-y-1.5 hover:shadow-2xl shadow-black/5 relative p-3 md:p-4"
                >
                  <div>
                    {/* Top Cover Image Box with Badges */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl bg-surface border line-rule overflow-hidden mb-6 flex items-center justify-center">
                      <img
                        src={thumbnail}
                        alt={plan.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />

                      {/* Series Badge (Top Left) */}
                      {/* <div className="absolute top-3 left-3 bg-ink/90 backdrop-blur-md px-3 py-1 rounded-full border border-signal/20">
                        <span className="text-[10px] text-[#02d683] font-mono uppercase tracking-widest font-bold">
                          {isCoInvest
                            ? "CO-INVESTMENT SERIES"
                            : "OWNERSHIP SERIES"}
                        </span>
                      </div> */}

                      {/* PDF Guide Pill (Top Right) */}
                      <div className="absolute top-3 right-3 bg-[#02d683] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-[10px] font-mono font-bold text-white uppercase">
                          PDF GUIDE
                        </span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-6">
                      <h3 className="font-display font-bold text-2xl md:text-3xl group-hover:text-[#02d683] transition-colors mb-2 tracking-tight">
                        {plan.title}
                      </h3>
                      <p className="font-body text-xs md:text-sm text-muted leading-relaxed">
                        {plan.subtitle}
                      </p>
                    </div>

                    {/* Station Setup Box */}
                    {/* <div className="mb-6 p-4 rounded-2xl bg-surface border line-rule">
                      <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-1">
                        Station Setup
                      </p>
                      <p className="font-display font-bold text-sm text-foreground">
                        {stationSetupText}
                      </p>
                    </div> */}

                    {/* What's Inside Section */}
                    <div className="mb-8">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
                        What&apos;s Inside
                      </p>
                      <ul className="space-y-2.5 text-xs text-muted font-body">
                        <li className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-[#02d683]/10 text-[#02d683] flex items-center justify-center font-bold text-[10px] shrink-0">
                            ✓
                          </span>
                          <span>Startup cost breakdown</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-[#02d683]/10 text-[#02d683] flex items-center justify-center font-bold text-[10px] shrink-0">
                            ✓
                          </span>
                          <span>Revenue-sharing & profit model</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-[#02d683]/10 text-[#02d683] flex items-center justify-center font-bold text-[10px] shrink-0">
                            ✓
                          </span>
                          <span>
                            Financial projections & sensitivity analysis
                          </span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-[#02d683]/10 text-[#02d683] flex items-center justify-center font-bold text-[10px] shrink-0">
                            ✓
                          </span>
                          <span>Step-by-step 90-day launch checklist</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pricing & Buy Business Plan Footer */}
                  <div className=" border-t line-rule mt-auto">
                    <div className="flex items-baseline justify-between mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display font-extrabold text-2xl md:text-3xl text-foreground">
                          $19.99
                        </span>
                        <span className="text-xs font-mono text-muted uppercase tracking-wider">
                          / PDF
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-muted">
                          One-time purchase
                        </p>
                        <p className="text-[10px] font-mono text-[#02d683] font-semibold">
                          Instant download
                        </p>
                      </div>
                    </div>

                    {/* <Link
                      href={`/contact?plan=${plan.id}`}
                      className="block w-full"
                    > */}
                    <button
                      onClick={() => handleBuy({ productId: "6ab2ec76684db1741948d279" })}

                      className="w-full relative overflow-hidden py-4 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group/btn shadow-md hover:bg-[#02bc73]">
                      <span>Buy Business Plan</span>
                      <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                        →
                      </span>
                    </button>
                    {/* </Link> */}

                    <p className="text-[10px] text-center text-muted font-body mt-3">
                      Digital business plan only. Machines sold separately.
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-card rounded-3xl border line-rule">
              <h3 className="font-display text-2xl mb-2">
                No matching blueprints found
              </h3>
              <p className="font-body text-muted text-sm">
                Try modifying your search query or filter selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </main >
  );
}
