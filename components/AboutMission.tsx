"use client";

import GPMark from "./GPMark";

export default function AboutMission() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-surface border-b line-rule transition-colors duration-300">
      <div className="container-edit">
        {/* Why We Exist */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-20 md:pb-28 border-b line-rule">
          <div className="lg:col-span-5">
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-signal-dim dark:text-signal mb-3">
              Purpose & Purpose-Driven Power
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight transition-colors duration-300">
              Why We Exist
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <p className="font-body text-xl md:text-2xl font-medium leading-relaxed transition-colors duration-300">
              Phones keep us connected to the people and plans that matter. Greenpal makes it easier to keep going when your battery runs low.
            </p>
            <p className="font-body text-base md:text-lg text-muted leading-relaxed transition-colors duration-300">
              Our mission is to make portable charging a convenient part of everyday life. No searching for wall sockets or leaving your phone behind at an outlet—stay powered wherever you go.
            </p>
          </div>
        </div>

        {/* Simple to Use. Built Around Your Day. */}
        <div className="pt-20 md:pt-28">
          <div className="max-w-3xl mb-14 md:mb-16">
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-signal-dim dark:text-signal mb-3">
              Everyday Simplicity
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6 transition-colors duration-300">
              Simple to Use. Built Around Your Day.
            </h2>
            <p className="font-body text-lg md:text-xl text-muted leading-relaxed transition-colors duration-300">
              Rent a power bank at a Greenpal station, take it with you and return it after use. Follow the instructions at the station to get started. You can keep enjoying your visit while your phone charges.
            </p>
          </div>

          {/* 3 Step Process Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="bg-card border line-rule p-8 rounded-2xl relative shadow-sm hover:border-signal/40 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="w-10 h-10 rounded-xl bg-signal/15 text-signal-dim dark:text-signal font-display font-bold flex items-center justify-center text-lg">
                  1
                </span>
                <span className="text-xs uppercase font-semibold tracking-wider text-muted">
                  Quick Access
                </span>
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl mb-3 transition-colors duration-300">
                Rent at a Station
              </h3>
              <p className="font-body text-sm md:text-base text-muted leading-relaxed transition-colors duration-300">
                Locate any Greenpal Pulse station. Follow the simple on-station instructions to release a fully charged power bank.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card border line-rule p-8 rounded-2xl relative shadow-sm hover:border-signal/40 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="w-10 h-10 rounded-xl bg-signal/15 text-signal-dim dark:text-signal font-display font-bold flex items-center justify-center text-lg">
                  2
                </span>
                <span className="text-xs uppercase font-semibold tracking-wider text-muted">
                  Stay Mobile
                </span>
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl mb-3 transition-colors duration-300">
                Charge on the Move
              </h3>
              <p className="font-body text-sm md:text-base text-muted leading-relaxed transition-colors duration-300">
                Take it with you wherever you go. Keep shopping, eating, working, and enjoying your visit while your phone charges in your pocket or bag.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card border line-rule p-8 rounded-2xl relative shadow-sm hover:border-signal/40 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="w-10 h-10 rounded-xl bg-signal/15 text-signal-dim dark:text-signal font-display font-bold flex items-center justify-center text-lg">
                  3
                </span>
                <span className="text-xs uppercase font-semibold tracking-wider text-muted">
                  Drop Off
                </span>
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl mb-3 transition-colors duration-300">
                Return After Use
              </h3>
              <p className="font-body text-sm md:text-base text-muted leading-relaxed transition-colors duration-300">
                Slide the power bank back into an open slot at any Greenpal station when finished. No cables to carry, no stress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
