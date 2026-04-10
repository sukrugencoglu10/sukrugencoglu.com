import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";

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
    <>
      <ContactSection />
      <section className="section-padding bg-white border-t border-border">
        <div className="container-site">
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <PlusServicesWizard showContactButton />
          </div>
        </div>
      </section>
    </>
  );
}
