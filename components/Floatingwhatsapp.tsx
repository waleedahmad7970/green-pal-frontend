"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Replace with your real WhatsApp business number (country code, no + or spaces)
const WHATSAPP_NUMBER = "14165551234";
const WHATSAPP_MESSAGE = "Hi, I'd like to ask about a Greenpal station.";

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[100]"
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 190 : 64 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative flex items-center h-16 rounded-full border line-rule cursor-pointer group overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-shadow duration-500"
      >
        {/* Liquid hover fill */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#25D366] rounded-full scale-0 group-hover:scale-100 transition-transform duration-[600ms] ease-signature pointer-events-none" />

        {/* Icon — fixed size, pinned to the left */}
        <div className="relative z-10 flex items-center justify-center w-16 h-16 shrink-0 text-[#25D366] group-hover:text-white transition-colors duration-[600ms]">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.3c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
          </svg>
        </div>

        {/* Label — revealed as the pill expands */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="relative z-10 whitespace-nowrap pr-5 text-white font-display font-bold text-base tracking-wide pointer-events-none"
            >
              Chat on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
    </motion.div>
  );
}
