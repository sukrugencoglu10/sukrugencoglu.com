"use client";

import { useState } from "react";

type Item = { id: string | number; title: string; description: string };

export default function SssList({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0)
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#bbb", fontSize: 14 }}>
        Henüz soru eklenmemiş.
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {items.map((item) => {
        const isOpen = openId === String(item.id);
        return (
          <div
            key={item.id}
            style={{
              background: "#fff",
              border: `1px solid ${isOpen ? "#111" : "#e8e8e8"}`,
              borderRadius: 12,
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : String(item.id))}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "1.1rem 1.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111", lineHeight: 1.4 }}>
                {item.title}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 18,
                  color: "#999",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "0 1.5rem 1.25rem",
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.8,
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
  );
}
