import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutStory from "@/components/AboutStory";
import AboutValues from "@/components/AboutValues";
import ClosingCTA from "@/components/ClosingCTA";

export const metadata: Metadata = {
  title: "About — Greenpal",
  description: "The story, timeline, and charter behind Greenpal's charging infrastructure.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <ClosingCTA />
    </>
  );
}
