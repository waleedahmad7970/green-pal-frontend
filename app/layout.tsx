import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import FloatingSupport from "@/components/FloatingSupport";
import { Toaster } from "react-hot-toast";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

const rethink = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-rethink",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thegreenpal.ca"),
  title: {
    default: "Greenpal | Portable Power Bank Rental & Shared Charging",
    // Child pages should write their title WITHOUT '| Greenpal' — this template adds it automatically.
    template: "%s | Greenpal",
  },
  description:
    "Greenpal designs and operates smart charging stations, rentable power banks, and on-the-go utility devices for airports, malls, and transit hubs.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#02D683",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenpal | Portable Power Bank Rental & Shared Charging",
    description:
      "Stay charged on the go with Greenpal portable power bank rentals. Shared charging for customers, venue partnerships & business blueprints.",
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${rethink.variable} ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Schema.org: Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Greenpal",
                url: "https://thegreenpal.ca",
                logo: "https://thegreenpal.ca/icon.svg",
                description:
                  "Greenpal provides portable power bank rentals and shared charging stations for venues, events, airports, and malls across Canada.",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Edmonton",
                  addressRegion: "AB",
                  addressCountry: "CA",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  url: "https://thegreenpal.ca/contact",
                },
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Greenpal",
                url: "https://thegreenpal.ca",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://thegreenpal.ca/products?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>

      {/* Google Tag Manager (loads the main GTM script) */}
      <GoogleTagManager gtmId="GTM-5Q555H4G" />

      {/* Google Analytics (gtag.js). Remove this line if GA4 is set up
          inside Tag Manager, otherwise visits are counted twice. */}
      <GoogleAnalytics gaId="G-19313VK3PX" />

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5Q555H4G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        {/* <FloatingSupport /> */}
        <WhatsAppFloatingButton />
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  );
}
