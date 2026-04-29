import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { buildSitemap, type SitemapEntry } from "@/lib/seo/sitemap-helpers";
import { siteConfig } from "@/lib/seo/config";

export const revalidate = 3600;

type BlogPost = {
  slug: string;
  published?: boolean;
  publishedAt?: string;
  updatedAt?: string;
};

async function blogPostEntries(): Promise<SitemapEntry[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data, error } = await supabase
    .from("blog_yazilari")
    .select("items")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data?.items) return [];
  const posts = (data.items as BlogPost[]).filter((p) => p.published && p.slug);

  return posts.flatMap((post) => {
    const lm =
      post.updatedAt || post.publishedAt
        ? new Date(post.updatedAt || post.publishedAt!)
        : new Date();
    return siteConfig.supportedLangs.map((lang) => ({
      url: `${siteConfig.baseUrl}/${lang}/blog/${post.slug}`,
      lastModified: lm,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap({
    staticPathsByLang: {
      tr: [
        { path: "/", priority: 1, changeFrequency: "weekly" },
        { path: "/calismalar", priority: 0.8, changeFrequency: "weekly" },
        { path: "/hakkimda", priority: 0.8, changeFrequency: "monthly" },
        { path: "/hizmetler", priority: 0.8, changeFrequency: "monthly" },
        { path: "/nasil-calisiriz", priority: 0.7, changeFrequency: "monthly" },
        { path: "/iletisim", priority: 0.7, changeFrequency: "monthly" },
        { path: "/sss", priority: 0.7, changeFrequency: "monthly" },
        { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
      ],
      en: [
        { path: "/", priority: 1, changeFrequency: "weekly" },
        { path: "/work", priority: 0.8, changeFrequency: "weekly" },
        { path: "/about", priority: 0.8, changeFrequency: "monthly" },
        { path: "/services", priority: 0.8, changeFrequency: "monthly" },
        { path: "/how-we-work", priority: 0.7, changeFrequency: "monthly" },
        { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
        { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
      ],
    },
    dynamicSources: [blogPostEntries],
  });
}
