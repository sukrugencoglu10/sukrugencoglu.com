import type { Metadata } from "next";
import ServicesSection from "@/components/sections/ServicesSection";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Hizmetler | Şükrü Gençoğlu",
  description:
    "Google & Meta Ads yönetimi, sunucu taraflı takip, web geliştirme ve büyüme danışmanlığı hizmetleri.",
  alternates: {
    canonical: `${baseUrl}/tr/hizmetler`,
    languages: {
      tr: `${baseUrl}/tr/hizmetler`,
      en: `${baseUrl}/en/services`,
      "x-default": `${baseUrl}/tr/hizmetler`,
    },
  },
  openGraph: {
    title: "Hizmetler | Şükrü Gençoğlu",
    description:
      "Google & Meta Ads yönetimi, sunucu taraflı takip, web geliştirme ve büyüme danışmanlığı hizmetleri.",
    url: `${baseUrl}/tr/hizmetler`,
  },
};

export default function HizmetlerPage() {
  return (
    <>
      <ServicesSection />
    </>
  );
}
