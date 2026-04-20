-- ─────────────────────────────────────────────────────────────────────────────
-- Blog Yazıları — Supabase migration
-- Studyo admin panelindeki "Blog Yazıları" aracı ve Çalışmalar sayfası bu tabloyu kullanır.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → buradaki içeriği yapıştır → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_yazilari (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO blog_yazilari (id, items, updated_at)
VALUES (1, '[]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;
