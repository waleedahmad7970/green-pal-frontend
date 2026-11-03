"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

// Same design tokens as the plans page: signal / signal-dim / ink / card / surface / muted.
// Everything you may want to edit later lives in the config block below.

const EASE = [0.16, 1, 0.3, 1] as const;

const BTN =
    "bg-signal text-ink font-body font-bold hover:bg-signal-dim transition-all duration-200 shadow-xl shadow-signal/20";
const CARD = "bg-card";
const CHECK_BUBBLE =
    "bg-signal text-ink flex items-center justify-center shrink-0 rounded-full";

// ---------- CONFIG (edit content here) ----------
const FRANCHISE = {
    price: "$2,000",
    currency: "CAD",
    priceLabel: "Launch Franchise — total investment",
};

const STATS = [
    { value: "$2,000", label: "Total investment (CAD)" },
    { value: "80%", label: "Of rental revenue is yours" },
    { value: "3 days", label: "Station ships after payment" },
    { value: "3 years", label: "Initial term, renews" },
];

const INCLUDED = [
    { title: "1 × Pulse 8 station", text: "Countertop station with 8 power banks. You own it.", value: "$1,000" },
    { title: "Training programme", text: "Territory registration, franchise training, launch kit, marketing assets, platform access and launch support.", value: "$1,000" },
];

const BENEFITS = [
    { title: "Your own territory", text: "Pick any open territory, first-come first-served. Once it is registered, it is yours." },
    { title: "Proven network", text: "Stations are already live at gyms, clinics, bars and arenas across Edmonton. You join a working business." },
    { title: "We run the tech", text: "Rentals, payments, returns and statements run on the Greenpal platform and app. You never handle cash or card data." },
    { title: "Training & support", text: "Venue playbook, pitch kit, partnership template and a real support line. We stay with you after launch." },
];

const MONEY = [
    {
        tag: "Rentals",
        you: 80,
        them: 20,
        title: "You keep 80%",
        text: "Guests rent a power bank by the hour. 80% of net rental revenue is yours, 20% is Greenpal's. Paid monthly with a statement.",
    },
    {
        tag: "Screen advertising",
        you: 20,
        them: 80,
        title: "You receive 20%",
        text: "Greenpal wins and manages the ad contracts across the network, so it keeps 80%. Your 20% is paid on the same statement.",
    },
];

const EXAMPLE = [
    { label: "Station rental revenue / year", value: "$14,600" },
    { label: "Your 80% share / year", value: "$11,680", strong: true },
    { label: "Your share / month", value: "$973" },
    { label: "Greenpal's 20% share", value: "$2,920" },
];

const TIERS = [
    { name: "Launch", price: "$2,000", stations: "1 station", banks: "8 power banks", current: true },
    { name: "Starter", price: "$5,000", stations: "4 stations", banks: "32 power banks" },
    { name: "Growth", price: "$10,000", stations: "9 stations", banks: "72 power banks" },
];

const TIER_NOTES = [
    "Training and onboarding included in every tier",
    "Same 80% rental share in every tier",
    "30% on order, 70% on shipment",
];

const VENUES = [
    { icon: "♥", name: "Gyms & rec centres" },
    { icon: "✚", name: "Clinics & waiting rooms" },
    { icon: "♪", name: "Bars, pubs & arenas" },
    { icon: "⌂", name: "Hotels & entertainment" },
];

const VENUE_GETS = [
    "A service their guests already ask for",
    "Zero cost to host the station",
    "A share of rental revenue (20% under standard terms)",
    "Their own branding on the station screen",
];

const PULSE = [
    { name: "Pulse 8", detail: "8 banks · countertop", note: "Your launch station" },
    { name: "Pulse 12", detail: "12 banks · countertop", note: "Busier venues" },
    { name: "Pulse 24", detail: "24 banks · floor totem", note: "Large venues" },
    { name: "Pulse 48", detail: "48 banks · floor totem", note: "Crowds and arenas" },
];

const STEPS = [
    { n: "1", title: "Disclosure", text: "You receive our disclosure document under Alberta's Franchises Act, before you sign or pay anything." },
    { n: "2", title: "Order + 30%", text: "Sign the agreement, pay $600, and your territory is registered." },
    { n: "3", title: "Station ships", text: "Pay the remaining $1,400. Your Pulse 8 ships within 3 days." },
    { n: "4", title: "Training", text: "Learn the platform, the app, station setup and the venue playbook." },
    { n: "5", title: "Win venues", text: "Pitch places where people wait, using our pitch kit and partnership template." },
    { n: "6", title: "Install", text: "Plug-and-play on one standard outlet. We help set venue branding on the screen." },
    { n: "7", title: "Go live", text: "First rentals appear on your platform dashboard." },
    { n: "8", title: "Monthly rhythm", text: "Statement and payout each month. Check banks, visit venues, plan growth." },
];

const FIRST_30 = [
    { when: "Day 1", what: "Order confirmed, $600 paid, territory registered" },
    { when: "Days 1–3", what: "Station ships, $1,400 balance due" },
    { when: "Week 1", what: "Platform set up, training completed, launch kit in hand" },
    { when: "Week 2", what: "Venue list built, first meetings booked" },
    { when: "Week 3", what: "First partnership agreements signed, installs scheduled" },
    { when: "Week 4", what: "First stations live, first rentals tracked" },
    { when: "Day 30", what: "Launch review with Greenpal" },
];

const RISKS = [
    "Income is not guaranteed. It depends on your venues, placements and effort.",
    "Greenpal is early-stage, incorporated in 2026. You share the risks of a young company.",
    "Advertising is a bonus on top of rentals, not the reason the numbers work.",
    "Stations do not place themselves. Operators who work the playbook do better.",
];

const FAQ = [
    {
        q: "What does $2,000 CAD cover?",
        a: "One Pulse 8 station with 8 power banks ($1,000) plus the full training and onboarding programme ($1,000). You pay 30% ($600) on order and 70% ($1,400) on shipment.",
    },
    {
        q: "Do I need experience?",
        a: "No. Training covers the platform, the venue playbook and station operations. What matters is consistency: visiting venues and keeping stations stocked.",
    },
    {
        q: "Who finds the venues?",
        a: "You do, in your territory. Your launch kit includes the pitch kit and the same partnership agreement template Greenpal venues sign today.",
    },
    {
        q: "How and when am I paid?",
        a: "Monthly. Your 80% of net rental revenue and your 20% of advertising revenue are shown on one statement and paid on that cycle.",
    },
    {
        q: "What are my ongoing costs?",
        a: "Your own time, travel and placement work. The revenue splits are the ongoing terms with Greenpal. The full fee picture is in the franchise agreement, so review it before signing.",
    },
    {
        q: "What if a station breaks or a bank goes missing?",
        a: "Report it to Greenpal support right away at info@thegreenpal.ca or 780-719-5725. Replacements are supplied on the standard order terms.",
    },
    {
        q: "Can I add more stations?",
        a: "Yes. Extra stations and banks use the same 30% on order, 70% on shipment terms. Your monthly numbers show when a venue is ready for more.",
    },
    {
        q: "Is the income guaranteed?",
        a: "No. Some months are busy and some are slow, and some may have little or no revenue. The example on this page is illustrative only.",
    },
];

// ---------- ANIMATION HELPERS ----------
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
};

const viewport = { once: true, margin: "-80px" } as const;

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

function SectionHead({ title, sub }: { title: string; sub?: string }) {
    return (
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">{title}</h2>
            {sub && (
                <p className="font-body text-base text-muted leading-relaxed mt-4">{sub}</p>
            )}
        </motion.div>
    );
}

function Section({
    id,
    children,
}: {
    id?: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            id={id}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mb-24 scroll-mt-32"
        >
            {children}
        </motion.div>
    );
}

function FaqList() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {FAQ.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                    <motion.div
                        key={faq.q}
                        variants={fadeUp}
                        className="border line-rule rounded-2xl bg-card overflow-hidden transition-colors duration-300"
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                        >
                            <span className="font-display font-semibold text-lg md:text-xl transition-colors duration-300 group-hover:text-[#02d683]">
                                {faq.q}
                            </span>
                            <span
                                className={`flex-shrink-0 ml-4 transition-all duration-300 group-hover:text-[#02d683] ${
                                    isOpen ? "rotate-45" : "rotate-0"
                                }`}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                            </span>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${
                                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <p className="font-body text-muted px-6 md:px-8 pb-6 md:pb-8 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function FranchisePage() {
    return (
        <div className="min-h-screen bg-surface text-current transition-colors duration-500 pt-28 md:pt-36 pb-28">
            <div className="relative z-10 container-edit">
                {/* --- HERO --- */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
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
                            Franchise Opportunity
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.04] mb-6"
                    >
                        Own a charging station business.{" "}
                        <span className="accent inline-block">Own your territory.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="font-body text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Place Greenpal power bank rental stations in busy gyms, clinics,
                        bars and hotels near you. You run the venues. We supply the
                        stations, the app and the training. You keep 80% of rental revenue,
                        paid monthly.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            href="/contact"
                            className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-lg ${BTN}`}
                        >
                            Apply for a Franchise
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-7 py-3.5 rounded-full border border-signal/60 font-display font-semibold text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            See how it works ↓
                        </a>
                    </motion.div>
                </motion.div>

                {/* --- KEY NUMBERS --- */}
                <Section>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {STATS.map((s) => (
                            <motion.div
                                key={s.label}
                                variants={fadeUp}
                                className={`rounded-[20px] shadow-md p-6 text-center ${CARD}`}
                            >
                                <div className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight accent">
                                    {s.value}
                                </div>
                                <div className="font-body text-xs sm:text-sm text-muted mt-2 leading-snug">
                                    {s.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Section>

                {/* --- PRICE + WHAT'S INCLUDED --- */}
                <Section>
                    <motion.div
                        variants={fadeUp}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 rounded-[20px] shadow-lg p-8 sm:p-12 ${CARD}`}
                    >
                        <div className="flex flex-col justify-center">
                            <span className="font-mono text-xs uppercase tracking-wider text-signal-dim dark:text-signal font-semibold mb-3">
                                {FRANCHISE.priceLabel}
                            </span>
                            <div className="flex items-baseline gap-3 flex-wrap mb-4">
                                <span className="font-display font-extrabold text-6xl sm:text-7xl tracking-tight">
                                    {FRANCHISE.price}
                                </span>
                                <span className="font-display font-bold text-xl text-muted">
                                    {FRANCHISE.currency}
                                </span>
                            </div>
                            <p className="font-body text-sm text-muted leading-relaxed mb-2 max-w-md">
                                Pay <strong className="text-current">30% ($600)</strong> when
                                you order and <strong className="text-current">70% ($1,400)</strong>{" "}
                                when your station ships. It ships within 3 days.
                            </p>
                            <p className="font-body text-xs text-muted leading-relaxed mb-8 max-w-md">
                                No payment is taken until you have received and reviewed our
                                disclosure document.
                            </p>
                            <div>
                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-base ${BTN}`}
                                >
                                    Get the disclosure document
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-5">
                                What is included
                            </h2>
                            <ul className="space-y-5">
                                {INCLUDED.map((item) => (
                                    <li key={item.title} className="flex items-start gap-3">
                                        <span className={`mt-0.5 w-6 h-6 ${CHECK_BUBBLE}`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-baseline justify-between gap-4">
                                                <h3 className="font-display font-bold text-base">
                                                    {item.title}
                                                </h3>
                                                <span className="font-mono text-sm text-muted">
                                                    {item.value}
                                                </span>
                                            </div>
                                            <p className="font-body text-sm text-muted leading-snug mt-1">
                                                {item.text}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </Section>

                {/* --- BENEFITS --- */}
                <Section>
                    <SectionHead title="Why franchise with us." />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                        {BENEFITS.map((b, i) => (
                            <motion.div
                                key={b.title}
                                variants={fadeUp}
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                className={`flex flex-col rounded-[20px] shadow-md p-8 transition-shadow duration-300 hover:shadow-xl ${CARD}`}
                            >
                                <span className="font-mono text-[11px] text-muted/70 mb-4">
                                    0{i + 1}
                                </span>
                                <h3 className="font-display font-bold text-xl tracking-tight mb-3">
                                    {b.title}
                                </h3>
                                <p className="font-body text-sm text-muted leading-relaxed">
                                    {b.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Section>

                {/* --- HOW THE MONEY WORKS --- */}
                <Section>
                    <SectionHead
                        title="How you make money."
                        sub="Two revenue streams, one monthly statement."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MONEY.map((m) => (
                            <motion.div
                                key={m.tag}
                                variants={fadeUp}
                                className={`rounded-[20px] shadow-md p-8 ${CARD}`}
                            >
                                <span className="font-mono text-xs uppercase tracking-wider text-signal-dim dark:text-signal font-semibold">
                                    {m.tag}
                                </span>
                                <h3 className="font-display font-extrabold text-3xl tracking-tight mt-2 mb-5">
                                    {m.title}
                                </h3>
                                <div className="flex h-9 rounded-full overflow-hidden font-mono text-xs font-semibold mb-5">
                                    <div
                                        style={{ width: `${m.you}%` }}
                                        className="bg-signal text-ink flex items-center justify-center"
                                    >
                                        You {m.you}%
                                    </div>
                                    <div
                                        style={{ width: `${m.them}%` }}
                                        className="bg-ink text-sand flex items-center justify-center"
                                    >
                                        Greenpal {m.them}%
                                    </div>
                                </div>
                                <p className="font-body text-sm text-muted leading-relaxed">
                                    {m.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Section>

                {/* --- WORKED EXAMPLE --- */}
                <Section>
                    <motion.div
                        variants={fadeUp}
                        className={`rounded-[20px] shadow-lg p-8 sm:p-12 ${CARD}`}
                    >
                        <div className="max-w-2xl mb-8">
                            <span className="font-mono text-xs uppercase tracking-wider text-signal-dim dark:text-signal font-semibold">
                                Example only
                            </span>
                            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mt-2 mb-3">
                                What could one station earn?
                            </h2>
                            <p className="font-body text-sm text-muted leading-relaxed">
                                Assumes 50% daily utilization (4 of the 8 slots rented once a
                                day), an average 2-hour rental at the standard hourly rate,
                                365 days a year.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {EXAMPLE.map((e) => (
                                <div
                                    key={e.label}
                                    className={`rounded-2xl p-5 border ${
                                        e.strong ? "border-signal bg-signal/10" : "border-current/10"
                                    }`}
                                >
                                    <div className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                                        {e.value}
                                    </div>
                                    <div className="font-body text-xs text-muted mt-1 leading-snug">
                                        {e.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="font-body text-xs text-muted leading-relaxed mt-6 max-w-3xl">
                            Illustrative only. Real revenue varies by venue, placement and
                            month, and can be lower, including months with little or no
                            revenue. This is not a promise, forecast or guarantee of earnings.
                            Advertising revenue is extra and depends on contracts Greenpal
                            secures.
                        </p>
                    </motion.div>
                </Section>

                {/* --- TIERS --- */}
                <Section>
                    <SectionHead
                        title="Start small. Grow when ready."
                        sub="You are reading about the Launch Franchise, the entry tier. Bigger tiers are there when you want more stations."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        {TIERS.map((t) => (
                            <motion.div
                                key={t.name}
                                variants={fadeUp}
                                className={`relative rounded-[20px] shadow-md p-8 ${CARD} ${
                                    t.current ? "ring-2 ring-signal" : ""
                                }`}
                            >
                                {t.current && (
                                    <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-signal text-ink font-mono text-[11px] font-bold uppercase tracking-wider">
                                        This package
                                    </span>
                                )}
                                <h3 className="font-display font-bold text-xl mb-1">{t.name}</h3>
                                <div className="flex items-baseline gap-2 mb-5">
                                    <span className="font-display font-extrabold text-4xl tracking-tight">
                                        {t.price}
                                    </span>
                                    <span className="font-body text-sm text-muted">CAD</span>
                                </div>
                                <ul className="space-y-2 font-body text-sm">
                                    <li className="flex items-center gap-2">
                                        <Check className="text-signal-dim dark:text-signal" />
                                        {t.stations}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="text-signal-dim dark:text-signal" />
                                        {t.banks}
                                    </li>
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                    <motion.ul
                        variants={fadeUp}
                        className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 font-body text-sm text-muted"
                    >
                        {TIER_NOTES.map((n) => (
                            <li key={n} className="flex items-center gap-2">
                                <Check className="text-signal-dim dark:text-signal" />
                                {n}
                            </li>
                        ))}
                    </motion.ul>
                </Section>

                {/* --- VENUES --- */}
                <Section>
                    <SectionHead
                        title="Where stations go."
                        sub="Great places are where people wait an hour or more, every day. Venues say yes because it costs them nothing."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                            {VENUES.map((v) => (
                                <div
                                    key={v.name}
                                    className={`rounded-[20px] shadow-md p-6 flex flex-col gap-3 ${CARD}`}
                                >
                                    <span className={`w-10 h-10 text-lg ${CHECK_BUBBLE}`}>
                                        {v.icon}
                                    </span>
                                    <span className="font-display font-bold text-base leading-snug">
                                        {v.name}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                        <motion.div variants={fadeUp} className={`rounded-[20px] shadow-md p-8 ${CARD}`}>
                            <h3 className="font-display font-bold text-xl mb-5">
                                What the venue gets
                            </h3>
                            <ul className="space-y-4">
                                {VENUE_GETS.map((g) => (
                                    <li key={g} className="flex items-start gap-2.5 font-body text-sm">
                                        <span className={`mt-0.5 w-5 h-5 ${CHECK_BUBBLE}`}>
                                            <Check className="w-3 h-3" />
                                        </span>
                                        {g}
                                    </li>
                                ))}
                            </ul>
                            <p className="font-body text-xs text-muted mt-6 leading-relaxed">
                                Live today at Pawn Shop Live, Chop Shop Physiques, B Street
                                Bar, VRtual Arena, Evolution Wonderlounge, Cure MD and more.
                            </p>
                        </motion.div>
                    </div>
                </Section>

                {/* --- PULSE LINE --- */}
                <Section>
                    <SectionHead
                        title="Room to scale."
                        sub="Same platform, same banks, bigger stations for busier venues."
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {PULSE.map((p, i) => (
                            <motion.div
                                key={p.name}
                                variants={fadeUp}
                                className={`rounded-[20px] shadow-md p-6 ${CARD} ${
                                    i === 0 ? "ring-2 ring-signal" : ""
                                }`}
                            >
                                <h3 className="font-display font-bold text-xl">{p.name}</h3>
                                <p className="font-body text-sm text-muted mt-1">{p.detail}</p>
                                <p className="font-mono text-[11px] uppercase tracking-wider text-signal-dim dark:text-signal mt-4">
                                    {p.note}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Section>

                {/* --- HOW IT WORKS --- */}
                <Section id="how-it-works">
                    <SectionHead
                        title="How it works."
                        sub="From signed agreement to live stations in eight steps."
                    />
                    <motion.div variants={fadeUp} className={`rounded-2xl shadow-md p-6 sm:p-8 mb-6 ${CARD}`}>
                        <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
                            {STEPS.map((s) => (
                                <li key={s.n} className="flex items-start gap-3">
                                    <span
                                        className={`w-8 h-8 text-sm font-display font-bold ${CHECK_BUBBLE}`}
                                    >
                                        {s.n}
                                    </span>
                                    <div>
                                        <h3 className="font-display font-bold text-base mb-1">
                                            {s.title}
                                        </h3>
                                        <p className="font-body text-sm text-muted leading-snug">
                                            {s.text}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </motion.div>

                    <motion.div variants={fadeUp} className={`rounded-2xl shadow-md p-6 sm:p-8 ${CARD}`}>
                        <h3 className="font-display font-bold text-xl mb-5">Your first 30 days</h3>
                        <ul className="divide-y divide-current/10">
                            {FIRST_30.map((f) => (
                                <li
                                    key={f.when}
                                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3"
                                >
                                    <span className="font-mono text-xs uppercase tracking-wider text-signal-dim dark:text-signal font-semibold sm:w-24 shrink-0">
                                        {f.when}
                                    </span>
                                    <span className="font-body text-sm">{f.what}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </Section>

                {/* --- RISKS --- */}
                <Section>
                    <SectionHead
                        title="The honest part."
                        sub="Greenpal is early-stage. Here is what to know before you decide."
                    />
                    <motion.ul
                        variants={fadeUp}
                        className={`rounded-[20px] shadow-md p-8 max-w-3xl mx-auto space-y-4 ${CARD}`}
                    >
                        {RISKS.map((r) => (
                            <li key={r} className="flex items-start gap-3 font-body text-sm leading-snug">
                                <span className="mt-0.5 w-5 h-5 rounded-full border border-signal text-signal-dim dark:text-signal flex items-center justify-center shrink-0 font-bold text-xs">
                                    !
                                </span>
                                {r}
                            </li>
                        ))}
                    </motion.ul>
                </Section>

                {/* --- FAQ --- */}
                <Section>
                    <SectionHead title="FAQ" sub="Questions about the Greenpal franchise." />
                    <FaqList />
                </Section>

                {/* --- SMALL PRINT --- */}
                <p className="font-body text-xs text-muted max-w-3xl mx-auto text-center mb-24 leading-relaxed">
                    This page is a summary for information only. It is not a franchise
                    agreement, a disclosure document or an offer to sell a franchise.
                    Under Alberta's Franchises Act, Greenpal gives you a disclosure
                    document before you sign or pay anything. If this page differs from
                    those documents, they govern. Earnings figures are illustrative and
                    not guaranteed.
                </p>

                {/* --- BOTTOM CTA --- */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="relative overflow-hidden rounded-3xl bg-ink text-sand p-8 sm:p-14"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 gp-motif opacity-20 pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-sand leading-tight mb-4">
                            Territories go in order. Yours is still open.
                        </h2>
                        <p className="font-body text-sand/70 text-base md:text-lg mb-8 leading-relaxed">
                            Book a short call with our CEO about your city and your
                            questions. Then review the disclosure document at your own pace.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/contact"
                                className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-lg ${BTN}`}
                            >
                                Start the conversation
                            </Link>
                            <a
                                href="tel:7807195725"
                                className="px-7 py-3.5 rounded-full border border-sand/30 font-display font-semibold text-sm hover:bg-sand/10 transition-all text-sand"
                            >
                                Call 780-719-5725
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
