import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import AiServicesTeaser from "@/components/sections/AiServicesTeaser";

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
      mobileFirstRight
      pinnedAnons={<AiServicesTeaser inline />}
    />
  );
}
