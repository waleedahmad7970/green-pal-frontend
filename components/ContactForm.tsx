"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setPos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      // Replace these 3 strings with your keys from the EmailJS dashboard
      await emailjs.sendForm(
        "service_1jb18su",   // e.g., "service_xyz123"
        "template_qu5qivc",  // e.g., "template_abc456"
        formRef.current,
        "JzUVdWjrfeTC3gVUa"    // e.g., "user_789def..."
      );

      setSubmitted(true);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setServerError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-white text-ink">
      <div className="container-edit max-w-5xl grid md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <Field label="Name" name="name" />
                <Field label="Company" name="company" />
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <Field label="Email" name="email" type="email" />
                <Field label="Phone" name="phone" type="tel" />
              </div>
              <Field label="Tell us about the venue" name="message" textarea />

              {serverError && (
                <p className="text-sm text-red-500 font-body">{serverError}</p>
              )}

              <motion.button
                ref={btnRef}
                type="submit"
                disabled={isSubmitting}
                onMouseMove={handleMove}
                onMouseLeave={() => setPos({ x: 0, y: 0 })}
                animate={{ x: pos.x, y: pos.y }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                  mass: 0.4,
                }}
                className="magnetic-btn bg-[#02d683] text-ink font-body font-bold px-8 py-4 rounded-full cursor-pointer hover:bg-[#02bc73] transition-colors shadow-lg shadow-[#02d683]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </motion.button>
            </form>
          )}
        </div>

        {/* Our Location */}
        <div className="flex flex-col">
          <h3 className="font-display text-2xl font-semibold mb-6 text-ink">
            Our Location
          </h3>

          <div className="relative w-full aspect-[4/3] rounded-2xl border border-ink/10 overflow-hidden mb-8">
            <iframe
              title="Our location"
              src="https://www.google.com/maps?q=123+Greenpal+Ave+Suite+400+Toronto+ON+M5V+2T6+Canada&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="space-y-5 font-body text-sm">
            <div>
              <span className="block text-ink/50 mb-1">Address</span>
              <span className="text-ink font-medium">
                123 Greenpal Ave, Suite 400
                <br />
                Toronto, ON M5V 2T6, Canada
              </span>
            </div>
            <div>
              <span className="block text-ink/50 mb-1">Phone</span>
              <a
                href="tel:+14165551234"
                className="text-ink font-medium hover:text-[#02d683] transition-colors"
              >
                +1 (780) 777‑0519
              </a>
            </div>
            <div>
              <span className="block text-ink/50 mb-1">Email</span>
              <a
                href="mailto:hello@greenpal.com"
                className="text-ink font-medium hover:text-[#02d683] transition-colors"
              >
                hello@greenpal.com
              </a>
            </div>
            <div>
              <span className="block text-ink/50 mb-1">Hours</span>
              <span className="text-ink font-medium">
                Mon–Fri, 9:00 AM – 6:00 PM EST
              </span>
            </div>
          </div>

          <a
            href="https://wa.me/+17807770519?text=Hi%2C%20I%27d%20like%20to%20ask%20about%20a%20Greenpal%20station."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-body font-bold px-6 py-3.5 rounded-full hover:bg-[#1ebe5a] transition-colors shadow-lg shadow-[#25D366]/20 w-fit"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.3c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
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