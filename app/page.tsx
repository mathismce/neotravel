import Navbar from "../components/Navbar";
import HeroSection from "../components/home/HeroSection";
import VehiclesSection from "../components/home/VehiclesSection";
import AboutSection from "../components/home/AboutSection";
import ReviewsSection from "../components/home/ReviewsSection";
import FaqSection from "../components/home/FaqSection";
import FooterSection from "../components/home/FooterSection";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#08111f] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,72,123,0.52),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(26,44,88,0.35),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.92),rgba(8,17,31,0.98))]" />

      <Navbar />
      <HeroSection />
      <VehiclesSection />
      <AboutSection />
      <ReviewsSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}