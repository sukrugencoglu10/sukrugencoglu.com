import type { Metadata } from "next";
import WorkSection from "@/components/sections/WorkSection";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Work | Şükrü Gençoğlu",
  description:
    "Completed projects and success stories in digital marketing and web development.",
  alternates: {
    canonical: `${baseUrl}/en/work`,
    languages: {
      tr: `${baseUrl}/tr/calismalar`,
      en: `${baseUrl}/en/work`,
      "x-default": `${baseUrl}/tr/calismalar`,
    },
  },
  openGraph: {
    title: "Work | Şükrü Gençoğlu",
    description:
      "Completed projects and success stories in digital marketing and web development.",
    url: `${baseUrl}/en/work`,
  },
};

export default function WorkPage() {
  return <WorkSection />;
}
