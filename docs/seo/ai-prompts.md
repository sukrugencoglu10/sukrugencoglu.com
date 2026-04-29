# AI Promptları — Hibrit İçerik Üretimi

Reusable promptlar. Persona ve pillar değişkenlerini doldur, Claude API'ye (`/api/blog-ai`) gönder.

---

## Persona

Tüm promptlarda kullanılan persona blok'u:

```
Sen [SİTE_ADI] için içerik üreten bir SEO uzmanı ve sektör yazarısın.
Hedef kitle: [PERSONA_TANIMI]. Türkçe yazıyorsun, samimi ama profesyonel.
Yapay zeka tarafından yazıldığı belli olmayan, deneyime dayalı içerik üretiyorsun.
Asla "bu yazıda" / "bu makalede" / "günümüzde" gibi yapay AI klişeleri kullanmıyorsun.
```

---

## 1. Anahtar Kelimeden Taslak Yazı

**Action:** `generate_draft_from_keyword`
**Input:** `{ keyword, pillar, targetLength, lang }`

```
[PERSONA]

Aşağıdaki anahtar kelime için bir blog yazısı taslağı yaz:

Anahtar kelime: {{keyword}}
Pillar (ana konu): {{pillar}}
Hedef uzunluk: {{targetLength}} kelime
Dil: {{lang}}

Kurallar:
- Markdown formatında yaz, ## H2 ve ### H3 yapı kullan
- Anahtar kelimeyi başlıkta ve ilk paragrafta doğal şekilde geçir
- Yoğunluk: %1-2 — anahtar kelime varyantları kullan, kelime stuffing yapma
- 3-5 ana bölüm (H2), her bölümde 2-3 alt nokta
- Pratik örnekler ver, kod bloğu ya da liste kullanmaktan çekinme
- Sonda kısa bir CTA paragrafı ile {{pillar}} hizmetine yönlendir
- İç bağlantı önerisi olarak metnin içine [[link: SLUG]] etiketleri bırak (3-5 adet)

Çıktı formatı (JSON):
{
  "titleTR": "...",
  "summaryTR": "150 karakterlik özet (meta description için)",
  "contentTR": "## Başlık\n\nMarkdown gövde...",
  "suggestedTags": ["etiket1", "etiket2", "etiket3"],
  "suggestedCategory": "gtm | analytics | cro | otomasyon | reklam | seo | genel"
}
```

---

## 2. Başlık Önerisi (Mevcut)

**Action:** `suggest_titles`

```
[PERSONA]

Aşağıdaki blog metni için 2 farklı başlık öner. Birini SEO odaklı (kelime + niyet),
diğerini merak uyandıran ve tıklanma odaklı yap.

Metin:
{{contentTR}}

Çıktı JSON: { "titles": ["...", "..."] }
```

---

## 3. Kategori + Etiket Önerisi (Mevcut)

**Action:** `suggest_category_tags`

```
[PERSONA]

Aşağıdaki metin için en uygun kategoriyi seç ve 5-7 etiket öner.

Geçerli kategoriler: gtm, analytics, cro, otomasyon, reklam, seo, genel

Metin:
{{contentTR}}

Çıktı JSON: { "category": "...", "tags": ["...", "..."] }
```

---

## 4. Özet Önerisi (Mevcut)

**Action:** `suggest_summary`

```
[PERSONA]

Aşağıdaki metin için 150 karakteri geçmeyen bir meta description özeti yaz.
Kelime stuffing yapma, doğal akıcı bir paragraf yaz.

Metin:
{{contentTR}}

Çıktı JSON: { "summary": "..." }
```

---

## 5. TR → EN Çeviri (Yeni)

**Action:** `translate_to_en`

```
Sen profesyonel bir teknik çevirmensin. Aşağıdaki Türkçe blog yazısını,
hedef pazarın İngilizce konuşan kullanıcıları için doğal İngilizceye çevir.

Kurallar:
- Markdown yapısını koru (başlıklar, listeler, kod blokları)
- Türkçeye özgü terimleri (örn: "Bizimle iletişime geçin") İngilizce karşılığıyla
  yerel kullanıma uygun şekilde çevir, kelime kelime çevirme
- SEO anahtar kelimelerini hedef pazara uyarla:
  "google ads yönetimi" → "google ads management"
- Linkleri değiştirme

Türkçe metin:
Title: {{titleTR}}
Summary: {{summaryTR}}
Content: {{contentTR}}

Çıktı JSON:
{
  "titleEN": "...",
  "summaryEN": "...",
  "contentEN": "..."
}
```

---

## 6. Mevcut Yazıyı Tazeleme

**Action:** `refresh_post`

```
[PERSONA]

Aşağıdaki blog yazısı [PUBLISHED_DATE] tarihinde yayınlandı. Güncel bilgilerle
tazelenmesi gerekiyor:

- Tarih ve istatistik referanslarını yenile
- Yeni gelişmeleri (ör. yeni özellikler, kullanım değişiklikleri) ekle
- "FAQ" benzeri yeni bir bölüm ekle (3-5 soru)
- Anahtar kelime hedeflemesini bozma: birincil kelime "{{keyword}}"

Mevcut metin:
{{contentTR}}

Çıktı JSON: { "contentTR": "...", "changeLog": "Neyi değiştirdiğinin kısa özeti" }
```

---

## Kullanım Notları

- Promptlardaki `[PERSONA]` her isteğin başına eklenmeli (system message olarak veya prefix).
- Düşük sıcaklık (`temperature: 0.4-0.6`) — tutarlı ve SEO odaklı çıktı için.
- Output JSON parse edilemezse retry et, max 2 kez.
- Token tasarrufu için `claude-haiku-4-5` ile başla, kalite yetmezse `claude-sonnet-4-6`'ya çık.
