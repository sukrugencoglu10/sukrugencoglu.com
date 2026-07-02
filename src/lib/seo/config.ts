/**
 * SEO Kit Konfigürasyonu
 *
 * Bu kit'i başka projeye taşırken yalnızca BU dosyayı düzenle.
 * Diğer dosyalar (JsonLd, MetaBuilder, sitemap-helpers, og-image) jenerik kalır.
 */

export type SeoConfig = {
  baseUrl: string;
  defaultLang: string;
  supportedLangs: string[];
  /** Hangi yolun hangi dile karşılık geldiği — hreflang üretimi için. */
  pathMap: Record<string, Record<string, string>>;
  defaultOgImage: string;
  twitterHandle?: string;
  searchConsoleVerification?: string;
  organization: {
    name: string;
    legalName?: string;
    logo: string; // /logo.png gibi public altı yol veya tam URL
    sameAs: string[];
    contactPoint?: {
      telephone?: string;
      email?: string;
      contactType?: string;
      areaServed?: string;
      availableLanguage?: string[];
    };
  };
  person?: {
    name: string;
    image?: string;
    jobTitleTR: string;
    jobTitleEN: string;
    bioTR: string;
    bioEN: string;
  };
};

/**
 * pathMap örnek: { "/hakkimda": { tr: "/hakkimda", en: "/about" } }
 * Sayfanın TR yolundan EN karşılığını üretmek için.
 */
export const siteConfig: SeoConfig = {
  baseUrl: "https://www.sukrugencoglu.com",
  defaultLang: "tr",
  supportedLangs: ["tr", "en"],
  pathMap: {
    "/": { tr: "/", en: "/" },
    "/hakkimda": { tr: "/hakkimda", en: "/about" },
    "/hizmetler": { tr: "/hizmetler", en: "/services" },
    "/calismalar": { tr: "/calismalar", en: "/work" },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/nasil-calisiriz": { tr: "/nasil-calisiriz", en: "/how-we-work" },
    "/sss": { tr: "/sss", en: "/faq" },
    "/blog": { tr: "/blog", en: "/blog" },
  },
  defaultOgImage: "/og-default.png",
  twitterHandle: "@sukrugencoglu10",
  searchConsoleVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  organization: {
    name: "Şükrü Gençoğlu",
    logo: "/logo-main.svg",
    sameAs: [
      "https://linkedin.com/in/sukrugencoglu10",
      "https://wa.me/905324072694",
    ],
    contactPoint: {
      telephone: "+90-532-407-2694",
      email: "sukrugencoglu10@gmail.com",
      contactType: "customer support",
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    },
  },
  person: {
    name: "Şükrü Gençoğlu",
    jobTitleTR: "Web Geliştirici & Growth Engineer",
    jobTitleEN: "Web Developer & Growth Engineer",
    bioTR:
      "Google & Meta Ads, GTM ve dönüşüm odaklı web geliştirme alanında uzmanlaşmış bağımsız geliştirici.",
    bioEN:
      "Independent developer specializing in Google & Meta Ads, GTM, and conversion-focused web development.",
  },
};
