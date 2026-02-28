/* HeroGraphics — sg.com birebir layout */
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface GraphicItem {
  src: string;
  alt: string;
  itemStyle: React.CSSProperties;
  bordered: boolean;
  objectFit?: "cover" | "contain" | "none";
}

const items: GraphicItem[] = [
  {
    src: "/ga.jpeg",
    alt: "Google Analytics",
    itemStyle: { width: "22%", height: "28%", top: "22%", left: 0 },
    bordered: true,
  },
  {
    src: "/googleads.jpeg",
    alt: "Google Ads",
    itemStyle: { width: "50%", height: "46%", top: "2%", left: "26%" },
    bordered: false,
  },
  {
    src: "/looker.jpeg",
    alt: "Looker Studio",
    itemStyle: { width: "20%", height: "26%", top: "12%", right: 0 },
    bordered: true,
  },
  {
    src: "/wf.jpeg",
    alt: "Dashboard",
    itemStyle: { width: "44%", height: "38%", top: "52%", left: "4%" },
    bordered: false,
    objectFit: "contain",
  },
  {
    src: "/gtm.jpeg",
    alt: "Google Tag Manager",
    itemStyle: { width: "22%", height: "30%", top: "52%", left: "52%" },
    bordered: true,
  },
  {
    src: "/meta.jpeg",
    alt: "Meta Ads",
    itemStyle: { width: "28%", height: "38%", top: "48%", right: "-4%" },
    bordered: false,
  },
];

import type { CSSProperties } from "react";

export default function MasonryGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const closeLightbox = () => setLightboxOpen(false);

  const lightbox =
    lightboxOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            onClick={closeLightbox}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wf.jpeg"
              alt="Dashboard"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
                display: "block",
              }}
            />
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1.2 / 1",
          transform: "scale(0.71)",
          transformOrigin: "center right",
        }}
      >
        {items.map((item, i) => {
          const borderStyle: CSSProperties = item.bordered
            ? {
                padding: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                border: "1px solid #f2f2f2",
              }
            : { boxShadow: "0 20px 40px rgba(0,0,0,0.12)" };

          const isWf = item.src === "/wf.jpeg";

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                background: "#fff",
                overflow: "hidden",
                borderRadius: "4px",
                cursor: isWf ? "zoom-in" : "pointer",
                transition:
                  "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                ...borderStyle,
                ...item.itemStyle,
              }}
              onClick={() => {
                if (isWf && window.innerWidth < 768) setLightboxOpen(true);
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-8px) scale(1.02)";
                (e.currentTarget as HTMLDivElement).style.zIndex = "5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.zIndex = "";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="eager"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: item.objectFit ?? "cover",
                  display: "block",
                  transition: "transform 3s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.transform =
                    "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.transform = "")
                }
              />
            </div>
          );
        })}
      </div>

      {lightbox}
    </>
  );
}
