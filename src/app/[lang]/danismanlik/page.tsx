"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PaketCard, { type Paket } from "@/components/ui/PaketCard";

export default function DanismanlikPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const [items, setItems] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/danismanlik")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          const published = d
            .filter((p: Paket) => p.published)
            .sort((a: Paket, b: Paket) => (a.order ?? 999) - (b.order ?? 999));
          setItems(published);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(
    new Set(items.map((p) => p.category).filter(Boolean) as string[])
  );
  const filtered = activeCategory
    ? items.filter((p) => p.category === activeCategory)
    : items;

  return (
    <div className="min-h-screen bg-surface-secondary/20">
      <div className="container-site py-12 sm:py-16">
        <nav className="text-xs text-ink-secondary mb-6">
          <Link href={`/${lang}`} className="hover:text-orange">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span>Danışmanlık</span>
        </nav>

        <header className="max-w-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-3">
            {lang === "tr" ? "Büyüme Mühendisliği Danışmanlığı" : "Growth Engineering Consultancy"}
          </h1>
          <p className="text-base text-ink-secondary leading-relaxed">
            {lang === "tr"
              ? "Audit, kurulum, retainer formatlarında büyüme danışmanlığı. Sabit kapsam, ölçülebilir çıktı, KOSGEB destek dosyalarına uygun fatura yapısı."
              : "Audit, setup, retainer-format growth consultancy. Fixed scope, measurable outcomes."}
          </p>
        </header>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                activeCategory === null
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink-secondary border-border hover:border-orange hover:text-orange"
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition uppercase tracking-wider ${
                  activeCategory === cat
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink-secondary border-border hover:border-orange hover:text-orange"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-ink-secondary text-sm">
            Yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-ink-secondary text-sm bg-white rounded-2xl border border-dashed border-border">
            {lang === "tr"
              ? "Şu an yayında danışmanlık hizmeti bulunmuyor."
              : "No consultancy services available right now."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((p) => (
              <PaketCard
                key={p.slug}
                paket={p}
                lang={lang}
                basePath="danismanlik"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
