// Claude prompt template'leri — sektör + opsiyonlar → JSON öneri
import { HEDEFLER, TURLER, TEKLIF_STRATEJILERI, KAMPANYA_AYARI_BASLIKLARI } from './constants'

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

// Aşama 3.1: Teklif verme stratejisi — sektör + hedef + tür bağlamına göre puanla
export function teklifAnalizPrompt(sektor, secilenHedefId, secilenTurId) {
  const hedef = HEDEFLER.find(h => h.id === secilenHedefId)
  const tur = TURLER.find(t => t.id === secilenTurId)
  const stratejiListesi = TEKLIF_STRATEJILERI
    .map(s => `- ${s.id}: ${s.label} — ${s.aciklama}`)
    .join('\n')

  return `Sen deneyimli bir Google Ads uzmanısın. Bir kullanıcı su yapilanmayi sectiniz:
- Sektör: ${sektor}
- Hedef: ${hedef?.label}
- Kampanya türü: ${tur?.label}

Şimdi teklif verme (bidding) stratejisini seçecek. Aşağıdaki seçenekleri bu sektör + hedef + tür kombinasyonu için değerlendir.

Teklif stratejileri:
${stratejiListesi}

Görev: Her strateji için:
- "uygunluk": "cok-uygun" | "uygun" | "az-uygun" | "onerilmez"
- "gerekce": Bu kombinasyona özel SOMUT sebep (1-2 kısa cümle, Türkçe)

Kurallar:
- Yeni hesaplarda dönüşüm verisi az olabileceği için "Önerilen" çoğu zaman güvenli — bunu dikkate al
- "Dönüşüm değeri" sadece e-ticaret/değer takibi olan kampanyalar için anlamlıdır
- "Gösterim payı" marka bilinirliği veya rakip baskısı senaryolarında uygundur
- En fazla 2 strateji "cok-uygun" olabilir
- Müşteri "Yalnızca yeni müşteriler için teklif ver" seçeneği için de kısa bir öneri ekle

SADECE geçerli JSON dön, başka metin yok:
{
  "onerilen": { "uygunluk": "...", "gerekce": "..." },
  "donusumler": { "uygunluk": "...", "gerekce": "..." },
  "donusum-degeri": { "uygunluk": "...", "gerekce": "..." },
  "tiklamalar": { "uygunluk": "...", "gerekce": "..." },
  "gosterim-payi": { "uygunluk": "...", "gerekce": "..." },
  "yeni-musteri": { "oneri": "evet" | "hayir", "gerekce": "1-2 cümle" }
}`
}

// Aşama 3.2: Kampanya Ayarları başlıkları için AI önerileri
export function ayarlarAnalizPrompt(sektor, secilenHedefId, secilenTurId, secilenTeklifId) {
  const hedef = HEDEFLER.find(h => h.id === secilenHedefId)
  const tur = TURLER.find(t => t.id === secilenTurId)
  const teklif = TEKLIF_STRATEJILERI.find(s => s.id === secilenTeklifId)

  return `Sen deneyimli bir Google Ads uzmanısın. Bir kullanıcı şu yapılandırmayı seçti:
- Sektör: ${sektor}
- Hedef: ${hedef?.label}
- Kampanya türü: ${tur?.label}
- Teklif stratejisi: ${teklif?.label || '—'}

Şimdi "Kampanya Ayarları" ekranındaki her başlık için kısa, somut ve karar verdirici bir öneri yaz. Her başlık için 1-2 kısa cümle yeter.

Başlıklar ve neyi içerdikleri:
- aglar: "Google Arama Ağı İş Ortakları" (üçüncü taraf siteler) ve "Görüntülü Reklam Ağı genişletmesi" — kalsın mı kapansın mı?
- konumlar: Coğrafi hedefleme önerisi (tüm ülke / şehir / yarıçap)
- diller: Hangi dil(ler) seçilmeli
- ab-siyasi: AB siyasi reklam beyanı (neredeyse her zaman "Hayır")
- kitle-segmentleri: "Hedefleme" mi "Gözlem" mi · hangi segment kategorileri ekleyelim (örn. "ev hizmetleri", "yakın ilgi: ...")
- diger: Reklam rotasyonu, başlangıç/bitiş tarihleri, zaman planlaması için kısa not

SADECE geçerli JSON dön, başka metin yok:
{
  "aglar": { "oneri": "...", "gerekce": "..." },
  "konumlar": { "oneri": "...", "gerekce": "..." },
  "diller": { "oneri": "...", "gerekce": "..." },
  "ab-siyasi": { "oneri": "...", "gerekce": "..." },
  "kitle-segmentleri": { "oneri": "...", "gerekce": "..." },
  "diger": { "oneri": "...", "gerekce": "..." }
}

"oneri" alanı kısa ve eyleme yönelik olsun (örn. "Kapatın", "Türkiye + 20 mil yarıçap", "Sadece Türkçe", "Hayır", "Gözlem modunda 3-5 ilgi alanı segmenti", "Optimize et + sürekli yayın").
"gerekce" alanı sektöre özel kısa bir sebep verin.`
}

// Aşama 3.4.1: Sektörle alakalı anahtar kelime önerileri
// Google Ads anahtar kelimeleri MAX 80 karakter olabilir → AI'a hatırlatılır
export function anahtarKelimePrompt(sektor, secilenHedefId, secilenTurId) {
  const hedef = HEDEFLER.find(h => h.id === secilenHedefId)
  const tur = TURLER.find(t => t.id === secilenTurId)

  return `Sen deneyimli bir Google Ads SEM uzmanısın. Şu yapılandırmaya göre 15 anahtar kelime öner:
- Sektör: ${sektor}
- Hedef: ${hedef?.label}
- Kampanya türü: ${tur?.label}

KRİTİK KURAL: Google Ads her bir anahtar kelimeyi MAX 80 KARAKTER kabul eder. Hiçbir önerin 80 karakteri geçmesin. Çoğu kelime 15-50 karakter arasında olmalı.

15 öneriyi 3 kategoriye dağıt:
- "islemsel": Satın alma niyeti yüksek (örn. "fiyat", "satın al", "online sipariş")
- "bilgilendirici": Araştırma niyetli (örn. "nasıl yapılır", "rehber", "karşılaştırma")
- "marka-yan": Yan ilgi alanları, sektörle ilişkili genel terimler

Her kategoriden 5 kelime ver. Türkçe yaz. Tek kelime de olabilir, 2-5 kelimelik fraz da.

SADECE geçerli JSON dön, başka metin yok:
{
  "kelimeler": [
    { "kelime": "...", "kategori": "islemsel" | "bilgilendirici" | "marka-yan", "neden": "1 cümlelik kısa not" },
    ... (toplam 15 adet)
  ]
}`
}
