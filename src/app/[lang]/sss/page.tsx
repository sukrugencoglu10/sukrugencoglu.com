"use client";

import { useState, useEffect } from "react";

export default function SssPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sss")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 14 }}>
      Yükleniyor...
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "inherit" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "#111", margin: "0 0 8px" }}>
          Sık Sorulan Sorular
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>{items.length} soru</p>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#bbb", fontSize: 14 }}>
          Henüz soru eklenmemiş.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map(item => {
            const isOpen = openId === String(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: "#fff", border: `1px solid ${isOpen ? "#111" : "#e8e8e8"}`,
                  borderRadius: 12, overflow: "hidden", transition: "border-color 0.15s",
                }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : String(item.id))}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 12, padding: "1.1rem 1.5rem", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111", lineHeight: 1.4 }}>
                    {item.title}
                  </span>
                  <span style={{
                    flexShrink: 0, fontSize: 18, color: "#999",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 1.5rem 1.25rem", fontSize: 14, color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {item.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
