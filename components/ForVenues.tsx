"use client";

const venues = [
  "Restaurants",
  "Gyms",
  "Clinics",
  "Entertainment",
  "Shopping",
  "Campuses",
  "Hotels",
  "Events",
];

export default function ForVenues() {
  return (
    <section className="bg-surface transition-colors duration-300 py-24 md:py-32 border-t line-rule">
      <div className="container-edit flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Label */}
        <h2 className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] dark:text-green-400 mb-6 transition-colors duration-300">
          For venues
        </h2>

        {/* Main Heading - Inherits standard light/dark text color */}
        <h3 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight transition-colors duration-300">
          Give Your Guests Power Without Adding Friction.
        </h3>

        {/* Description */}
        <p className="font-body text-lg md:text-xl text-muted dark:text-gray-400 leading-relaxed mb-12 md:mb-16 transition-colors duration-300">
          Greenpal helps venues add portable charging as a convenient customer
          amenity. The station is designed for self-service use, making it
          suitable for places where customers spend time and depend on their
          phones.
        </p>

        {/* Venues Pill Grid */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
          {venues.map((venue) => (
            <span
              key={venue}
              className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 font-body font-medium text-base md:text-lg transition-colors duration-300 bg-card hover:border-[#02d683] dark:hover:border-green-400"
            >
              {venue}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-display font-bold text-lg hover:scale-105 transition-transform duration-300"
        >
          Become a Greenpal Host Location
        </a>
      </div>
    </section>
  );
}
