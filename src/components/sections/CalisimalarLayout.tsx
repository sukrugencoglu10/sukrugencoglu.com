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
  { id: "sss",        label: "SSS",                icon: "❓" },
  { id: "notlar",     label: "Notlar",              icon: "📝" },
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

/* ─── Blog cards grid ─────────────────────────────────────────── */
const ACCENT: Record<string, string> = {
  gtm: "#1D9E75", analytics: "#3B82F6", cro: "#F59E0B",
  otomasyon: "#8B5CF6", genel: "#6B7280", reklam: "#EF4444",
};

function BlogCards() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/blog-yazilari").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPosts(d.filter((p: any) => p.published)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!posts.length) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#bbb", fontSize: 13 }}>
      Henüz yayınlanmış blog yazısı yok.
    </div>
  );

  return (
    <div style={{ padding: "2rem", animation: "fadeInDetail 0.2s ease-out" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.25rem",
      }}>
        {posts.map(post => {
          const title = lang === "tr" ? post.titleTR : post.titleEN;
          const summary = lang === "tr" ? post.summaryTR : post.summaryEN;
          const accent = ACCENT[post.category] || "#1D9E75";
          const date = (() => {
            try { return new Date(post.publishedAt).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { year: "numeric", month: "short", day: "numeric" }); }
            catch { return post.publishedAt; }
          })();
          return (
            <div
              key={post.id}
              onClick={() => router.push(`/${lang}/blog/${post.slug}`)}
              style={{
                background: "#fff",
                border: "0.5px solid #e8e8e8",
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Colour strip + emoji */}
              <div style={{
                height: 80, background: accent + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderBottom: `2px solid ${accent}22`,
                fontSize: 36,
              }}>
                {post.coverEmoji || "📝"}
              </div>
              {/* Body */}
              <div style={{ padding: "1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                    textTransform: "uppercase" as const, color: accent,
                  }}>{post.category}</span>
                  <span style={{ fontSize: 10, color: "#bbb" }}>·</span>
                  <span style={{ fontSize: 10, color: "#bbb" }}>{post.readingMinutes} dk</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.35 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#888", lineHeight: 1.65, flex: 1 }}>{summary}</p>
                {post.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                    {post.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 10,
                        background: "#f0f0f0", color: "#777",
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 10, color: "#ccc", marginTop: 4 }}>{date}</div>
              </div>
            </div>
          );
        })}
      </div>
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
    <div style={{ minHeight: "calc(100vh - 80px)", background: "#fafafa", fontFamily: "inherit" }}>

      {/* ── Top tab bar ── */}
      <div style={{
        position: "sticky",
        top: 80,
        zIndex: 20,
        background: "#fff",
        borderBottom: "0.5px solid #e8e8e8",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        gap: 0,
      }}>
        {/* Tab buttons */}
        {SECTIONS.map(sec => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleSectionClick(sec.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "14px 18px",
                border: "none",
                borderBottom: `2.5px solid ${isActive ? "#111" : "transparent"}`,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#111" : "#888",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
              <span style={{ fontSize: 15 }}>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          );
        })}

        {/* Close button when section active */}
        {activeSection && (
          <button
            onClick={() => { setActiveSection(null); setActiveItemId(null); }}
            style={{
              marginLeft: "auto", marginRight: "0.75rem",
              padding: "0 12px", border: "none", background: "transparent",
              cursor: "pointer", fontSize: 18, color: "#ccc", fontFamily: "inherit",
              transition: "color 0.15s",
            }}
            title="Kapat">
            ✕
          </button>
        )}
      </div>

      {/* ── Content area ── */}
      {!activeSection ? (
        /* Maps view */
        <div style={{ padding: "2rem 1.5rem" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
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
      ) : activeSection === "dusunceler" ? (
        /* Blog yazıları — tam genişlik kart grid */
        <BlogCards />
      ) : (
        /* Diğer sekmeler — iç liste + detay */
        <div style={{ display: "flex", minHeight: "calc(100vh - 130px)" }}>

          {/* Inner list panel */}
          <div style={{
            width: 240,
            flexShrink: 0,
            background: "#f7f7f7",
            borderRight: "0.5px solid #e8e8e8",
            overflowY: "auto",
            animation: "slideInLeft 0.18s ease-out",
          }}>
            <div style={{ padding: "14px 16px 8px", borderBottom: "0.5px solid #ebebeb" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em" }}>
                {SECTIONS.find(s => s.id === activeSection)?.label.toUpperCase()}
              </div>
            </div>
            {activeSection === "hiyerarsi" && <HiyerarsiInner activeItemId={activeItemId} onSelect={handleItemSelect} />}
            {activeSection === "sss"       && <SssInner       activeItemId={activeItemId} onSelect={handleItemSelect} />}
            {activeSection === "notlar"    && <NotlarInner    activeItemId={activeItemId} onSelect={handleItemSelect} />}
          </div>

          {/* Detail panel */}
          <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
            {!activeItemId ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", minHeight: 360, color: "#ccc", gap: 12 }}>
                <span style={{ fontSize: 40 }}>{SECTIONS.find(s => s.id === activeSection)?.icon}</span>
                <span style={{ fontSize: 13 }}>Soldaki listeden bir öğe seç</span>
              </div>
            ) : (
              <div style={{ animation: "fadeInDetail 0.2s ease-out", minHeight: "100%" }}>
                {activeSection === "hiyerarsi" && <HiyerarsiDetail itemId={activeItemId} />}
                {activeSection === "sss"       && <SssDetail       itemId={activeItemId} />}
                {activeSection === "notlar"    && <NotlarDetail    itemId={activeItemId} />}
              </div>
            )}
          </main>
        </div>
      )}

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
