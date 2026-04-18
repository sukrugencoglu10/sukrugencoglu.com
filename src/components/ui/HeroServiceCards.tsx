"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceModal from "./ServiceModal";
import GrowthForm from "./GrowthForm";
import PlusServicesWizard from "./PlusServicesWizard";

const CARDS = [
  {
    id: "ads" as const,
    badge: "Reklam ve Analiz",
    color: "#ff5f00",
    gradientFrom: "#fff4ee",
    icon: "📊",
    iconBg: "linear-gradient(135deg, #ff5f00 0%, #ff8c42 100%)",
    title: "Google & Meta Ads\nYönetimi",
    subtitle: "Veriye dayalı kampanyalar, ölçülebilir sonuçlar.",
    bullets: [
      "Sunucu Taraflı GTM Kurulumu",
      "Facebook CAPI & Dönüşüm Takibi",
      "Looker Studio Raporlaması",
      "Reklam Optimizasyonu",
    ],
    cta: "Ücretsiz Analiz Al →",
    modalTitle: "Reklam ve Analiz",
  },
  {
    id: "plus" as const,
    badge: "+Plus Hizmetlerimiz",
    color: "#7c3aed",
    gradientFrom: "#f5f0ff",
    icon: "⚡",
    iconBg: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    title: "Özel Yazılım\nAltyapıları",
    subtitle: "İşletmenize özel sistem, sıfır manuel iş.",
    bullets: [
      "Web Site & SEO",
      "Veri Paneli & Otomasyon",
      "Müşteri Yönetimi (CRM)",
      "Süreç Otomasyonu",
    ],
    cta: "Hızlı Başvuru →",
    modalTitle: "+Plus Hizmetlerimiz",
  },
];

// 0 = gallery, 1 = ads card, 2 = plus card
const TOTAL = CARDS.length + 1;
const DURATIONS = [4500, 5000, 5000];

export default function HeroServiceCards() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<"ads" | "plus" | null>(null);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % TOTAL);
  }, []);

  useEffect(() => {
    if (paused) return;
    const delay = DURATIONS[active] ?? 5000;
    const t = setTimeout(advance, delay);
    return () => clearTimeout(t);
  }, [active, paused, advance]);

  const openModal = (id: "ads" | "plus") => {
    setPaused(true);
    setModal(id);
  };
  const closeModal = () => {
    setModal(null);
    setPaused(false);
  };

  const activeCard = active > 0 ? CARDS[active - 1] : null;

  return (
    <>
      {/* Overlay panels — absolute inset-0 over MasonryGallery */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 8 }}>
        <AnimatePresence mode="wait">
          {activeCard && (
            <motion.div
              key={activeCard.id}
              className="absolute inset-0 flex flex-col justify-center items-center p-6"
              style={{
                background: `linear-gradient(145deg, ${activeCard.gradientFrom} 0%, #ffffff 70%)`,
                borderRadius: 24,
                overflow: "hidden",
                pointerEvents: "auto",
              }}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Decorative blob top-right */}
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: activeCard.color,
                  opacity: 0.07,
                  pointerEvents: "none",
                }}
              />
              {/* Decorative blob bottom-left */}
              <div
                style={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: activeCard.color,
                  opacity: 0.05,
                  pointerEvents: "none",
                }}
              />

              {/* Content */}
              <div className="relative z-10 w-full max-w-xs mx-auto text-center flex flex-col items-center gap-4">
                {/* Icon */}
                <div
                  style={{
                    background: activeCard.iconBg,
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    boxShadow: `0 12px 32px ${activeCard.color}40`,
                  }}
                >
                  {activeCard.icon}
                </div>

                {/* Badge */}
                <span
                  style={{
                    background: `${activeCard.color}15`,
                    color: activeCard.color,
                    border: `1px solid ${activeCard.color}30`,
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                >
                  {activeCard.badge}
                </span>

                {/* Title */}
                <h3
                  className="text-xl font-extrabold text-ink leading-tight"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {activeCard.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-ink-secondary leading-relaxed -mt-1">
                  {activeCard.subtitle}
                </p>

                {/* Bullets */}
                <ul className="w-full text-left space-y-1.5">
                  {activeCard.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-ink-secondary">
                      <span
                        style={{
                          background: activeCard.iconBg,
                          width: 18,
                          height: 18,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => openModal(activeCard.id)}
                  style={{ background: activeCard.iconBg, boxShadow: `0 6px 20px ${activeCard.color}40` }}
                  className="w-full py-2.5 rounded-xl text-white text-sm font-bold cursor-pointer border-none transition-opacity hover:opacity-90 mt-1"
                >
                  {activeCard.cta}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation dots — always visible */}
        <div
          className="absolute flex gap-2 items-center"
          style={{ bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 20, pointerEvents: "auto" }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const card = i > 0 ? CARDS[i - 1] : null;
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => { setActive(i); setPaused(false); }}
                style={{
                  width: isActive ? 20 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: isActive ? (card?.color ?? "#ff5f00") : "rgba(0,0,0,0.2)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                aria-label={i === 0 ? "Galeri" : CARDS[i - 1].badge}
              />
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={modal === "ads"}
        onClose={closeModal}
        title="Reklam ve Analiz"
        color="#ff5f00"
      >
        <GrowthForm />
      </ServiceModal>

      <ServiceModal
        isOpen={modal === "plus"}
        onClose={closeModal}
        title="+Plus Hizmetlerimiz"
        color="#7c3aed"
      >
        <PlusServicesWizard />
      </ServiceModal>
    </>
  );
}
