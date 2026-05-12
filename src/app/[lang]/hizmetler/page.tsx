import type { Metadata } from "next";
import Link from "next/link";
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
      <section className="bg-surface-secondary/30 border-t border-border py-12 sm:py-16">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-orange mb-1">
                Hazır Paketler
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-ink leading-snug mb-1">
                Sabit kapsam, şeffaf fiyat
              </h3>
              <p className="text-sm text-ink-secondary">
                Veri analizi, raporlama ve takip altyapısı için ürünleştirilmiş paketler.
              </p>
            </div>
            <Link
              href="/tr/paketler"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-orange transition shrink-0"
            >
              Paketlere göz at →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
