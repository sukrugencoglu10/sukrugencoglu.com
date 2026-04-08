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
  const [openFaqIds, setOpenFaqIds] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
    setOpenFaqIds(new Set());
    setTimeout(() => {
      setActiveId(id);
      setAnimating(false);
    }, 150);
  };

  const toggleFaq = (faqId: number) => {
    setOpenFaqIds(prev => {
      const next = new Set(prev);
      next.has(faqId) ? next.delete(faqId) : next.add(faqId);
      return next;
    });
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "2rem 1rem" : "4rem 1.5rem" }}>

        {/* Üst başlık */}
        <div style={{ marginBottom: isMobile ? "1.25rem" : "2rem" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
            STÜDYO
          </div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>
            Reklam Hiyerarşisi
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#ccc", fontSize: 13 }}>Yükleniyor...</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "240px 1fr",
            gap: isMobile ? "0.75rem" : "1.5rem",
            alignItems: "start",
          }}>
            {/* Sekmeler — masaüstü: dikey liste, mobil: yatay kaydırmalı */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              gap: isMobile ? 6 : 4,
              overflowX: isMobile ? "auto" : "visible",
              paddingBottom: isMobile ? 4 : 0,
              WebkitOverflowScrolling: "touch" as const,
              scrollbarWidth: "none" as const,
            }}>
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                      padding: isMobile ? "8px 13px" : "10px 14px",
                      borderRadius: isMobile ? 20 : 10,
                      border: isMobile
                        ? (isActive ? "1.5px solid #111" : "0.5px solid #e0e0e0")
                        : "none",
                      background: isMobile
                        ? (isActive ? "#111" : "#fff")
                        : (isActive ? "#fff" : "transparent"),
                      boxShadow: isMobile ? "none" : (isActive ? "inset 3px 0 0 #111, 0 1px 6px rgba(0,0,0,0.06)" : "none"),
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      whiteSpace: isMobile ? "nowrap" : "normal",
                    }}
                  >
                    {!isMobile && (
                      <span style={{
                        flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                        background: isActive ? "#111" : "#efefef",
                        color: isActive ? "#fff" : "#aaa",
                        fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {String(items.indexOf(item) + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span style={{
                      fontSize: isMobile ? 13 : 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isMobile ? (isActive ? "#fff" : "#555") : (isActive ? "#111" : "#666"),
                      lineHeight: 1.35,
                      transition: "all 0.15s",
                    }}>
                      {item.title || "—"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* İçerik paneli */}
            <div style={{
              background: "#fff",
              border: "0.5px solid #e8e8e8",
              borderRadius: isMobile ? 12 : 16,
              borderTopLeftRadius: 4,
              padding: isMobile ? "1.25rem" : "2rem",
              minHeight: isMobile ? 0 : 200,
              boxShadow: "inset 0 3px 0 #111, 0 2px 16px rgba(0,0,0,0.06)",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(6px)" : "translateY(0)",
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}>
              {activeItem ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                    {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: "#111", margin: "0 0 0.75rem", lineHeight: 1.3 }}>
                    {activeItem.title}
                  </h3>
                  {activeItem.description ? (
                    <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                      {renderWithLinks(activeItem.description)}
                    </p>
                  ) : (
                    <p style={{ fontSize: 14, color: "#ccc", margin: 0, fontStyle: "italic" }}>Açıklama eklenmemiş.</p>
                  )}

                  {/* SSS */}
                  {activeItem.faq && activeItem.faq.length > 0 && (
                    <div style={{ marginTop: "1.5rem", borderTop: "0.5px solid #f0f0f0", paddingTop: "1.25rem" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                        SSS — SIK SORULAN SORULAR
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {activeItem.faq.map((f) => {
                          const isOpen = openFaqIds.has(f.id);
                          return (
                            <div key={f.id} style={{
                              background: "#fafafa",
                              borderRadius: 10,
                              border: isOpen ? "0.5px solid #d0d0d0" : "0.5px solid #eee",
                              overflow: "hidden",
                              transition: "border-color 0.15s",
                            }}>
                              <button
                                onClick={() => toggleFaq(f.id)}
                                style={{
                                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                                  padding: isMobile ? "14px 14px" : "13px 16px",
                                  background: "transparent", border: "none",
                                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                                  minHeight: 44,
                                }}
                              >
                                <span style={{
                                  flexShrink: 0, fontSize: 10,
                                  color: isOpen ? "#111" : "#aaa",
                                  transition: "transform 0.2s, color 0.15s",
                                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                  display: "inline-block",
                                }}>▶</span>
                                <span style={{
                                  fontWeight: 600,
                                  color: isOpen ? "#111" : "#333",
                                  fontSize: isMobile ? 14 : 14,
                                  lineHeight: 1.45,
                                  flex: 1,
                                  transition: "color 0.15s",
                                  textAlign: "left",
                                }}>
                                  {f.question}
                                </span>
                              </button>
                              {isOpen && (
                                <div style={{
                                  padding: isMobile ? "0 14px 14px 34px" : "0 16px 14px 37px",
                                  paddingTop: 12,
                                  fontSize: 14, color: "#555", lineHeight: 1.75,
                                  whiteSpace: "pre-wrap",
                                  borderTop: "0.5px solid #eee",
                                }}>
                                  {renderWithLinks(f.answer)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <style>{`
        div[style*="scrollbar-width: none"]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
