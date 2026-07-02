import { ImageResponse } from "next/og";
import { siteConfig } from "./config";

/**
 * Generic OG Image Template — 1200x630.
 *
 * Kullanım:
 *   import { renderOgImage } from "@/lib/seo/og-image";
 *   export default function Image() {
 *     return renderOgImage({ title: "Yazı Başlığı", category: "gtm", accent: "#1D9E75" });
 *   }
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
  gtm: "#1D9E75",
  analytics: "#3B82F6",
  cro: "#F59E0B",
  otomasyon: "#8B5CF6",
  genel: "#6B7280",
  reklam: "#EF4444",
  seo: "#0EA5E9",
};

type OgInput = {
  title: string;
  subtitle?: string;
  category?: string;
  accent?: string;
};

export function renderOgImage({ title, subtitle, category, accent }: OgInput) {
  const color = accent || (category ? CATEGORY_COLORS[category] : null) || "#1D9E75";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: category badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {category ? (
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "white",
                background: color,
                padding: "10px 22px",
                borderRadius: 999,
              }}
            >
              {category}
            </div>
          ) : (
            <div />
          )}
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111", display: "flex" }}>
            {siteConfig.organization.name}
          </div>
        </div>

        {/* Middle: title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: title.length > 70 ? 56 : 72,
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 1080,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: "#666", lineHeight: 1.5, maxWidth: 1000 }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom: accent bar + url */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ height: 6, width: 120, background: color, borderRadius: 3 }} />
          <div style={{ fontSize: 22, color: "#999", display: "flex" }}>
            {siteConfig.baseUrl.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
