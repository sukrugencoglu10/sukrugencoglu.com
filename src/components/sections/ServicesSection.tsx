"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";

const ICONS = ["⚡", "📡", "📊", "🤖", "🔍"];
const COLORS = ["#ff5f00", "#1D9E75", "#2563eb", "#7c3aed", "#0ea5e9"];

export default function ServicesSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const items = t.services.items;
  const total = items.length;
  const color = COLORS[active];

  const goTo = (index: number) => {
    if (index === active || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 180);
  };

  const prev = () => goTo((active - 1 + total) % total);
  const next = () => goTo((active + 1) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="section-padding bg-surface-secondary/30 border-b border-border">
      <div className="container-site">

        {/* Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 mx-auto text-center">
          <Badge color="orange">{t.services.badge}</Badge>

          <div className="flex justify-center items-center gap-6 sm:gap-10 mt-8 mb-6 flex-wrap opacity-90">
            <img src="/Claude_AI_logo.svg" alt="Claude AI" className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-110" />
            <img src="/Google_Gemini_logo_2025.svg" alt="Google Gemini" className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-110" />
            <img src="/antigravity-color.svg" alt="Google Antigravity" className="h-7 sm:h-8 w-auto object-contain transition-transform hover:scale-110" />
            <img src="/ChatGPT-Logo.svg" alt="ChatGPT" className="h-9 sm:h-10 w-auto object-contain transition-transform hover:scale-110" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" alt="Adobe Illustrator" className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-110 rounded-lg" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
            {t.services.title}{" "}
            <span className="text-orange">{t.services.title_accent}</span>
          </h2>
        </div>

        {/* Slider */}
        <div className="max-w-5xl mx-auto">

          {/* Desktop: side tabs + content */}
          <div className="hidden md:grid md:grid-cols-[260px_1fr] gap-6 items-stretch">

            {/* Tab list */}
            <div className="flex flex-col gap-2">
              {items.map((item, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      boxShadow: `inset 3px 0 0 ${isActive ? COLORS[i] : "transparent"}`,
                      background: isActive ? `${COLORS[i]}10` : "transparent",
                      transition: "all 0.2s",
                    }}
                    className="text-left px-4 py-3 rounded-r-xl group flex items-center gap-3 cursor-pointer"
                  >
                    <span
                      style={{
                        background: isActive ? COLORS[i] : "#f0f0f0",
                        color: isActive ? "#fff" : "#999",
                        transition: "all 0.2s",
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{ color: isActive ? COLORS[i] : "#555" }}
                      className="text-sm font-semibold leading-snug transition-colors"
                    >
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content panel */}
            <div
              style={{
                boxShadow: `inset 0 3px 0 ${color}, var(--shadow-card)`,
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.18s ease, transform 0.18s ease",
              }}
              className="bg-white rounded-2xl rounded-tl-none p-8 lg:p-10 border border-border flex flex-col justify-between min-h-[320px]"
            >
              <div>
                <div
                  style={{ background: `${color}15`, color }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                >
                  {ICONS[active]}
                </div>
                <div
                  style={{ color: "#bbb" }}
                  className="text-xs font-bold tracking-widest mb-2 uppercase"
                >
                  {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-ink mb-4 leading-snug">
                  {items[active].title}
                </h3>
                {items[active].sections ? (
                  <div className="overflow-y-auto max-h-[380px] pr-2 space-y-5 text-[0.9rem]">
                    {items[active].sections!.map((sec, si) => (
                      <div key={si}>
                        <p className="font-bold text-ink mb-1">{sec.heading}</p>
                        {sec.intro && <p className="text-ink-secondary mb-2 leading-relaxed">{sec.intro}</p>}
                        <ul className="space-y-1">
                          {sec.bullets.map((b, bi) => (
                            <li key={bi} className="text-ink-secondary leading-relaxed">
                              <span className="font-semibold text-ink">{b.label}:</span> {b.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {items[active].closing && (
                      <div className="border-t border-border pt-4">
                        <p className="font-bold text-ink mb-1">{items[active].closing!.heading}</p>
                        <p className="text-ink-secondary leading-relaxed italic">&ldquo;{items[active].closing!.text}&rdquo;</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-ink-secondary leading-relaxed text-[0.95rem]">
                    {items[active].desc}
                  </p>
                )}
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 mt-8">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === active ? 24 : 8,
                      background: i === active ? color : "#e0e0e0",
                      transition: "all 0.25s",
                    }}
                    className="h-2 rounded-full cursor-pointer border-none p-0"
                    aria-label={`Hizmet ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: swipeable card + arrows */}
          <div
            className="md:hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                boxShadow: `inset 0 3px 0 ${color}, var(--shadow-card)`,
                opacity: animating ? 0 : 1,
                transform: animating ? "translateX(12px)" : "translateX(0)",
                transition: "opacity 0.18s ease, transform 0.18s ease",
              }}
              className="bg-white rounded-2xl p-6 border border-border"
            >
              <div
                style={{ background: `${color}15`, color }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
              >
                {ICONS[active]}
              </div>
              <div style={{ color: "#bbb" }} className="text-xs font-bold tracking-widest mb-1 uppercase">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-extrabold text-ink mb-3 leading-snug">
                {items[active].title}
              </h3>
              {items[active].sections ? (
                <div className="overflow-y-auto max-h-[340px] pr-1 space-y-4 text-sm">
                  {items[active].sections!.map((sec, si) => (
                    <div key={si}>
                      <p className="font-bold text-ink mb-1">{sec.heading}</p>
                      {sec.intro && <p className="text-ink-secondary mb-1 leading-relaxed">{sec.intro}</p>}
                      <ul className="space-y-1">
                        {sec.bullets.map((b, bi) => (
                          <li key={bi} className="text-ink-secondary leading-relaxed">
                            <span className="font-semibold text-ink">{b.label}:</span> {b.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {items[active].closing && (
                    <div className="border-t border-border pt-3">
                      <p className="font-bold text-ink mb-1">{items[active].closing!.heading}</p>
                      <p className="text-ink-secondary leading-relaxed italic">&ldquo;{items[active].closing!.text}&rdquo;</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-ink-secondary leading-relaxed text-sm">
                  {items[active].desc}
                </p>
              )}
            </div>

            {/* Mobile nav */}
            <div className="flex items-center justify-between mt-5 px-1">
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === active ? 20 : 7,
                      background: i === active ? color : "#e0e0e0",
                      transition: "all 0.25s",
                    }}
                    className="h-2 rounded-full cursor-pointer border-none p-0"
                    aria-label={`Hizmet ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl border border-border bg-white flex items-center justify-center text-ink hover:border-orange hover:text-orange transition-colors cursor-pointer"
                  aria-label="Önceki"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  style={{ background: color }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity hover:opacity-80 cursor-pointer border-none"
                  aria-label="Sonraki"
                >
                  →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
