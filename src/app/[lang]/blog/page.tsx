"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const ACCENT: Record<string, string> = {
  gtm: "#1D9E75", analytics: "#3B82F6", cro: "#F59E0B",
  otomasyon: "#8B5CF6", genel: "#6B7280", reklam: "#EF4444",
};

export default function BlogListePage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog-yazilari")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPosts(d.filter((p: any) => p.published)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 14 }}>
      Yükleniyor...
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "inherit" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "#111", margin: "0 0 8px" }}>
          Blog Yazıları
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>{posts.length} yazı yayında</p>
      </div>

      {posts.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#bbb", fontSize: 14 }}>
          Henüz yayınlanmış yazı yok.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {posts.map(post => {
            const title = lang === "tr" ? post.titleTR : post.titleEN;
            const summary = lang === "tr" ? post.summaryTR : post.summaryEN;
            const accent = ACCENT[post.category] || "#1D9E75";
            const date = (() => {
              try { return new Date(post.publishedAt).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { year: "numeric", month: "long", day: "numeric" }); }
              catch { return post.publishedAt; }
            })();
            return (
              <div
                key={post.id}
                onClick={() => router.push(`/${lang}/blog/${post.slug}`)}
                style={{
                  background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: 14,
                  overflow: "hidden", cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s", display: "flex", flexDirection: "column",
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
                  <div style={{ fontSize: 11, color: "#ccc" }}>{date}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
