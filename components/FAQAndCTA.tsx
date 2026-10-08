"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What does it cost?",
    answer: "Pay by the hour. You only pay for the time you rent a portable power bank.",
  },
  {
    question: "What station sizes are there?",
    answer: "Four: the Pulse 8 and Pulse 12 countertop stations, and the Pulse 24 and Pulse 48 floor totems.",
  },
  {
    question: "How do venues earn?",
    answer: "Venues share revenue on every rental - plus their own branding and promos on the station screen.",
  },
  {
    question: "Can the screen show our brand?",
    answer: "Yes. Every station screen carries the venue's own branding and promos alongside the Greenpal rental experience.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-surface transition-colors duration-300">
      <div className="py-10 md:py-20 border-t line-rule transition-colors duration-300">
        <div className="container-edit max-w-4xl mx-auto">
          <div className="mb-12 md:mb-16">
            {/* Stripped text-ink so it inherits standard light/dark text color automatically */}
            <h2 className="font-display font-bold text-display-lg">FAQ</h2>
            <p className="font-body text-xl text-muted transition-colors duration-300">
              Questions about Greenpal.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border line-rule rounded-2xl bg-card overflow-hidden transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                  >
                    {/* Stripped text-ink here as well */}
                    <span className="font-display font-semibold text-lg md:text-xl transition-colors duration-300 group-hover:text-[#02d683]">
                      {faq.question}
                    </span>
                    <span
                      className={`flex-shrink-0 ml-4 transition-all duration-300 group-hover:text-[#02d683] ${isOpen ? "rotate-45" : "rotate-0"
                        }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-body text-muted px-6 md:px-8 pb-6 md:pb-8 leading-relaxed transition-colors duration-300">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
