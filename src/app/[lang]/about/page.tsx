import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

const baseUrl = "https://www.sukrugencoglu.com";

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
  return (
    <>
      <AboutSection />
    </>
  );
}
