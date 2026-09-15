import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteEffects from "@/components/RouteEffects";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <RouteEffects />
      <Header />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
