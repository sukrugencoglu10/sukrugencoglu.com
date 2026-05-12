"use client";

import Link from "next/link";

export type PaketPricing = {
  amount?: number;
  currency?: string;
  label?: string;
};

export type Paket = {
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  category?: string;
  cover?: string;
  features?: string[];
  pricing?: {
    setup?: PaketPricing;
    monthly?: PaketPricing;
  };
  addons?: Array<{
    id: string;
    title: string;
    price?: number;
    recurrence?: "once" | "monthly";
  }>;
  cta?: string;
  published?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  order?: number;
};

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

export default function PaketCard({
  paket,
  lang = "tr",
  variant = "list",
}: {
  paket: Paket;
  lang?: string;
  variant?: "list" | "strip";
}) {
  const accent = CAT_COLORS[paket.category || "genel"] || CAT_COLORS.genel;
  const setup = formatPrice(paket.pricing?.setup);
  const monthly = formatPrice(paket.pricing?.monthly);
  const href = `/${lang}/paketler/${paket.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-orange/40"
      style={{ minHeight: variant === "strip" ? 360 : 420 }}
    >
      {paket.cover ? (
        <div
          className="w-full h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${paket.cover})` }}
        />
      ) : (
        <div
          className="w-full h-40 flex items-center justify-center"
          style={{ background: `${accent}15`, color: accent, fontSize: 48 }}
        >
          📦
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3">
        {paket.category && (
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: accent }}
          >
            {paket.category}
          </span>
        )}

        <h3 className="text-lg sm:text-xl font-extrabold text-ink leading-snug">
          {paket.title}
        </h3>

        {paket.tagline && (
          <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
            {paket.tagline}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-border/60 space-y-1">
          {setup && (
            <div className="flex justify-between text-xs">
              <span className="text-ink-secondary">
                {paket.pricing?.setup?.label || "Kurulum"}
              </span>
              <span className="font-semibold text-ink">{setup}</span>
            </div>
          )}
          {monthly && (
            <div className="flex justify-between text-xs">
              <span className="text-ink-secondary">
                {paket.pricing?.monthly?.label || "Aylık"}
              </span>
              <span className="font-semibold text-ink">{monthly} /ay</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3">
            <span
              className="text-sm font-semibold text-orange group-hover:underline"
              style={{ color: accent }}
            >
              {paket.cta || "Detay & Teklif"} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
