import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeText from "@/components/sections/MarqueeText";
import WorkSection from "@/components/sections/WorkSection";
import MantikhHaritasiSection from "@/components/sections/MantikhHaritasiSection";
import ContactSection from "@/components/sections/ContactSection";
import AiServicesTeaser from "@/components/sections/AiServicesTeaser";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";
import MobileContactBar from "@/components/sections/MobileContactBar";

const baseUrl = "https://www.sukrugencoglu.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isTR = lang === "tr";

  const title = isTR
    ? "Şükrü Gençoğlu — Web Geliştirici & Growth Engineer"
    : "Şükrü Gençoğlu — Web Developer & Growth Engineer";
  const description = isTR
    ? "Türkiye merkezli Growth Engineer. Google & Meta Ads yönetimi, sunucu taraflı takip ve yüksek performanslı web geliştirme."
    : "Growth Engineer based in Turkey. Google & Meta Ads management, server-side tracking, and high-performance web development.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        tr: `${baseUrl}/tr`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/tr`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
    },
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="relative z-10 mt-0 md:-mt-[80px]">
        <MarqueeText />
      </div>
      <WorkSection />
      {/* Masaüstünde vaka çalışmalarının hemen altında */}
      <div className="hidden lg:block">
        <AiServicesTeaser />
      </div>
      <MantikhHaritasiSection belowDashboard={<ContactSection noWrapper />} />
      {/* Mobilde standalone ContactSection */}
      <div className="lg:hidden">
        <ContactSection />
      </div>
      {/* Masaüstünde iletişim formunun altında */}
      <div className="hidden lg:block section-padding">
        <div className="container-site">
          <PlusServicesWizard />
        </div>
      </div>
      {/* Mobilde mantık haritasının altında */}
      <div className="lg:hidden">
        <AiServicesTeaser showCta={false} />
      </div>
      <div className="lg:hidden section-padding">
        <div className="container-site">
          <PlusServicesWizard />
        </div>
      </div>
      <MobileContactBar />
    </>
  );
}
