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
    <section className="relative py-20 md:py-28 bg-white text-ink">
      <div className="container-edit max-w-2xl">
        {submitted ? (
          <div>
            <p className="font-display text-3xl font-semibold mb-3 text-ink">
              Message sent.
            </p>
            <p className="text-muted font-body">
              We'll reply from a real person within a day.
            </p>
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
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                mass: 0.4,
              }}
              className="magnetic-btn bg-[#02d683] text-ink font-body font-bold px-8 py-4 rounded-full cursor-pointer hover:bg-[#02bc73] transition-colors shadow-lg shadow-[#02d683]/20"
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
      <span className="block text-sm text-ink/70 mb-2 font-body font-medium">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          required
          className="w-full bg-transparent border-b-2 border-ink/25 focus:border-[#02d683] outline-none pb-2 font-body text-ink placeholder:text-ink/30 resize-none transition-colors duration-300"
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          className="w-full bg-transparent border-b-2 border-ink/25 focus:border-[#02d683] outline-none pb-2 font-body text-ink placeholder:text-ink/30 transition-colors duration-300"
        />
      )}
    </label>
  );
}
