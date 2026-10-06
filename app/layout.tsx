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
  title: "Greenpal",
  description:
    "Greenpal designs and operates smart charging stations, rentable power banks, and on-the-go utility devices for airports, malls, and transit hubs.",
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
