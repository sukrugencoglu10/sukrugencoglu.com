-- ╭──────────────────────────────────────────────────────────────╮
-- │ SEO KONTROL MERKEZİ MIGRATION                                │
-- │ Studyo'daki "SEO Kontrol Merkezi" sekmesi için tek satır     │
-- │ JSONB checklist tablosu. Pattern: ana_harita, kisa_notlar.   │
-- │ Supabase Dashboard > SQL Editor'da elle çalıştırılır.        │
-- ╰──────────────────────────────────────────────────────────────╯

CREATE TABLE IF NOT EXISTS seo_kontrol_merkezi (
  id INT PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: 27 SEO checklist item, 3 grupta (on-page, pagespeed, search-console)
INSERT INTO seo_kontrol_merkezi (id, items, updated_at)
VALUES (
  1,
  '[
    {"id":"op-1","group":"on-page","title":"Title tag uzunluğu (50–60 karakter) ve anahtar kelime","link":"","notes":"","status":"todo"},
    {"id":"op-2","group":"on-page","title":"Meta description (150–160 karakter)","link":"","notes":"","status":"todo"},
    {"id":"op-3","group":"on-page","title":"H1 etiketi tek ve anahtar kelimeli mi?","link":"","notes":"","status":"todo"},
    {"id":"op-4","group":"on-page","title":"Görsel alt metinleri eksiksiz mi?","link":"","notes":"","status":"todo"},
    {"id":"op-5","group":"on-page","title":"Canonical URL doğru mu?","link":"","notes":"","status":"todo"},
    {"id":"op-6","group":"on-page","title":"hreflang TR/EN bağları doğru mu?","link":"","notes":"","status":"todo"},
    {"id":"op-7","group":"on-page","title":"Open Graph + Twitter Card meta etiketleri","link":"","notes":"","status":"todo"},
    {"id":"op-8","group":"on-page","title":"JSON-LD / Schema.org (Person, Article, Organization)","link":"https://search.google.com/test/rich-results","notes":"","status":"todo"},
    {"id":"op-9","group":"on-page","title":"robots.txt + sitemap.xml erişilebilir mi?","link":"https://sukrugencoglu.com/sitemap.xml","notes":"","status":"todo"},
    {"id":"op-10","group":"on-page","title":"404 ve 301 yönlendirmeleri sağlıklı mı?","link":"","notes":"","status":"todo"},
    {"id":"ps-1","group":"pagespeed","title":"PageSpeed Mobile skoru","link":"https://pagespeed.web.dev/analysis/https-sukrugencoglu-com?form_factor=mobile","notes":"","status":"todo"},
    {"id":"ps-2","group":"pagespeed","title":"PageSpeed Desktop skoru","link":"https://pagespeed.web.dev/analysis/https-sukrugencoglu-com?form_factor=desktop","notes":"","status":"todo"},
    {"id":"ps-3","group":"pagespeed","title":"LCP < 2.5s (Largest Contentful Paint)","link":"","notes":"","status":"todo"},
    {"id":"ps-4","group":"pagespeed","title":"INP < 200ms (Interaction to Next Paint)","link":"","notes":"","status":"todo"},
    {"id":"ps-5","group":"pagespeed","title":"CLS < 0.1 (Cumulative Layout Shift)","link":"","notes":"","status":"todo"},
    {"id":"ps-6","group":"pagespeed","title":"Görsel optimizasyonu (WebP, next/image, lazy load)","link":"","notes":"","status":"todo"},
    {"id":"ps-7","group":"pagespeed","title":"CSS/JS bundle boyutu","link":"","notes":"","status":"todo"},
    {"id":"ps-8","group":"pagespeed","title":"Font yükleme stratejisi (font-display: swap)","link":"","notes":"","status":"todo"},
    {"id":"sc-1","group":"search-console","title":"Property doğrulama hâlâ aktif mi?","link":"https://search.google.com/search-console","notes":"","status":"todo"},
    {"id":"sc-2","group":"search-console","title":"Sitemap submit + son crawl durumu","link":"https://search.google.com/search-console/sitemaps","notes":"","status":"todo"},
    {"id":"sc-3","group":"search-console","title":"Coverage / Index status — excluded URL''leri incele","link":"https://search.google.com/search-console/index","notes":"","status":"todo"},
    {"id":"sc-4","group":"search-console","title":"Performance — top queries / top pages","link":"https://search.google.com/search-console/performance/search-analytics","notes":"","status":"todo"},
    {"id":"sc-5","group":"search-console","title":"URL Inspection — yeni sayfaları index''le","link":"https://search.google.com/search-console","notes":"","status":"todo"},
    {"id":"sc-6","group":"search-console","title":"Mobile Usability hataları","link":"https://search.google.com/search-console","notes":"","status":"todo"},
    {"id":"sc-7","group":"search-console","title":"Manual Actions / Security Issues","link":"https://search.google.com/search-console/manual-actions","notes":"","status":"todo"},
    {"id":"sc-8","group":"search-console","title":"Backlinks (Links raporu)","link":"https://search.google.com/search-console/links","notes":"","status":"todo"},
    {"id":"sc-9","group":"search-console","title":"Core Web Vitals raporu (CrUX)","link":"https://search.google.com/search-console/core-web-vitals","notes":"","status":"todo"}
  ]'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
