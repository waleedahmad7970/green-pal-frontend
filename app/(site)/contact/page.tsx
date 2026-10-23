import type { Metadata } from "next";
import ContactIntro from "@/components/ContactIntro";
import ContactSteps from "@/components/ContactSteps";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Partner With Us",
  description:
    "Get in touch about placing Greenpal portable charging stations at your venue. We partner with malls, airports, stadiums, hotels and more across Canada.",
  alternates: {
    canonical: "https://thegreenpal.ca/contact",
  },
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
