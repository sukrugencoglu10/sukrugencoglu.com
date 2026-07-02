"use client";

import { useEffect } from "react";

interface DetailModalProps {
  title: string;
  subtitle?: string;
  description?: string;
  accentColor?: string;
  badge?: string;
  tags?: string[];
  meta?: string;
  onClose: () => void;
}

export default function DetailModal({
  title,
  subtitle,
  description,
  accentColor = "#1D9E75",
  badge,
  tags,
  meta,
  onClose,
}: DetailModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backdropFilter: "blur(2px)",
        animation: "dmFadeIn 0.15s ease-out",
      }}
    >
      <style>{`
        @keyframes dmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dmSlideIn { from { transform: translateY(10px) scale(0.97); opacity: 0; } to { transform: none; opacity: 1; } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "1.75rem",
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          position: "relative",
          animation: "dmSlideIn 0.18s ease-out",
          borderTop: `4px solid ${accentColor}`,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "none",
            background: "#f0f0f0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 18,
            lineHeight: 1,
          }}
          aria-label="Kapat"
        >
          ×
        </button>

        {badge && (
          <div
            style={{
              display: "inline-block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: accentColor,
              background: accentColor + "18",
              padding: "3px 8px",
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            {badge}
          </div>
        )}

        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.25,
            paddingRight: 28,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888", fontWeight: 500 }}>
            {subtitle}
          </p>
        )}

        {description && (
          <>
            <div style={{ height: 1, background: "#f0f0f0", margin: "14px 0" }} />
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#444",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {description}
            </p>
          </>
        )}

        {tags && tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 14 }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "#f0f0f0",
                  color: "#777",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {meta && (
          <div style={{ marginTop: 12, fontSize: 11, color: "#bbb" }}>{meta}</div>
        )}
      </div>
    </div>
  );
}