import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event & Festival Charging Stations",
  description:
    "Power up your event with Greenpal charging stations. Portable power bank rentals for music festivals, sporting events, trade shows and outdoor gatherings across Canada.",
  alternates: {
    canonical: "https://thegreenpal.ca/event",
  },
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
