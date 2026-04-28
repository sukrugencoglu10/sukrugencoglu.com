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

/* ─── SSS cards grid ─────────────────────────────────────────── */
function SssCards() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sss").then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!items.length) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#bbb", fontSize: 13 }}>
      Henüz SSS eklenmemiş.
    </div>
  );

  return (
    <div style={{ padding: "1.5rem", animation: "fadeInDetail 0.2s ease-out" }}>
      <div className="cal-blog-grid">
        {items.map(item => {
          const isOpen = openId === String(item.id);
          return (
            <div
              key={item.id}
              onClick={() => setOpenId(isOpen ? null : String(item.id))}
              style={{
                background: "#fff",
                border: `1px solid ${isOpen ? "#111" : "#e8e8e8"}`,
                borderRadius: 14,
                padding: "1.25rem 1.5rem",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLDivElement).style.borderColor = "#aaa"; }}
              onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLDivElement).style.borderColor = "#e8e8e8"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <span style={{ flexShrink: 0, fontSize: 14, color: "#888", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▾</span>
              </div>
              {!isOpen && (
                <p style={{ margin: 0, fontSize: 12, color: "#999", lineHeight: 1.6,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {item.description}
                </p>
              )}
              {isOpen && (
                <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {renderWithLinks(item.description || "")}
                </p>
              )}
            </div>
          );
        })}
      </div>
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
    <div style={{ animation: "fadeInDetail 0.2s ease-out" }}>
      <div className="cal-blog-grid">
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
              {/* Cover: image or emoji strip */}
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt=""
                  style={{
                    width: "100%", height: 140, objectFit: "cover", display: "block",
                    borderBottom: `2px solid ${accent}22`,
                  }}
                />
              ) : (
                <div style={{
                  height: 80, background: accent + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderBottom: `2px solid ${accent}22`,
                  fontSize: 36,
                }}>
                  {post.coverEmoji || "📝"}
                </div>
              )}
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
        /* Blog yazıları — tam genişlik kart grid */
        <BlogCards />
      ) : (
        /* SSS — kart grid */
        <SssCards />
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

        /* ── Blog cards grid ── */
        .cal-blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          padding: 1.5rem 1rem;
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

          .cal-blog-grid {
            grid-template-columns: 1fr;
            padding: 1rem 0.75rem;
            gap: 1rem;
          }
        }

        @media (max-width: 400px) {
          .cal-tab { padding: 10px 10px; }
        }
      `}</style>
    </div>
  );
}
