-- ─────────────────────────────────────────────────────────────────────────────
-- Vaka Çalışmaları (Case Studies) — Supabase migration
-- Studyo admin panelindeki "Vaka Çalışmaları" aracı ve ana sayfa "Çalışmalar"
-- bölümü bu tabloyu kullanır.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → buradaki içeriği yapıştır → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Tabloyu oluştur (SSS ile aynı şema)
CREATE TABLE IF NOT EXISTS vaka_calismalari (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Mevcut 3 projeyi seed et (eski src/lib/projects.ts içeriği)
INSERT INTO vaka_calismalari (id, items, updated_at)
VALUES (
  1,
  '[
    {
      "id": "pekcon",
      "titleTR": "Konteyner Satış Optimizasyonu",
      "titleEN": "Container Sales Optimization",
      "company": "Pekcon",
      "logo": "/pek.svg",
      "categoryTR": "CRO / Web Geliştirme",
      "categoryEN": "CRO / Web Development",
      "resultTR": "%92 Dönüşüm Artışı",
      "resultEN": "+92% Conversion",
      "tags": ["Landing Pages", "Server-Side GTM", "CRO", "Meta Ads"],
      "imageSeed": 11,
      "problemTR": "Düşük dönüşüm oranları ve yetersiz veri ölçümleme altyapısı.",
      "problemEN": "Low conversion rates and inadequate data tracking infrastructure.",
      "solutionTR": "Landing page optimizasyonu, GTM ile gelişmiş tracking yapısı ve A/B testing.",
      "solutionEN": "Landing page optimization, advanced tracking setup with GTM, and A/B testing.",
      "metrics": [
        { "value": "+92%", "labelTR": "Conversion Rate", "labelEN": "Conversion Rate" },
        { "value": "3.2x", "labelTR": "ROAS", "labelEN": "ROAS" }
      ]
    },
    {
      "id": "demirkol",
      "titleTR": "Sanayi Odaklı B2B Büyüme",
      "titleEN": "Industrial-Focused B2B Growth",
      "company": "Demirkol",
      "logo": "/dem.peg",
      "categoryTR": "B2B Teknik Pazarlama",
      "categoryEN": "B2B Technical Marketing",
      "resultTR": "+180% Qualified Leads",
      "resultEN": "+180% Qualified Leads",
      "tags": ["Google Ads", "GA4", "GTM", "Looker Studio"],
      "imageSeed": 22,
      "problemTR": "Geleneksel yöntemlerle sınırlı kalmış bir müşteri kitlesi ve düşük dijital görünürlük.",
      "problemEN": "A customer base restricted by traditional methods and low digital visibility.",
      "solutionTR": "Teknik pazarlama hunisi kurulumu, hedefli reklam yönetimi ve veri odaklı optimizasyon.",
      "solutionEN": "Technical marketing funnel setup, targeted ad management, and data-driven optimization.",
      "metrics": [
        { "value": "+180%", "labelTR": "Qualified Leads", "labelEN": "Qualified Leads" },
        { "value": "-45%", "labelTR": "Cost Per Lead", "labelEN": "Cost Per Lead" }
      ]
    },
    {
      "id": "automation",
      "titleTR": "İş Akışı Otomasyonu",
      "titleEN": "Workflow Automation",
      "company": "Multi-Client",
      "categoryTR": "n8n / API Entegrasyon",
      "categoryEN": "n8n / API Integration",
      "resultTR": "15+ Saat/Hafta Tasarruf",
      "resultEN": "15+ Hours/Week Saved",
      "tags": ["n8n", "Python", "Google Sheets API", "Webhooks"],
      "imageSeed": 33,
      "problemTR": "Tekrarlayan manuel görevler ve veri transferi süreçlerinde zaman kaybı.",
      "problemEN": "Time lost in repetitive manual tasks and data transfer processes.",
      "solutionTR": "n8n ve API entegrasyonları ile otomatik raporlama, lead işleme ve bildirim sistemleri.",
      "solutionEN": "Automated reporting, lead processing, and notification systems via n8n and API integrations.",
      "metrics": [
        { "value": "15+", "labelTR": "Saat/Hafta Tasarruf", "labelEN": "Hours/Week Saved" },
        { "value": "%0", "labelTR": "Manuel Hata", "labelEN": "Manual Errors" }
      ]
    }
  ]'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
