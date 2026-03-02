"use client";

import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-surface-secondary/30 border-b border-border">
      <div className="container-site">
        <div className="max-w-3xl mb-12 lg:mb-16 mx-auto text-center">
          <Badge color="orange">{t.services.badge}</Badge>
          
          <div className="flex justify-center items-center gap-6 sm:gap-10 mt-8 mb-6 flex-wrap opacity-90">
            <img 
              src="/Claude_AI_logo.svg" 
              alt="Claude AI" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-110"
            />
            <img 
              src="/Google_Gemini_logo_2025.svg" 
              alt="Google Gemini" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-110"
            />
            {/* Using uploaded Antigravity logo */}
            <img 
              src="/antigravity-color.svg" 
              alt="Google Antigravity" 
              className="h-7 sm:h-8 w-auto object-contain transition-transform hover:scale-110"
            />
            {/* Added ChatGPT logo */}
            <img 
              src="/ChatGPT-Logo.svg" 
              alt="ChatGPT" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform hover:scale-110"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" 
              alt="Adobe Illustrator" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-110 rounded-lg"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
            {t.services.title}{" "}
            <span className="text-orange">{t.services.title_accent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {t.services.items.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 lg:p-10 border border-border shadow-[var(--shadow-card)] hover:shadow-lg hover:border-orange/30 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center text-orange font-bold text-xl mb-6 shadow-sm">
                0{index + 1}
              </div>
              <div className="flex flex-col gap-4 flex-grow">
                <h3 className="text-2xl font-bold text-ink leading-snug group-hover:text-orange transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-ink-secondary leading-relaxed font-medium text-[0.95rem]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
