import type { Metadata } from "next";
import Hero from "@/components/Hero";
import PortalTransition from "@/components/PortalTransition";
import Elegance from "@/components/Elegance";
import Services from "@/components/Services";
import MarqueeTicker from "@/components/MarqueeTicker";
import Team from "@/components/Team";
import ClosingCTA from "@/components/ClosingCTA";
import ChargingStations from "@/components/Chargingstations";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import WhyGreenpal from "@/components/WhyGreenpal";
import FAQAndCTA from "@/components/FAQAndCTA";
import ForVenues from "@/components/ForVenues";
import GreenpalNetwork from "@/components/GreenpalNetwork";

export const metadata: Metadata = {
  title: "Greenpal | Portable Power Bank Rental & Shared Charging",
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
      "Portable charging made simple. Rent power on the go, or host a Greenpal station.",
    type: "website",
    url: "https://thegreenpal.ca",
    siteName: "Greenpal Canada",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      {/* <PortalTransition /> */}
      <ChargingStations />
      <HowItWorks />
      <WhyGreenpal />
      <GreenpalNetwork />
      <CTA />
      {/* <Elegance /> */}
      {/* <Services /> */}
      <ForVenues />
      {/* <Team /> */}
      <FAQAndCTA />
      <ClosingCTA />
    </>
  );
}
