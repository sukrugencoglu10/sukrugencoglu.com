import type { Metadata } from "next";
import WorkSection from "@/components/sections/WorkSection";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Çalışmalar | Şükrü Gençoğlu",
  description:
    "Dijital pazarlama ve web geliştirme alanındaki tamamlanmış projeler ve başarı hikayeleri.",
  alternates: {
    canonical: `${baseUrl}/tr/calismalar`,
    languages: {
      tr: `${baseUrl}/tr/calismalar`,
      en: `${baseUrl}/en/work`,
      "x-default": `${baseUrl}/tr/calismalar`,
    },
  },
  openGraph: {
    title: "Çalışmalar | Şükrü Gençoğlu",
    description:
      "Dijital pazarlama ve web geliştirme alanındaki tamamlanmış projeler ve başarı hikayeleri.",
    url: `${baseUrl}/tr/calismalar`,
  },
};

export default function CalisimalarPage() {
  return <WorkSection />;
}
