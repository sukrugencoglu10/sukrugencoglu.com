"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import PaketCard, { type Paket } from "@/components/ui/PaketCard";

export default function PaketlerStrip() {
  const { lang } = useLanguage();
  const [paketler, setPaketler] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/paketler")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          const featured = d
            .filter((p: Paket) => p.published && p.featured)
            .sort((a: Paket, b: Paket) => (a.order ?? 999) - (b.order ?? 999))
            .slice(0, 3);
          setPaketler(featured);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (paketler.length === 0) return null;

  return (
    <section className="bg-surface-secondary/30 border-b border-border section-padding">
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <Badge color="orange">
              {lang === "tr" ? "Hazır Paketler" : "Productized Packages"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight leading-snug mt-4">
              {lang === "tr" ? (
                <>
                  Sabit kapsam,{" "}
                  <span className="text-orange">şeffaf fiyat.</span>
                </>
              ) : (
                <>
                  Fixed scope,{" "}
                  <span className="text-orange">transparent pricing.</span>
                </>
              )}
            </h2>
          </div>
          <Link
            href={`/${lang}/paketler`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-orange transition shrink-0"
          >
            {lang === "tr" ? "Tüm Paketler" : "All Packages"} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paketler.map((p) => (
            <PaketCard key={p.slug} paket={p} lang={lang} variant="strip" />
          ))}
        </div>
      </div>
    </section>
  );
}
