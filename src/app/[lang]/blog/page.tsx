"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CardShare from "@/components/blog/CardShare";

const ACCENT: Record<string, string> = {
  gtm: "#1D9E75", analytics: "#3B82F6", cro: "#F59E0B",
  otomasyon: "#8B5CF6", genel: "#6B7280", reklam: "#EF4444", seo: "#0EA5E9",
};

const CAT_LABEL: Record<string, string> = {
  gtm: "GTM", analytics: "Analytics", cro: "CRO",
  otomasyon: "Otomasyon", genel: "Genel", reklam: "Reklam", seo: "SEO",
};

export default function BlogListePage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    fetch("/api/blog-yazilari")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPosts(d.filter((p: any) => p.published)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
  const filtered = activeCategory ? posts.filter(p => p.category === activeCategory) : posts;

  const handleCategory = (cat: string | null) => {
    setActiveCategory(cat);
    setAnimKey(k => k + 1);
  };

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 14 }}>
      Yükleniyor...
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "inherit" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .blog-card { animation: fadeUp 0.32s ease both; }
        .blog-card:nth-child(1) { animation-delay: 0ms; }
        .blog-card:nth-child(2) { animation-delay: 45ms; }
        .blog-card:nth-child(3) { animation-delay: 90ms; }
        .blog-card:nth-child(4) { animation-delay: 135ms; }
        .blog-card:nth-child(5) { animation-delay: 180ms; }
        .blog-card:nth-child(6) { animation-delay: 225ms; }
        .blog-card:nth-child(n+7) { animation-delay: 270ms; }
        .cat-pill { transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s; }
        .cat-pill:hover { transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "#111", margin: "0 0 6px" }}>
          Blog Yazıları
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: "0 0 1.5rem" }}>
          {activeCategory
            ? `${filtered.length} yazı · ${CAT_LABEL[activeCategory] || activeCategory}`
            : `${posts.length} yazı yayında`}
        </p>

        {/* Category bar */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="cat-pill"
              onClick={() => handleCategory(null)}
              style={{
                padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: "pointer", border: "1.5px solid",
                borderColor: activeCategory === null ? "#111" : "#e0e0e0",
                background: activeCategory === null ? "#111" : "#fff",
                color: activeCategory === null ? "#fff" : "#888",
              }}
            >
              Tümü
              <span style={{ marginLeft: 6, opacity: 0.55, fontWeight: 400, fontSize: 11 }}>{posts.length}</span>
            </button>

            {categories.map(cat => {
              const accent = ACCENT[cat] || "#6B7280";
              const isActive = activeCategory === cat;
              const count = posts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  className="cat-pill"
                  onClick={() => handleCategory(cat)}
                  style={{
                    padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", border: "1.5px solid",
                    borderColor: isActive ? accent : accent + "55",
                    background: isActive ? accent : accent + "0d",
                    color: isActive ? "#fff" : accent,
                  }}
                >
                  {CAT_LABEL[cat] || cat}
                  <span style={{ marginLeft: 6, opacity: 0.65, fontWeight: 400, fontSize: 11 }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#bbb", fontSize: 14 }}>
          Bu kategoride yayınlanmış yazı yok.
        </div>
      ) : (
        <div
          key={animKey}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}
        >
          {filtered.map(post => {
            const title = lang === "tr" ? post.titleTR : post.titleEN;
            const summary = lang === "tr" ? post.summaryTR : post.summaryEN;
            const accent = ACCENT[post.category] || "#1D9E75";
            const date = (() => {
              try {
                return new Date(post.publishedAt).toLocaleDateString(
                  lang === "tr" ? "tr-TR" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                );
              } catch { return post.publishedAt; }
            })();
            return (
              <div
                key={post.id}
                className="blog-card"
                onClick={() => router.push(`/${lang}/blog/${post.slug}`)}
                style={{
                  background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: 14,
                  overflow: "hidden", cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" style={{ width: "100%", height: 160, objectFit: "cover", display: "block", borderBottom: `2px solid ${accent}22` }} />
                ) : (
                  <div style={{ height: 90, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `2px solid ${accent}22`, fontSize: 40 }}>
                    {post.coverEmoji || "📝"}
                  </div>
                )}
                <div style={{ padding: "1.25rem 1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: accent }}>{post.category}</span>
                    <span style={{ fontSize: 10, color: "#bbb" }}>·</span>
                    <span style={{ fontSize: 10, color: "#bbb" }}>{post.readingMinutes} dk okuma</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111", lineHeight: 1.35 }}>{title}</h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.65, flex: 1 }}>{summary}</p>
                  {post.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#f0f0f0", color: "#777" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#ccc" }}>{date}</span>
                    <CardShare
                      url={`${window.location.origin}/${lang}/blog/${post.slug}`}
                      title={title}
                      lang={lang}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
