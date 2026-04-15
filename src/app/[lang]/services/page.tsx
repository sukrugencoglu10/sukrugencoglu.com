import type { Metadata } from "next";
import ServicesSection from "@/components/sections/ServicesSection";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Services | Şükrü Gençoğlu",
  description:
    "Google & Meta Ads management, server-side tracking, web development, and growth consulting services.",
  alternates: {
    canonical: `${baseUrl}/en/services`,
    languages: {
      tr: `${baseUrl}/tr/hizmetler`,
      en: `${baseUrl}/en/services`,
      "x-default": `${baseUrl}/tr/hizmetler`,
    },
  },
  openGraph: {
    title: "Services | Şükrü Gençoğlu",
    description:
      "Google & Meta Ads management, server-side tracking, web development, and growth consulting services.",
    url: `${baseUrl}/en/services`,
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesSection />
    </>
  );
}
