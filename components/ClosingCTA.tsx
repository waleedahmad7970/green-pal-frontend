"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

export default function ClosingCTA() {
  const btnRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    });
  };

  return (
    <section className="relative py-28 md:py-44 bg-ink text-sand overflow-hidden">
      <div className="absolute inset-0 gp-motif" aria-hidden="true" />
      <div className="container-edit relative flex flex-col items-start">
        <h2 className="font-display font-bold text-2xl text-sand max-w-3xl mb-4">
          Ready when you are
        </h2>

        <h2 className="font-display font-extrabold text-display-lg text-sand max-w-3xl mb-6">
          Stay Powered. Bring Greenpal to Your Location.{" "}
        </h2>

        <h2 className="font-display font-medium text-xl md:text-2xl text-sand/80 max-w-3xl mb-12">
          Host portable charging for your customers or explore a Greenpal
          business blueprint.{" "}
        </h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start w-full">
          <motion.div
            ref={btnRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 12,
              mass: 0.4,
            }}
            className="w-full md:w-auto"
          >
            <Link
              href="/contact"
              className="inline-flex justify-center w-full md:w-auto items-center gap-2 md:gap-4 bg-signal text-ink font-body font-medium px-6 py-3 md:px-10 md:py-5 rounded-full text-base md:text-lg max-w-max"
            >
              Host a Greenpal Station{" "}
            </Link>
          </motion.div>
          <motion.div
            ref={btnRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 12,
              mass: 0.4,
            }}
            className="w-full md:w-auto"
          >
            <Link
              href="/contact"
              className="inline-flex justify-center w-full md:w-auto items-center gap-2 md:gap-4 bg-signal text-ink font-body font-medium px-6 py-3 md:px-10 md:py-5 rounded-full text-base md:text-lg max-w-max"
            >
              Explore Business Blueprints
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
