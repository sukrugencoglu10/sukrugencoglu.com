import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import AiServicesTeaser from "@/components/sections/AiServicesTeaser";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Contact | Şükrü Gençoğlu",
  description:
    "Get in touch with Şükrü Gençoğlu for a free analysis and proposal.",
  alternates: {
    canonical: `${baseUrl}/en/contact`,
    languages: {
      tr: `${baseUrl}/tr/iletisim`,
      en: `${baseUrl}/en/contact`,
      "x-default": `${baseUrl}/tr/iletisim`,
    },
  },
  openGraph: {
    title: "Contact | Şükrü Gençoğlu",
    description:
      "Get in touch with Şükrü Gençoğlu for a free analysis and proposal.",
    url: `${baseUrl}/en/contact`,
  },
};

export default function ContactPage() {
  return (
    <ContactSection
      pinnedAnons={
        <div className="flex flex-col gap-8">
          <AiServicesTeaser inline />
          <PlusServicesWizard />
        </div>
      }
    />
  );
}
