"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { submitContact } from "@/lib/site/services/contact";
const ContactLocationsMap = dynamic(() => import("./Contactlocationsmap"), {
  ssr: false,
});
// Leaflet needs the browser (window), so load it on the client only

// Business hours are Mon-Fri 9 AM - 6 PM MT (Edmonton)
const AVAILABILITY_SLOTS = [
  "Morning (9 AM – 12 PM MT)",
  "Afternoon (12 – 4 PM MT)",
  "Evening (4 – 6 PM MT)",
  "Anytime",
];

// Canadian / North American numbers: (780) 719-5725
const formatCanadianPhone = (raw: string) => {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("1")) digits = digits.slice(1); // drop the +1 country code
  digits = digits.slice(0, 10);
  if (digits.length < 4) return digits.length ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// 10 digits; area code and exchange cannot start with 0 or 1
const isValidCanadianPhone = (value: string) =>
  /^[2-9]\d{2}[2-9]\d{6}$/.test(value.replace(/\D/g, ""));

export default function ContactForm() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setPos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    if (!isValidCanadianPhone(phone)) {
      setPhoneError("Enter a valid Canadian phone number, e.g. (780) 555-1234");
      return;
    }
    setPhoneError(null);

    setIsSubmitting(true);
    setServerError(null);

    try {
      // 1. Extract data directly from the form submission
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const venue = formData.get("venue") as string;
      const email = formData.get("email") as string;
      const userMessage = formData.get("message") as string;
      const availability = ((formData.get("availability") as string) || "").trim();

      // 2. Format the message to include the venue name
      const finalMessage = venue
        ? `Venue: ${venue}\n\n${userMessage}`
        : userMessage;

      // 3. Send the request to your backend via the custom API client
      const response = await submitContact({
        name,
        email,
        phone: `+1 ${phone}`,
        availability,
        subject: `New Venue Inquiry from ${name}`,
        message: finalMessage,
      });

      // 4. Handle success or failure from your Node.js backend
      if (response && response.success !== false) {
        setSubmitted(true);
      } else {
        throw new Error(response.message || "Failed to send message.");
      }
    } catch (error: any) {
      console.error("API Submission Error:", error);
      setServerError(
        error.message || "Failed to send message. Please try again.",
      );
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
                <Field label="Email" name="email" type="email" />
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <Field
                  label="Phone (Canada)"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(780) 555-1234"
                  value={phone}
                  onChange={(v) => {
                    setPhone(formatCanadianPhone(v));
                    if (phoneError) setPhoneError(null);
                  }}
                  error={phoneError}
                />
                <Field
                  label="Preferred availability"
                  name="availability"
                  placeholder="Select a time slot"
                  options={AVAILABILITY_SLOTS}
                  required={false}
                />
              </div>
              <Field label="Venue" name="venue" />
              <Field label="Message" name="message" textarea />

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
            Our Locations
          </h3>

          <div className="relative w-full aspect-[4/3] rounded-2xl border border-ink/10 overflow-hidden mb-8">
            <ContactLocationsMap />
          </div>

          <div className="space-y-5 font-body text-sm">
            <div>
              <span className="block text-ink/50 mb-1">Phone</span>
              <a
                href="tel:+17807195725"
                className="text-ink font-medium hover:text-signal transition-colors"
              >
                +1-780-719-5725
              </a>
            </div>
            <div>
              <span className="block text-ink/50 mb-1">Email</span>
              <a
                href="mailto:info@thegreenpal.ca"
                className="text-ink font-medium hover:text-signal transition-colors"
              >
                info@thegreenpal.ca
              </a>
            </div>
            <div>
              <span className="block text-ink/50 mb-1">Hours</span>
              <span className="text-ink font-medium">
                Mon–Fri, 9:00 AM – 6:00 PM MT (Edmonton)
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=info@thegreenpal.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#0b0b0b] text-white font-body font-bold px-6 py-3.5 rounded-full hover:opacity-80 transition-opacity w-fit"
            >
              Email us: info@thegreenpal.ca
            </a>
            <a
              href="https://wa.me/+17807195725?text=Hi%2C%20I%27d%20like%20to%20ask%20about%20a%20Greenpal%20station."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-body font-bold px-6 py-3.5 rounded-full hover:bg-[#1ebe5a] transition-colors shadow-lg shadow-[#25D366]/20 w-fit"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.3c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
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
  options,
  required = true,
  placeholder,
  inputMode,
  autoComplete,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
}) {
  const box = `w-full bg-transparent border-b-2 ${
    error ? "border-red-500" : "border-ink/25 focus:border-[#02d683]"
  } outline-none pb-2 font-body text-ink placeholder:text-ink/30 transition-colors duration-300`;

  return (
    <label className="block">
      <span className="block text-sm text-ink/70 mb-2 font-body font-medium">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          required={required}
          className={`${box} resize-none`}
        />
      ) : options ? (
        <div className="relative">
          <select
            name={name}
            required={required}
            defaultValue=""
            className={`${box} appearance-none pr-8 cursor-pointer`}
          >
            <option value="">{placeholder || "Select"}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 absolute right-1 top-1/2 -translate-y-[70%] text-ink/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          {...(onChange ? { value, onChange: (e) => onChange(e.target.value) } : {})}
          className={box}
        />
      )}
      {error && <span className="block text-xs text-red-500 mt-1.5 font-body">{error}</span>}
    </label>
  );
}
