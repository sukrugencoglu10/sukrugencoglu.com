"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import { getSlug } from "@/lib/slugs";

export default function AiServicesTeaser({ inline = false }: { inline?: boolean }) {
  const { t, lang } = useLanguage();

  const content = (
    <div className={`flex flex-col items-center text-center gap-5 ${inline ? "" : "max-w-3xl mx-auto"}`}>
      <Badge color="orange">{t.services.badge}</Badge>

      {/* Logolar */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap opacity-90">
        <img src="/Claude_AI_logo.svg" alt="Claude AI" className="h-8 sm:h-10 w-auto object-contain transition-transform hover:scale-110" />
        <img src="/Google_Gemini_logo_2025.svg" alt="Google Gemini" className="h-8 sm:h-10 w-auto object-contain transition-transform hover:scale-110" />
        <img src="/antigravity-color.svg" alt="Google Antigravity" className="h-6 sm:h-7 w-auto object-contain transition-transform hover:scale-110" />
        <img src="/ChatGPT-Logo.svg" alt="ChatGPT" className="h-7 sm:h-9 w-auto object-contain transition-transform hover:scale-110" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" alt="Adobe Illustrator" className="h-8 sm:h-10 w-auto object-contain transition-transform hover:scale-110 rounded-lg" />
      </div>

      {/* Başlık */}
      <h2 className={`font-extrabold text-ink tracking-tight leading-snug ${inline ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
        {lang === "tr" ? (
          <>
            İhtiyaca Uygun<br />
            Aİ Destekli Yazılım Altyapıları<br />
            <span className="text-orange">Kuruyoruz</span>
          </>
        ) : (
          <>
            Custom<br />
            AI-Powered Software Infrastructures<br />
            <span className="text-orange">We Build</span>
          </>
        )}
      </h2>

      {/* Buton */}
      <Link
        href={`/${lang}/${getSlug(lang, "services")}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-white text-ink text-sm font-semibold hover:border-orange hover:text-orange transition-colors duration-200"
      >
        <span className="text-orange font-bold">+</span>
        {t.hero.cta_secondary}
      </Link>
    </div>
  );

  // inline modda section wrapper olmadan döner
  if (inline) return content;

  return (
    <section className="bg-white border-b border-border py-16 sm:py-20">
      <div className="container-site">{content}</div>
    </section>
  );
}
