import type { Metadata } from "next";
import Image from "next/image";
import { BreadcrumbLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";

const baseUrl = siteConfig.baseUrl;

export const metadata: Metadata = {
  title: "Nasıl Çalışırız | Şükrü Gençoğlu",
  description:
    "Dijital pazarlama ve web geliştirme projelerinde izlediğimiz süreç ve çalışma yöntemimiz hakkında detaylı bilgi.",
  alternates: {
    canonical: `${baseUrl}/tr/nasil-calisiriz`,
    languages: {
      tr: `${baseUrl}/tr/nasil-calisiriz`,
      en: `${baseUrl}/en/how-we-work`,
      "x-default": `${baseUrl}/tr/nasil-calisiriz`,
    },
  },
  openGraph: {
    title: "Nasıl Çalışırız | Şükrü Gençoğlu",
    description:
      "Dijital pazarlama ve web geliştirme projelerinde izlediğimiz süreç ve çalışma yöntemimiz hakkında detaylı bilgi.",
    url: `${baseUrl}/tr/nasil-calisiriz`,
  },
};

export default function ProcessPage() {
  const breadcrumbs = [
    { name: "Ana Sayfa", url: `${baseUrl}/tr` },
    { name: "Nasıl Çalışırız", url: `${baseUrl}/tr/nasil-calisiriz` },
  ];

  return (
    <>
      <BreadcrumbLd items={breadcrumbs} />
    <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-start pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border bg-white">
          <Image
            src="/gemini.jpg"
            alt="Nasıl Çalışırız - İş Süreci"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border bg-white mt-8">
          <Image
            src="/unnamed (1).png"
            alt="Nasıl Çalışırız - İş Süreci 2"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
    </>
  );
}
