import { createClient } from "@supabase/supabase-js";
import { FaqLd, BreadcrumbLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import SssList from "./SssList";

export const revalidate = 60;

type Item = { id: string | number; title: string; description: string };

async function getItems(): Promise<Item[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data, error } = await supabase
      .from("sss")
      .select("items")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data?.items) return [];
    return data.items as Item[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const title = lang === "tr" ? "Sık Sorulan Sorular" : "Frequently Asked Questions";
  const description =
    lang === "tr"
      ? "Google Ads, Meta Ads, GTM ve dijital pazarlama hakkında sık sorulan sorular."
      : "Frequently asked questions about Google Ads, Meta Ads, GTM and digital marketing.";
  return {
    title: `${title} | Şükrü Gençoğlu`,
    description,
    alternates: {
      canonical: `${siteConfig.baseUrl}/${lang}/sss`,
      languages: {
        tr: `${siteConfig.baseUrl}/tr/sss`,
        en: `${siteConfig.baseUrl}/en/sss`,
        "x-default": `${siteConfig.baseUrl}/tr/sss`,
      },
    },
  };
}

export default async function SssPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const items = await getItems();
  const faqItems = items.map((i) => ({
    question: i.title,
    answer: i.description,
  }));

  const breadcrumbs = [
    { name: lang === "tr" ? "Ana Sayfa" : "Home", url: `${siteConfig.baseUrl}/${lang}` },
    { name: lang === "tr" ? "Sık Sorulan Sorular" : "FAQ", url: `${siteConfig.baseUrl}/${lang}/sss` },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "inherit" }}>
      <BreadcrumbLd items={breadcrumbs} />
      <FaqLd items={faqItems} />
      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 800,
            color: "#111",
            margin: "0 0 8px",
          }}
        >
          Sık Sorulan Sorular
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>{items.length} soru</p>
      </div>
      <SssList items={items} />
    </div>
  );
}
