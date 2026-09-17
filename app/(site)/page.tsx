import type { Metadata } from "next";
import Hero from "@/components/Hero";
import PortalTransition from "@/components/PortalTransition";
import Elegance from "@/components/Elegance";
import Services from "@/components/Services";
import MarqueeTicker from "@/components/MarqueeTicker";
import Expertise from "@/components/Expertise";
import Team from "@/components/Team";
import Work from "@/components/Work";
import Testimonials from "@/components/Testimonials";
import ClosingCTA from "@/components/ClosingCTA";
import ChargingStations from "@/components/Chargingstations";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import WhyGreenpal from "@/components/WhyGreenpal";
import FAQAndCTA from "@/components/FAQAndCTA";
import ForVenues from "@/components/ForVenues";

export const metadata: Metadata = {
  title: "Greenpal Canada | Portable Power Bank Rental & Shared Charging",
  description:
    "Stay charged on the go with Greenpal portable power bank rentals. Discover shared charging for customers, venue partnerships and Greenpal business blueprints.",
  keywords: [
    "portable power bank rental",
    "shared charging station",
    "power bank rental Canada",
    "phone charging station",
    "venue charging station",
    "portable charger rental",
  ],
  openGraph: {
    title: "Greenpal - Shared Power. Anytime. Anywhere.",
    description:
      "Portable charging made simple. Rent power on the go, host a Greenpal station, or explore Greenpal Power Portfolio Blueprints.",
    type: "website",
    url: "https://thegreenpal.ca",
    siteName: "Greenpal Canada",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <PortalTransition />
      <ChargingStations />
      <HowItWorks />
      <WhyGreenpal />
      <CTA />
      {/* <Elegance /> */}
      {/* <Services /> */}
      <ForVenues />
      <MarqueeTicker />
      <Expertise />
      {/* <Team /> */}
      <FAQAndCTA />
      <Testimonials />
      <ClosingCTA />
    </>
  );
}
