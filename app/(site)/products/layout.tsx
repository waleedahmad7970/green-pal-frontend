import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Power Banks & Charging Products",
  description:
    "Browse Greenpal portable power banks and charging products available for rental and purchase. High-speed, compact, and ready for rent at venues across Canada.",
  alternates: {
    canonical: "https://thegreenpal.ca/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
