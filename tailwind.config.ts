import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        signal: "#02D683",
        "signal-dim": "#02A868",
        ink: "#04231A",
        "ink-soft": "#0B3A2A",
        sand: "#F6F3EC",
        "sand-dim": "#ECE7DA",
        graphite: "#171716",
        line: {
          light: "#DAD6C9",
          dark: "#123B2C",
        },
      },
      fontFamily: {
        display: ["var(--font-rethink)", "sans-serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.2rem, 9vw, 9rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.4rem, 6vw, 5.5rem)", { lineHeight: "0.96", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.8rem, 3.6vw, 3.2rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
