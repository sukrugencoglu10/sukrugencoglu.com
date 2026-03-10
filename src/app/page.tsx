import HeroSection from "@/components/sections/HeroSection";
import MarqueeText from "@/components/sections/MarqueeText";
import WorkSection from "@/components/sections/WorkSection";
import MantikhHaritasiSection from "@/components/sections/MantikhHaritasiSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="relative z-10 -mt-[80px]">
        <MarqueeText />
      </div>
      <WorkSection />
      <MantikhHaritasiSection />
      <ContactSection />
    </>
  );
}
