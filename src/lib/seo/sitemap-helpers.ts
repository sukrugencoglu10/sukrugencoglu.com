import type { MetadataRoute } from "next";
import { siteConfig } from "./config";

/**
 * Generic sitemap builder. Statik yollar + dinamik kaynaklar (CMS, DB) birleştirir.
 *
 * Kullanım:
 *   export default async function sitemap() {
 *     return buildSitemap({
 *       staticPathsByLang: { tr: ["/", "/hakkimda"], en: ["/", "/about"] },
 *       dynamicSources: [
 *         async () => {
 *           const posts = await fetchBlogPosts();
 *           return posts.flatMap(p => siteConfig.supportedLangs.map(lang => ({
 *             url: `${siteConfig.baseUrl}/${lang}/blog/${p.slug}`,
 *             lastModified: new Date(p.updatedAt),
 *             changeFrequency: "monthly",
 *             priority: 0.6,
 *           })));
 *         }
 *       ]
 *     });
 *   }
 */

export type SitemapEntry = MetadataRoute.Sitemap[number];

export type StaticPathConfig = {
  path: string;
  priority?: number;
  changeFrequency?: SitemapEntry["changeFrequency"];
};

export type BuildSitemapInput = {
  /** Dil → yollar. Path "/" → /[lang], "/about" → /[lang]/about. */
  staticPathsByLang: Record<string, (string | StaticPathConfig)[]>;
  /** Async kaynaklar — her biri SitemapEntry dizisi döndürür (CMS/DB sorguları). */
  dynamicSources?: Array<() => Promise<SitemapEntry[]>>;
  defaultPriority?: number;
  defaultChangeFrequency?: SitemapEntry["changeFrequency"];
};

export async function buildSitemap(input: BuildSitemapInput): Promise<MetadataRoute.Sitemap> {
  const {
    staticPathsByLang,
    dynamicSources = [],
    defaultPriority = 0.7,
    defaultChangeFrequency = "monthly",
  } = input;
  const lastModified = new Date();

  const staticEntries: SitemapEntry[] = [];
  for (const [lang, paths] of Object.entries(staticPathsByLang)) {
    for (const item of paths) {
      const cfg = typeof item === "string" ? { path: item } : item;
      const url = `${siteConfig.baseUrl}/${lang}${cfg.path === "/" ? "" : cfg.path}`;
      staticEntries.push({
        url,
        lastModified,
        changeFrequency: cfg.changeFrequency ?? defaultChangeFrequency,
        priority: cfg.priority ?? defaultPriority,
      });
    }
  }

  const dynamicEntries = (await Promise.all(dynamicSources.map((fn) => safeRun(fn)))).flat();

  return [...staticEntries, ...dynamicEntries];
}

async function safeRun<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}
