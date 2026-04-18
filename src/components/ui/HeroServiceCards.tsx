"use client";

import { useState, useEffect } from "react";

const CARDS = [
  {
    badge: "Reklam ve Analiz",
    badgeColor: "#ff5f00",
    icon: "📊",
    title: "Google & Meta Ads",
    bullets: [
      "Sunucu Taraflı GTM",
      "Dönüşüm & CAPI Takibi",
      "Reklam Optimizasyonu",
    ],
  },
  {
    badge: "+Plus Hizmetlerimiz",
    badgeColor: "#7c3aed",
    icon: "⚡",
    title: "Özel Yazılım Altyapıları",
    bullets: [
      "Web Site & SEO",
      "Veri Paneli & Otomasyon",
      "Özel CRM & Süreç Sistemleri",
    ],
  },
];

export default function HeroServiceCards() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % CARDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const card = CARDS[active];

  return (
    <div
      className="absolute bottom-4 left-0 right-0 px-3 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderTop: `3px solid ${card.badgeColor}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            transition: "border-top-color 0.5s ease",
          }}
          className="rounded-2xl p-4"
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              style={{
                background: `${card.badgeColor}15`,
                color: card.badgeColor,
                border: `1px solid ${card.badgeColor}30`,
                transition: "all 0.5s ease",
              }}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            >
              <span>{card.icon}</span>
              {card.badge}
            </span>

            {/* Dots */}
            <div className="flex gap-1.5">
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 16 : 6,
                    background: i === active ? card.badgeColor : "#d1d5db",
                    transition: "all 0.3s ease",
                    pointerEvents: "auto",
                  }}
                  className="h-1.5 rounded-full border-none p-0 cursor-pointer"
                  aria-label={`Kart ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content with crossfade */}
          <div style={{ position: "relative", minHeight: 64 }}>
            {CARDS.map((c, i) => (
              <div
                key={i}
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(-6px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  position: i === active ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  pointerEvents: i === active ? "auto" : "none",
                }}
              >
                <p className="text-sm font-extrabold text-ink mb-2">{c.title}</p>
                <ul className="space-y-1">
                  {c.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-center gap-1.5 text-xs text-ink-secondary">
                      <span style={{ color: CARDS[i].badgeColor }} className="font-bold">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
