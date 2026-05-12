-- ─────────────────────────────────────────────────────────────────────────────
-- Paketler — Supabase migration
-- Studyo admin panelindeki "Paketler" aracı ve /paketler sayfası bu tabloyu kullanır.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → buradaki içeriği yapıştır → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS paketler (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO paketler (id, items, updated_at)
VALUES (1, '[]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;
