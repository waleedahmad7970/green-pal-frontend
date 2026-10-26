"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

// All colors come from your design classes (signal / signal-dim / ink / accent / card / muted).
// No hard-coded color values live in this file except the original dark cabinet gradient
// inside the station graphic.

const EASE = [0.16, 1, 0.3, 1] as const;

// Shared class strings so every button / card stays consistent.
const BTN =
  "bg-signal text-ink font-body font-bold hover:bg-signal-dim transition-all duration-200 shadow-xl shadow-signal/20";
const CARD = "bg-card";
const CHIP = "bg-signal text-ink";
const CHECK_BUBBLE =
  "bg-signal text-ink flex items-center justify-center shrink-0 rounded-full";

// --- PAYMENT LINKS ---
// TODO: replace each "#" with the real payment link for that tier
// (or set the NEXT_PUBLIC_PAY_* env vars). Each tier has its own link.
const PAY_LINKS = {
  pulse8: process.env.NEXT_PUBLIC_PAY_PULSE_8 ?? "#",
  pulse12: process.env.NEXT_PUBLIC_PAY_PULSE_12 ?? "#",
  pulse24: process.env.NEXT_PUBLIC_PAY_PULSE_24 ?? "#",
  pulse48: process.env.NEXT_PUBLIC_PAY_PULSE_48 ?? "#",
};

// --- TYPES ---
interface PlanData {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceNumeric: number;
  priceLabel: string;
  slots: 8 | 12 | 24 | 48;
  popular?: boolean;
  image: string; // real station picture, put files in /public/stations/
  payUrl: string;
  blurb: string;
  features: string[];
  specs: {
    dimensions: string;
    weight: string;
    screen: string;
    formFactor: string;
    bestFor: string;
  };
}

const PLANS: PlanData[] = [
  {
    id: "pulse-8",
    name: "Pulse 8",
    subtitle: "A compact beginning",
    price: "$500",
    priceNumeric: 500,
    priceLabel: "one time",
    slots: 8,
    image: "/stations/pulse-8.png",
    payUrl: PAY_LINKS.pulse8,
    blurb: "8 power banks. Good for small busy places.",
    features: [
      "You pay one time: $500",
      "We buy your station and place it",
      "It gets its own number — yours",
      "50% of the net rental revenue, paid monthly",
    ],
    specs: {
      dimensions: "280 x 215 x 180 mm",
      weight: "5.2 kg",
      screen: "LED Status Matrix",
      formFactor: "Countertop Compact",
      bestFor: "Boutique cafes, salons, specialty bakeries & intimate lounges",
    },
  },
  {
    id: "pulse-12",
    name: "Pulse 12",
    subtitle: "More room to connect",
    price: "$750",
    priceNumeric: 750,
    priceLabel: "one time",
    slots: 12,
    image: "/stations/pulse-12.png",
    payUrl: PAY_LINKS.pulse12,
    blurb: "12 power banks. Good for busy places.",
    features: [
      "You pay one time: $750",
      "We buy your station and place it",
      "It gets its own number — yours",
      "50% of the net rental revenue, paid monthly",
    ],
    specs: {
      dimensions: "360 x 280 x 210 mm",
      weight: "8.8 kg",
      screen: "High-contrast LCD Status Display",
      formFactor: "Countertop Standard",
      bestFor: "Gastropubs, fitness studios, casual dining & busy lobbies",
    },
  },
  {
    id: "pulse-24",
    name: "Pulse 24",
    subtitle: "A step up in capacity",
    price: "$1,500",
    priceNumeric: 1500,
    priceLabel: "one time",
    slots: 24,
    popular: true,
    image: "/stations/pulse-24.png",
    payUrl: PAY_LINKS.pulse24,
    blurb: "24 power banks. Good for very busy places.",
    features: [
      "You pay one time: $1,500",
      "We buy your station and place it",
      "It gets its own number — yours",
      "50% of the net rental revenue, paid monthly",
    ],
    specs: {
      dimensions: "490 x 320 x 240 mm",
      weight: "14.5 kg",
      screen: 'Full Color 10.1" Interactive Info Display',
      formFactor: "Bar / Wall Mount",
      bestFor: "Nightclubs, hotel lobbies, busy restaurants & event halls",
    },
  },
  {
    id: "pulse-48",
    name: "Pulse 48",
    subtitle: "Our largest package",
    price: "$2,500",
    priceNumeric: 2500,
    priceLabel: "one time",
    slots: 48,
    image: "/stations/pulse-48.png",
    payUrl: PAY_LINKS.pulse48,
    blurb: "48 power banks. Good for the busiest places.",
    features: [
      "You pay one time: $2,500",
      "We buy your station and place it",
      "It gets its own number — yours",
      "50% of the net rental revenue, paid monthly",
    ],
    specs: {
      dimensions: "1650 x 420 x 380 mm",
      weight: "42.0 kg",
      screen: '43" 1080p Digital Advertising Screen',
      formFactor: "Free-standing Kiosk",
      bestFor: "Airports, shopping malls, stadiums & high-capacity transit hubs",
    },
  },
];

const STEPS = [
  { n: "1", text: "You pay one time." },
  { n: "2", text: "We buy your station — it gets its own number, yours." },
  {
    n: "3",
    text: "People rent power banks. Every month we send you your half, with all the numbers.",
  },
];

// --- ANIMATION HELPERS ---
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const viewport = { once: true, margin: "-80px" } as const;

// --- STATION SLOT VECTOR GRAPHIC (fallback when no picture file exists) ---
function StationSlotGraphic({ slots }: { slots: 8 | 12 | 24 | 48 }) {
  const baseId = useId();
  const cols = 4;
  const rows = slots / 4;
  const slotW = 5.8;
  const slotH = 5.8;
  const gapX = 2.4;
  const gapY = 2.4;
  const padX = 3.5;
  const padY = 3.5;

  const width = padX * 2 + cols * slotW + (cols - 1) * gapX;
  const height = padY * 2 + rows * slotH + (rows - 1) * gapY;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0 transition-transform duration-500 group-hover:scale-110"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`stationBg-${baseId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a5a3a" />
          <stop offset="100%" stopColor="#12432b" />
        </linearGradient>
      </defs>

      <rect
        x="0.75"
        y="0.75"
        width={width - 1.5}
        height={height - 1.5}
        rx="4.5"
        fill={`url(#stationBg-${baseId})`}
        className="stroke-ink"
        strokeWidth="1.5"
      />

      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const x = padX + c * (slotW + gapX);
          const y = padY + r * (slotH + gapY);
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={slotW}
              height={slotH}
              rx="1.5"
              className="fill-signal stroke-signal-dim"
              strokeWidth="0.4"
            />
          );
        })
      )}
    </svg>
  );
}

// Real station picture; falls back to the vector graphic if the file is missing.
function StationVisual({ plan }: { plan: PlanData }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex items-center justify-center h-40">
        <StationSlotGraphic slots={plan.slots} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={plan.image}
      alt={`${plan.name} power bank station`}
      onError={() => setFailed(true)}
      className="h-40 w-full object-contain transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.4}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface text-current transition-colors duration-500 pt-28 md:pt-36 pb-28">
      <div className="relative z-10 container-edit">
        {/* --- HEADER HERO --- */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-signal/60 bg-card mb-7"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-70 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.22em] font-semibold text-signal-dim dark:text-signal">
              Co-Investment & Station Packages
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.04] mb-6"
          >
            Put a charging station in a busy place.{" "}
            <span className="accent inline-block">Get paid every month.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          >
            You pay one time. We buy the station, put it in a busy place and
            run it. Every month we send you 50% of the net rental revenue from
            your station.
          </motion.p>
        </motion.div>

        {/* --- PLANS GRID --- */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {PLANS.map((plan, i) => {
              const isPopular = plan.popular;

              return (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group relative flex"
                >
                  <div
                    className={`relative flex flex-col justify-between w-full rounded-[20px] p-8 sm:p-10 min-h-[640px] overflow-hidden transition-shadow duration-300 group-hover:shadow-xl ${CARD} ${isPopular
                      ? "border-2 border-signal shadow-lg"
                      : "border border-signal/60"
                      }`}
                  >
                    {isPopular && (
                      <div
                        className={`absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-b-xl font-display text-[10px] font-bold tracking-[0.2em] uppercase ${CHIP}`}
                      >
                        Recommended
                      </div>
                    )}

                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-current">
                            {plan.name}
                          </h3>
                          <p className="font-body text-sm text-muted mt-1">
                            {plan.subtitle}
                          </p>
                        </div>
                        <span className="font-mono text-[11px] text-muted/70 mt-2">
                          0{i + 1}
                        </span>
                      </div>

                      <div className="my-5">
                        <span className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
                          {plan.price}
                        </span>
                        <span className="font-display font-bold text-lg text-muted ml-2">
                          — {plan.priceLabel}
                        </span>
                      </div>

                      <div className="min-h-[160px] flex flex-col justify-center">
                        <StationVisual plan={plan} />
                        <p className="font-body text-xs text-muted text-center mt-2">
                          {plan.blurb}
                        </p>
                      </div>

                      <div className="h-px my-5 bg-signal/40" />

                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 font-body text-sm leading-snug"
                          >
                            <span className={`mt-0.5 w-5 h-5 ${CHECK_BUBBLE}`}>
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="text-current/90">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative pt-2 space-y-3">
                      <a
                        onClick={() => router.push('/contact')}
                        className={`w-full py-4 px-5 cursor-pointer rounded-full text-base flex items-center justify-center gap-2 active:scale-[0.98] ${BTN}`}
                      >
                        PAY {plan.price}
                      </a>

                      <p className="font-body text-[11px] text-muted text-center">
                        You get half the rent money, every month.
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* --- HOW IT WORKS --- */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-signal/60 bg-card p-6 sm:p-8"
          >
            <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-5">
              How it works
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 text-sm font-display font-bold ${CHECK_BUBBLE}`}
                  >
                    {s.n}
                  </span>
                  <span className="font-body text-sm leading-snug">
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>

        {/* --- HONEST SMALL PRINT --- */}
        <p className="font-body text-xs text-muted max-w-3xl mx-auto text-center mb-28 leading-relaxed">
          Please read this. The money is not promised. Some months are busy.
          Some months are slow. Your pay can go up and down. All the rules are
          in the investor paper. Please read it before you pay.
        </p>

        {/* --- SPECIFICATION COMPARISON MATRIX --- */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mb-28"
        >
          <motion.div
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              Compare stations.
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="overflow-x-auto no-scrollbar rounded-2xl border border-signal/60 bg-card"
          >
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="bg-signal text-ink">
                  <th className="p-4 sm:p-5 font-display text-sm font-semibold">
                    Station
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className="p-4 sm:p-5 font-display text-sm font-bold text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {p.name}
                        {p.popular && (
                          <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                        )}
                      </div>
                      <div className="font-mono text-xs font-normal text-ink/70">
                        {p.price} — one time
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body text-sm">
                {[
                  {
                    label: "Power Banks",
                    cells: PLANS.map((p) => `${p.slots}`),
                    strong: true,
                  },
                  {
                    label: "Form Factor",
                    cells: PLANS.map((p) => p.specs.formFactor),
                  },
                  {
                    label: "Dimensions",
                    cells: PLANS.map((p) => p.specs.dimensions),
                  },
                  {
                    label: "Weight",
                    cells: PLANS.map((p) => p.specs.weight),
                  },
                  {
                    label: "Display Screen",
                    cells: PLANS.map((p) => p.specs.screen),
                  },
                  {
                    label: "Your Share",
                    cells: PLANS.map(
                      () => "50% of net rental revenue, paid monthly"
                    ),
                    accent: true,
                  },
                ].map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-signal/30 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  >
                    <td className="p-4 sm:p-5 font-medium">{row.label}</td>
                    {row.cells.map((c, idx) => (
                      <td
                        key={idx}
                        className={`p-4 sm:p-5 text-center ${row.strong
                          ? "font-bold"
                          : row.accent
                            ? "font-semibold accent"
                            : "text-muted"
                          }`}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>

        {/* --- BOTTOM CTA --- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="relative overflow-hidden rounded-3xl bg-ink text-sand p-8 sm:p-14 border border-sand/15"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/2 gp-motif opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-sand leading-tight mb-4">
              Questions before you pay?
            </h2>
            <p className="font-body text-sand/70 text-base md:text-lg mb-8 leading-relaxed">
              Talk to us. We will answer anything about the stations, the
              places and the monthly numbers.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-lg ${BTN}`}
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                className="px-7 py-3.5 rounded-full border border-sand/30 font-display font-semibold text-sm hover:bg-sand/10 transition-all text-sand"
              >
                View Hardware Lineup ↗
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- PLAN DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative w-full max-w-2xl bg-card border-[1.5px] border-signal rounded-3xl p-6 sm:p-9 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedPlan(null)}
                aria-label="Close modal"
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-signal/60 flex items-center justify-center hover:rotate-90 transition-all duration-300"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-signal-dim dark:text-signal font-semibold">
                  Station Details
                </span>
                {selectedPlan.popular && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${CHIP}`}
                  >
                    Recommended
                  </span>
                )}
              </div>

              <h3 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-1">
                {selectedPlan.name}
              </h3>
              <p className="font-body text-sm text-muted mb-6">
                {selectedPlan.subtitle} • {selectedPlan.slots} power banks
              </p>

              <div className="p-5 rounded-2xl border border-signal/50 bg-card flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="font-display font-bold text-3xl accent">
                    {selectedPlan.price}
                  </div>
                  <div className="font-body text-xs text-muted">
                    one time
                  </div>
                </div>
                <div className="w-32">
                  <StationVisual plan={selectedPlan} />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-muted">
                  Station Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body">
                  {[
                    ["Good for", selectedPlan.specs.bestFor],
                    ["Display", selectedPlan.specs.screen],
                    ["Form factor", selectedPlan.specs.formFactor],
                    ["Size & weight", `${selectedPlan.specs.dimensions} · ${selectedPlan.specs.weight}`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="p-3.5 rounded-xl border border-signal/40"
                    >
                      <span className="block text-xs text-muted">{label}</span>
                      <span className="font-medium text-current">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-muted mb-3">
                  How this package works
                </h4>
                <ul className="space-y-2.5 font-body text-sm text-current">
                  {selectedPlan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 ${CHECK_BUBBLE}`}>
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-body text-xs text-muted mb-6 leading-relaxed">
                The money is not promised. Some months are busy, some are slow,
                and your pay can go up and down. All the rules are in the
                investor paper. Please read it before you pay.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={selectedPlan.payUrl}
                  className={`flex-1 inline-flex items-center justify-center py-3.5 px-6 rounded-full text-base text-center hover:-translate-y-0.5 ${BTN}`}
                >
                  PAY {selectedPlan.price}
                </a>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="py-3.5 px-6 rounded-full border border-signal/60 font-display font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}