import type { Metadata } from "next";
import { siteConfig } from "./config";

/**
 * Generic metadata builder.
 *
 * Tüm sayfalarda generateMetadata içinde kullanılır:
 *   return buildMetadata({
 *     lang: "tr",
 *     pathKey: "/hakkimda",
 *     title: "Hakkımda",
 *     description: "...",
 *   });
 *
 * canonical, hreflang, openGraph, twitter alanlarını otomatik üretir.
 * Başka bir projeye taşırken bu dosya değişmez — sadece config.ts düzenlenir.
 */

export type BuildMetadataInput = {
  /** Dil kodu (tr, en vb.) — config.supportedLangs içinden olmalı. */
  lang: string;
  /** config.pathMap içindeki anahtar (TR yolu olarak yazılır). */
  pathKey: keyof typeof siteConfig.pathMap | string;
  title: string;
  description?: string;
  /** Custom OG/twitter image URL. Verilmezse Next.js opengraph-image.tsx fallback'i devreye girer. */
  image?: string;
  /** "article" → blog yazıları; default "website". */
  ogType?: "website" | "article";
  /** Article specific. */
  publishedTime?: string;
  tags?: string[];
  /** Meta robots — sayfa noindex olmalıysa { index: false, follow: false }. */
  robots?: Metadata["robots"];
  /** Override için override; başlık/açıklama dışındaki alanlar. */
  extra?: Partial<Metadata>;
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const { lang, pathKey, title, description, image, ogType = "website", publishedTime, tags, robots, extra } = input;

  const pathMap = siteConfig.pathMap[pathKey as string];
  const langs: Record<string, string> = {};
  if (pathMap) {
    for (const l of siteConfig.supportedLangs) {
      langs[l] = `${siteConfig.baseUrl}/${l}${pathMap[l] ?? pathMap[siteConfig.defaultLang] ?? ""}`;
    }
    langs["x-default"] = `${siteConfig.baseUrl}/${siteConfig.defaultLang}${pathMap[siteConfig.defaultLang] ?? ""}`;
  }

  const currentPath = pathMap?.[lang] ?? pathKey;
  const url = `${siteConfig.baseUrl}/${lang}${currentPath === "/" ? "" : currentPath}`;
  const fullTitle = `${title} | ${siteConfig.organization.name}`;

  const customImages = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    alternates: pathMap
      ? { canonical: url, languages: langs }
      : { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: ogType,
      siteName: siteConfig.organization.name,
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags } : {}),
      ...(customImages ? { images: customImages } : {}),
      locale: lang === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
      ...(customImages ? { images: customImages.map((i) => i.url) } : {}),
    },
    ...(robots ? { robots } : {}),
    ...extra,
  };

  return metadata;
}
