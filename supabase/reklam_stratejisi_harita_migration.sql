-- ─────────────────────────────────────────────────────────────────────────────
-- Reklam Stratejisi Haritası — Supabase migration
-- Studyo panelindeki "Reklam Stratejisi" mantık haritası bu tabloyu kullanır.
-- /api/reklam-stratejisi-harita endpoint'i bu tablodan okur/yazar.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → buradaki içeriği yapıştır → Run
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reklam_stratejisi_harita (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boş başlangıç verisi (Studyo'dan node eklenecek)
INSERT INTO reklam_stratejisi_harita (id, items, updated_at)
VALUES (
  1,
  '{"terms": [], "connections": [], "metadata": {"w": 880, "h": 555}}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
