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
type SectionId = "hiyerarsi" | "sss" | "notlar" | "dusunceler";

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "hiyerarsi",  label: "Reklam Hiyerarşisi", icon: "⬡" },
  { id: "sss",        label: "SSS",                icon: "?" },
  { id: "notlar",     label: "Notlar",              icon: "📝" },
  { id: "dusunceler", label: "Düşünceler",          icon: "✍️" },
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

function DusuncelerInner({ activeItemId, onSelect }: { activeItemId: string | null; onSelect: (id: string) => void }) {
  const { lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/blog-yazilari").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d.filter((p: any) => p.published)); }).catch(() => {});
  }, []);
  return (
    <InnerList
      items={items.map(i => ({ id: String(i.id), label: (lang === "tr" ? i.titleTR : i.titleEN) || "(başlıksız)", emoji: i.coverEmoji }))}
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
              padding: "9px 16px",
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
              color: isActive ? "#111" : "#666", lineHeight: 1.35,
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

function DusuncelerDetail({ itemId }: { itemId: string }) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/blog-yazilari").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setData(d.filter((p: any) => p.published)); }).catch(() => {});
  }, []);
  const post = data.find(p => String(p.id) === itemId);
  if (!post) return <Loading />;
  const ACCENT: Record<string, string> = {
    gtm: "#1D9E75", analytics: "#3B82F6", cro: "#F59E0B",
    otomasyon: "#8B5CF6", genel: "#6B7280", reklam: "#EF4444",
  };
  const accent = ACCENT[post.category] || "#1D9E75";
  const title = lang === "tr" ? post.titleTR : post.titleEN;
  const summary = lang === "tr" ? post.summaryTR : post.summaryEN;
  const date = (() => { try { return new Date(post.publishedAt).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return post.publishedAt; } })();
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 32 }}>{post.coverEmoji || "📝"}</span>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: accent }}>
            {post.category}
          </span>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{date} · {post.readingMinutes} dk</div>
        </div>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 0.75rem", lineHeight: 1.25 }}>{title}</h2>
      <p style={{ fontSize: 14, color: "#777", lineHeight: 1.7, margin: "0 0 1.5rem" }}>{summary}</p>
      {post.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {post.tags.map((tag: string) => (
            <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12,
              background: "#f0f0f0", color: "#666", fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      )}
      <button onClick={() => router.push(`/${lang}/blog/${post.slug}`)}
        style={{ padding: "10px 20px", background: accent, color: "#fff", border: "none",
          borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        Yazıyı Oku →
      </button>
    </div>
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
    <div style={{ display: "flex", minHeight: "calc(100vh - 80px)", background: "#fafafa", fontFamily: "inherit" }}>

      {/* ── Left sidebar ── */}
      <aside style={{
        width: 52,
        flexShrink: 0,
        background: "#fff",
        borderRight: "0.5px solid #e8e8e8",
        display: "flex",
        flexDirection: "column",
        paddingTop: "1.5rem",
        gap: 4,
        position: "sticky",
        top: 80,
        height: "calc(100vh - 80px)",
        overflowY: "auto",
        zIndex: 10,
      }}>
        {SECTIONS.map(sec => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleSectionClick(sec.id)}
              title={sec.label}
              style={{
                width: "100%",
                padding: "14px 0",
                border: "none",
                borderRight: `2.5px solid ${isActive ? "#111" : "transparent"}`,
                background: isActive ? "#f5f5f5" : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
              }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{sec.icon}</span>
            </button>
          );
        })}
      </aside>

      {/* ── Inner list (visible when section selected) ── */}
      {activeSection && (
        <div style={{
          width: 220,
          flexShrink: 0,
          background: "#f5f5f5",
          borderRight: "0.5px solid #e8e8e8",
          position: "sticky",
          top: 80,
          height: "calc(100vh - 80px)",
          overflowY: "auto",
          animation: "slideInLeft 0.18s ease-out",
        }}>
          {/* Section header */}
          <div style={{ padding: "16px 16px 8px", borderBottom: "0.5px solid #e8e8e8" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", marginBottom: 4 }}>
              {SECTIONS.find(s => s.id === activeSection)?.label.toUpperCase()}
            </div>
          </div>

          {activeSection === "hiyerarsi"  && <HiyerarsiInner  activeItemId={activeItemId} onSelect={handleItemSelect} />}
          {activeSection === "sss"        && <SssInner        activeItemId={activeItemId} onSelect={handleItemSelect} />}
          {activeSection === "notlar"     && <NotlarInner     activeItemId={activeItemId} onSelect={handleItemSelect} />}
          {activeSection === "dusunceler" && <DusuncelerInner activeItemId={activeItemId} onSelect={handleItemSelect} />}
        </div>
      )}

      {/* ── Main content area ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {!activeSection ? (
          /* Maps view */
          <div style={{ padding: "2rem 1.5rem" }}>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em" }}>
                STRATEJİ STÜDYOSU
              </span>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, color: "#111",
                margin: "8px 0 12px", lineHeight: 1.2 }}>
                Canlı Reklam & Web Hiyerarşisi
              </h1>
              <p style={{ fontSize: 14, color: "#888", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
                Aşağıdaki harita, Şükrü Gençoğlu tarafından Stüdyo üzerinde oluşturulan
                ve gerçek zamanlı olarak güncellenen dijital büyüme stratejisini göstermektedir.
              </p>
            </div>
            <AdvertisingHierarchyLiveMap />
            <ReklamKpiLiveMap />
          </div>
        ) : !activeItemId ? (
          /* Section selected but no item — placeholder */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", minHeight: 400, color: "#ccc", gap: 12 }}>
            <span style={{ fontSize: 40 }}>{SECTIONS.find(s => s.id === activeSection)?.icon}</span>
            <span style={{ fontSize: 13 }}>
              Soldaki listeden bir öğe seç
            </span>
          </div>
        ) : (
          /* Detail panel */
          <div style={{ animation: "fadeInDetail 0.2s ease-out", minHeight: "100%" }}>
            {activeSection === "hiyerarsi"  && <HiyerarsiDetail  itemId={activeItemId} />}
            {activeSection === "sss"        && <SssDetail        itemId={activeItemId} />}
            {activeSection === "notlar"     && <NotlarDetail     itemId={activeItemId} />}
            {activeSection === "dusunceler" && <DusuncelerDetail itemId={activeItemId} />}
          </div>
        )}
      </main>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
