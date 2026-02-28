/* HeroGraphics — sg.com birebir layout */
"use client";

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
  return (
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

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              background: "#fff",
              overflow: "hidden",
              borderRadius: "4px",
              cursor: "pointer",
              transition:
                "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              ...borderStyle,
              ...item.itemStyle,
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
  );
}
