-- ─────────────────────────────────────────────────────────────────────────────
-- ANA Harita (Mind Map) — Supabase migration
-- Studyo panelindeki "ANA Blok" zihin haritası aracı bu tabloyu kullanır.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → buradaki içeriği yapıştır → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ana_harita (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boş başlangıç verisi
INSERT INTO ana_harita (id, items, updated_at)
VALUES (
  1,
  '{"terms": [], "connections": [], "metadata": {"w": 880, "h": 555}}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
