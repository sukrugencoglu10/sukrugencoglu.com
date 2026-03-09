"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LEGEND = [
  { key: "donusum", color: "#e95578", label: "Dönüşüm" },
  { key: "lead",    color: "#81358a", label: "Lead"     },
  { key: "tasarruf",color: "#f4bd13", label: "Tasarruf" },
];

const SLIDES = [
  {
    company: "Pekcon",
    metricValue: "+92%",
    metricLabel: "Dönüşüm Artışı",
    extra: { val: "3.2x", lbl: "ROAS" },
    tags: ["Meta Ads", "CRO", "GTM"],
    // CRO etkisi: pembe ortada ani sıçrama, diğerleri yavaş büyüme
    lines: [
      { color: "#e95578", path: "M0,85 C20,84 38,82 55,79 S78,72 92,62 S108,42 122,30 S145,18 165,12 S202,7 238,5 S265,4 280,4" },
      { color: "#81358a", path: "M0,80 C22,76 42,70 62,64 S88,56 104,52 S124,46 142,42 S166,36 184,32 S218,26 252,22 S270,20 280,18" },
      { color: "#f4bd13", path: "M0,75 C26,72 48,69 68,66 S94,62 114,59 S134,55 154,58 S174,52 192,49 S224,45 256,41 S272,39 280,37" },
    ],
  },
  {
    company: "Demirkol",
    metricValue: "+180%",
    metricLabel: "Qualified Leads",
    extra: { val: "-45%", lbl: "Cost Per Lead" },
    tags: ["Google Ads", "GA4", "Looker Studio"],
    // B2B büyüme: mor çok agresif, diğerleri ılımlı
    lines: [
      { color: "#e95578", path: "M0,82 C18,78 36,72 56,66 S82,58 96,54 S116,48 132,44 S155,38 172,34 S205,28 240,23 S265,20 280,18" },
      { color: "#81358a", path: "M0,90 C14,84 28,74 46,62 S70,46 86,36 S108,24 126,16 S150,10 168,7 S204,4 235,3 S262,2 280,2" },
      { color: "#f4bd13", path: "M0,72 C28,70 50,67 72,64 S98,60 118,58 S138,54 158,57 S178,52 198,49 S228,45 258,42 S272,40 280,38" },
    ],
  },
  {
    company: "Multi-Client",
    metricValue: "15+ Saat",
    metricLabel: "Haftalık Tasarruf",
    extra: { val: "%0", lbl: "Manuel Hata" },
    tags: ["n8n", "Python", "Otomasyon"],
    // Otomasyon: sarı en güçlü, diğerleri dalgalı
    lines: [
      { color: "#e95578", path: "M0,78 C18,74 36,70 54,74 S80,66 96,62 S116,58 132,62 S152,54 168,48 S196,42 220,38 S254,32 280,28" },
      { color: "#81358a", path: "M0,84 C22,80 42,74 62,70 S88,63 104,59 S124,54 142,57 S162,50 180,44 S212,37 248,31 S268,28 280,25" },
      { color: "#f4bd13", path: "M0,88 C14,84 28,76 46,66 S70,52 88,42 S108,30 126,22 S150,14 170,9 S206,6 238,4 S262,3 280,3" },
    ],
  },
];

export default function GrowthDashboard() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number) => {
    setDir(i > index ? 1 : -1);
    setIndex(i);
  };

  const s = SLIDES[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full rounded-2xl bg-[#eaf3fb] border border-[#1e6296]/20 shadow-[var(--shadow-card)] p-5 tracking-tight overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-subtle mb-0.5">Kampanya Analizi</p>
          <h3 className="text-ink text-base font-semibold">Müşteri Sonuçları</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e6296] animate-pulse" />
          <span className="text-xs font-mono text-[#1e6296]">AKTİF</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-3">
        {LEGEND.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] text-ink-muted">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart — always visible, active line highlighted */}
      <div className="relative mb-3">
        <svg viewBox="0 0 280 100" className="w-full h-28" preserveAspectRatio="none">
          {[20, 40, 60, 80].map((y) => (
            <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="rgba(30,98,150,0.1)" strokeWidth="0.5" />
          ))}
          {s.lines.map((l, i) => (
            <motion.path
              key={l.color + index}
              d={l.path}
              fill="none"
              stroke={l.color}
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: "easeInOut", delay: i * 0.1 }}
            />
          ))}
        </svg>
        <div className="flex justify-between px-0.5 -mt-1">
          {["Oca", "Şub", "Mar", "Nis", "May", "Haz"].map((m) => (
            <span key={m} className="text-[10px] text-ink-subtle">{m}</span>
          ))}
        </div>
      </div>

      {/* Sliding company info */}
      <div className="relative overflow-hidden" style={{ minHeight: "72px" }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ x: dir * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-[#1e6296]/15 pt-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[10px] font-medium text-ink-subtle mb-0.5">{s.company}</p>
                <p className="text-2xl font-extrabold font-mono leading-none text-[#1e6296]">
                  {s.metricValue}
                </p>
                <p className="text-xs mt-0.5 text-ink-muted">{s.metricLabel}</p>
              </div>
              <div className="px-2.5 py-1 rounded-lg text-xs font-semibold font-mono bg-[#1e6296]/10 text-[#1e6296]">
                {s.extra.val} <span className="font-normal opacity-70">{s.extra.lbl}</span>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {s.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#1e6296]/8 text-[#1e6296]">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {SLIDES.map((sl, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === index ? sl.color : "#1e629630",
              transform: i === index ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
