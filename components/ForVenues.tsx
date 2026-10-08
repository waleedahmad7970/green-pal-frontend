// "use client";

// import { motion } from "framer-motion";

// const venues = [
//   "Restaurants",
//   "Gyms",
//   "Clinics",
//   "Entertainment",
//   "Shopping",
//   "Campuses",
//   "Hotels",
//   "Events",
// ];

// export default function ForVenues() {
//   // Triple the array to guarantee a seamless loop width on ultra-wide screens
//   const marqueeItems = [...venues, ...venues, ...venues];

//   return (
//     <section className="bg-surface transition-colors duration-300 py-10 md:py-32 border-t line-rule overflow-hidden">
//       <div className="container-edit flex flex-col items-center text-center max-w-4xl mx-auto">
//         {/* Label */}
//         <h2 className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] dark:text-green-400 mb-6 transition-colors duration-300">
//           For venues
//         </h2>

//         {/* Main Heading */}
//         <h3 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight transition-colors duration-300">
//           Give Your Guests Power Without Adding Friction.
//         </h3>

//         {/* Description */}
//         <p className="font-body text-lg md:text-xl text-muted dark:text-gray-400 leading-relaxed mb-12 md:mb-16 transition-colors duration-300">
//           Greenpal helps venues add portable charging as a convenient customer
//           amenity. The station is designed for self-service use, making it
//           suitable for places where customers spend time and depend on their
//           phones.
//         </p>
//       </div>

//       {/* Venues Framer Motion Marquee Slider */}
//       <div className="relative w-full overflow-hidden mb-16 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
//         <motion.div
//           className="flex gap-3 md:gap-4 w-max"
//           animate={{ x: ["0%", "-33.333%"] }}
//           transition={{
//             ease: "linear",
//             duration: 25,
//             repeat: Infinity,
//           }}
//         >
//           {marqueeItems.map((venue, index) => (
//             <span
//               key={`${venue}-${index}`}
//               className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 font-body font-medium text-base md:text-lg transition-colors duration-300 bg-card hover:border-[#02d683] dark:hover:border-green-400 whitespace-nowrap shrink-0"
//             >
//               {venue}
//             </span>
//           ))}
//         </motion.div>
//       </div>

//       <div className="container-edit flex flex-col items-center text-center max-w-4xl mx-auto">
//         {/* CTA Button */}
//         <a
//           href="/contact"
//           className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-display font-bold text-lg hover:scale-105 transition-transform duration-300"
//         >
//           Become a Greenpal Host Location
//         </a>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Dumbbell,
  Stethoscope,
  PartyPopper,
  ShoppingBag,
  GraduationCap,
  Hotel,
  CalendarDays
} from "lucide-react";

// Map venues to their respective Lucide icons
const venues = [
  { name: "Restaurants", icon: UtensilsCrossed },
  { name: "Gyms", icon: Dumbbell },
  { name: "Clinics", icon: Stethoscope },
  { name: "Entertainment", icon: PartyPopper },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Campuses", icon: GraduationCap },
  { name: "Hotels", icon: Hotel },
  { name: "Events", icon: CalendarDays },
];

export default function ForVenues() {
  // Triple the array to guarantee a seamless loop width on ultra-wide screens
  const marqueeItems = [...venues, ...venues, ...venues];

  return (
    <section className="bg-surface transition-colors duration-300 py-10 md:py-32 border-t line-rule overflow-hidden">
      <div className="container-edit flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        {/* Label */}
        <h2 className="font-body text-sm font-bold uppercase tracking-widest text-[#02d683] dark:text-green-400 mb-6 transition-colors duration-300">
          For venues
        </h2>

        {/* Main Heading */}
        <h3 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight transition-colors duration-300">
          Give Your Guests Power Without Adding Friction.
        </h3>

        {/* Description */}
        <div className="flex flex-col gap-2 font-body text-lg md:text-xl text-muted dark:text-gray-400 leading-relaxed mb-12 md:mb-16 transition-colors duration-300">
          <p>
            Greenpal helps venues add portable charging as a convenient customer
            amenity. The station is designed for self-service use, making it
            suitable for places where customers spend time and depend on their
            phones.
          </p>
          <p>Your branding and promos on the station screen.</p>
          <p>Right-sized for your traffic: Pulse 48 for 1,000+ visitors a day, Pulse 24 for 200-1,000, Pulse 12 for 50-200, Pulse 8 for under 50.</p>
        </div>
      </div>

      {/* Venues Framer Motion Marquee Slider */}
      <div className="relative w-full overflow-hidden mb-16 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
        >
          {marqueeItems.map((venue, index) => {
            const IconComponent = venue.icon;
            return (
              <div
                key={`${venue.name}-${index}`}
                className="group flex flex-col items-center justify-center gap-3 px-8 py-6 rounded-2xl border border-black/10 dark:border-white/10 font-body font-medium text-base md:text-lg transition-all duration-300 bg-card hover:border-[#02d683] dark:hover:border-green-400 hover:shadow-xl hover:shadow-[#02d683]/10 min-w-[160px] md:min-w-[180px] shrink-0 cursor-default"
              >
                <IconComponent className="w-9 h-9 md:w-11 md:h-11 text-[#02d683] dark:text-green-400 transition-transform duration-300 group-hover:scale-110" />
                <span className="whitespace-nowrap">{venue.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="container-edit flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        {/* CTA Button */}
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signal text-ink font-display font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-md"
        >
          Become a Greenpal Host Location
        </a>
      </div>
    </section>
  );
}