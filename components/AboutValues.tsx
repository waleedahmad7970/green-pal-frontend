"use client";

import GPMark from "./GPMark";

const drivers = [
  {
    title: "Convenience",
    tagline: "Power where people already spend time.",
    description:
      "Available across everyday spots—restaurants, shops, transit points, and venues—so charging is right there when you need it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Freedom",
    tagline: "Portable charging that moves with you.",
    description:
      "No waiting around tied to an electrical wall outlet. Take power with you, keep moving, and charge as you live your life.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Shared use",
    tagline: "Power banks designed to be borrowed, returned and used again.",
    description:
      "A sustainable, shared-infrastructure approach. Borrow a high-grade power bank when you need power and return it for the next visitor.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "Partnership",
    tagline: "Working with local businesses to make charging easier to access.",
    description:
      "Collaborating with Canadian venues, retail partners, and hospitality locations to provide an effortless guest amenity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function AboutValues() {
  return (
    <section className="py-20 md:py-28 bg-surface-dim border-b line-rule transition-colors duration-300">
      <div className="container-edit">
        <div className="max-w-2xl mb-14 md:mb-16">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-signal-dim dark:text-signal mb-3">
            Core Principles
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-4 transition-colors duration-300">
            What Drives Greenpal
          </h2>
          <p className="font-body text-base md:text-lg text-muted transition-colors duration-300">
            Four guiding commitments behind every Greenpal Pulse station and power bank deployment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.title}
              className="bg-card border line-rule p-8 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-signal/40 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-signal/15 text-signal-dim dark:text-signal flex items-center justify-center mb-6">
                  {driver.icon}
                </div>
                <h3 className="font-display font-bold text-2xl mb-2 transition-colors duration-300">
                  {driver.title}
                </h3>
                <p className="font-body text-sm font-semibold text-signal-dim dark:text-signal mb-3">
                  {driver.tagline}
                </p>
                <p className="font-body text-sm text-muted leading-relaxed transition-colors duration-300">
                  {driver.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
