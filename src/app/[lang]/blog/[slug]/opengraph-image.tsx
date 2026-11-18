import { renderOgImage, ogSize, ogContentType } from "@/lib/seo/og-image";
import { siteConfig } from "@/lib/seo/config";

export const alt = "Blog yazısı kapağı";
export const size = ogSize;
export const contentType = ogContentType;

type Post = {
  slug: string;
  titleTR?: string;
  titleEN?: string;
  summaryTR?: string;
  summaryEN?: string;
  category?: string;
  coverColor?: string;
  published?: boolean;
};

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${siteConfig.baseUrl}/api/blog-yazilari`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const posts: Post[] = await res.json();
    return posts.find((p) => p.slug === slug && p.published) ?? null;
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPost(slug);
  const title = post
    ? lang === "tr"
      ? post.titleTR || post.titleEN || slug
      : post.titleEN || post.titleTR || slug
    : slug;
  const subtitle = post
    ? lang === "tr"
      ? post.summaryTR
      : post.summaryEN
    : undefined;

  return renderOgImage({
    title,
    subtitle,
    category: post?.category,
    accent: post?.coverColor,
  });
}
