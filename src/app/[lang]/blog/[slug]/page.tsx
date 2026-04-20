import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

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
  const backLabel = lang === "tr" ? "← Çalışmalar" : "← Work";

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    lang === "tr" ? "tr-TR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const accentColor = post.coverColor || "#1D9E75";

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {/* Hero */}
      <div
        style={{
          background: accentColor + "0f",
          borderBottom: `3px solid ${accentColor}`,
          padding: "3.5rem 1.5rem 2.5rem",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link
            href={`/${lang}/${backPath}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 13,
              color: "#666",
              textDecoration: "none",
              marginBottom: 24,
              gap: 4,
            }}
          >
            {backLabel}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 48 }}>{post.coverEmoji || "📝"}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accentColor,
                background: accentColor + "18",
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              {post.category}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 38px)",
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.2,
              margin: "0 0 16px",
            }}
          >
            {title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
              color: "#888",
              flexWrap: "wrap",
            }}
          >
            <span>{formattedDate}</span>
            <span>·</span>
            <span>
              {post.readingMinutes} {lang === "tr" ? "dk okuma" : "min read"}
            </span>
          </div>

          {post.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: "#efefef",
                    color: "#666",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div className="blog-content">
          <ReactMarkdown>{content}</ReactMarkdown>
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
          font-size: 16px;
          line-height: 1.8;
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
        }
        .blog-content th, .blog-content td {
          padding: 8px 12px;
          border: 1px solid #e8e8e8;
          text-align: left;
        }
        .blog-content th {
          background: #f5f5f5;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
