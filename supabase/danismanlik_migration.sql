-- ─────────────────────────────────────────────────────────────────────────────
-- Danışmanlık Hizmetleri — Supabase migration
-- Studyo admin panelindeki "Danışmanlık" aracı ve /danismanlik sayfası bu tabloyu kullanır.
-- Paketler tablosundan ayrıdır — Growth Audit, Growth OS, Growth Pod gibi
-- danışmanlık formatları burada yönetilir.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → buradaki içeriği yapıştır → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS danismanlik_hizmetleri (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO danismanlik_hizmetleri (id, items, updated_at)
VALUES (1, '[]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;
