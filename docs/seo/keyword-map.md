# Anahtar Kelime Haritası — sukrugencoglu.com

> Bu doküman canlı bir kayıttır. Her ay GSC (Google Search Console) verisiyle çapraz kontrol edilir, gerçek arama sorguları eklenir.

**Son güncelleme:** 2026-04-29
**Hedef pazar:** Türkiye (TR öncelikli, EN ikincil)
**Persona:** KOBİ sahipleri, e-ticaret operatörleri, dijital pazarlama yöneticileri.

---

## Pillar / Cluster Yapısı

Her pillar bir hizmet sayfasına denk gelir. Her pillar altında 5–10 cluster blog yazısı, ilgili pillar'a iç bağlantı verir; pillar da en güçlü 3 cluster'a iç bağlantı verir.

### Pillar 1 — Google Ads Yönetimi

- **Pillar URL:** `/tr/hizmetler` (mevcut sayfa, Google Ads kelimesine optimize edilmeli)
- **Birincil kelime:** `google ads yönetimi`
- **Hedef sorgular:**
  - "google ads ajansı"
  - "google ads kampanya yönetimi"
  - "google reklamı verme"
  - "adwords yönetim hizmeti"

**Cluster yazıları:**

| Slug | Birincil kelime | Niyet |
|---|---|---|
| google-ads-donusum-takibi-kurulumu | google ads dönüşüm takibi | how-to |
| google-ads-kampanya-yapisi | google ads kampanya yapısı | educational |
| google-ads-anahtar-kelime-arastirmasi | google ads anahtar kelime araştırması | how-to |
| google-ads-roas-nasil-artirilir | google ads roas | educational |
| performance-max-vs-search-kampanya | performance max search karşılaştırması | comparison |

---

### Pillar 2 — Meta Ads (Facebook & Instagram) Yönetimi

- **Pillar URL:** `/tr/hizmetler` veya yeni alt sayfa `/tr/hizmetler/meta-ads`
- **Birincil kelime:** `meta ads yönetimi`
- **Hedef sorgular:**
  - "facebook reklam ajansı"
  - "instagram reklam yönetimi"
  - "meta business suite"

**Cluster yazıları:**

| Slug | Birincil kelime | Niyet |
|---|---|---|
| meta-pixel-kurulumu | meta pixel kurulumu | how-to |
| facebook-reklam-hedefleme | facebook reklam hedefleme | educational |
| meta-ads-katalog-reklam | meta ads katalog reklam e-ticaret | how-to |
| ios14-meta-ads-etkisi | ios 14 meta ads | educational |

---

### Pillar 3 — Web Analytics & Google Tag Manager

- **Pillar URL:** Yeni `/tr/hizmetler/analytics-gtm` veya mevcut sayfanın bir bölümü
- **Birincil kelime:** `google tag manager kurulumu`
- **Hedef sorgular:**
  - "gtm kurulumu"
  - "ga4 kurulumu"
  - "e-ticaret takibi google analytics"

**Cluster yazıları:**

| Slug | Birincil kelime | Niyet |
|---|---|---|
| gtm-ile-eticaret-takibi | gtm e-ticaret takibi | how-to |
| ga4-server-side-tracking | server side tracking ga4 | educational |
| gtm-formu-takip-etme | gtm form gönderim takibi | how-to |
| ga4-vs-ua-fark | ga4 ua fark | comparison |
| consent-mode-v2-kurulumu | consent mode v2 | how-to |

---

### Pillar 4 — CRO (Dönüşüm Optimizasyonu)

- **Pillar URL:** Yeni `/tr/hizmetler/cro`
- **Birincil kelime:** `dönüşüm oranı optimizasyonu`
- **Hedef sorgular:**
  - "cro nedir"
  - "satış sayfası optimizasyonu"
  - "a/b testi nasıl yapılır"

**Cluster yazıları:**

| Slug | Birincil kelime | Niyet |
|---|---|---|
| ab-testi-nasil-yapilir | a/b testi nasıl yapılır | how-to |
| landing-page-cro-checklist | landing page cro | educational |
| sepet-terk-orani-azaltma | sepet terk oranı | how-to |
| heatmap-analizi | heatmap analizi | educational |

---

### Pillar 5 — SEO (Bonus)

- **Pillar URL:** `/tr/hizmetler/seo` (planlı)
- **Birincil kelime:** `teknik seo hizmeti`

**Cluster yazıları:**

| Slug | Birincil kelime | Niyet |
|---|---|---|
| nextjs-seo-rehberi | next.js seo | how-to |
| structured-data-rehberi | json-ld schema | educational |
| core-web-vitals-iyilestirme | core web vitals | how-to |

---

## Mevcut Sayfa-Kelime Ataması

| URL | Birincil kelime | İkincil | Mevcut sıralama* | Hedef |
|---|---|---|---|---|
| `/tr` | freelance growth engineer | google ads ajansı, dijital pazarlama uzmanı | ? | Top 10 |
| `/tr/hizmetler` | google ads yönetimi | meta ads, dijital reklam ajansı | ? | Top 5 |
| `/tr/calismalar` | google ads vaka çalışması | reklam başarı hikayesi | ? | Top 10 |
| `/tr/hakkimda` | şükrü gençoğlu | growth engineer | branded | #1 |
| `/tr/nasil-calisiriz` | reklam yönetim süreci | dijital pazarlama süreç | ? | Top 10 |
| `/tr/iletisim` | google ads ücretsiz analiz | reklam analizi teklif | ? | Top 5 |
| `/tr/sss` | google ads sık sorulan sorular | meta ads sss | ? | Top 5 |

\* GSC verisi alınınca doldurulacak.

---

## Internal Linking Şeması

**Kural:** Her cluster yazısı pillar'a 1 link, en yakın 2 cluster'a 1'er link verir. Pillar sayfası en güçlü 3 cluster'a link verir.

**Örnek (Google Ads pillar):**

```
/hizmetler  ───→  google-ads-donusum-takibi-kurulumu
            ───→  google-ads-kampanya-yapisi
            ───→  google-ads-roas-nasil-artirilir

google-ads-donusum-takibi-kurulumu  ──→  /hizmetler (anchor: "google ads yönetim hizmeti")
                                    ──→  google-ads-roas-nasil-artirilir
                                    ──→  gtm-ile-eticaret-takibi  (cross-pillar)
```

---

## Aylık İnceleme Süreci

1. **GSC Performance > Queries** → Son 28 gün, TR pazarı, click + impression > 10 olan tüm sorgular dışa aktar
2. **Yeni sorguları cluster yazıları halinde planla** — her sorgu için niyet (how-to / educational / comparison / branded) belirle
3. **Sıralama dropleri** → mevcut yazıları güncelle (içerik tazele, başlık optimize et)
4. **CTR < %2 olan top-50 sorgular** → meta description ve title yeniden yaz

---

## Yapılacaklar (Mart-Mayıs 2026)

- [ ] GSC erişimi sağlanması ve baseline alınması
- [ ] Pillar 1 (Google Ads) için ilk 3 cluster yazısı yayınlama
- [ ] Pillar 2 (Meta Ads) için ilk 2 cluster yazısı yayınlama
- [ ] `/tr/hizmetler` sayfasında Google Ads bölümünün H2/H3 yapısı SEO'ya uygun yeniden düzenle
- [ ] Internal linking şeması ilk 5 yazıda uygulanmalı
- [ ] EN versiyonları için çeviri akışı (Faz D'deki AI çevirisi devreye girince)
