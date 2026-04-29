import type { Metadata } from "next";
import ServicesSection from "@/components/sections/ServicesSection";
import { BreadcrumbLd, ServiceListLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";

const baseUrl = siteConfig.baseUrl;

const servicesTR = [
  { name: "Yüksek Performanslı Web Siteleri", description: "Next.js, React ve Tailwind CSS ile Core Web Vitals uyumlu, SEO odaklı ultra hızlı web deneyimleri." },
  { name: "Gelişmiş Veri Takibi & Veri Mimarisi", description: "Sunucu Taraflı GTM ile Facebook CAPI ve Google Ads'e %100 doğrulukla veri iletimi." },
  { name: "İş Zekası & Veri Panelleri", description: "GA4 ve Google Ads verilerini Looker Studio'da birleştiren şeffaf raporlama dashboardları." },
  { name: "Pazarlama Otomasyonu (n8n & Yapay Zeka)", description: "n8n ve yapay zeka araçlarıyla lead yönetimi ve veri akışı otomasyonu." },
  { name: "SEO", description: "Teknik SEO denetimi, içerik optimizasyonu ve otorite yönetimi ile organik görünürlük artırma." },
  { name: "Google & Meta Ads Yönetimi", description: "Dönüşüm odaklı Google Ads ve Meta Ads kampanya yönetimi." },
];

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
  const breadcrumbs = [
    { name: "Ana Sayfa", url: `${baseUrl}/tr` },
    { name: "Hizmetler", url: `${baseUrl}/tr/hizmetler` },
  ];

  return (
    <>
      <BreadcrumbLd items={breadcrumbs} />
      <ServiceListLd items={servicesTR} lang="tr" />
      <ServicesSection />
    </>
  );
}
