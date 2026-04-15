import type { Metadata } from "next";

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

import AdvertisingHierarchyLiveMap from "@/components/ui/AdvertisingHierarchyLiveMap";
import ReklamKpiLiveMap from "@/components/ui/ReklamKpiLiveMap";
import Badge from "@/components/ui/Badge";
import FaqShowcase from "@/components/sections/FaqShowcase";

export default function WorkPage() {
  return (
    <div className="section-padding bg-surface-secondary min-h-screen">
      <div className="container-site">
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge color="blue">Strategy Studio</Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">Live Ad & Web Hierarchy</h1>
          <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
            The following map shows the digital growth strategy created and updated in real-time 
             by Şükrü Gençoğlu in the Studio.
          </p>
        </div>
        <AdvertisingHierarchyLiveMap />
        <ReklamKpiLiveMap />
      </div>
      <FaqShowcase />
    </div>
  );
}
