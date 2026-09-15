"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

export default function ContactForm() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [submitted, setSubmitted] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setPos({ x, y });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative py-20 md:py-28 bg-ink text-sand">
      <div className="container-edit max-w-2xl">
        {submitted ? (
          <div>
            <p className="font-display text-3xl font-semibold mb-3">Message sent.</p>
            <p className="text-sand/65 font-body">We'll reply from a real person within a day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <Field label="Name" name="name" />
              <Field label="Company" name="company" />
            </div>
            <Field label="Email" name="email" type="email" />
            <Field label="Tell us about the venue" name="message" textarea />

            <motion.button
              ref={btnRef}
              type="submit"
              onMouseMove={handleMove}
              onMouseLeave={() => setPos({ x: 0, y: 0 })}
              animate={{ x: pos.x, y: pos.y }}
              transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
              className="magnetic-btn bg-signal text-ink font-body font-medium px-8 py-4 rounded-full"
            >
              Send message
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-sand/45 mb-2 font-body">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          required
          className="w-full bg-transparent border-b border-sand/25 focus:border-signal outline-none pb-2 font-body text-sand placeholder:text-sand/30 resize-none transition-colors duration-300"
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          className="w-full bg-transparent border-b border-sand/25 focus:border-signal outline-none pb-2 font-body text-sand placeholder:text-sand/30 transition-colors duration-300"
        />
      )}
    </label>
  );
}
