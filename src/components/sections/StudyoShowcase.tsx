"use client";

import { useState, useEffect } from "react";

interface HiyerarsiItem {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
}

export default function StudyoShowcase() {
  const [items, setItems] = useState<HiyerarsiItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reklam-hiyerarsisi")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

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
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "3rem",
          alignItems: "start",
        }}
        className="studyo-showcase-grid"
      >
        {/* Sol sidebar */}
        <div style={{ paddingTop: "0.25rem" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#bbb",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            STÜDYO
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: "0.75rem",
            }}
          >
            Reklam
            <br />
            Hiyerarşisi
          </div>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: 0 }}>
            Markanızın mesajını katmanlar halinde yapılandırın.
          </p>
        </div>

        {/* Sağ içerik — accordion listesi */}
        <div>
          {loading ? (
            <div style={{ color: "#ccc", fontSize: 13 }}>Yükleniyor...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item, idx) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#fff",
                      border: "0.5px solid #e8e8e8",
                      borderRadius: 12,
                      overflow: "hidden",
                      transition: "box-shadow 0.15s",
                      boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          background: isOpen ? "#111" : "#f0f0f0",
                          color: isOpen ? "#fff" : "#999",
                          fontSize: 11,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: 14,
                          fontWeight: 500,
                          color: isOpen ? "#111" : "#444",
                          transition: "color 0.15s",
                        }}
                      >
                        {item.title || "—"}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#bbb",
                          transition: "transform 0.15s",
                          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                          display: "inline-block",
                        }}
                      >
                        ▶
                      </span>
                    </button>

                    {isOpen && item.description && (
                      <div
                        style={{
                          padding: "0 16px 16px 54px",
                          fontSize: 14,
                          color: "#555",
                          lineHeight: 1.75,
                          borderTop: "0.5px solid #f0f0f0",
                          paddingTop: 12,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobil responsive: tek sütun */}
      <style>{`
        @media (max-width: 768px) {
          .studyo-showcase-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
