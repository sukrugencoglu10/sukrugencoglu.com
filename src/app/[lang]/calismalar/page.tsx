import type { Metadata } from "next";

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

import CalisimalarLayout from "@/components/sections/CalisimalarLayout";

export default function CalisimalarPage() {
  return <CalisimalarLayout />;
}
