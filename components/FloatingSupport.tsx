"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function FloatingSupport() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        // Anchored to the bottom right. 
        // Because the right edge is fixed, animating the width makes it expand to the left.
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex justify-end">

            {/* The Entrance Pop */}
            <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            >
                <Link href="/contact" className="block">

                    <motion.div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        // Animate width: 64px (w-16) to 170px when hovered
                        animate={{ width: isHovered ? 170 : 64 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        // Theme-native: bg-card and line-rule
                        className="relative flex items-center h-16 rounded-full border line-rule cursor-pointer group overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-shadow duration-500"
                    >

                        {/* Liquid hover fill: Uses bg-ink, perfectly tied to your theme */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-ink scale-0 group-hover:scale-100 rounded-full transition-transform duration-[600ms] ease-signature pointer-events-none" />

                        {/* Icon: Fixed width container so it doesn't squish when expanding */}
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 shrink-0 text-ink group-hover:text-white transition-colors duration-[600ms]">
                            <svg
                                // The Icon Flourish: Tilts backwards on hover
                                className="w-6 h-6 transition-transform duration-[600ms] ease-signature group-hover:-rotate-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>

                        {/* Expanding Text: Slides in smoothly as the button gets wider */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                                    transition={{ duration: 0.3, delay: 0.05 }}
                                    // Text flips to white to contrast against the bg-ink fill
                                    className="relative z-10 pr-6 whitespace-nowrap text-ink group-hover:text-white font-display font-bold text-lg tracking-wide transition-colors duration-[600ms]"
                                >
                                    Need Help?
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </Link>
            </motion.div>

        </div>
    );
}