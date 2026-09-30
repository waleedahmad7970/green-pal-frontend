"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const stationTabs = [
    {
        id: "mega",
        label: "Mega Tower (48+ Slots)",
        badge: "High Capacity • Main Stages",
        title: "The Ultimate High-Traffic Power Hub",
        description:
            "Engineered for heavy crowd density at main music festival stages, central food courts, and stadium gates. Delivers simultaneous high-speed power bank rentals and automated returns with zero bottlenecking.",
        specs: ["48+ Fast-Charge Bays", "Dual-Sided Touch Displays", "Smart Load Balancing", "Instant QR Code Checkout"],
    },
    {
        id: "hub",
        label: "Portable Hub (12-24 Slots)",
        badge: "Compact • VIP & Backstage",
        title: "Flexible Power for Intimate Zones",
        description:
            "Optimized for VIP lounges, artist green rooms, sponsor activations, and secondary stages where floor space is limited but uninterrupted connectivity is essential.",
        specs: ["12 to 24 Slot Variants", "Lightweight Modular Build", "Battery Backup Included", "Custom Branding Wraps"],
    },
    {
        id: "pro",
        label: "Festival Pro (Outdoor)",
        badge: "Weatherproof • Open Grounds",
        title: "Built for Extreme Outdoor Elements",
        description:
            "Fully weather-sealed with IP54 dust and splash protection, anti-glare high-brightness screens for direct sunlight, and ruggedized housing for open-air festival fields.",
        specs: ["IP54 Weather Resistance", "Sunlight-Readable Screens", "Surge & Thermal Protection", "All-Terrain Stability Base"],
    },
];

export default function EventsPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        // 1. Load Calendly Script
        const existingScript = document.querySelector(
            'script[src="https://assets.calendly.com/assets/external/widget.js"]'
        );
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;
            document.body.appendChild(script);
        }

        // 2. GSAP Entrance Animations
        const ctx = gsap.context(() => {
            gsap.from(".gsap-reveal", {
                opacity: 0,
                y: 35,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="bg-surface transition-colors duration-300 min-h-screen overflow-hidden">

            {/* 1. HERO SECTION */}
            <section className="py-24 md:py-36 border-b line-rule transition-colors duration-300 relative">
                <div className="container-edit max-w-5xl mx-auto px-4 text-center relative z-10">
                    <div className="gsap-reveal inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase bg-card border line-rule mb-6 text-[#02d683] shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#02d683] animate-pulse"></span>
                        Live Events & Festivals 2026 Ecosystem
                    </div>
                    <h1 className="gsap-reveal font-display font-bold text-4xl md:text-7xl mb-6 tracking-tight leading-tight">
                        Portable Charging Infrastructure for Major Events
                    </h1>
                    <p className="gsap-reveal font-body text-lg md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed transition-colors duration-300 mb-10">
                        Eliminate low-battery anxiety, keep crowds engaged longer, and unlock new sponsor revenue streams with Greenpal’s high-capacity power bank rental ecosystem.
                    </p>
                    <div className="gsap-reveal flex flex-wrap justify-center gap-4">
                        <a
                            href="#schedule-call"
                            className="bg-[#02d683] text-black font-semibold px-8 py-4 rounded-2xl transition hover:opacity-90 shadow-lg text-lg"
                        >
                            Book Event Consultation
                        </a>
                        <Link
                            href="/contact"
                            className="border line-rule bg-card font-semibold px-8 py-4 rounded-2xl transition hover:bg-surface text-lg inline-flex items-center justify-center"
                        >
                            Contact Sales Team →
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. TRUSTED PARTNERS / FESTIVALS BAR */}
            <section className="py-10 border-b line-rule transition-colors duration-300 bg-card/30">
                <div className="container-edit max-w-6xl mx-auto px-4 text-center">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-6">
                        Trusted by top music producers, sports arenas & outdoor festival organizers nationwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75 font-display font-bold text-lg md:text-xl tracking-wider">
                        <span>COASTAL VIBES</span>
                        <span>ECHO FEST</span>
                        <span>METRO ARENA</span>
                        <span>SUMMERBEAT</span>
                        <span>APEX GATHERINGS</span>
                    </div>
                </div>
            </section>

            {/* 3. INTERACTIVE STATION CONFIGURATION TABS (Replaces basic slider) */}
            <section className="py-24 md:py-32 border-b line-rule transition-colors duration-300">
                <div className="container-edit max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block py-1.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase bg-card border line-rule mb-4 text-[#02d683]">
                            Hardware Architecture
                        </span>
                        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
                            Designed for Any Venue Layout
                        </h2>
                        <p className="font-body text-muted text-lg max-w-2xl mx-auto">
                            Switch between our core station models to inspect capacity, power specs, and optimal placement zones.
                        </p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {stationTabs.map((tab, idx) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(idx)}
                                className={`px-6 py-3 rounded-2xl font-display font-semibold text-sm md:text-base transition-all duration-300 border ${activeTab === idx
                                        ? "bg-[#02d683] text-black border-[#02d683] shadow-md scale-105"
                                        : "bg-card border line-rule text-muted hover:border-[#02d683]/50"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Content Card */}
                    <div className="border line-rule rounded-3xl bg-card p-8 md:p-14 shadow-2xl transition-all duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-[#02d683] bg-[#02d683]/10 uppercase tracking-wider mb-4">
                                    {stationTabs[activeTab].badge}
                                </span>
                                <h3 className="font-display font-bold text-2xl md:text-4xl mb-4">
                                    {stationTabs[activeTab].title}
                                </h3>
                                <p className="font-body text-muted text-lg leading-relaxed mb-8">
                                    {stationTabs[activeTab].description}
                                </p>
                                <div className="flex flex-col gap-3 mb-8">
                                    {stationTabs[activeTab].specs.map((spec, i) => (
                                        <div key={i} className="flex items-center gap-3 font-body text-sm">
                                            <span className="w-5 h-5 rounded-full bg-[#02d683]/20 text-[#02d683] flex items-center justify-center font-bold text-xs">✓</span>
                                            <span>{spec}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-[#02d683] text-black font-semibold px-6 py-3 rounded-xl transition hover:opacity-90 shadow-sm"
                                >
                                    Request This Model Quote →
                                </Link>
                            </div>

                            {/* Visual Graphic Representation Box */}
                            <div className="border line-rule rounded-2xl bg-surface p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#02d683]/5 to-transparent pointer-events-none"></div>
                                <div className="w-20 h-20 rounded-3xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-display font-bold text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    ⚡
                                </div>
                                <h4 className="font-display font-bold text-xl mb-2">{stationTabs[activeTab].label}</h4>
                                <p className="font-body text-xs text-muted max-w-xs">
                                    Fully integrated with real-time cloud analytics, automated billing, and secure locking bays.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. WHY CHOOSE GREENPAL (Advanced Grid with Icon Cards) */}
            <section className="py-24 md:py-32 border-b line-rule transition-colors duration-300 bg-card/20">
                <div className="container-edit max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
                            Built for Event Scale & Reliability
                        </h2>
                        <p className="font-body text-muted text-lg max-w-2xl mx-auto">
                            Everything event planners need to deliver flawless mobile power without adding operational overhead.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="border line-rule rounded-2xl bg-card p-8 transition-all duration-300 hover:border-[#02d683]/50">
                            <div className="w-14 h-14 rounded-2xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-bold text-2xl mb-6">
                                01
                            </div>
                            <h3 className="font-display font-semibold text-xl mb-3">Frictionless Web App Rentals</h3>
                            <p className="font-body text-muted leading-relaxed">
                                No app downloads required. Attendees scan the station QR code, authorize via secure mobile checkout, and grab a power bank in under 10 seconds.
                            </p>
                        </div>

                        <div className="border line-rule rounded-2xl bg-card p-8 transition-all duration-300 hover:border-[#02d683]/50">
                            <div className="w-14 h-14 rounded-2xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-bold text-2xl mb-6">
                                02
                            </div>
                            <h3 className="font-display font-semibold text-xl mb-3">Real-Time Telemetry & Reports</h3>
                            <p className="font-body text-muted leading-relaxed">
                                Monitor station inventory levels, live rental velocity, and battery health remotely through our dedicated organizer portal.
                            </p>
                        </div>

                        <div className="border line-rule rounded-2xl bg-card p-8 transition-all duration-300 hover:border-[#02d683]/50">
                            <div className="w-14 h-14 rounded-2xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-bold text-2xl mb-6">
                                03
                            </div>
                            <h3 className="font-display font-semibold text-xl mb-3">Zero Logistics Hassle</h3>
                            <p className="font-body text-muted leading-relaxed">
                                Units arrive pre-charged and pre-configured. We provide end-to-end white-glove setup, on-site technical backup, and rapid post-event teardown.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. IMPACT STATS BANNER */}
            <section className="py-16 border-b line-rule transition-colors duration-300 bg-card/60">
                <div className="container-edit max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="border line-rule rounded-2xl bg-card p-6 shadow-sm">
                            <div className="font-display font-bold text-3xl md:text-4xl text-[#02d683] mb-2">500+</div>
                            <div className="font-body text-sm text-muted">Festivals Powered</div>
                        </div>
                        <div className="border line-rule rounded-2xl bg-card p-6 shadow-sm">
                            <div className="font-display font-bold text-3xl md:text-4xl text-[#02d683] mb-2">99.9%</div>
                            <div className="font-body text-sm text-muted">Network Uptime</div>
                        </div>
                        <div className="border line-rule rounded-2xl bg-card p-6 shadow-sm">
                            <div className="font-display font-bold text-3xl md:text-4xl text-[#02d683] mb-2">10M+</div>
                            <div className="font-body text-sm text-muted">Successful Charges</div>
                        </div>
                        <div className="border line-rule rounded-2xl bg-card p-6 shadow-sm">
                            <div className="font-display font-bold text-3xl md:text-4xl text-[#02d683] mb-2">24/7</div>
                            <div className="font-body text-sm text-muted">On-Site Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. MID-PAGE CTA BANNER TO CONTACT */}
            <section className="py-20 border-b line-rule transition-colors duration-300 bg-[#02d683]/5">
                <div className="container-edit max-w-4xl mx-auto px-4 text-center">
                    <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                        Planning a Multi-City Tour or Custom Sponsorship?
                    </h2>
                    <p className="font-body text-muted text-lg max-w-2xl mx-auto mb-8">
                        Our team specializes in customized enterprise rollouts, brand-sponsored power banks, and dedicated technical crews.
                    </p>
                    <Link
                        href="/contact"
                        className="bg-[#02d683] text-black font-semibold px-8 py-4 rounded-2xl transition hover:opacity-90 shadow-md inline-block text-lg"
                    >
                        Get in Touch With Our Team
                    </Link>
                </div>
            </section>

            {/* 7. CENTERED CALENDLY BOOKING SECTION */}
            <section id="schedule-call" className="py-24 md:py-36 transition-colors duration-300">
                <div className="container-edit max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block py-1.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase bg-card border line-rule mb-4 text-[#02d683]">
                            Direct Scheduling
                        </span>
                        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
                            Schedule an Event Consultation
                        </h2>
                        <p className="font-body text-muted text-lg max-w-xl mx-auto transition-colors duration-300">
                            Pick a direct slot with our venue operations team below to calculate power requirements and layout placement for your upcoming date.
                        </p>
                    </div>

                    {/* Centered Widget Container */}
                    <div className="border line-rule rounded-3xl bg-card overflow-hidden transition-colors duration-300 p-4 md:p-8 flex justify-center items-center shadow-2xl mb-8">
                        <div
                            className="calendly-inline-widget w-full"
                            data-url="https://calendly.com/YOUR_ACTUAL_CALENDLY_USERNAME/event-consultation"
                            style={{ minWidth: "320px", height: "700px" }}
                        />
                    </div>

                    {/* Bottom Contact Page Fallback CTA */}
                    <div className="text-center mt-8">
                        <p className="font-body text-muted mb-4">Prefer writing us an email directly instead of booking a call?</p>
                        <Link
                            href="/contact"
                            className="inline-block border line-rule bg-card font-semibold px-6 py-3 rounded-xl transition hover:bg-surface shadow-sm"
                        >
                            Go to Contact Form →
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}