# Anahtar Kelime Haritası — [PROJECT_NAME]

> Reusable şablon. `[PLACEHOLDER]` etiketlerini doldurarak yeni proje için anahtar kelime haritası üret.

**Son güncelleme:** [TARIH]
**Hedef pazar:** [ÜLKE / DİL]
**Persona:** [HEDEF KİTLE — sektör, rol, problem]

---

## Pillar / Cluster Yapısı

> Pillar sayısı: 3-5 arası ideal. Her pillar bir hizmet/ürün sayfasına denk gelir. Pillar altında 5-10 cluster.

### Pillar [N] — [PILLAR_BAŞLIĞI]

- **Pillar URL:** `[/path]`
- **Birincil kelime:** `[ANA_KELIME]`
- **Hedef sorgular:**
  - "[long-tail 1]"
  - "[long-tail 2]"
  - "[long-tail 3]"

**Cluster yazıları:**

| Slug | Birincil kelime | Niyet (how-to / educational / comparison / branded) |
|---|---|---|
| [slug-1] | [kelime] | [niyet] |
| [slug-2] | [kelime] | [niyet] |
| [slug-3] | [kelime] | [niyet] |
| [slug-4] | [kelime] | [niyet] |
| [slug-5] | [kelime] | [niyet] |

---

## Mevcut Sayfa-Kelime Ataması

| URL | Birincil kelime | İkincil | Mevcut sıralama | Hedef |
|---|---|---|---|---|
| `/` | | | ? | |
| | | | ? | |

---

## Cluster Keşif Promptu (AI'ya verilecek)

```
[PILLAR_BAŞLIĞI] konusunda Türkiye'de [HEDEF_KİTLE] tarafından aranan
10 long-tail anahtar kelime öner. Her birinin niyetini (how-to / educational /
comparison / branded) ve tahmini aylık arama hacmini belirt. Çıktı formatı:

| Kelime | Niyet | Hacim |
```

---

## Internal Linking Kuralları

- Her cluster yazısı pillar'a 1 link verir (anchor: pillar'ın birincil kelimesi).
- Her cluster yazısı en yakın 2 cluster'a link verir.
- Pillar sayfası en güçlü 3 cluster yazısına link verir.
- Cross-pillar bağlantı: ilgili kelimeler farklı pillar'da varsa.

---

## Aylık İnceleme Süreci

1. GSC Queries → 28 günlük export
2. Yeni sorgular → cluster yazıları olarak planla
3. Sıralama düşüşü → içerik tazele
4. CTR < %2 → meta yeniden yaz
