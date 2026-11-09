"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const BTN =
    "bg-signal text-ink font-body font-bold hover:bg-signal-dim transition-all duration-200 shadow-xl shadow-signal/20";
const CARD = "bg-card";
const CHECK_BUBBLE =
    "bg-signal text-ink flex items-center justify-center shrink-0 rounded-full";

// ---------- CONFIG (edit content here) ----------
// The pay links are the Stripe Payment Links. Put them in .env.local:
//   NEXT_PUBLIC_DEPOSIT_COINVESTMENT_URL=https://buy.stripe.com/...
//   NEXT_PUBLIC_DEPOSIT_FRANCHISE_URL=https://buy.stripe.com/...
//   NEXT_PUBLIC_DEPOSIT_PREMIUM_URL=https://buy.stripe.com/...
//   NEXT_PUBLIC_DEPOSIT_COINVEST_STAKE_URL=https://buy.stripe.com/...
const DEPOSITS = [
    {
        key: "coinvestment",
        title: "Co-Investment",
        label: "Initial deposit",
        amount: "$500",
        currency: "CAD",
        text: "Reserve your place as a Greenpal co-investment partner with an initial deposit.",
        url: process.env.NEXT_PUBLIC_DEPOSIT_COINVESTMENT_URL || "",
    },
    {
        key: "franchise",
        title: "Franchise",
        label: "Initial deposit",
        amount: "$600",
        currency: "CAD",
        text: "Reserve your territory as a Greenpal franchise partner with an initial deposit.",
        url: process.env.NEXT_PUBLIC_DEPOSIT_FRANCHISE_URL || "",
    },
    {
        key: "premium",
        title: "Premium",
        label: "Initial deposit",
        amount: "$2,000",
        currency: "CAD",
        text: "Reserve your premium Greenpal package with an initial deposit.",
        url: process.env.NEXT_PUBLIC_DEPOSIT_PREMIUM_URL || "",
    },
    {
        key: "coinvest_stake",
        title: "Co-Invest 25% Stake",
        label: "Full payment",
        amount: "$5,000",
        currency: "CAD",
        text: "Co-invest in two 24-slot stations and one 48-slot station at a 25% stake, paid in full.",
        buttonLabel: "Pay $5,000 in full",
        url: process.env.NEXT_PUBLIC_DEPOSIT_COINVEST_STAKE_URL || "",
    },
];

const STEPS = [
    { n: "1", title: "Choose", text: "Pick the deposit that matches what you are reserving." },
    { n: "2", title: "Pay securely", text: "Pay by card on Stripe's secure page. Enter your name, email and phone." },
    { n: "3", title: "We contact you", text: "You get a confirmation email, and our team reaches out with the next steps." },
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

function QrCode({ value, label }: { value: string; label: string }) {
    const [src, setSrc] = useState("");

    useEffect(() => {
        let cancelled = false;
        import("qrcode")
            .then((QR) =>
                QR.toDataURL(value, { margin: 1, width: 640, color: { dark: "#0b1a12", light: "#ffffff" } })
            )
            .then((url) => !cancelled && setSrc(url))
            .catch(() => !cancelled && setSrc(""));
        return () => {
            cancelled = true;
        };
    }, [value]);

    if (!src) return <div className="w-56 h-56 sm:w-60 sm:h-60 rounded-2xl bg-surface animate-pulse" />;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`QR code to pay the ${label} deposit`} className="w-56 h-56 sm:w-60 sm:h-60 rounded-2xl bg-white p-3" />;
}

export default function BookPage() {
    return (
        <div className="min-h-screen bg-surface text-current transition-colors duration-500 pt-28 md:pt-36 pb-28">
            <div className="relative z-10 container-edit">
                {/* --- HERO --- */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="text-center max-w-3xl mx-auto mb-16"
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
                            Reserve with a deposit
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.04] mb-6"
                    >
                        Secure your spot with{" "}
                        <span className="accent inline-block">an initial deposit.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="font-body text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed"
                    >
                        Pay by card online, or scan a QR code with your phone. All amounts are in Canadian dollars.
                    </motion.p>
                </motion.div>

                {/* --- DEPOSIT CARDS --- */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-10"
                >
                    {DEPOSITS.map((d) => (
                        <motion.div
                            key={d.key}
                            variants={fadeUp}
                            className={`flex flex-col items-center text-center rounded-[20px] shadow-lg p-8 sm:p-10 ${CARD}`}
                        >
                            <span className="font-mono text-xs uppercase tracking-wider text-signal-dim dark:text-signal font-semibold mb-2">
                                {d.label}
                            </span>
                            <h2 className="font-display font-bold text-2xl tracking-tight mb-4">
                                {d.title}
                            </h2>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="font-display font-extrabold text-6xl tracking-tight">
                                    {d.amount}
                                </span>
                                <span className="font-display font-bold text-lg text-muted">
                                    {d.currency}
                                </span>
                            </div>
                            <p className="font-body text-sm text-muted leading-relaxed mb-8 max-w-xs">
                                {d.text}
                            </p>

                            {d.url ? (
                                <>
                                    <a
                                        href={d.url}
                                        className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-base mb-8 ${BTN}`}
                                    >
                                        {d.buttonLabel ?? `Pay ${d.amount} deposit`}
                                    </a>
                                    <QrCode value={d.url} label={d.title} />
                                    <p className="font-body text-xs text-muted mt-3">
                                        Or scan with your phone
                                    </p>
                                </>
                            ) : (
                                <span className="px-8 py-4 rounded-full border border-signal/40 font-display font-semibold text-sm text-muted">
                                    Available soon
                                </span>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                <p className="font-body text-sm text-center max-w-2xl mx-auto mb-24 leading-relaxed">
                    <strong>Deposits are non-refundable.</strong>{" "}
                    <span className="text-muted">
                        Please make sure you are ready to proceed before paying.
                    </span>
                </p>

                {/* --- HOW IT WORKS --- */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-4xl mx-auto mb-24"
                >
                    <motion.h2
                        variants={fadeUp}
                        className="font-display font-bold text-3xl md:text-4xl tracking-tight text-center mb-10"
                    >
                        How it works.
                    </motion.h2>
                    <motion.ol
                        variants={fadeUp}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl shadow-md p-6 sm:p-8 ${CARD}`}
                    >
                        {STEPS.map((s) => (
                            <li key={s.n} className="flex items-start gap-3">
                                <span className={`w-8 h-8 text-sm font-display font-bold ${CHECK_BUBBLE}`}>
                                    {s.n}
                                </span>
                                <div>
                                    <h3 className="font-display font-bold text-base mb-1">{s.title}</h3>
                                    <p className="font-body text-sm text-muted leading-snug">{s.text}</p>
                                </div>
                            </li>
                        ))}
                    </motion.ol>
                </motion.div>

                <p className="font-body text-center text-sm text-muted">
                    Questions first?{" "}
                    <Link href="/contact" className="text-signal-dim dark:text-signal font-semibold hover:underline">
                        Contact us
                    </Link>
                </p>
            </div>
        </div>
    );
}
