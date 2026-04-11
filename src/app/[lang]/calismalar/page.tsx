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

import AdvertisingHierarchyLiveMap from "@/components/ui/AdvertisingHierarchyLiveMap";
import Badge from "@/components/ui/Badge";

export default function CalisimalarPage() {
  return (
    <div className="section-padding bg-surface-secondary min-h-screen">
      <div className="container-site">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge color="blue">Strateji Stüdyosu</Badge>
          <h1 className="text-4xl font-extrabold text-ink tracking-tight">Canlı Reklam & Web Hiyerarşisi</h1>
          <p className="text-ink-muted max-w-2xl">
            Aşağıdaki harita, Şükrü Gençoğlu tarafından Stüdyo üzerinde oluşturulan 
            ve gerçek zamanlı olarak güncellenen dijital büyüme stratejisini göstermektedir.
          </p>
        </div>
        <AdvertisingHierarchyLiveMap />
      </div>
    </div>
  );
}
