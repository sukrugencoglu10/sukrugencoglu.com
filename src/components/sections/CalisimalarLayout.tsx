"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const AdvertisingHierarchyLiveMap = dynamic(() => import("@/components/ui/AdvertisingHierarchyLiveMap"), { ssr: false });
const ReklamKpiLiveMap = dynamic(() => import("@/components/ui/ReklamKpiLiveMap"), { ssr: false });

/* ─── helpers ────────────────────────────────────────────────── */
function renderWithLinks(text: string) {
  return text.split(/(https?:\/\/[^\s]+)/gi).map((part, i) =>
    /^https?:\/\//i.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          style={{ color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" }}>{part}</a>
      : part
  );
}

/* ─── section definitions ────────────────────────────────────── */
type SectionId = "sss" | "dusunceler";

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "sss",        label: "SSS",                icon: "❓" },
  { id: "dusunceler", label: "Blog Yazıları",         icon: "✍️" },
];

/* ─── inner lists ─────────────────────────────────────────────── */
function HiyerarsiInner({ activeItemId, onSelect }: { activeItemId: string | null; onSelect: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/reklam-hiyerarsisi").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); }).catch(() => {});
  }, []);
  return (
    <InnerList items={items.map(i => ({ id: String(i.id), label: i.title }))}
      activeId={activeItemId} onSelect={onSelect} />
  );
}

function SssInner({ activeItemId, onSelect }: { activeItemId: string | null; onSelect: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/sss").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); }).catch(() => {});
  }, []);
  return (
    <InnerList items={items.map(i => ({ id: String(i.id), label: i.title }))}
      activeId={activeItemId} onSelect={onSelect} />
  );
}

function NotlarInner({ activeItemId, onSelect }: { activeItemId: string | null; onSelect: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/kisa-notlar").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); }).catch(() => {});
  }, []);
  return (
    <InnerList items={items.map(i => ({ id: String(i.id), label: i.title || "Not" }))}
      activeId={activeItemId} onSelect={onSelect} />
  );
}


function InnerList({ items, activeId, onSelect }: {
  items: { id: string; label: string; emoji?: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!items.length) return (
    <div style={{ padding: "1.5rem 1rem", fontSize: 12, color: "#bbb", fontStyle: "italic" }}>
      İçerik yükleniyor...
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 0" }}>
      {items.map((item, idx) => {
        const isActive = item.id === activeId;
        return (
          <button key={item.id} onClick={() => onSelect(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px",
              border: "none", borderLeft: `3px solid ${isActive ? "#111" : "transparent"}`,
              background: isActive ? "#fff" : "transparent",
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              transition: "all 0.13s",
            }}>
            {item.emoji
              ? <span style={{ fontSize: 15, lineHeight: 1 }}>{item.emoji}</span>
              : <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 5,
                  background: isActive ? "#111" : "#efefef", color: isActive ? "#fff" : "#aaa",
                  fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
            }
            <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 400,
              color: isActive ? "#111" : "#555", lineHeight: 1.35,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── detail panels ──────────────────────────────────────────── */
function HiyerarsiDetail({ itemId }: { itemId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [openFaqIds, setOpenFaqIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    fetch("/api/reklam-hiyerarsisi").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setData(d); }).catch(() => {});
  }, []);
  const item = data.find(i => String(i.id) === itemId);
  if (!item) return <Loading />;
  const toggleFaq = (id: number) =>
    setOpenFaqIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 1rem", lineHeight: 1.25 }}>{item.title}</h2>
      {item.description && (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: "0 0 1.5rem", whiteSpace: "pre-wrap" }}>
          {renderWithLinks(item.description)}
        </p>
      )}
      {item.faq?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", marginBottom: 4 }}>SIKÇA SORULAN SORULAR</div>
          {item.faq.map((fq: any) => (
            <div key={fq.id} style={{ border: "0.5px solid #eee", borderRadius: 10, overflow: "hidden" }}>
              <button onClick={() => toggleFaq(fq.id)}
                style={{ width: "100%", padding: "11px 16px", background: openFaqIds.has(fq.id) ? "#f5f5f5" : "#fff",
                  border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{fq.question}</span>
                <span style={{ fontSize: 16, color: "#aaa", flexShrink: 0 }}>{openFaqIds.has(fq.id) ? "−" : "+"}</span>
              </button>
              {openFaqIds.has(fq.id) && (
                <div style={{ padding: "11px 16px", fontSize: 13, color: "#555", lineHeight: 1.75,
                  borderTop: "0.5px solid #eee", background: "#fafafa" }}>
                  {renderWithLinks(fq.answer)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SssDetail({ itemId }: { itemId: string }) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/sss").then(r => r.json()).then(d => { if (Array.isArray(d)) setData(d); }).catch(() => {});
  }, []);
  const item = data.find(i => String(i.id) === itemId);
  if (!item) return <Loading />;
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 1rem", lineHeight: 1.25 }}>{item.title}</h2>
      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
        {renderWithLinks(item.description || "")}
      </p>
    </div>
  );
}

function NotlarDetail({ itemId }: { itemId: string }) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/kisa-notlar").then(r => r.json()).then(d => { if (Array.isArray(d)) setData(d); }).catch(() => {});
  }, []);
  const item = data.find(i => String(i.id) === itemId);
  if (!item) return <Loading />;
  const NOTE_COLORS: Record<string, string> = {
    "#ffffff": "#111", "#f28b82": "#c0392b", "#fbbc04": "#b7770d", "#fff475": "#8a7000",
    "#ccff90": "#2d7a00", "#a7ffeb": "#00695c", "#cbf0f8": "#006064", "#aecbfa": "#1a5276",
    "#d7aefb": "#6c3483", "#fdcfe8": "#922b61", "#e6c9a8": "#7d4e1c", "#e8eaed": "#5f6368",
  };
  const accent = NOTE_COLORS[item.color] || "#111";
  return (
    <div style={{ padding: "2rem", background: item.color || "#fff", minHeight: "100%", borderRadius: "0 0 12px 0" }}>
      {item.title && (
        <h2 style={{ fontSize: 22, fontWeight: 700, color: accent, margin: "0 0 1rem", lineHeight: 1.25 }}>{item.title}</h2>
      )}
      <p style={{ fontSize: 14, color: "#444", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
        {item.content || <span style={{ color: "#aaa", fontStyle: "italic" }}>İçerik yok.</span>}
      </p>
    </div>
  );
}

/* ─── Accordion expanding panels (Süzen-style) ─────────────────── */
const ACCENT: Record<string, string> = {
  gtm: "#1D9E75", analytics: "#3B82F6", cro: "#F59E0B",
  otomasyon: "#8B5CF6", genel: "#6B7280", reklam: "#EF4444",
};

const FAQ_GRADIENTS = [
  "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)",
  "linear-gradient(135deg, #4a3520 0%, #8b6332 100%)",
  "linear-gradient(135deg, #1f4d3d 0%, #3a8060 100%)",
  "linear-gradient(135deg, #4a1e3d 0%, #8b3a6a 100%)",
  "linear-gradient(135deg, #3d2a4a 0%, #6a4a8b 100%)",
  "linear-gradient(135deg, #4a2a1e 0%, #8b5a3a 100%)",
  "linear-gradient(135deg, #1e404a 0%, #3a7a8b 100%)",
];

function AccordionPanels({
  items,
  activeId,
  onSelect,
  emptyText,
}: {
  items: { id: string; title: string; subtitle?: string; cover?: string; gradient: string; meta?: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  emptyText: string;
}) {
  if (!items.length) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#bbb", fontSize: 13 }}>
      {emptyText}
    </div>
  );
  // If no active, default to first
  const effectiveActive = activeId && items.some(i => i.id === activeId) ? activeId : items[0].id;
  return (
    <div className="cal-accordion">
      {items.map(item => {
        const isActive = item.id === effectiveActive;
        return (
          <div
            key={item.id}
            className={`cal-acc-panel${isActive ? " cal-acc-panel--active" : ""}`}
            onClick={() => onSelect(item.id)}
            style={{
              background: item.cover ? `url(${item.cover}) center/cover` : item.gradient,
              flexGrow: isActive ? 4 : 1,
              flexShrink: 1,
              flexBasis: 0,
            }}
          >
            {/* Dark overlay */}
            <div className="cal-acc-overlay" />

            {/* Inactive: just title at bottom */}
            <div className="cal-acc-collapsed-label">
              {item.title}
            </div>

            {/* Active: title + subtitle + Devamı button */}
            <div className="cal-acc-expanded">
              {item.meta && <div className="cal-acc-meta">{item.meta}</div>}
              <h3 className="cal-acc-title">{item.title}</h3>
              {item.subtitle && <div className="cal-acc-subtitle">{item.subtitle}</div>}
              <button
                className="cal-acc-cta"
                onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
              >
                Devamı
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SssAccordion({ activeId, onSelect }: { activeId: string | null; onSelect: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/sss").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading />;
  return (
    <AccordionPanels
      items={items.map((i, idx) => ({
        id: String(i.id),
        title: i.title,
        subtitle: i.description ? String(i.description).slice(0, 90) + (String(i.description).length > 90 ? "…" : "") : undefined,
        gradient: FAQ_GRADIENTS[idx % FAQ_GRADIENTS.length],
        meta: "SSS",
      }))}
      activeId={activeId}
      onSelect={onSelect}
      emptyText="Henüz SSS içeriği yok."
    />
  );
}

function BlogAccordion() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [readyId, setReadyId] = useState<string | null>(null); // to trigger navigation on second click
  useEffect(() => {
    fetch("/api/blog-yazilari").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPosts(d.filter((p: any) => p.published)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const items = posts.map(post => {
    const title = lang === "tr" ? post.titleTR : post.titleEN;
    const summary = lang === "tr" ? post.summaryTR : post.summaryEN;
    const accent = ACCENT[post.category] || "#1D9E75";
    return {
      id: String(post.id),
      title,
      subtitle: summary,
      cover: post.coverImage || undefined,
      gradient: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
      meta: `${post.category?.toUpperCase() || ""} · ${post.readingMinutes} dk`,
      slug: post.slug,
    };
  });

  if (!items.length) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#bbb", fontSize: 13 }}>
      Henüz yayınlanmış blog yazısı yok.
    </div>
  );

  const handleSelect = (id: string) => {
    if (activeId === id) {
      const post = posts.find(p => String(p.id) === id);
      if (post) router.push(`/${lang}/blog/${post.slug}`);
    } else {
      setActiveId(id);
      setReadyId(id);
    }
  };

  return (
    <AccordionPanels
      items={items}
      activeId={activeId}
      onSelect={handleSelect}
      emptyText="Henüz blog yazısı yok."
    />
  );
}

function Loading() {
  return <div style={{ padding: "2rem", fontSize: 13, color: "#bbb" }}>Yükleniyor...</div>;
}

/* ─── Main Layout ─────────────────────────────────────────────── */
export default function CalisimalarLayout() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleSectionClick = (id: SectionId) => {
    if (activeSection === id) {
      setActiveSection(null);
      setActiveItemId(null);
    } else {
      setActiveSection(id);
      setActiveItemId(null);
    }
  };

  const handleItemSelect = (id: string) => setActiveItemId(id);

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", background: "#fafafa", fontFamily: "inherit" }}>

      {/* ── Top tab bar ── */}
      <div className="cal-tabbar">
        {SECTIONS.map(sec => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleSectionClick(sec.id)}
              className={`cal-tab${isActive ? " cal-tab--active" : ""}`}>
              <span className="cal-tab-icon">{sec.icon}</span>
              <span className="cal-tab-label">{sec.label}</span>
            </button>
          );
        })}
        {activeSection && (
          <button
            onClick={() => { setActiveSection(null); setActiveItemId(null); }}
            className="cal-tab-close"
            title="Kapat">
            ✕
          </button>
        )}
      </div>

      {/* ── Content area ── */}
      {!activeSection ? (
        /* Maps view */
        <div className="cal-maps-wrap">
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 800, color: "#111",
              margin: "0 0 10px", lineHeight: 1.2 }}>
              Canlı Reklam & Web Hiyerarşisi
            </h1>
            <p style={{ fontSize: 14, color: "#888", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Aşağıdaki harita, Şükrü Gençoğlu tarafından Stüdyo üzerinde oluşturulan
              ve gerçek zamanlı olarak güncellenen dijital büyüme stratejisini göstermektedir.
            </p>
          </div>
          <AdvertisingHierarchyLiveMap />
          <ReklamKpiLiveMap />
        </div>
      ) : activeSection === "dusunceler" ? (
        /* Blog yazıları — accordion paneller */
        <div className="cal-accordion-wrap">
          <BlogAccordion />
        </div>
      ) : (
        /* SSS — accordion paneller + detay */
        <div className="cal-accordion-wrap">
          <SssAccordion activeId={activeItemId} onSelect={handleItemSelect} />
          {activeItemId && (
            <div className="cal-acc-detail">
              <SssDetail itemId={activeItemId} />
            </div>
          )}
        </div>
      )}

      <style>{`
        /* ── Tab bar ── */
        .cal-tabbar {
          position: sticky;
          top: 80px;
          z-index: 20;
          background: #fff;
          border-bottom: 0.5px solid #e8e8e8;
          display: flex;
          align-items: stretch;
          justify-content: center;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .cal-tabbar::-webkit-scrollbar { display: none; }

        .cal-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 14px 16px;
          border: none;
          border-bottom: 2.5px solid transparent;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: #888;
          transition: all 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cal-tab--active {
          border-bottom-color: #111;
          color: #111;
          font-weight: 700;
        }
        .cal-tab-icon { font-size: 15px; }
        .cal-tab-close {
          margin-left: auto;
          margin-right: 0.5rem;
          padding: 0 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          color: #ccc;
          flex-shrink: 0;
        }

        /* ── Maps wrapper ── */
        .cal-maps-wrap {
          padding: 1.5rem 1rem;
        }

        /* ── Split layout ── */
        .cal-split {
          display: flex;
          min-height: calc(100vh - 130px);
        }
        .cal-list-panel {
          width: 240px;
          flex-shrink: 0;
          background: #f7f7f7;
          border-right: 0.5px solid #e8e8e8;
          overflow-y: auto;
          animation: slideInLeft 0.18s ease-out;
        }
        .cal-detail-panel {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }
        .cal-back-btn {
          display: none;
          margin: 1rem 1rem 0;
          padding: 7px 14px;
          border: 0.5px solid #e0e0e0;
          border-radius: 8px;
          background: #f5f5f5;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          font-family: inherit;
        }

        /* ── Accordion expanding panels (Süzen-style) ── */
        .cal-accordion-wrap {
          padding: 1.5rem 1rem;
        }
        .cal-accordion {
          display: flex;
          gap: 10px;
          height: 420px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .cal-acc-panel {
          position: relative;
          flex: 1;
          min-width: 0;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background-size: cover;
          background-position: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .cal-acc-panel--active {
          flex: 4;
        }
        .cal-acc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%);
          transition: opacity 0.3s;
        }
        .cal-acc-panel--active .cal-acc-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.2) 100%);
        }
        .cal-acc-collapsed-label {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 18px;
          padding: 0 10px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          line-height: 1.3;
          z-index: 2;
          opacity: 1;
          transition: opacity 0.2s;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-shadow: 0 2px 6px rgba(0,0,0,0.6);
        }
        .cal-acc-panel--active .cal-acc-collapsed-label {
          opacity: 0;
          pointer-events: none;
        }
        .cal-acc-expanded {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 22px 26px 26px;
          color: #fff;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s 0.15s, transform 0.4s 0.15s;
          pointer-events: none;
        }
        .cal-acc-panel--active .cal-acc-expanded {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .cal-acc-meta {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          opacity: 0.85;
          margin-bottom: 8px;
        }
        .cal-acc-title {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 800;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .cal-acc-subtitle {
          font-size: 13px;
          line-height: 1.55;
          opacity: 0.9;
          margin-bottom: 14px;
          max-width: 480px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cal-acc-cta {
          display: inline-block;
          padding: 9px 22px;
          background: rgba(255,255,255,0.95);
          color: #111;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .cal-acc-cta:hover {
          background: #fff;
          transform: translateY(-1px);
        }
        .cal-acc-detail {
          max-width: 1200px;
          margin: 1.5rem auto 0;
          background: #fff;
          border-radius: 14px;
          border: 0.5px solid #e8e8e8;
          animation: fadeInDetail 0.25s ease-out;
        }

        /* ── Animations ── */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .cal-tabbar { justify-content: flex-start; }
          .cal-tab { padding: 12px 12px; gap: 5px; font-size: 12px; }
          .cal-tab-label { display: none; }
          .cal-tab-icon { font-size: 18px; }
          .cal-tab--active .cal-tab-label { display: inline; }

          .cal-maps-wrap { padding: 1rem 0.75rem; }

          .cal-split { flex-direction: column; }
          .cal-list-panel { width: 100%; border-right: none; border-bottom: 0.5px solid #e8e8e8; }
          .cal-split--detail .cal-list-panel { display: none; }
          .cal-split--detail .cal-detail-panel { display: block; }
          .cal-back-btn { display: inline-flex; align-items: center; gap: 4px; }

          .cal-accordion-wrap { padding: 1rem 0.75rem; }
          .cal-accordion {
            flex-direction: column;
            height: auto;
            gap: 8px;
          }
          .cal-acc-panel {
            min-height: 90px;
            flex: 0 0 auto;
          }
          .cal-acc-panel--active {
            min-height: 280px;
            flex: 0 0 auto;
          }
          .cal-acc-title { font-size: 20px; }
          .cal-acc-expanded { padding: 18px 20px 22px; }
        }

        @media (max-width: 400px) {
          .cal-tab { padding: 10px 10px; }
        }
      `}</style>
    </div>
  );
}
