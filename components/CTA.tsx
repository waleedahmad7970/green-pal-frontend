"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

// --------------------------------------------------------
// 1. MAGNETIC BUTTON COMPONENT (Theme Native)
// --------------------------------------------------------
function MagneticButton({ text, href }: { text: string; href: string }) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!buttonRef.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = buttonRef.current.getBoundingClientRect();

        setPosition({
            x: (clientX - (left + width / 2)) * 0.3,
            y: (clientY - (top + height / 2)) * 0.3
        });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <Link href={href} className="block w-max">
            <motion.div
                ref={buttonRef}
                onMouseMove={handleMouse}
                onMouseLeave={reset}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                // Uses bg-card and line-rule so it handles light/dark transitions automatically
                className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 rounded-full border line-rule cursor-pointer group overflow-hidden bg-card shadow-sm"
            >
                {/* Liquid hover fill: expands with bg-ink (or brand signal color depending on theme preference) */}
                <div className="absolute inset-0 bg-ink scale-0 group-hover:scale-100 rounded-full transition-transform duration-[600ms] ease-signature origin-center" />

                {/* Text color transitions cleanly to white/surface on hover */}
                <span className="relative z-10 transition-colors duration-500 font-display font-bold text-xl md:text-2xl text-center px-4 group-hover:text-white">
                    {text}
                </span>
            </motion.div>
        </Link>
    );
}

// --------------------------------------------------------
// 2. MAIN CTA SECTION
// --------------------------------------------------------
interface CTAProps {
    title?: string;
    description?: string;
    buttonText?: string;
    href?: string;
}

export default function CTA({
    title = "Let's build the future of power.",
    description = "Join the Greenpal network today. Deploy stations, earn passive income, and keep your city charged up.",
    buttonText = "Connect Now",
    href = "/contact",
}: CTAProps) {
    return (
        <section className="py-28 md:py-40 px-6 bg-surface border-t line-rule relative overflow-hidden">

            {/* Ambient background accent glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-signal/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="container-edit flex flex-col items-center justify-center text-center gap-16 relative z-10">

                <div className="w-full max-w-5xl flex flex-col items-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-[7rem] font-display font-bold leading-[0.9] tracking-tighter mb-8"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl md:text-3xl text-muted font-body max-w-2xl"
                    >
                        {description}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
                    className="w-full flex justify-center"
                >
                    <MagneticButton text={buttonText} href={href} />
                </motion.div>

            </div>
        </section>
    );
}