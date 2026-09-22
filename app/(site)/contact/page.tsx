import type { Metadata } from "next";
import ContactIntro from "@/components/ContactIntro";
import ContactSteps from "@/components/ContactSteps";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Greenpal",
  description:
    "Get in touch about placing Greenpal charging stations at your venue.",
};

export default function ContactPage() {
  return (
    <>
      <ContactIntro />
      <ContactForm />
      <ContactSteps />
    </>
  );
}
