import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import { PersonLd, BreadcrumbLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import ContactSection from "@/components/sections/ContactSection";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";

const baseUrl = siteConfig.baseUrl;

export const metadata: Metadata = {
  title: "Hakkımda | Şükrü Gençoğlu",
  description:
    "Dijital pazarlama ve web geliştirme alanında deneyimli Growth Engineer Şükrü Gençoğlu hakkında bilgi edinin.",
  alternates: {
    canonical: `${baseUrl}/tr/hakkimda`,
    languages: {
      tr: `${baseUrl}/tr/hakkimda`,
      en: `${baseUrl}/en/about`,
      "x-default": `${baseUrl}/tr/hakkimda`,
    },
  },
  openGraph: {
    title: "Hakkımda | Şükrü Gençoğlu",
    description:
      "Dijital pazarlama ve web geliştirme alanında deneyimli Growth Engineer Şükrü Gençoğlu hakkında bilgi edinin.",
    url: `${baseUrl}/tr/hakkimda`,
  },
};

export default function HakkimdaPage() {
  const breadcrumbs = [
    { name: "Ana Sayfa", url: `${baseUrl}/tr` },
    { name: "Hakkımda", url: `${baseUrl}/tr/hakkimda` },
  ];

  return (
    <>
      <BreadcrumbLd items={breadcrumbs} />
      <PersonLd lang="tr" />
      <AboutSection />
      <ContactSection
        pinnedAnons={
          <div className="flex flex-col gap-6">
            <PlusServicesWizard />
          </div>
        }
      />
    </>
  );
}
