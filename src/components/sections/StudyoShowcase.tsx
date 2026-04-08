"use client";

import { useState, useEffect } from "react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface HiyerarsiItem {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
  faq?: FaqItem[];
}

function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/gi)
  return parts.map((part, i) =>
    /^https?:\/\//i.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" }}
      >
        {part}
      </a>
    ) : (
      part
    )
  )
}

export default function StudyoShowcase() {
  const [items, setItems] = useState<HiyerarsiItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reklam-hiyerarsisi")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          setActiveId(data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goTo = (id: number) => {
    if (id === activeId || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveId(id);
      setAnimating(false);
    }, 150);
  };

  if (!loading && items.length === 0) return null;

  const activeItem = items.find((i) => i.id === activeId);
  const activeIdx = items.findIndex((i) => i.id === activeId);

  return (
    <section
      style={{
        borderTop: "0.5px solid #e8e8e8",
        background: "#fafafa",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >

        {/* Üst başlık */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
            STÜDYO
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>
            Reklam Hiyerarşisi
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#ccc", fontSize: 13 }}>Yükleniyor...</div>
        ) : (
          /* Desktop: sol sekmeler + sağ içerik */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "1.5rem",
              alignItems: "start",
            }}
            className="studyo-showcase-grid"
          >
            {/* Sol — başlık sekmeleri */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "none",
                      background: isActive ? "#fff" : "transparent",
                      boxShadow: isActive ? "inset 3px 0 0 #111, 0 1px 6px rgba(0,0,0,0.06)" : "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: 7,
                        background: isActive ? "#111" : "#efefef",
                        color: isActive ? "#fff" : "#aaa",
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      {String(items.indexOf(item) + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#111" : "#666",
                        lineHeight: 1.35,
                        transition: "all 0.15s",
                      }}
                    >
                      {item.title || "—"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sağ — açıklama paneli */}
            <div
              style={{
                background: "#fff",
                border: "0.5px solid #e8e8e8",
                borderRadius: 16,
                borderTopLeftRadius: 4,
                padding: "2rem 2rem 2rem 2rem",
                minHeight: 200,
                boxShadow: "inset 0 3px 0 #111, 0 2px 16px rgba(0,0,0,0.06)",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(6px)" : "translateY(0)",
                transition: "opacity 0.15s ease, transform 0.15s ease",
              }}
            >
              {activeItem ? (
                <>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#bbb",
                      letterSpacing: "0.08em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#111",
                      margin: "0 0 1rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {activeItem.title}
                  </h3>
                  {activeItem.description ? (
                    <p
                      style={{
                        fontSize: 14,
                        color: "#555",
                        lineHeight: 1.8,
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {renderWithLinks(activeItem.description)}
                    </p>
                  ) : (
                    <p style={{ fontSize: 14, color: "#ccc", margin: 0, fontStyle: "italic" }}>
                      Açıklama eklenmemiş.
                    </p>
                  )}

                  {/* SSS */}
                  {activeItem.faq && activeItem.faq.length > 0 && (
                    <div style={{ marginTop: "2rem", borderTop: "0.5px solid #f0f0f0", paddingTop: "1.5rem" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                        SSS — SIK SORULAN SORULAR
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {activeItem.faq.map((f) => (
                          <div
                            key={f.id}
                            style={{
                              padding: "14px 16px",
                              background: "#fafafa",
                              borderRadius: 12,
                              border: "0.5px solid #eee",
                            }}
                          >
                            <div style={{ fontWeight: 700, color: "#111", fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>
                              {f.question}
                            </div>
                            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                              {renderWithLinks(f.answer)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Mobil: tek sütun */}
      <style>{`
        @media (max-width: 768px) {
          .studyo-showcase-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
