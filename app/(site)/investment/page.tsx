// // // "use client";

// // // import { useEffect, useRef, useState, useMemo } from "react";
// // // import Link from "next/link";
// // // import gsap from "gsap";
// // // import { ScrollTrigger } from "gsap/ScrollTrigger";
// // // import { plans } from "@/data/plans/plans";

// // // export default function InvestmentPlansPage() {
// // //   const sectionRef = useRef<HTMLElement>(null);
// // //   const gridRef = useRef<HTMLDivElement>(null);

// // //   // State for Search and Series Filter
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [activeSeries, setActiveSeries] = useState("All");

// // //   // Dynamically get unique series for filter buttons
// // //   const seriesList = useMemo(() => {
// // //     const series = plans.map((p: any) => p.series).filter(Boolean);
// // //     return ["All", ...Array.from(new Set(series))];
// // //   }, []);

// // //   // Filter plans based on search input and series selection
// // //   const filteredPlans = useMemo(() => {
// // //     return plans.filter((plan: any) => {
// // //       const matchesSearch =
// // //         plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         plan.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
// // //       const matchesSeries =
// // //         activeSeries === "All" || plan.series === activeSeries;

// // //       return matchesSearch && matchesSeries;
// // //     });
// // //   }, [searchTerm, activeSeries]);

// // //   // GSAP Entrance Animation
// // //   useEffect(() => {
// // //     gsap.registerPlugin(ScrollTrigger);

// // //     const ctx = gsap.context(() => {
// // //       if (filteredPlans.length > 0) {
// // //         gsap.fromTo(
// // //           gsap.utils.toArray(".plan-card"),
// // //           { autoAlpha: 0, y: 30 },
// // //           {
// // //             autoAlpha: 1,
// // //             y: 0,
// // //             duration: 0.5,
// // //             stagger: 0.05,
// // //             ease: "power2.out",
// // //             overwrite: "auto",
// // //             scrollTrigger: {
// // //               trigger: gridRef.current,
// // //               start: "top 85%",
// // //             },
// // //           },
// // //         );
// // //       }
// // //     }, gridRef);

// // //     return () => {
// // //       ctx.revert();
// // //     };
// // //   }, [filteredPlans]);

// // //   return (
// // //     <main
// // //       ref={sectionRef}
// // //       className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32"
// // //     >
// // //       <div className="container-edit max-w-7xl mx-auto px-6">
// // //         <header className="mb-16 max-w-3xl">
// // //           <p className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] mb-4 transition-colors duration-300">
// // //             Greenpal Power Portfolio
// // //           </p>
// // //           <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight transition-colors duration-300">
// // //             Investment Blueprints.
// // //           </h1>
// // //           <p className="font-body text-lg md:text-xl text-muted leading-relaxed transition-colors duration-300">
// // //             Explore our co-investment and ownership portfolio series, complete
// // //             with modeled economics, capital breakdowns, and projected returns.
// // //           </p>
// // //         </header>

// // //         {/* --- Search & Series Filter Section --- */}
// // //         <div className="mb-12 space-y-6">
// // //           <div className="relative max-w-xl">
// // //             <svg
// // //               className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
// // //               fill="none"
// // //               viewBox="0 0 24 24"
// // //               stroke="currentColor"
// // //               strokeWidth={2}
// // //             >
// // //               <path
// // //                 strokeLinecap="round"
// // //                 strokeLinejoin="round"
// // //                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// // //               />
// // //             </svg>
// // //             <input
// // //               type="text"
// // //               placeholder="Search by blueprint title or station structure..."
// // //               value={searchTerm}
// // //               onChange={(e) => setSearchTerm(e.target.value)}
// // //               className="w-full pl-12 pr-6 py-4 rounded-full bg-card border line-rule font-body focus:outline-none focus:border-[#02d683] transition-colors shadow-sm"
// // //             />
// // //           </div>

// // //           {/* Series Filter Pills */}
// // //           <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
// // //             {seriesList?.map((seriesName: string) => (
// // //               <button
// // //                 key={seriesName}
// // //                 onClick={() => setActiveSeries(seriesName)}
// // //                 className={`shrink-0 px-6 py-2.5 rounded-full font-body text-sm font-bold transition-all ${
// // //                   activeSeries === seriesName
// // //                     ? "bg-[#02d683] text-ink border-[#02d683] shadow-lg shadow-[#02d683]/20"
// // //                     : "bg-card border line-rule text-muted hover:border-[#02d683]"
// // //                 }`}
// // //               >
// // //                 {seriesName === "All"
// // //                   ? "All Series"
// // //                   : seriesName.replace("GREENPAL ", "")}
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* --- Plans Grid --- */}
// // //         <div
// // //           ref={gridRef}
// // //           className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
// // //         >
// // //           {filteredPlans.length > 0 ? (
// // //             filteredPlans.map((plan: any) => {
// // //               const primaryMetric =
// // //                 plan.metrics.yourContribution || plan.metrics.yourInvestment;
// // //               const monthlyMetric = plan.metrics.investorPerMonth;
// // //               const paybackMetric = plan.metrics.payback;
// // //               const totalPortfolioMetric = plan.metrics.totalPortfolio;

// // //               return (
// // //                 <div
// // //                   key={plan.id}
// // //                   className="plan-card invisible flex flex-col justify-between border line-rule bg-card rounded-3xl p-8 md:p-10 transition-all duration-300 group hover:border-[#02d683] hover:-translate-y-1.5 hover:shadow-2xl shadow-black/5 relative overflow-hidden"
// // //                 >
// // //                   {/* Top glowing ambient accent on hover */}
// // //                   <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#02d683]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

// // //                   <div>
// // //                     {/* Series Tag & Portfolio Tag */}
// // //                     <div className="flex items-center justify-between gap-2 mb-4">
// // //                       <span className="text-[11px] font-mono uppercase tracking-widest text-[#02d683] bg-[#02d683]/10 border border-[#02d683]/20 px-3.5 py-1 rounded-full font-semibold">
// // //                         {plan.series.replace("GREENPAL ", "")}
// // //                       </span>
// // //                       <span className="text-[10px] font-mono text-muted tracking-wider uppercase">
// // //                         {plan.portfolioTag}
// // //                       </span>
// // //                     </div>

// // //                     <h3 className="font-display font-bold text-2xl md:text-3xl group-hover:text-[#02d683] transition-colors mb-2 tracking-tight">
// // //                       {plan.title}
// // //                     </h3>
// // //                     <p className="font-body text-xs md:text-sm text-muted mb-6 leading-relaxed bg-surface/50 p-3.5 rounded-xl border line-rule">
// // //                       {plan.subtitle}
// // //                     </p>

// // //                     {/* Key Metrics Dashboard Grid */}
// // //                     <div className="grid grid-cols-2 gap-3.5 p-5 rounded-2xl bg-surface border line-rule mb-6 shadow-inner">
// // //                       <div>
// // //                         <p className="text-[10px] font-mono uppercase text-muted tracking-wider mb-1">
// // //                           {primaryMetric?.label || "Investment"}
// // //                         </p>
// // //                         <p className="font-display font-extrabold text-xl md:text-2xl text-foreground">
// // //                           {primaryMetric?.value}
// // //                         </p>
// // //                         <span className="text-[10px] text-muted">
// // //                           {primaryMetric?.subtext}
// // //                         </span>
// // //                       </div>
// // //                       <div>
// // //                         <p className="text-[10px] font-mono uppercase text-muted tracking-wider mb-1">
// // //                           {monthlyMetric?.label || "Monthly Return"}
// // //                         </p>
// // //                         <p className="font-display font-extrabold text-xl md:text-2xl text-[#02d683]">
// // //                           {monthlyMetric?.value}
// // //                         </p>
// // //                         <span className="text-[10px] text-muted">
// // //                           {monthlyMetric?.subtext}
// // //                         </span>
// // //                       </div>

// // //                       {totalPortfolioMetric && (
// // //                         <div>
// // //                           <p className="text-[10px] font-mono uppercase text-muted tracking-wider mb-1">
// // //                             {totalPortfolioMetric.label}
// // //                           </p>
// // //                           <p className="font-display font-bold text-lg text-foreground">
// // //                             {totalPortfolioMetric.value}
// // //                           </p>
// // //                           <span className="text-[10px] text-muted">
// // //                             {totalPortfolioMetric.subtext}
// // //                           </span>
// // //                         </div>
// // //                       )}

// // //                       <div
// // //                         className={`${totalPortfolioMetric ? "" : "col-span-2"} pt-3 border-t line-rule flex justify-between items-center`}
// // //                       >
// // //                         <span className="text-[10px] font-mono uppercase text-muted tracking-wider">
// // //                           {paybackMetric?.label || "Payback"}
// // //                         </span>
// // //                         <span className="font-display font-bold text-sm text-foreground">
// // //                           {paybackMetric?.value}{" "}
// // //                           <span className="text-muted font-normal text-xs">
// // //                             ({paybackMetric?.subtext})
// // //                           </span>
// // //                         </span>
// // //                       </div>
// // //                     </div>

// // //                     {/* What You Get Highlights */}
// // //                     {plan.whatYouGetInThisBlueprint && (
// // //                       <div className="mb-6 space-y-2">
// // //                         <p className="text-[10px] font-mono uppercase tracking-widest text-muted">
// // //                           Blueprint Inclusions:
// // //                         </p>
// // //                         <ul className="space-y-1.5 text-xs text-muted font-body">
// // //                           {plan.whatYouGetInThisBlueprint.map(
// // //                             (item: string, idx: number) => (
// // //                               <li key={idx} className="flex items-start gap-2">
// // //                                 <span className="text-[#02d683] font-bold mt-0.5">
// // //                                   ✓
// // //                                 </span>
// // //                                 <span className="leading-snug">{item}</span>
// // //                               </li>
// // //                             ),
// // //                           )}
// // //                         </ul>
// // //                       </div>
// // //                     )}
// // //                   </div>

// // //                   {/* Actions & Buy Now Button */}
// // //                   <div className="pt-6 border-t line-rule flex items-center justify-between gap-4 mt-auto">
// // //                     <div>
// // //                       <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
// // //                         Verified Spec
// // //                       </span>
// // //                       <span className="text-xs font-body font-medium text-foreground">
// // //                         Instant Delivery
// // //                       </span>
// // //                     </div>

// // //                     <Link
// // //                       href={`/contact?plan=${plan.id}`}
// // //                       className="inline-block"
// // //                     >
// // //                       <button className="relative overflow-hidden px-7 py-3 rounded-full border line-rule bg-surface group/btn transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm">
// // //                         <div className="absolute inset-0 bg-[#02d683] scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-signature rounded-full origin-center" />
// // //                         <span className="relative z-10 font-bold text-xs md:text-sm transition-colors duration-300 group-hover/btn:text-ink">
// // //                           Buy Now
// // //                         </span>
// // //                         <span className="relative z-10 text-xs transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-ink">
// // //                           →
// // //                         </span>
// // //                       </button>
// // //                     </Link>
// // //                   </div>
// // //                 </div>
// // //               );
// // //             })
// // //           ) : (
// // //             <div className="col-span-full py-20 text-center">
// // //               <h3 className="font-display text-2xl mb-2">
// // //                 No blueprints found
// // //               </h3>
// // //               <p className="font-body text-muted">
// // //                 Try adjusting your search criteria or series filter.
// // //               </p>
// // //             </div>
// // //           )}
// // //         </div>

// // //         <div className="mt-20 border line-rule rounded-3xl p-8 md:p-12 bg-card text-center max-w-4xl mx-auto shadow-sm">
// // //           <h4 className="font-display font-bold text-xl mb-3">
// // //             Business Planning & Due Diligence Disclaimer
// // //           </h4>
// // //           <p className="font-body text-sm text-muted leading-relaxed max-w-2xl mx-auto">
// // //             Purchasing a blueprint provides complete financial models, capital
// // //             breakdowns, and launch frameworks. Review all terms, sensitivity
// // //             scenarios, and participation structures prior to funding execution.
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </main>
// // //   );
// // // }
// // "use client";

// // import { useEffect, useRef, useState, useMemo } from "react";
// // import Link from "next/link";
// // import gsap from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";
// // import { plans } from "@/data/plans/plans";

// // const planImages = [
// //   "https://i.postimg.cc/RFV24K7Q/image.png",
// //   "https://i.postimg.cc/d0Hc75tj/image.png",
// //   "https://i.postimg.cc/zfN9293j/image.png",
// //   "https://i.postimg.cc/gchHrrgD/image.png",
// //   "https://i.postimg.cc/766tpD41/image.png",
// // ];

// // export default function InvestmentPlansPage() {
// //   const sectionRef = useRef<HTMLElement>(null);
// //   const gridRef = useRef<HTMLDivElement>(null);

// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [activeSeries, setActiveSeries] = useState("All");

// //   const seriesList = useMemo(() => {
// //     const series = plans.map((p: any) => p.series).filter(Boolean);
// //     return ["All", ...Array.from(new Set(series))];
// //   }, []);

// //   const filteredPlans = useMemo(() => {
// //     return plans.filter((plan: any) => {
// //       const matchesSearch =
// //         plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         plan.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
// //       const matchesSeries =
// //         activeSeries === "All" || plan.series === activeSeries;

// //       return matchesSearch && matchesSeries;
// //     });
// //   }, [searchTerm, activeSeries]);

// //   useEffect(() => {
// //     gsap.registerPlugin(ScrollTrigger);

// //     const ctx = gsap.context(() => {
// //       if (filteredPlans.length > 0) {
// //         gsap.fromTo(
// //           gsap.utils.toArray(".plan-card"),
// //           { autoAlpha: 0, y: 40 },
// //           {
// //             autoAlpha: 1,
// //             y: 0,
// //             duration: 0.6,
// //             stagger: 0.08,
// //             ease: "power3.out",
// //             overwrite: "auto",
// //             scrollTrigger: {
// //               trigger: gridRef.current,
// //               start: "top 85%",
// //             },
// //           },
// //         );
// //       }
// //     }, gridRef);

// //     return () => {
// //       ctx.revert();
// //     };
// //   }, [filteredPlans]);

// //   return (
// //     <main
// //       ref={sectionRef}
// //       className="min-h-screen bg-surface transition-colors duration-300 pt-32 md:pt-40 pb-36 relative overflow-hidden"
// //     >
// //       {/* Background Decorative Glow */}
// //       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#02d683]/5 blur-[140px] pointer-events-none rounded-full" />

// //       <div className="container-edit max-w-7xl mx-auto px-6 relative z-10">
// //         <header className="mb-16 max-w-3xl">
// //           <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#02d683]/10 border border-[#02d683]/20 mb-6">
// //             <span className="w-2 h-2 rounded-full bg-[#02d683] animate-pulse shadow-[0_0_10px_#02d683]" />
// //             <span className="text-[11px] font-mono uppercase tracking-widest text-[#02d683]">
// //               Verified Institutional Portfolios
// //             </span>
// //           </div>
// //           <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
// //             Investment Blueprints.
// //           </h1>
// //           <p className="font-body text-lg md:text-xl text-muted leading-relaxed">
// //             Deploy capital into high-yield shared charging infrastructure.
// //             Complete with forensic economics, capital recovery timelines, and
// //             guaranteed operational profit-sharing.
// //           </p>
// //         </header>

// //         {/* --- Search & Filter Bar --- */}
// //         <div className="mb-14 space-y-6">
// //           <div className="relative max-w-xl">
// //             <svg
// //               className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //               strokeWidth={2}
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// //               />
// //             </svg>
// //             <input
// //               type="text"
// //               placeholder="Search by blueprint title or infrastructure model..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="w-full pl-13 pr-6 py-4 rounded-2xl bg-card border line-rule font-body focus:outline-none focus:border-[#02d683] transition-all shadow-sm text-sm"
// //             />
// //           </div>

// //           {/* Series Pills */}
// //           <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
// //             {seriesList?.map((seriesName: string) => (
// //               <button
// //                 key={seriesName}
// //                 onClick={() => setActiveSeries(seriesName)}
// //                 className={`shrink-0 px-6 py-2.5 rounded-full font-body text-xs md:text-sm font-bold transition-all duration-300 ${
// //                   activeSeries === seriesName
// //                     ? "bg-[#02d683] text-ink border-[#02d683] shadow-lg shadow-[#02d683]/25 scale-105"
// //                     : "bg-card border line-rule text-muted hover:border-[#02d683]/60 hover:text-foreground"
// //                 }`}
// //               >
// //                 {seriesName === "All"
// //                   ? "All Portfolio Series"
// //                   : seriesName.replace("GREENPAL ", "")}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* --- WOW Investment Card Grid --- */}
// //         <div
// //           ref={gridRef}
// //           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20"
// //         >
// //           {filteredPlans.length > 0 ? (
// //             filteredPlans.map((plan: any, i: number) => {
// //               const primaryMetric =
// //                 plan.metrics.yourContribution || plan.metrics.yourInvestment;
// //               const monthlyMetric = plan.metrics.investorPerMonth;
// //               const paybackMetric = plan.metrics.payback;
// //               const thumbnail = planImages[i % planImages.length];
// //               const isCoInvest = plan.series.includes("CO-INVEST");

// //               return (
// //                 <div
// //                   key={plan.id}
// //                   className="plan-card invisible flex flex-col justify-between border line-rule bg-card rounded-[2rem] overflow-hidden transition-all duration-500 group hover:border-[#02d683]/60 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(2,214,131,0.12)] relative"
// //                 >
// //                   {/* Top Neon Ambient Sweep on Hover */}
// //                   <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#02d683] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

// //                   {/* Thumbnail / Visual Header */}
// //                   <div className="relative aspect-[16/10] w-full bg-surface border-b line-rule p-5 flex items-center justify-center overflow-hidden">
// //                     <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent z-10 opacity-60" />
// //                     <img
// //                       src={thumbnail}
// //                       alt={plan.title}
// //                       className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
// //                     />

// //                     {/* Floating Series Badge */}
// //                     <div className="absolute top-4 left-4 z-20 bg-ink/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#02d683]/30 shadow-lg">
// //                       <span className="text-[10px] text-[#02d683] font-mono uppercase tracking-widest font-bold">
// //                         {isCoInvest ? "Co-Invest (50/50)" : "100% Ownership"}
// //                       </span>
// //                     </div>

// //                     {/* Quick ROI Pill */}
// //                     <div className="absolute top-4 right-4 z-20 bg-[#02d683] text-ink font-mono text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
// //                       {paybackMetric?.value} Payback
// //                     </div>
// //                   </div>

// //                   {/* Body Content */}
// //                   <div className="flex flex-col flex-grow p-7 md:p-8">
// //                     <div>
// //                       <span className="text-[10px] font-mono text-muted tracking-wider uppercase block mb-2">
// //                         {plan.portfolioTag}
// //                       </span>
// //                       <h3 className="font-display font-bold text-2xl group-hover:text-[#02d683] transition-colors mb-2.5 leading-snug">
// //                         {plan.title}
// //                       </h3>
// //                       <p className="font-body text-xs text-muted mb-6 leading-relaxed line-clamp-2">
// //                         {plan.subtitle}
// //                       </p>

// //                       {/* Financial Metrics Pod (Glassmorphism Style) */}
// //                       <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-surface/80 backdrop-blur-sm border line-rule mb-8 shadow-inner">
// //                         <div className="p-2 rounded-xl bg-card/50 border line-rule">
// //                           <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-1">
// //                             {primaryMetric?.label || "Capital"}
// //                           </p>
// //                           <p className="font-display font-extrabold text-lg text-foreground">
// //                             {primaryMetric?.value}
// //                           </p>
// //                           <span className="text-[9px] text-[#02d683] font-medium">
// //                             {primaryMetric?.subtext}
// //                           </span>
// //                         </div>
// //                         <div className="p-2 rounded-xl bg-card/50 border line-rule">
// //                           <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-1">
// //                             {monthlyMetric?.label || "Monthly Return"}
// //                           </p>
// //                           <p className="font-display font-extrabold text-lg text-[#02d683]">
// //                             {monthlyMetric?.value}
// //                           </p>
// //                           <span className="text-[9px] text-muted">
// //                             Projected
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Card Footer / Buy Now Action */}
// //                     <div className="pt-5 border-t line-rule flex items-center justify-between gap-4 mt-auto">
// //                       <div>
// //                         <span className="text-[10px] font-mono text-muted uppercase block">
// //                           Model Access
// //                         </span>
// //                         <span className="font-display font-bold text-sm text-foreground">
// //                           Instant PDF & Data
// //                         </span>
// //                       </div>

// //                       <Link
// //                         href={`/contact?plan=${plan.id}`}
// //                         className="inline-block"
// //                       >
// //                         <button className="relative overflow-hidden px-6 py-3 rounded-full border line-rule bg-surface group/btn transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm">
// //                           <div className="absolute inset-0 bg-[#02d683] scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-signature rounded-full origin-center" />
// //                           <span className="relative z-10 font-bold text-xs md:text-sm transition-colors duration-300 group-hover/btn:text-ink">
// //                             Buy Now
// //                           </span>
// //                           <span className="relative z-10 text-xs transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-ink">
// //                             →
// //                           </span>
// //                         </button>
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })
// //           ) : (
// //             <div className="col-span-full py-28 text-center bg-card rounded-3xl border line-rule">
// //               <h3 className="font-display text-2xl mb-2">
// //                 No matching portfolios found
// //               </h3>
// //               <p className="font-body text-muted text-sm">
// //                 Try modifying your filter categories or search terms.
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Disclaimer Card */}
// //         <div className="border line-rule rounded-3xl p-8 md:p-12 bg-card text-center max-w-4xl mx-auto shadow-sm">
// //           <h4 className="font-display font-bold text-lg md:text-xl mb-3">
// //             Institutional Due Diligence & Structuring
// //           </h4>
// //           <p className="font-body text-xs md:text-sm text-muted leading-relaxed max-w-2xl mx-auto">
// //             All investment blueprints include granular financial spreadsheets,
// //             sensitivity calculations, and operational breakdowns. Review legal
// //             terms and definitive agreements prior to final capital deployment.
// //           </p>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }

// "use client";

// import { useEffect, useRef, useState, useMemo } from "react";
// import Link from "next/link";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { plans } from "@/data/plans/plans";

// const planImages = [
//   "https://i.postimg.cc/RFV24K7Q/image.png",
//   "https://i.postimg.cc/d0Hc75tj/image.png",
//   "https://i.postimg.cc/zfN9293j/image.png",
//   "https://i.postimg.cc/gchHrrgD/image.png",
//   "https://i.postimg.cc/766tpD41/image.png",
// ];

// export default function InvestmentPlansPage() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeSeries, setActiveSeries] = useState("All");

//   const seriesList = useMemo(() => {
//     const series = plans.map((p: any) => p.series).filter(Boolean);
//     return ["All", ...Array.from(new Set(series))];
//   }, []);

//   const filteredPlans = useMemo(() => {
//     return plans.filter((plan: any) => {
//       const matchesSearch =
//         plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         plan.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesSeries =
//         activeSeries === "All" || plan.series === activeSeries;

//       return matchesSearch && matchesSeries;
//     });
//   }, [searchTerm, activeSeries]);

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     const ctx = gsap.context(() => {
//       if (filteredPlans.length > 0) {
//         gsap.fromTo(
//           gsap.utils.toArray(".plan-card"),
//           { autoAlpha: 0, y: 35 },
//           {
//             autoAlpha: 1,
//             y: 0,
//             duration: 0.55,
//             stagger: 0.06,
//             ease: "power3.out",
//             overwrite: "auto",
//             scrollTrigger: {
//               trigger: gridRef.current,
//               start: "top 85%",
//             },
//           },
//         );
//       }
//     }, gridRef);

//     return () => {
//       ctx.revert();
//     };
//   }, [filteredPlans]);

//   return (
//     <main
//       ref={sectionRef}
//       className="min-h-screen bg-surface transition-colors duration-300 pt-32 md:pt-40 pb-36"
//     >
//       {/* Full-width container layout */}
//       <div className="max-w-[1400px] mx-auto px-6 md:px-12">
//         <header className="mb-16 max-w-3xl">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#02d683]/10 border border-[#02d683]/20 mb-4">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#02d683] animate-pulse" />
//             <span className="text-[10px] font-mono uppercase tracking-widest text-[#02d683]">
//               Active Capital Deployments
//             </span>
//           </div>
//           <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">
//             Investment Blueprints.
//           </h1>
//           <p className="font-body text-lg md:text-xl text-muted leading-relaxed">
//             Select a verified infrastructure portfolio model. Access
//             institutional-grade financial projections and cash flow structures.
//           </p>
//         </header>

//         {/* --- Search & Series Filter Section --- */}
//         <div className="mb-14 space-y-6">
//           <div className="relative max-w-xl">
//             <svg
//               className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by blueprint title or allocation..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-6 py-4 rounded-2xl bg-card border line-rule font-body focus:outline-none focus:border-[#02d683] transition-colors shadow-sm text-sm"
//             />
//           </div>

//           {/* Series Filter Tabs */}
//           <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//             {seriesList?.map((seriesName: string) => (
//               <button
//                 key={seriesName}
//                 onClick={() => setActiveSeries(seriesName)}
//                 className={`shrink-0 px-6 py-2.5 rounded-full font-body text-sm font-bold transition-all ${
//                   activeSeries === seriesName
//                     ? "bg-[#02d683] text-ink border-[#02d683] shadow-lg shadow-[#02d683]/20"
//                     : "bg-card border line-rule text-muted hover:border-[#02d683]"
//                 }`}
//               >
//                 {seriesName === "All"
//                   ? "All Series"
//                   : seriesName.replace("GREENPAL ", "")}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* --- Full-Width Wide Grid --- */}
//         <div
//           ref={gridRef}
//           className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
//         >
//           {filteredPlans.length > 0 ? (
//             filteredPlans.map((plan: any, i: number) => {
//               const primaryMetric =
//                 plan.metrics.yourContribution || plan.metrics.yourInvestment;
//               const monthlyMetric = plan.metrics.investorPerMonth;
//               const paybackMetric = plan.metrics.payback;
//               const thumbnail = planImages[i % planImages.length];

//               return (
//                 <div
//                   key={plan.id}
//                   className="plan-card invisible flex flex-col justify-between border line-rule bg-card rounded-[2.5rem] overflow-hidden transition-all duration-300 group hover:border-[#02d683] hover:-translate-y-1.5 hover:shadow-2xl shadow-black/5 relative"
//                 >
//                   {/* FULL-BLEED COVER IMAGE HEADER */}
//                   <div className="relative aspect-[21/14] w-full bg-surface border-b line-rule overflow-hidden">
//                     <img
//                       src={thumbnail}
//                       alt={plan.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40" />

//                     {/* Floating Series Badge Overlay */}
//                     <div className="absolute top-4 left-4 bg-ink/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#02d683]/30 shadow-lg">
//                       <span className="text-[10px] text-[#02d683] font-mono uppercase tracking-widest font-bold">
//                         {plan.series.replace("GREENPAL ", "")}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Card Content Body - Streamlined / Less Info */}
//                   <div className="flex flex-col flex-grow p-8 md:p-10">
//                     <div className="mb-6">
//                       <h3 className="font-display font-bold text-2xl md:text-3xl group-hover:text-[#02d683] transition-colors mb-2 tracking-tight">
//                         {plan.title}
//                       </h3>
//                       <p className="font-body text-xs md:text-sm text-muted leading-relaxed line-clamp-2">
//                         {plan.subtitle}
//                       </p>
//                     </div>

//                     {/* Clean Financial Metrics Bar */}
//                     <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-surface border line-rule mb-8">
//                       <div>
//                         <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-0.5">
//                           {primaryMetric?.label || "Capital"}
//                         </p>
//                         <p className="font-display font-extrabold text-base md:text-lg text-foreground">
//                           {primaryMetric?.value}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-0.5">
//                           {monthlyMetric?.label || "Monthly Return"}
//                         </p>
//                         <p className="font-display font-extrabold text-base md:text-lg text-[#02d683]">
//                           {monthlyMetric?.value}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-0.5">
//                           {paybackMetric?.label || "Payback"}
//                         </p>
//                         <p className="font-display font-extrabold text-base md:text-lg text-foreground">
//                           {paybackMetric?.value}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Footer Action Bar with Buy Now Button */}
//                     <div className="pt-5 border-t line-rule flex items-center justify-between gap-4 mt-auto">
//                       <div>
//                         <span className="text-[10px] font-mono text-muted uppercase block">
//                           Instant Access
//                         </span>
//                         <span className="text-xs font-body font-medium text-foreground">
//                           Verified PDF Blueprint & Model
//                         </span>
//                       </div>

//                       <Link
//                         href={`/contact?plan=${plan.id}`}
//                         className="inline-block"
//                       >
//                         <button className="relative overflow-hidden px-7 py-3 rounded-full border line-rule bg-surface group/btn transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm">
//                           <div className="absolute inset-0 bg-[#02d683] scale-0 group-hover/btn:scale-100 transition-transform duration-500 ease-signature rounded-full origin-center" />
//                           <span className="relative z-10 font-bold text-xs md:text-sm transition-colors duration-300 group-hover/btn:text-ink">
//                             Buy Now
//                           </span>
//                           <span className="relative z-10 text-xs transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-ink">
//                             →
//                           </span>
//                         </button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="col-span-full py-20 text-center bg-card rounded-3xl border line-rule">
//               <h3 className="font-display text-2xl mb-2">
//                 No matching blueprints found
//               </h3>
//               <p className="font-body text-muted text-sm">
//                 Try modifying your search query or filter selection.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Disclaimer Section */}
//         <div className="border line-rule rounded-3xl p-8 md:p-12 bg-card text-center max-w-4xl mx-auto shadow-sm">
//           <h4 className="font-display font-bold text-lg md:text-xl mb-3">
//             Due Diligence & Execution Framework
//           </h4>
//           <p className="font-body text-sm text-muted leading-relaxed max-w-2xl mx-auto">
//             Each investment blueprint contains comprehensive financial models,
//             capital recovery projections, and operational frameworks. Review
//             full agreements before executing capital allocations.
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { plans } from "@/data/plans/plans";

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
                className={`shrink-0 px-6 py-2.5 rounded-full font-body text-sm font-bold transition-all ${
                  activeSeries === seriesName
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
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
                  className="plan-card invisible flex flex-col justify-between border line-rule bg-card rounded-[2.5rem] overflow-hidden transition-all duration-300 group hover:border-[#02d683] hover:-translate-y-1.5 hover:shadow-2xl shadow-black/5 relative p-6 md:p-8"
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
                      <div className="absolute top-3 left-3 bg-ink/90 backdrop-blur-md px-3 py-1 rounded-full border border-signal/20">
                        <span className="text-[10px] text-[#02d683] font-mono uppercase tracking-widest font-bold">
                          {isCoInvest
                            ? "CO-INVESTMENT SERIES"
                            : "OWNERSHIP SERIES"}
                        </span>
                      </div>

                      {/* PDF Guide Pill (Top Right) */}
                      <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full border line-rule flex items-center gap-1.5 shadow-sm">
                        <svg
                          className="w-3.5 h-3.5 text-[#02d683]"
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
                        <span className="text-[10px] font-mono font-bold text-foreground uppercase">
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
                    <div className="mb-6 p-4 rounded-2xl bg-surface border line-rule">
                      <p className="text-[9px] font-mono uppercase text-muted tracking-wider mb-1">
                        Station Setup
                      </p>
                      <p className="font-display font-bold text-sm text-foreground">
                        {stationSetupText}
                      </p>
                    </div>

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
                  <div className="pt-6 border-t line-rule mt-auto">
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

                    <Link
                      href={`/contact?plan=${plan.id}`}
                      className="block w-full"
                    >
                      <button className="w-full relative overflow-hidden py-4 rounded-full bg-[#02d683] text-ink font-display font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group/btn shadow-md hover:bg-[#02bc73]">
                        <span>Buy Business Plan</span>
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                          →
                        </span>
                      </button>
                    </Link>

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
    </main>
  );
}
