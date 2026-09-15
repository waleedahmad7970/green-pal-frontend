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
        <h2 className="font-display font-extrabold text-display-lg text-sand max-w-3xl mb-12">
          Let's put a station where it's needed.
        </h2>
        <motion.div
          ref={btnRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setPos({ x: 0, y: 0 })}
          animate={{ x: pos.x, y: pos.y }}
          transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-4 bg-signal text-ink font-body font-medium px-10 py-5 rounded-full text-lg"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
