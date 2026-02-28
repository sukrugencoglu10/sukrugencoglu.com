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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mt-6">
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
