import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

const baseUrl = "https://www.sukrugencoglu.com";

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
  return (
    <>
      <AboutSection />
    </>
  );
}
