import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// Geist is served via the official `geist` package (local font files) rather
// than next/font/google, since Geist isn't in every Next.js version's Google
// Fonts manifest and next/font/google will throw "Unknown font" if it's missing.
const rethink = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-rethink",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Greenpal",
  description:
    "Greenpal designs and operates smart charging stations, rentable power banks, and on-the-go utility devices for airports, malls, and transit hubs.",
};

// Runs before paint to avoid a flash of the wrong theme.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('greenpal-theme');
    var theme = 'dark';
    if (stored) {
      var parsed = JSON.parse(stored);
      theme = (parsed && parsed.state && parsed.state.theme) || 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

// Deliberately minimal: this root layout only sets up fonts and the html
// element. The public site (marketing pages) and /admin each bring their own
// chrome via their own nested layouts, so admin doesn't inherit the public
// Header/Footer/smooth-scroll.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rethink.variable} ${GeistSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
