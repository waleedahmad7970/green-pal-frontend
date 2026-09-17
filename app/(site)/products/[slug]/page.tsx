import Link from "next/link";
import { notFound } from "next/navigation";

// Comprehensive database covering all 6 series
const getProduct = (slug: string) => {
  const db: Record<string, any> = {
    "ownership-series": {
      title: "Ownership Series Blueprint",
      subtitle: "Series 01 — Direct Asset Control Framework",
      price: "$14.00",
      overview:
        "The Ownership Series is engineered for private planners and independent entities wishing to model direct capital deployment into shared power bank stations. This blueprint breaks down the exact capital layout, hardware specifications, station mix configurations, and revenue-sharing expectations.",
      metrics: [
        { label: "Deployment Scope", value: "Custom Station Units" },
        { label: "Financial Horizon", value: "3-Year Projections" },
        { label: "Model Type", value: "Full Asset Ownership" },
      ],
      sections: [
        {
          heading: "Capital Structure & Equipment Breakdown",
          content:
            "Detailed line-item allocation covering core station towers, backup power banks, secure mounting infrastructure, deployment logistics, and initial regional setup costs.",
        },
        {
          heading: "Revenue Assumptions & Rental Yields",
          content:
            "Modeled daily rental frequencies, high-dwell duration curves, average transaction pricing structures, and gross revenue forecasts mapped across varying venue foot traffic.",
        },
        {
          heading: "Operating Costs & Break-Even Analysis",
          content:
            "Comprehensive ledger of venue host commissions, electricity overhead, routine maintenance allowances, customer support handling, and the mathematical break-even timeline.",
        },
        {
          heading: "Launch Planning & 90-Day Roadmap",
          content:
            "A structured execution checklist covering site selection criteria, lease agreement considerations, municipal compliance checkpoints, and activation scheduling.",
        },
      ],
    },
    "co-invest-series": {
      title: "Co-Invest Series Blueprint",
      subtitle: "Series 02 — 50/50 Balanced Partnership Framework",
      price: "$29.00",
      overview:
        "The Co-Invest Series outlines a collaborative expansion model. Greenpal matches your capital contribution 50/50 while retaining direct oversight of logistics, maintenance, firmware updates, and operational network support.",
      metrics: [
        { label: "Capital Contribution", value: "50% Parity Model" },
        { label: "Asset Management", value: "Greenpal Operated" },
        { label: "Revenue Allocation", value: "Structured Split Model" },
      ],
      sections: [
        {
          heading: "50/50 Capital Matching Mechanics",
          content:
            "An in-depth look at how pooled capital accelerates multi-station network deployments without single-party over-exposure.",
        },
        {
          heading: "Operational Responsibilities Matrix",
          content:
            "Clear definition of duties: partner funding commitments versus Greenpal technical operations, software infrastructure management, and hardware maintenance protocols.",
        },
        {
          heading: "Portfolio Yield & Distribution Frameworks",
          content:
            "Transparent calculation sheets outlining revenue collection cycles, platform fees, net pool generation, and automated distribution rules.",
        },
        {
          heading: "Risk Mitigation & Scaling Controls",
          content:
            "Built-in safeguards for underperforming locations, station re-allocations, and asset depreciation accounting.",
        },
      ],
    },
    "transit-hub-blueprint": {
      title: "Transit Hub Deployment Model",
      subtitle: "Series 03 — High-Velocity Commuter Architecture",
      price: "$34.00",
      overview:
        "Tailored for ultra-high traffic environments like airports, central train terminals, and subway interchanges where dwell time is short and transaction velocity is at its peak.",
      metrics: [
        { label: "Traffic Density", value: "Ultra-High Volume" },
        { label: "Station Format", value: "Multi-Tower Clusters" },
        { label: "Focus", value: "Rapid-Swap Inventory" },
      ],
      sections: [
        {
          heading: "Commuter Flow & Peak-Hour Capacity",
          content:
            "Calculations mapping passenger throughput to power bank availability, minimizing empty slots during morning and evening rush windows.",
        },
        {
          heading: "Security & Municipal Concessions",
          content:
            "Guidelines for navigating transit authority approvals, fire safety clearances, and ADA accessibility compliance in public concourses.",
        },
      ],
    },
    "hospitality-hospital-blueprint": {
      title: "Hospitality & Healthcare Framework",
      subtitle: "Series 04 — Extended Dwell Optimization",
      price: "$39.00",
      overview:
        "Specialized positioning blueprint designed for hotels, resorts, tourist destination centers, and large multi-building hospital complexes prioritizing visitor convenience.",
      metrics: [
        { label: "Environment", value: "Extended Dwell Spaces" },
        { label: "Integration", value: "Concierge & Lobby Tier" },
        { label: "Support Level", value: "White-Glove Setup" },
      ],
      sections: [
        {
          heading: "Guest Amenity Value Projections",
          content:
            "Evaluating how mobile power availability increases guest satisfaction scores and reduces front-desk friction caused by dead phone batteries.",
        },
        {
          heading: "Facility Concession Structuring",
          content:
            "Revenue share models tailored specifically for hotel management groups and hospital auxiliary service departments.",
        },
      ],
    },
    "campus-retail-blueprint": {
      title: "Campus & Retail Ecosystem",
      subtitle: "Series 05 — Multi-Building Routing Network",
      price: "$44.00",
      overview:
        "Engineered for university student unions, sprawling campus grounds, and major regional shopping malls with fragmented student and shopper footprints.",
      metrics: [
        { label: "Deployment", value: "Multi-Node Network" },
        { label: "Target Audience", value: "Students & Shoppers" },
        { label: "Seasonality", value: "Academic Calendar Adjusted" },
      ],
      sections: [
        {
          heading: "Student Union & Mall Placement Strategy",
          content:
            "Pinpointing optimal high-dwell anchor locations near food courts, libraries, and central corridors to maximize organic appless scans.",
        },
        {
          heading: "Semester Volume Dips & Adjustments",
          content:
            "Pro forma adjustments accounting for summer breaks, holidays, and heavy retail shopping peaks like Black Friday.",
        },
      ],
    },
    "enterprise-bundle": {
      title: "Complete Portfolio Bundle",
      subtitle: "Series 06 — Comprehensive Strategic Collection",
      price: "$79.00",
      overview:
        "The complete strategic suite combining all series and deployment architectures. Ideal for institutional evaluators and multi-market developers seeking complete cross-model data visibility.",
      metrics: [
        { label: "Included Series", value: "All 5 Core Frameworks" },
        { label: "Analysis Depth", value: "Full Sensitivity Suite" },
        { label: "Strategic Value", value: "Master Collection" },
      ],
      sections: [
        {
          heading: "Cross-Model Comparative Matrix",
          content:
            "Side-by-side financial statements evaluating ownership yields versus co-investment models across diverse urban markets.",
        },
        {
          heading: "Stress Testing & Macro Volatility",
          content:
            "Modeled performance during utility cost spikes, supply chain disruptions, and retail foot traffic contraction.",
        },
      ],
    },
  };

  return db[slug];
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface transition-colors duration-300 pt-28 md:pt-36 pb-32">
      <div className="container-edit max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-body font-bold text-muted hover:text-[#02d683] transition-colors duration-300 mb-12 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to All Blueprints
        </Link>

        {/* Main Header */}
        <div className="max-w-4xl mb-16">
          <p className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] mb-4">
            {product.subtitle}
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight text-ink dark:text-white">
            {product.title}
          </h1>
          <p className="font-body text-lg md:text-xl text-muted leading-relaxed">
            {product.overview}
          </p>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {product.metrics.map((m: any, idx: number) => (
            <div key={idx} className="border line-rule rounded-2xl bg-card p-6">
              <p className="font-body text-xs font-bold uppercase tracking-wider text-muted mb-1">
                {m.label}
              </p>
              <p className="font-display font-bold text-lg md:text-xl text-ink dark:text-white">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Comprehensive Sections */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink dark:text-white mb-8">
              Inside the Blueprint
            </h2>

            {product.sections.map((sec: any, i: number) => (
              <div key={i} className="border-t line-rule pt-8">
                <h3 className="font-display font-bold text-xl md:text-2xl mb-3 text-ink dark:text-white">
                  {sec.heading}
                </h3>
                <p className="font-body text-muted leading-relaxed text-base md:text-lg">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Purchase Card */}
          <div className="lg:col-span-5 xl:col-span-4 w-full sticky top-32">
            <div className="border line-rule bg-card rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between mb-6">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-[#02d683]">
                  Instant Digital PDF
                </span>
                <span className="font-display font-bold text-3xl md:text-4xl text-ink dark:text-white">
                  {product.price}
                </span>
              </div>

              <button className="w-full inline-flex items-center justify-center px-8 py-5 rounded-full bg-signal text-ink font-display font-bold text-lg hover:scale-[1.02] transition-transform duration-300 mb-6 shadow-md">
                Purchase Blueprint
              </button>

              <div className="pt-6 border-t line-rule space-y-4">
                <div className="flex items-center gap-3 text-xs font-body text-muted">
                  <svg
                    className="w-4 h-4 text-[#02d683]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Secure digital file delivery upon purchase
                </div>
                <div className="flex items-center gap-3 text-xs font-body text-muted">
                  <svg
                    className="w-4 h-4 text-[#02d683]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Includes calculation structures & financial spreadsheets
                </div>
                <p className="text-muted font-body text-xs leading-relaxed pt-4 border-t line-rule text-center">
                  Purchasing a blueprint is the purchase of a business-planning
                  product only. It does not create an investment, ownership
                  interest or profit-participation right in Greenpal Canada Ltd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
