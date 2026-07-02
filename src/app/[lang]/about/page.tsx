import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import { PersonLd, BreadcrumbLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import ContactSection from "@/components/sections/ContactSection";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";

const baseUrl = siteConfig.baseUrl;

export const metadata: Metadata = {
  title: "About | Şükrü Gençoğlu",
  description:
    "Learn about Şükrü Gençoğlu, an experienced Growth Engineer in digital marketing and web development.",
  alternates: {
    canonical: `${baseUrl}/en/about`,
    languages: {
      tr: `${baseUrl}/tr/hakkimda`,
      en: `${baseUrl}/en/about`,
      "x-default": `${baseUrl}/tr/hakkimda`,
    },
  },
  openGraph: {
    title: "About | Şükrü Gençoğlu",
    description:
      "Learn about Şükrü Gençoğlu, an experienced Growth Engineer in digital marketing and web development.",
    url: `${baseUrl}/en/about`,
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/en` },
    { name: "About", url: `${baseUrl}/en/about` },
  ];

  return (
    <>
      <BreadcrumbLd items={breadcrumbs} />
      <PersonLd lang="en" />
      <AboutSection />
      <ContactSection
        pinnedAnons={
          <div className="flex flex-col gap-6">
            <PlusServicesWizard showContactButton />
          </div>
        }
      />
    </>
  );
}
