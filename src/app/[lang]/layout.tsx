import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Lang } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import PinnedAnons from "@/components/sections/PinnedAnons";

const validLangs: Lang[] = ["tr", "en"];
const baseUrl = "https://www.sukrugencoglu.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        tr: `${baseUrl}/tr`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/tr`,
      },
    },
    openGraph: {
      locale: lang === "tr" ? "tr_TR" : "en_US",
      alternateLocale: lang === "tr" ? ["en_US"] : ["tr_TR"],
      siteName: "Şükrü Gençoğlu",
      type: "website",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!validLangs.includes(lang as Lang)) {
    notFound();
  }

  return (
    <LanguageProvider initialLang={lang as Lang}>
      <Navbar />
      <main>{children}</main>
      {/* Mobilde footer üstü — masaüstünde ContactSection sağ kolonunda gösteriliyor */}
      <div className="lg:hidden bg-surface-secondary border-t border-border px-2 py-10 flex justify-center">
        <PinnedAnons />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </LanguageProvider>
  );
}
