"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
// You can remove the GPMark import if you are completely replacing it with your image logos
import { useThemeStore, useNavStore } from "@/lib/store";
import { scrollToTarget } from "@/lib/lenisStore";
import darkLogo from "@/public/icons/darkLogo.svg";
import lightGreen from "@/public/icons/lightGreen.svg";
import Image from "next/image";
import { lightLogo } from "@/public/icons";

const sectionLinks = [
  { label: "Elegance", href: "/#elegance" },
  { label: "Services", href: "/#services" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Team", href: "/#team" },
  { label: "Work", href: "/#work" },
];

const pageLinks = [
  { label: "Products", href: "/products" },
  { label: "Investment Plans", href: "/investment" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { menuOpen, setMenuOpen } = useNavStore();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    setMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      scrollToTarget(href.replace("/", ""));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-colors duration-500 ${
        scrolled || pathname !== "/"
          ? "bg-surface/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-edit flex items-center justify-between h-20">
        {/* --- LOGO SWAP IS HERE --- */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            // This checks your theme state and loads the correct image!
            src={theme === "dark" ? lightLogo : lightGreen}
            alt="Greenpal Logo"
            className="h-6 md:h-10 w-auto object-contain" // Adjust the height (h-8) as needed to fit your image beautifully
          />
        </Link>
        {/* ------------------------- */}

        <nav className="hidden lg:flex items-center gap-8">
          {/* {sectionLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchorClick(e, l.href)}
              className="font-body text-sm text-muted hover:text-current transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
          <span className="w-px h-4 bg-current opacity-20" /> */}
          {pageLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-body text-sm transition-colors duration-300 ${
                pathname === l.href ? "accent" : "text-muted hover:text-current"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full border line-rule flex items-center px-0.5"
          >
            <motion.span
              className="w-5 h-5 rounded-full bg-signal block"
              animate={{ x: theme === "dark" ? 22 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </button>

          <button
            className="lg:hidden flex flex-col gap-1.5 w-8"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-surface border-t line-rule"
          >
            <nav className="container-edit flex flex-col py-6 gap-5">
              {/* {sectionLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className="font-display text-2xl font-medium text-left"
                >
                  {l.label}
                </Link>
              ))} */}
              {pageLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-2xl font-medium text-left"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
