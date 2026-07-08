"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface BlogPost {
  id: string;
  slug: string;
  titleTR: string;
  titleEN: string;
  summaryTR: string;
  summaryEN: string;
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
  eticaret: "#EC4899",
  fullstack: "#14B8A6",
};

export default function BlogStrip() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Detect mobile via touch support
  const isMobile = typeof window !== "undefined" && "ontouchstart" in window;

  const handleCardClick = useCallback(
    (slug: string) => {
      if (!isMobile) {
        // Desktop: normal click navigates
        router.push(`/${lang}/blog/${slug}`);
        return;
      }

      // Mobile: double tap navigates, single tap pauses/resumes
      const now = Date.now();
      const timeSinceLastTap = now - lastTapRef.current;
      lastTapRef.current = now;

      if (timeSinceLastTap < 350) {
        // Double tap → navigate
        router.push(`/${lang}/blog/${slug}`);
      } else {
        // Single tap → toggle pause
        setIsPaused((prev) => !prev);
      }
    },
    [isMobile, lang, router]
  );

  useEffect(() => {
    fetch("/api/blog-yazilari")
      .then((r) => r.json())
      .then((data: BlogPost[]) => {
        if (Array.isArray(data)) {
          setPosts(
            data
              .filter((p) => p.published)
              .sort(
                (a, b) =>
                  new Date(b.publishedAt).getTime() -
                  new Date(a.publishedAt).getTime()
              )
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Format relative date
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(
        lang === "tr" ? "tr-TR" : "en-US",
        { day: "numeric", month: "short" }
      );
    } catch {
      return "";
    }
  };

  // Build duplicated list for seamless loop
  const displayPosts = useMemo(() => {
    if (posts.length === 0) return [];
    // Duplicate to fill the strip for seamless scrolling
    return [...posts, ...posts];
  }, [posts]);

  if (loading || posts.length === 0) return null;

  return (
    <div className="blog-strip-wrapper">
      {/* Left vertical badge */}
      <div className="blog-strip-badge-sidebar">
        <div className="blog-strip-badge">
          <span className="blog-strip-badge-dot" />
          <span className="blog-strip-badge-text">
            {lang === "tr" ? "Blog" : "Blog"}
          </span>
        </div>
      </div>

      {/* Scrolling area */}
      <div className="blog-strip-scroll-area">
        {/* Fade edges */}
        <div className="blog-strip-fade-left" />
        <div className="blog-strip-fade-right" />

      {/* Scrolling track */}
      <div className="blog-strip-overflow">
        <div
          className="blog-strip-track"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayPosts.map((post, idx) => {
            const accentColor =
              CATEGORY_COLORS[post.category] || "#1D9E75";
            const title = lang === "tr" ? post.titleTR : post.titleEN;

            return (
              <article
                key={`${post.id}-${idx}`}
                className="blog-strip-card"
                onClick={() => handleCardClick(post.slug)}
                style={{
                  ["--accent" as string]: accentColor,
                  ["--accent-bg" as string]:
                    (post.coverColor || accentColor) + "20",
                }}
              >
                {/* Icon + Category */}
                <div className="blog-strip-card-header">
                  <div className="blog-strip-card-icon">
                    <img
                      src="/logo-main.svg"
                      alt=""
                      className="blog-strip-card-logo"
                    />
                  </div>
                  <span
                    className="blog-strip-card-category"
                    style={{ color: post.coverColor || accentColor }}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="blog-strip-card-title">{title}</h3>

                {/* Meta */}
                <div className="blog-strip-card-meta">
                  <span className="blog-strip-card-date">
                    {formatDate(post.publishedAt)}
                  </span>
                  <span
                    className="blog-strip-card-read"
                    style={{ color: post.coverColor || accentColor }}
                  >
                    {post.readingMinutes} {lang === "tr" ? "dk" : "min"}
                  </span>
                </div>

                {/* Bottom accent line */}
                <div
                  className="blog-strip-card-accent-line"
                  style={{
                    background: `linear-gradient(90deg, ${
                      post.coverColor || accentColor
                    }, transparent)`,
                  }}
                />
              </article>
            );
          })}
        </div>
      </div>
      </div>

      <style>{`
        .blog-strip-wrapper {
          position: relative;
          width: 100%;
          background: #fff;
          border-bottom: 1px solid rgba(232, 121, 160, 0.25);
          display: flex;
          align-items: stretch;
          user-select: none;
        }

        /* Vertical badge sidebar */
        .blog-strip-badge-sidebar {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
          background: #1D9E75;
          flex-shrink: 0;
        }
        .blog-strip-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }
        .blog-strip-badge-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 2s ease-in-out infinite;
        }
        .blog-strip-badge-text {
          color: #fff;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Scroll area */
        .blog-strip-scroll-area {
          position: relative;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          padding: 14px 0;
        }

        /* Fade edges */
        .blog-strip-fade-left {
          pointer-events: none;
          position: absolute;
          inset: 0;
          right: auto;
          width: 60px;
          z-index: 10;
          background: linear-gradient(to right, #fff, transparent);
        }
        .blog-strip-fade-right {
          pointer-events: none;
          position: absolute;
          inset: 0;
          left: auto;
          width: 60px;
          z-index: 10;
          background: linear-gradient(to left, #fff, transparent);
        }

        /* Scrolling */
        .blog-strip-overflow {
          overflow: hidden;
        }
        .blog-strip-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: blogStripScroll 80s linear infinite;
        }

        @media (max-width: 768px) {
          .blog-strip-track {
            animation-duration: 100s;
            gap: 12px;
          }
        }

        @keyframes blogStripScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Card */
        .blog-strip-card {
          position: relative;
          flex-shrink: 0;
          width: 260px;
          background: var(--accent-bg, #fafafa);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 16px 18px 14px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .blog-strip-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        /* Card header */
        .blog-strip-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .blog-strip-card-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blog-strip-card-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .blog-strip-card-category {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Title */
        .blog-strip-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #222;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Meta */
        .blog-strip-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .blog-strip-card-date {
          font-size: 11px;
          color: #aaa;
        }
        .blog-strip-card-read {
          font-size: 11px;
          font-weight: 600;
        }

        /* Bottom accent line */
        .blog-strip-card-accent-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .blog-strip-card:hover .blog-strip-card-accent-line {
          opacity: 1;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .blog-strip-card {
            width: 220px;
            padding: 12px 14px 10px;
          }
          .blog-strip-card-emoji {
            font-size: 20px;
          }
          .blog-strip-card-title {
            font-size: 12px;
          }
          .blog-strip-badge-container {
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
