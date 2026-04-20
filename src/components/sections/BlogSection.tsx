"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

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

const CATEGORY_COLORS: Record<string, string> = {
  gtm: "#1D9E75",
  analytics: "#3B82F6",
  cro: "#F59E0B",
  otomasyon: "#8B5CF6",
  genel: "#6B7280",
};

export default function BlogSection() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("tumu");

  useEffect(() => {
    fetch("/api/blog-yazilari")
      .then((r) => r.json())
      .then((data: BlogPost[]) => {
        if (Array.isArray(data)) {
          setPosts(data.filter((p) => p.published));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["tumu", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered =
    activeCategory === "tumu"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <section style={{ padding: "5rem 0 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#1D9E75",
              background: "rgba(29,158,117,0.08)",
              padding: "4px 12px",
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            {t.blog.badge}
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "0 0 12px",
              color: "#111",
            }}
          >
            {t.blog.title}{" "}
            <span style={{ color: "#1D9E75" }}>{t.blog.title_accent}</span>
          </h2>
          <p style={{ fontSize: 15, color: "#666", margin: 0, maxWidth: 540 }}>
            {t.blog.subtitle}
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  border: `1px solid ${activeCategory === cat ? "#1D9E75" : "#e0e0e0"}`,
                  background: activeCategory === cat ? "#1D9E75" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#555",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {cat === "tumu" ? (lang === "tr" ? "Tümü" : "All") : cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 260,
                  borderRadius: 16,
                  background: "#f5f5f5",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#aaa", fontSize: 14 }}>
            {t.blog.noPosts}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((post) => {
              const accentColor = CATEGORY_COLORS[post.category] || "#1D9E75";
              const title = lang === "tr" ? post.titleTR : post.titleEN;
              const summary = lang === "tr" ? post.summaryTR : post.summaryEN;
              return (
                <article
                  key={post.id}
                  onClick={() => router.push(`/${lang}/blog/${post.slug}`)}
                  style={{
                    background: "#fff",
                    border: "1px solid #ebebeb",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.09)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Cover */}
                  <div
                    style={{
                      background: post.coverColor
                        ? post.coverColor + "18"
                        : accentColor + "12",
                      borderBottom: `3px solid ${post.coverColor || accentColor}`,
                      padding: "28px 24px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span style={{ fontSize: 36, lineHeight: 1 }}>{post.coverEmoji || "📝"}</span>
                    <div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: post.coverColor || accentColor,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#111",
                        margin: "0 0 10px",
                        lineHeight: 1.35,
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#666",
                        lineHeight: 1.6,
                        margin: "0 0 16px",
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {summary}
                    </p>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 10,
                              padding: "2px 8px",
                              borderRadius: 10,
                              background: "#f4f4f4",
                              color: "#777",
                              fontWeight: 500,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 12,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#aaa" }}>
                        {formatDate(post.publishedAt)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: post.coverColor || accentColor,
                          fontWeight: 600,
                        }}
                      >
                        {post.readingMinutes} {t.blog.minRead}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
