import { renderOgImage, ogSize, ogContentType } from "@/lib/seo/og-image";

export const alt = "Şükrü Gençoğlu — Web Geliştirici & Growth Engineer";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OgImage({
  params,
}: {
  params: { lang: string };
}) {
  const isTR = params.lang === "tr";
  return renderOgImage({
    title: isTR
      ? "Google & Meta Ads ile doğru müşterilere ulaşın"
      : "Reach the right customers with Google & Meta Ads",
    subtitle: isTR
      ? "Veriye dayalı reklam ve dönüşüm odaklı web geliştirme"
      : "Data-driven ads and conversion-focused web development",
    category: "GROWTH",
    accent: "#1D9E75",
  });
}
