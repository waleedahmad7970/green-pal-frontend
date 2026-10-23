import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutMission from "@/components/AboutMission";
import AboutValues from "@/components/AboutValues";
import AboutProducts from "@/components/AboutProducts";
import AboutCTA from "@/components/AboutCTA";

export const metadata: Metadata = {
  title: "About Us — Shared Portable Charging",
  description:
    "Greenpal is an Edmonton-based Canadian company bringing shared portable charging to the places people shop, eat, work and spend time.",
  alternates: {
    canonical: "https://thegreenpal.ca/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutProducts />
      <AboutCTA />
    </main>
  );
}
