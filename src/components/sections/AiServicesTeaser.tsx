"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import { getSlug } from "@/lib/slugs";

export default function AiServicesTeaser() {
  const { t, lang } = useLanguage();

  return (
    <section className="bg-white border-b border-border py-16 sm:py-20">
      <div className="container-site">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">

          <Badge color="orange">{t.services.badge}</Badge>

          {/* Logolar */}
          <div className="flex justify-center items-center gap-5 sm:gap-10 flex-wrap opacity-90">
            <img
              src="/Claude_AI_logo.svg"
              alt="Claude AI"
              className="h-9 sm:h-11 w-auto object-contain transition-transform hover:scale-110"
            />
            <img
              src="/Google_Gemini_logo_2025.svg"
              alt="Google Gemini"
              className="h-9 sm:h-11 w-auto object-contain transition-transform hover:scale-110"
            />
            <img
              src="/antigravity-color.svg"
              alt="Google Antigravity"
              className="h-6 sm:h-8 w-auto object-contain transition-transform hover:scale-110"
            />
            <img
              src="/ChatGPT-Logo.svg"
              alt="ChatGPT"
              className="h-8 sm:h-10 w-auto object-contain transition-transform hover:scale-110"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg"
              alt="Adobe Illustrator"
              className="h-9 sm:h-11 w-auto object-contain transition-transform hover:scale-110 rounded-lg"
            />
          </div>

          {/* Başlık */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            {t.services.title}<br />
            <span className="text-orange">{t.services.title_accent}</span>
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
      </div>
    </section>
  );
}
