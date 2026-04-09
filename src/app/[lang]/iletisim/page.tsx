import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import AiServicesTeaser from "@/components/sections/AiServicesTeaser";
import PinnedAnons from "@/components/sections/PinnedAnons";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "İletişim | Şükrü Gençoğlu",
  description: "Ücretsiz analiz ve teklif için Şükrü Gençoğlu ile iletişime geçin.",
  alternates: {
    canonical: `${baseUrl}/tr/iletisim`,
    languages: {
      tr: `${baseUrl}/tr/iletisim`,
      en: `${baseUrl}/en/contact`,
      "x-default": `${baseUrl}/tr/iletisim`,
    },
  },
  openGraph: {
    title: "İletişim | Şükrü Gençoğlu",
    description: "Ücretsiz analiz ve teklif için Şükrü Gençoğlu ile iletişime geçin.",
    url: `${baseUrl}/tr/iletisim`,
  },
};

export default function IletisimPage() {
  return (
    <ContactSection
      mobileFirstRight
      pinnedAnons={
        <div className="flex flex-col gap-10">
          <PinnedAnons />
          <AiServicesTeaser inline />
        </div>
      }
    />
  );
}
