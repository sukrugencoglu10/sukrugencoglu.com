import { siteConfig } from "./config";

/**
 * JSON-LD schema bileşenleri.
 * Tüm bileşenler React Server Component'tir; <script type="application/ld+json"> üretir.
 *
 * Kullanım:
 *   import { OrganizationLd, ArticleLd } from "@/lib/seo/JsonLd";
 *   <OrganizationLd /> // root layout
 *   <ArticleLd post={post} lang="tr" /> // blog detay
 */

type LdProps = { data: Record<string, unknown> };

function Ld({ data }: LdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}${siteConfig.organization.logo}`,
    sameAs: siteConfig.organization.sameAs,
    contactPoint: siteConfig.organization.contactPoint
      ? {
          "@type": "ContactPoint",
          ...siteConfig.organization.contactPoint,
        }
      : undefined,
  };
  return <Ld data={data} />;
}

export function WebSiteLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.organization.name,
    url: siteConfig.baseUrl,
    inLanguage: siteConfig.supportedLangs,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.baseUrl}/tr/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return <Ld data={data} />;
}

export function PersonLd({ lang = "tr" }: { lang?: string }) {
  const p = siteConfig.person;
  if (!p) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    url: `${siteConfig.baseUrl}/${lang}/${lang === "tr" ? "hakkimda" : "about"}`,
    image: p.image ? `${siteConfig.baseUrl}${p.image}` : undefined,
    jobTitle: lang === "tr" ? p.jobTitleTR : p.jobTitleEN,
    description: lang === "tr" ? p.bioTR : p.bioEN,
    sameAs: siteConfig.organization.sameAs,
    worksFor: { "@type": "Organization", name: siteConfig.organization.name },
  };
  return <Ld data={data} />;
}

type ArticleInput = {
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  readingMinutes?: number;
};

export function ArticleLd({ post, lang = "tr" }: { post: ArticleInput; lang?: string }) {
  const url = `${siteConfig.baseUrl}/${lang}/blog/${post.slug}`;
  const image = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteConfig.baseUrl}${post.coverImage}`
    : `${siteConfig.baseUrl}${siteConfig.defaultOgImage}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.summary,
    image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: siteConfig.person
      ? {
          "@type": "Person",
          name: siteConfig.person.name,
          url: `${siteConfig.baseUrl}/${lang}/${lang === "tr" ? "hakkimda" : "about"}`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.baseUrl}${siteConfig.organization.logo}` },
    },
    keywords: post.tags?.join(", "),
    articleSection: post.category,
    inLanguage: lang,
  };
  return <Ld data={data} />;
}

type FaqItem = { question: string; answer: string };

export function FaqLd({ items }: { items: FaqItem[] }) {
  if (!items?.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
  return <Ld data={data} />;
}

type Crumb = { name: string; url: string };

export function BreadcrumbLd({ items }: { items: Crumb[] }) {
  if (!items?.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
  return <Ld data={data} />;
}
