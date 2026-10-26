import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Plans | Co-Invest with Greenpal",
  description:
    "Explore Greenpal investment plans and co-invest in Canada's shared portable charging network. Earn passive revenue by funding charging stations at high-traffic venues.",
  alternates: {
    canonical: "https://thegreenpal.ca/plans",
  },
};

export default function InvestmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
