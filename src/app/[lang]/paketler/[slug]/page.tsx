"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Paket, PaketPricing } from "@/components/ui/PaketCard";
import PaketTeklifModal from "@/components/ui/PaketTeklifModal";

const CAT_COLORS: Record<string, string> = {
  veri: "#2563eb",
  reklam: "#EF4444",
  web: "#1D9E75",
  otomasyon: "#8B5CF6",
  genel: "#6B7280",
};

function formatPrice(p?: PaketPricing) {
  if (!p?.amount) return null;
  const num = Number(p.amount).toLocaleString("tr-TR");
  return `${num} ${p.currency || "TRY"}`;
}

export default function PaketDetailPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const slug = params?.slug as string;
  const [paket, setPaket] = useState<Paket | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/paketler")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          const found = d.find(
            (p: Paket) => p.slug === slug && p.published
          );
          if (found) setPaket(found);
          else setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  if (loading) {
    return (
      <div className="container-site py-20 text-center text-ink-secondary text-sm">
        Yükleniyor...
      </div>
    );
  }

  if (notFound || !paket) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold text-ink mb-3">Paket bulunamadı</h1>
        <Link
          href={`/${lang}/paketler`}
          className="text-orange hover:underline text-sm"
        >
          ← Tüm Paketler
        </Link>
      </div>
    );
  }

  const accent = CAT_COLORS[paket.category || "genel"] || CAT_COLORS.genel;
  const setup = formatPrice(paket.pricing?.setup);
  const monthly = formatPrice(paket.pricing?.monthly);

  return (
    <div className="min-h-screen bg-surface-secondary/20">
      <div className="container-site py-10 sm:py-14">
        <nav className="text-xs text-ink-secondary mb-6">
          <Link href={`/${lang}`} className="hover:text-orange">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/paketler`} className="hover:text-orange">
            Paketler
          </Link>
          <span className="mx-2">/</span>
          <span>{paket.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <article className="bg-white rounded-2xl border border-border overflow-hidden">
            {paket.cover ? (
              <div
                className="w-full h-56 sm:h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${paket.cover})` }}
              />
            ) : (
              <div
                className="w-full h-56 sm:h-72 flex items-center justify-center text-6xl"
                style={{ background: `${accent}15`, color: accent }}
              >
                📦
              </div>
            )}

            <div className="p-6 sm:p-10">
              {paket.category && (
                <span
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: accent }}
                >
                  {paket.category}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink leading-tight mt-2 mb-3">
                {paket.title}
              </h1>
              {paket.tagline && (
                <p className="text-base text-ink-secondary leading-relaxed mb-6">
                  {paket.tagline}
                </p>
              )}

              {paket.features && paket.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-ink mb-3 uppercase tracking-wider">
                    Paket İçeriği
                  </h2>
                  <ul className="space-y-2">
                    {paket.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-ink-secondary leading-relaxed"
                      >
                        <span style={{ color: accent }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {paket.description && (
                <div className="prose prose-sm sm:prose-base max-w-none text-ink-secondary">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                  >
                    {paket.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">
                Fiyatlandırma
              </h3>

              {setup && (
                <div className="flex justify-between items-baseline pb-3 border-b border-border">
                  <span className="text-sm text-ink-secondary">
                    {paket.pricing?.setup?.label || "Tek seferlik kurulum"}
                  </span>
                  <span className="font-bold text-ink">{setup}</span>
                </div>
              )}
              {monthly && (
                <div className="flex justify-between items-baseline pt-3 pb-3">
                  <span className="text-sm text-ink-secondary">
                    {paket.pricing?.monthly?.label || "Aylık bakım"}
                  </span>
                  <span className="font-bold text-ink">{monthly} /ay</span>
                </div>
              )}

              {paket.addons && paket.addons.length > 0 && (
                <>
                  <div className="border-t border-border pt-4 mt-2">
                    <h4 className="text-xs font-bold text-ink mb-3 uppercase tracking-wider">
                      Ek Modüller
                    </h4>
                    <div className="space-y-2">
                      {paket.addons.map((addon) => (
                        <label
                          key={addon.id}
                          className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-surface-secondary/40 transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(addon.id)}
                            onChange={() => toggleAddon(addon.id)}
                            className="mt-0.5 accent-orange"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-ink leading-snug">
                              {addon.title}
                            </div>
                            {addon.price ? (
                              <div className="text-xs text-ink-secondary mt-0.5">
                                +{Number(addon.price).toLocaleString("tr-TR")}{" "}
                                TRY
                                {addon.recurrence === "monthly" ? " /ay" : ""}
                              </div>
                            ) : null}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => setModalOpen(true)}
                className="mt-6 w-full py-3 bg-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition"
              >
                {paket.cta || "Teklif İste"} →
              </button>

              <p className="text-[11px] text-ink-secondary text-center mt-3">
                Onay sonrası fatura + EFT ile ilerlenir.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <PaketTeklifModal
        paket={paket}
        selectedAddons={selectedAddons}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
