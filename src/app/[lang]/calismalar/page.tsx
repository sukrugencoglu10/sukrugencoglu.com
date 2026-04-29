import type { Metadata } from "next";
import CalisimalarLayout from "@/components/sections/CalisimalarLayout";
import { BreadcrumbLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";

const baseUrl = siteConfig.baseUrl;

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
  const breadcrumbs = [
    { name: "Ana Sayfa", url: `${baseUrl}/tr` },
    { name: "Çalışmalar", url: `${baseUrl}/tr/calismalar` },
  ];

  return (
    <>
      <BreadcrumbLd items={breadcrumbs} />
      <CalisimalarLayout />
    </>
  );
}
