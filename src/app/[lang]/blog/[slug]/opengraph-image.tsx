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
  params: { lang: string; slug: string };
}) {
  const post = await getPost(params.slug);
  const title = post
    ? params.lang === "tr"
      ? post.titleTR || post.titleEN || params.slug
      : post.titleEN || post.titleTR || params.slug
    : params.slug;
  const subtitle = post
    ? params.lang === "tr"
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
