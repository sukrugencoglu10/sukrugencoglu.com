# SEO Kit

Next.js 14+ App Router projeleri için taşınabilir SEO altyapısı.

## İçerik

| Dosya | Amaç |
|---|---|
| `config.ts` | Site-spesifik tüm değerler (URL, dil, organizasyon, kişi). **Yeni projede yalnızca burayı düzenle.** |
| `MetaBuilder.ts` | Sayfa metadata (title/desc/canonical/hreflang/og/twitter) tek fonksiyonla. |
| `JsonLd.tsx` | schema.org bileşenleri: Organization, WebSite, Person, BlogPosting, FAQPage, BreadcrumbList. |
| `og-image.tsx` | Generic 1200×630 OG image template (`renderOgImage`). |
| `sitemap-helpers.ts` | Statik + dinamik kaynaklardan sitemap üretici (`buildSitemap`). |

## Yeni projeye taşıma

```bash
cp -r src/lib/seo TARGET_PROJECT/src/lib/
```

Sonra:

1. **`config.ts`** içindeki tüm değerleri yeni proje için düzenle (`baseUrl`, `pathMap`, `organization`, `person`).
2. **`tsconfig.json`** içindeki `paths` map'inde `@/*` → `./src/*` tanımlı olmalı.
3. **Bağımlılıklar:** `next/og` Next.js 13+ ile gelir, ek paket gerekmez. Sadece `next` ve `react` yeter.
4. **`src/app/[lang]/layout.tsx`** içinde:
   ```tsx
   import { OrganizationLd, WebSiteLd } from "@/lib/seo/JsonLd";
   // <body> içine: <OrganizationLd /><WebSiteLd />
   ```
5. **`src/app/sitemap.ts`** — `buildSitemap` ile yaz (örnek: bu projedeki `src/app/sitemap.ts`).
6. **OG image:**
   - Default: `src/app/[lang]/opengraph-image.tsx` → `renderOgImage({ title, subtitle })`
   - Blog detay: `src/app/[lang]/blog/[slug]/opengraph-image.tsx` → post verisini fetch et, `renderOgImage` ile dön
7. **Sayfa metadata** — `buildMetadata` kullan:
   ```ts
   export async function generateMetadata({ params }) {
     const { lang } = await params;
     return buildMetadata({
       lang,
       pathKey: "/hakkimda",
       title: "Hakkımda",
       description: "...",
     });
   }
   ```

## Env değişkenleri

| Anahtar | Açıklama | Zorunlu |
|---|---|---|
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console doğrulama kodu | Hayır |

## Doğrulama

- **Schema:** https://search.google.com/test/rich-results
- **Sosyal kart:** https://www.opengraph.xyz
- **Sitemap:** `curl https://yoursite.com/sitemap.xml`
- **Robots:** `curl https://yoursite.com/robots.txt`

## Bu projeye özgü detaylar

- Blog yazıları Supabase `blog_yazilari` tablosundan (JSON array `items`).
- SSS Supabase `sss` tablosundan, FAQPage schema otomatik üretiliyor.
- Studyo/Admin altyapısı `noindex` (bkz. `src/app/studyo/layout.tsx`).
