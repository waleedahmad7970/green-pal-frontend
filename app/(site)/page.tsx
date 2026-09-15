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

export default function Home() {
  return (
    <>
      <Hero />
      <PortalTransition />
      <ChargingStations />
      <HowItWorks />
      <Elegance />
      <Services />
      <MarqueeTicker />
      <Expertise />
      <Team />
      <Work />
      <Testimonials />
      <ClosingCTA />
    </>
  );
}
