"use client";

import FAQ from "@/components/FAQAndCTA";
import React, { useEffect } from "react";

export default function EventsPage() {
    useEffect(() => {
        // Automatically load Calendly external script
        const existingScript = document.querySelector(
            'script[src="https://assets.calendly.com/assets/external/widget.js"]'
        );

        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div>
            <div className="bg-surface transition-colors duration-300 min-h-screen text-ink">
                {/* Hero Section */}
                <section className="py-16 md:py-28 border-b line-rule transition-colors duration-300">
                    <div className="container-edit max-w-5xl mx-auto px-4 text-center">
                        <span className="inline-block py-1.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase bg-card border line-rule mb-6 text-[#02d683]">
                            Live Events & Festivals 2026
                        </span>
                        <h1 className="font-display font-bold text-4xl md:text-6xl mb-6 tracking-tight">
                            Portable Charging Stations for Events & Festivals
                        </h1>
                        <p className="font-body text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                            Keep your attendees connected, active, and sharing longer. Greenpal delivers high-capacity, shared portable power-bank rental ecosystems built specifically for high-traffic music festivals, sports arenas, and corporate conferences.
                        </p>
                    </div>
                </section>

                {/* Features Grid Section */}
                <section className="py-20 md:py-28 border-b line-rule transition-colors duration-300">
                    <div className="container-edit max-w-6xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
                                Why Event Producers Choose Greenpal
                            </h2>
                            <p className="font-body text-muted text-lg max-w-2xl mx-auto transition-colors duration-300">
                                Eliminate low-battery anxiety across your venue with enterprise-grade mobile charging infrastructure.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="border line-rule rounded-2xl bg-card p-8 transition-colors duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-bold text-xl mb-6">
                                        01
                                    </div>
                                    <h3 className="font-display font-semibold text-xl mb-3">Seamless Self-Service</h3>
                                    <p className="font-body text-muted leading-relaxed transition-colors duration-300">
                                        Attendees scan a station QR code via web app, grab a power bank instantly, and return it to any terminal on festival grounds without friction.
                                    </p>
                                </div>
                            </div>

                            <div className="border line-rule rounded-2xl bg-card p-8 transition-colors duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-bold text-xl mb-6">
                                        02
                                    </div>
                                    <h3 className="font-display font-semibold text-xl mb-3">High-Density Scalability</h3>
                                    <p className="font-body text-muted leading-relaxed transition-colors duration-300">
                                        Modular station towers designed to handle massive crowd influxes during peak headliner sets with zero downtime or power bottlenecks.
                                    </p>
                                </div>
                            </div>

                            <div className="border line-rule rounded-2xl bg-card p-8 transition-colors duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#02d683]/10 flex items-center justify-center text-[#02d683] font-bold text-xl mb-6">
                                        03
                                    </div>
                                    <h3 className="font-display font-semibold text-xl mb-3">Custom Event Branding</h3>
                                    <p className="font-body text-muted leading-relaxed transition-colors duration-300">
                                        Fully customized hardware body wraps and digital rental screen interfaces tailored to match sponsor guidelines and stage themes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Centered Calendly Booking Section */}
                <section className="py-20 md:py-28 transition-colors duration-300">
                    <div className="container-edit max-w-4xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
                                Schedule an Event Consultation
                            </h2>
                            <p className="font-body text-muted text-lg max-w-xl mx-auto transition-colors duration-300">
                                Book a direct slot with our venue operations team to calculate power requirements and layout placement for your upcoming date.
                            </p>
                        </div>

                        {/* Centered Container */}
                        <div className="border line-rule rounded-2xl bg-card overflow-hidden transition-colors duration-300 p-4 md:p-8 flex justify-center items-center shadow-sm">
                            <div
                                className="calendly-inline-widget w-full"
                                data-url="https://calendly.com/YOUR_ACTUAL_CALENDLY_USERNAME/event-consultation"
                                style={{ minWidth: "320px", height: "700px" }}
                            />
                        </div>
                    </div>
                </section>
            </div>
            <FAQ />
        </div>
    );
}