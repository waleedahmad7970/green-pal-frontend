"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
// You can remove the GPMark import if you are completely replacing it with your image logos
import { useThemeStore, useNavStore } from "@/lib/store";
// ⚠️ adjust the path if your slice file is somewhere else
import { scrollToTarget } from "@/lib/lenisStore";
import darkLogo from "@/public/icons/darkLogo.svg";
import lightGreen from "@/public/icons/lightGreen.svg";
import Image from "next/image";
import { lightLogo } from "@/public/icons";
import { useAdminAuth } from "@/lib/admin/auth";

const sectionLinks = [
  { label: "Elegance", href: "/#elegance" },
  { label: "Services", href: "/#services" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Team", href: "/#team" },
  { label: "Work", href: "/#work" },
];

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Investment Plans", href: "/investment" },
  { label: "Events", href: "/event" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Links shown inside the user popup
const accountLinks = [
  { label: "My Profile", href: "/profile" },
  { label: "My Inquiries", href: "/inquiries" },
];

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
    />
  </svg>
);

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { menuOpen, setMenuOpen } = useNavStore();
  const { isAuthed, user, logout } = useAdminAuth();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // avoids a hydration mismatch if your auth store is persisted
  useEffect(() => setMounted(true), []);

  // close the user popup when the page changes
  useEffect(() => setUserMenuOpen(false), [pathname]);

  // close the user popup on outside click / Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    setMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      scrollToTarget(href.replace("/", ""));
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMenuOpen(false);
    await logout?.();
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-colors duration-500 ${scrolled || pathname !== "/"
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
          {pageLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-body text-sm transition-colors duration-300 ${pathname === l.href ? "accent" : "text-muted hover:text-current"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Talk to Sales Button - Desktop */}
          <Link
            href="/contact"
            className="hidden lg:flex items-center justify-center px-5 py-2 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity duration-300"
          >
            Talk to Sales
          </Link>

          {/* ---------- USER ICON + POPUP ---------- */}
          {!mounted ? (
            <div className="w-9 h-9" />
          ) : !isAuthed ? (
            <Link
              href="/login" // ⚠️ adjust to your login route
              aria-label="Sign in"
              className="w-9 h-9 rounded-full border line-rule flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <UserIcon />
            </Link>
          ) : (
            <div ref={userMenuRef} className="relative">
              <button
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="relative w-9 h-9 rounded-full border line-rule flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <UserIcon />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#02d683] border-2 border-[var(--surface,#fff)]" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-3 w-64 bg-card border line-rule rounded-2xl shadow-xl p-2 origin-top-right"
                  >
                    <div className="px-3 py-3 border-b line-rule mb-1">
                      <p className="font-display font-bold text-sm truncate">
                        {user?.name || "My Account"}
                      </p>
                      {user?.email && (
                        <p className="font-body text-xs text-muted truncate">
                          {user.email}
                        </p>
                      )}
                    </div>

                    {accountLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={`block px-3 py-2.5 rounded-xl font-body text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${pathname === item.href ? "accent" : ""
                          }`}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2.5 mt-1 rounded-xl font-body text-sm text-red-500 border-t line-rule hover:bg-red-500/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {/* --------------------------------------- */}

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
              className={`h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
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

              {/* Talk to Sales Button - Mobile */}
              <div className="pt-4 mt-2 border-t line-rule">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-display text-xl font-medium hover:opacity-80 transition-opacity duration-300"
                >
                  Talk to Sales
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}