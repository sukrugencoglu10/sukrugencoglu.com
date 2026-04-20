"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

/* ─── helpers ──────────────────────────────────────────────── */
function renderWithLinks(text: string) {
  return text.split(/(https?:\/\/[^\s]+)/gi).map((part, i) =>
    /^https?:\/\//i.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer"
        style={{ color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" }}>
        {part}
      </a>
    ) : part
  );
}

/* ─── types ─────────────────────────────────────────────────── */
type SectionId = "hiyerarsi" | "sss" | "notlar" | "dusunceler";

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "hiyerarsi", label: "Reklam Hiyerarşisi", icon: "⬡" },
  { id: "sss",       label: "SSS",               icon: "?" },
  { id: "notlar",    label: "Notlar",             icon: "📝" },
  { id: "dusunceler",label: "Düşünceler",         icon: "✍️" },
];

/* ─── sub-panels ─────────────────────────────────────────────── */
function HiyerarsiPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [openFaqIds, setOpenFaqIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reklam-hiyerarsisi")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data); setActiveId(data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFaq = (id: number) =>
    setOpenFaqIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const active = items.find(i => i.id === activeId);

  if (loading) return <Spinner />;
  if (!items.length) return <Empty text="Henüz içerik eklenmemiş." />;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start", height: "100%" }}>
      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", maxHeight: "60vh" }}>
        {items.map((item, idx) => {
          const isActive = item.id === activeId;
          return (
            <button key={item.id} onClick={() => setActiveId(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10,
                border: "none", background: isActive ? "#fff" : "transparent",
                boxShadow: isActive ? "inset 3px 0 0 #111, 0 1px 6px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                background: isActive ? "#111" : "#efefef", color: isActive ? "#fff" : "#aaa",
                fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111" : "#666", lineHeight: 1.35 }}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
      {/* Detail */}
      <div style={{ background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: "4px 16px 16px 16px",
        padding: "1.5rem 2rem", boxShadow: "inset 0 3px 0 #111, 0 2px 16px rgba(0,0,0,0.06)",
        overflowY: "auto", maxHeight: "60vh" }}>
        {active ? (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 0.75rem", lineHeight: 1.3 }}>{active.title}</h3>
            {active.description && (
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: "0 0 1rem", whiteSpace: "pre-wrap" }}>
                {renderWithLinks(active.description)}
              </p>
            )}
            {active.faq?.length > 0 && (
              <div style={{ borderTop: "0.5px solid #eee", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: 6 }}>
                {active.faq.map((fq: any) => (
                  <div key={fq.id} style={{ border: "0.5px solid #eee", borderRadius: 10, overflow: "hidden" }}>
                    <button onClick={() => toggleFaq(fq.id)}
                      style={{ width: "100%", padding: "10px 14px", background: openFaqIds.has(fq.id) ? "#f5f5f5" : "#fff",
                        border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{fq.question}</span>
                      <span style={{ fontSize: 14, color: "#aaa", flexShrink: 0 }}>{openFaqIds.has(fq.id) ? "−" : "+"}</span>
                    </button>
                    {openFaqIds.has(fq.id) && (
                      <div style={{ padding: "10px 14px", fontSize: 13, color: "#555", lineHeight: 1.7,
                        borderTop: "0.5px solid #eee", background: "#fafafa" }}>
                        {renderWithLinks(fq.answer)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

function SssPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sss")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) { setItems(data); setActiveId(data[0].id); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goTo = (id: number) => {
    if (id === activeId || animating) return;
    setAnimating(true);
    setTimeout(() => { setActiveId(id); setAnimating(false); }, 150);
  };

  if (loading) return <Spinner />;
  if (!items.length) return <Empty text="Henüz SSS eklenmemiş." />;

  const active = items.find(i => i.id === activeId);
  const activeIdx = items.findIndex(i => i.id === activeId);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", maxHeight: "60vh" }}>
        {items.map((item, idx) => {
          const isActive = item.id === activeId;
          return (
            <button key={item.id} onClick={() => goTo(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10,
                border: "none", background: isActive ? "#fff" : "transparent",
                boxShadow: isActive ? "inset 3px 0 0 #111, 0 1px 6px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                background: isActive ? "#111" : "#efefef", color: isActive ? "#fff" : "#aaa",
                fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111" : "#666", lineHeight: 1.35 }}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: "4px 16px 16px 16px",
        padding: "1.5rem 2rem", boxShadow: "inset 0 3px 0 #111, 0 2px 16px rgba(0,0,0,0.06)",
        opacity: animating ? 0 : 1, transform: animating ? "translateY(6px)" : "translateY(0)",
        transition: "opacity 0.15s ease, transform 0.15s ease", overflowY: "auto", maxHeight: "60vh" }}>
        {active && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", marginBottom: 8 }}>
              {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 0.75rem", lineHeight: 1.3 }}>{active.title}</h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
              {renderWithLinks(active.description || "")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function NotlarPanel() {
  const [notes, setNotes] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kisa-notlar")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) { setNotes(data); setActiveId(data[0].id); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!notes.length) return <Empty text="Henüz not eklenmemiş." />;

  const active = notes.find(n => n.id === activeId);

  const NOTE_COLORS: Record<string, string> = {
    "#ffffff": "#111", "#f28b82": "#c0392b", "#fbbc04": "#b7770d", "#fff475": "#8a7000",
    "#ccff90": "#2d7a00", "#a7ffeb": "#00695c", "#cbf0f8": "#006064", "#aecbfa": "#1a5276",
    "#d7aefb": "#6c3483", "#fdcfe8": "#922b61", "#e6c9a8": "#7d4e1c", "#e8eaed": "#5f6368",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", maxHeight: "60vh" }}>
        {notes.map((note, idx) => {
          const isActive = note.id === activeId;
          const accent = NOTE_COLORS[note.color] || "#111";
          return (
            <button key={note.id} onClick={() => setActiveId(note.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10,
                border: "none", background: isActive ? "#fff" : "transparent",
                boxShadow: isActive ? `inset 3px 0 0 ${accent}, 0 1px 6px rgba(0,0,0,0.06)` : "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
              <span style={{ flexShrink: 0, width: 10, height: 10, borderRadius: 3, background: note.color || "#eee",
                border: "1px solid rgba(0,0,0,0.08)" }} />
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111" : "#666", lineHeight: 1.35, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {note.title || `Not ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ background: active?.color || "#fff", border: "0.5px solid #e8e8e8",
        borderRadius: "4px 16px 16px 16px", padding: "1.5rem 2rem",
        boxShadow: `inset 0 3px 0 ${NOTE_COLORS[active?.color] || "#111"}, 0 2px 16px rgba(0,0,0,0.06)`,
        overflowY: "auto", maxHeight: "60vh", transition: "background 0.2s" }}>
        {active && (
          <>
            {active.title && (
              <h3 style={{ fontSize: 18, fontWeight: 700, color: NOTE_COLORS[active.color] || "#111",
                margin: "0 0 0.75rem", lineHeight: 1.3 }}>{active.title}</h3>
            )}
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
              {active.content || <span style={{ color: "#aaa", fontStyle: "italic" }}>İçerik yok.</span>}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function DusuncelerPanel() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog-yazilari")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const published = data.filter(p => p.published);
          setPosts(published);
          if (published.length > 0) setActiveId(published[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!posts.length) return <Empty text="Henüz yayınlanmış yazı yok." />;

  const active = posts.find(p => p.id === activeId);

  const ACCENT_COLORS: Record<string, string> = {
    gtm: "#1D9E75", analytics: "#3B82F6", cro: "#F59E0B",
    otomasyon: "#8B5CF6", genel: "#6B7280", reklam: "#EF4444",
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { year: "numeric", month: "long", day: "numeric" }); }
    catch { return iso; }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", maxHeight: "60vh" }}>
        {posts.map(post => {
          const isActive = post.id === activeId;
          const accent = ACCENT_COLORS[post.category] || "#6B7280";
          const title = lang === "tr" ? post.titleTR : post.titleEN;
          return (
            <button key={post.id} onClick={() => setActiveId(post.id)}
              style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: 10,
                border: "none", background: isActive ? "#fff" : "transparent",
                boxShadow: isActive ? `inset 3px 0 0 ${accent}, 0 1px 6px rgba(0,0,0,0.06)` : "none",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{post.coverEmoji || "📝"}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#111" : "#666",
                  lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {title || "(başlıksız)"}
                </div>
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{post.publishedAt}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: "4px 16px 16px 16px",
        padding: "1.5rem 2rem", overflowY: "auto", maxHeight: "60vh",
        boxShadow: active ? `inset 0 3px 0 ${ACCENT_COLORS[active.category] || "#111"}, 0 2px 16px rgba(0,0,0,0.06)` : "none" }}>
        {active && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{active.coverEmoji || "📝"}</span>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
                  color: ACCENT_COLORS[active.category] || "#888" }}>
                  {active.category}
                </span>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>
                  {formatDate(active.publishedAt)} · {active.readingMinutes} dk
                </div>
              </div>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
              {lang === "tr" ? active.titleTR : active.titleEN}
            </h3>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 1rem", lineHeight: 1.6 }}>
              {lang === "tr" ? active.summaryTR : active.summaryEN}
            </p>
            <button
              onClick={() => router.push(`/${lang}/blog/${active.slug}`)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
                background: ACCENT_COLORS[active.category] || "#111", color: "#fff", border: "none",
                borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Yazıyı Oku →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── loading / empty helpers ────────────────────────────────── */
function Spinner() {
  return <div style={{ padding: "2rem", color: "#bbb", fontSize: 13 }}>Yükleniyor...</div>;
}
function Empty({ text }: { text: string }) {
  return <div style={{ padding: "2rem", color: "#bbb", fontSize: 13, fontStyle: "italic" }}>{text}</div>;
}

/* ─── Main Sidebar ───────────────────────────────────────────── */
export default function CalisimalarSidebar() {
  const [active, setActive] = useState<SectionId | null>(null);

  const toggle = (id: SectionId) => setActive(prev => prev === id ? null : id);

  return (
    <section style={{ background: "#fafafa", borderTop: "0.5px solid #e8e8e8", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Sidebar nav */}
        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid #e8e8e8", marginBottom: 0 }}>
          {SECTIONS.map(sec => {
            const isActive = active === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => toggle(sec.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 20px",
                  border: "none",
                  borderBottom: `2.5px solid ${isActive ? "#111" : "transparent"}`,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#111" : "#888",
                  transition: "all 0.15s",
                  marginBottom: -1,
                }}
              >
                <span style={{ fontSize: 15 }}>{sec.icon}</span>
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        {active && (
          <div style={{
            background: "#f5f5f5",
            border: "0.5px solid #e8e8e8",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: "1.5rem",
            animation: "sidebarFadeIn 0.18s ease-out",
          }}>
            {active === "hiyerarsi" && <HiyerarsiPanel />}
            {active === "sss"       && <SssPanel />}
            {active === "notlar"    && <NotlarPanel />}
            {active === "dusunceler"&& <DusuncelerPanel />}
          </div>
        )}
      </div>

      <style>{`
        @keyframes sidebarFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
