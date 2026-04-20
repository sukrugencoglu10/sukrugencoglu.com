import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const baseUrl = "https://www.sukrugencoglu.com";

interface BlogPost {
  id: string;
  slug: string;
  titleTR: string;
  titleEN: string;
  summaryTR: string;
  summaryEN: string;
  contentTR: string;
  contentEN: string;
  tags: string[];
  category: string;
  coverEmoji: string;
  coverColor: string;
  publishedAt: string;
  readingMinutes: number;
  published: boolean;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${baseUrl}/api/blog-yazilari`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const posts: BlogPost[] = await res.json();
    return posts.find((p) => p.slug === slug && p.published) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = lang === "tr" ? post.titleTR : post.titleEN;
  const description = lang === "tr" ? post.summaryTR : post.summaryEN;
  const backPath = lang === "tr" ? "calismalar" : "work";

  return {
    title: `${title} | Şükrü Gençoğlu`,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${slug}`,
      languages: {
        tr: `${baseUrl}/tr/blog/${slug}`,
        en: `${baseUrl}/en/blog/${slug}`,
        "x-default": `${baseUrl}/tr/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Şükrü Gençoğlu`,
      description,
      url: `${baseUrl}/${lang}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const title = lang === "tr" ? post.titleTR : post.titleEN;
  const content = lang === "tr" ? post.contentTR : post.contentEN;
  const backPath = lang === "tr" ? "calismalar" : "work";
  const backLabel = lang === "tr" ? "← Blog Yazıları" : "← Blog Posts";

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    lang === "tr" ? "tr-TR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const accentColor = post.coverColor || "#1D9E75";

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {/* Hero */}
      <div style={{ borderBottom: `2px solid ${accentColor}22`, padding: "1.25rem 1rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, color: "#111", lineHeight: 1.2, margin: "0 0 10px" }}>
            {title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accentColor, background: accentColor + "18", padding: "3px 9px", borderRadius: 20 }}>
              {post.category}
            </span>
            <span style={{ fontSize: 12, color: "#bbb" }}>·</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>{formattedDate}</span>
            <span style={{ fontSize: 12, color: "#bbb" }}>·</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>{post.readingMinutes} {lang === "tr" ? "dk okuma" : "min read"}</span>
          </div>
          {post.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 11, padding: "2px 9px", borderRadius: 10, background: "#f0f0f0", color: "#666", fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
        <div className="blog-content">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
        </div>

        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #e8e8e8",
          }}
        >
          <Link
            href={`/${lang}/${backPath}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "#111",
              color: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {backLabel}
          </Link>
        </div>
      </div>

      <style>{`
        .blog-content {
          font-size: clamp(15px, 2.5vw, 17px);
          line-height: 1.85;
          color: #333;
        }
        .blog-content h1,
        .blog-content h2,
        .blog-content h3 {
          font-weight: 700;
          color: #111;
          margin: 2em 0 0.75em;
          line-height: 1.3;
        }
        .blog-content h1 { font-size: 1.8em; }
        .blog-content h2 { font-size: 1.4em; }
        .blog-content h3 { font-size: 1.15em; }
        .blog-content p { margin: 0 0 1.25em; }
        .blog-content ul, .blog-content ol {
          padding-left: 1.5em;
          margin: 0 0 1.25em;
        }
        .blog-content li { margin-bottom: 0.4em; }
        .blog-content code {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.88em;
          font-family: monospace;
          color: #d63384;
        }
        .blog-content pre {
          background: #1e1e1e;
          color: #e8e8e8;
          padding: 1.25rem 1.5rem;
          border-radius: 10px;
          overflow-x: auto;
          margin: 0 0 1.5em;
          font-size: 0.875em;
          line-height: 1.6;
        }
        .blog-content pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
        .blog-content blockquote {
          border-left: 3px solid #1D9E75;
          padding: 0.5em 1.25em;
          margin: 0 0 1.5em;
          background: rgba(29,158,117,0.05);
          border-radius: 0 8px 8px 0;
          color: #555;
        }
        .blog-content a {
          color: #1D9E75;
          text-decoration: underline;
        }
        .blog-content strong { font-weight: 700; color: #111; }
        .blog-content hr {
          border: none;
          border-top: 1px solid #e8e8e8;
          margin: 2em 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 0 1.5em;
          font-size: 14px;
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .blog-content th, .blog-content td {
          padding: 8px 12px;
          border: 1px solid #e8e8e8;
          text-align: left;
          white-space: nowrap;
        }
        .blog-content th {
          background: #f5f5f5;
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .blog-content h1 { font-size: 1.5em; }
          .blog-content h2 { font-size: 1.25em; }
          .blog-content h3 { font-size: 1.1em; }
          .blog-content pre { padding: 0.9rem 1rem; font-size: 0.82em; }
        }
      `}</style>
    </div>
  );
}
