"use client";

import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import ProjectTable from "@/components/ui/ProjectTable";
import { projects } from "@/lib/projects";

export default function WorkSection() {
  const { t, lang } = useLanguage();

  return (
    <section id="work" className="section-padding bg-surface-secondary">
      <div className="container-site">
        {/* Başlık */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge color="pink">{t.work.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            {t.work.title}{" "}
            <span className="text-accent">{t.work.title_accent}</span>
          </h2>
          <p className="text-ink-muted max-w-md">{t.work.subtitle}</p>
        </div>

        {/* Proje tablosu (eski sitedeki gibi genişleyebilir tablo yapısı) */}
        <div className="w-full max-w-5xl mx-auto">
          <ProjectTable />
        </div>
      </div>
    </section>
  );
}
