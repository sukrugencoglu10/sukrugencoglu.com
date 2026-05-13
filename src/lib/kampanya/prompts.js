// Claude prompt template'leri — sektör + opsiyonlar → JSON öneri
import { HEDEFLER, TURLER } from './constants'

// Aşama 1: Sektöre göre her hedef için uygunluk değerlendirmesi
export function hedefAnalizPrompt(sektor) {
  const hedefListesi = HEDEFLER
    .filter(h => h.id !== 'kilavuzsuz')
    .map(h => `- ${h.id}: ${h.label} — ${h.aciklama}`)
    .join('\n')

  return `Sen deneyimli bir Google Ads uzmanısın. "${sektor}" sektöründe iş yapan birine, aşağıdaki Google Ads kampanya hedeflerinin ne kadar uygun olduğunu değerlendir.

Hedefler:
${hedefListesi}

Görev: Her hedef için:
- "uygunluk": "cok-uygun" | "uygun" | "az-uygun" | "onerilmez"
- "gerekce": Bu sektöre özel SOMUT bir sebep (1-2 kısa cümle, Türkçe, doğrudan hitap)

Kurallar:
- Sektörü dikkate alarak gerçekçi değerlendir; her hedefe "çok uygun" verme
- En fazla 2-3 hedef "çok uygun" olabilir
- Gerekçeler genel değil, sektöre özel olsun (örn. "yerel bir kahve dükkanı için fiziksel ziyaret kritik")

SADECE aşağıdaki formatta geçerli JSON dön, başka hiçbir metin veya markdown ekleme:
{
  "satis": { "uygunluk": "...", "gerekce": "..." },
  "potansiyel": { "uygunluk": "...", "gerekce": "..." },
  "web-trafik": { "uygunluk": "...", "gerekce": "..." },
  "uygulama": { "uygunluk": "...", "gerekce": "..." },
  "youtube": { "uygunluk": "...", "gerekce": "..." },
  "yerel": { "uygunluk": "...", "gerekce": "..." }
}`
}

// Aşama 2: Sektör + seçilen hedef → her kampanya türü için uygunluk
export function turAnalizPrompt(sektor, secilenHedefId) {
  const hedef = HEDEFLER.find(h => h.id === secilenHedefId)
  const turListesi = TURLER
    .map(t => `- ${t.id}: ${t.label} — ${t.aciklama}`)
    .join('\n')

  return `Sen deneyimli bir Google Ads uzmanısın. "${sektor}" sektöründe iş yapan bir kullanıcı "${hedef?.label}" hedefini seçti. Aşağıdaki kampanya türlerinin bu sektör + bu hedef kombinasyonu için ne kadar uygun olduğunu değerlendir.

Kampanya türleri:
${turListesi}

Görev: Her tür için:
- "uygunluk": "cok-uygun" | "uygun" | "az-uygun" | "onerilmez"
- "gerekce": Sektör + hedef kombinasyonuna özel SOMUT sebep (1-2 kısa cümle, Türkçe)

Kurallar:
- Hedefle uyumsuz türleri "az-uygun" veya "onerilmez" işaretle (örn. fiziksel ürün satışı yoksa "alisveris" önerilmez)
- En fazla 2 tür "çok-uygun" olabilir
- Gerekçeler sektör+hedef bağlamına özel olsun

SADECE geçerli JSON dön, markdown veya başka metin yok:
{
  "maks-performans": { "uygunluk": "...", "gerekce": "..." },
  "arama": { "uygunluk": "...", "gerekce": "..." },
  "talep": { "uygunluk": "...", "gerekce": "..." },
  "video": { "uygunluk": "...", "gerekce": "..." },
  "goruntulu": { "uygunluk": "...", "gerekce": "..." },
  "alisveris": { "uygunluk": "...", "gerekce": "..." }
}`
}
