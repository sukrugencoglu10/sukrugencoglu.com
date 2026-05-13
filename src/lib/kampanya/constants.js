// Google Ads kampanya hedefleri ve türleri — UI'dan birebir alındı
// Kampanya Stüdyosu Aşama 1 (Hedef) ve Aşama 2 (Tür)

export const HEDEFLER = [
  {
    id: 'satis',
    label: 'Satış',
    aciklama: 'Online, uygulama içi, telefon aracılığıyla veya mağazada gerçekleştirilen satışları artırın',
    icon: '🏷️',
  },
  {
    id: 'potansiyel',
    label: 'Potansiyel müşteriler',
    aciklama: 'Müşterileri harekete geçmeye teşvik ederek potansiyel müşteriler ve başka dönüşümler elde edin',
    icon: '👥',
  },
  {
    id: 'web-trafik',
    label: 'Web sitesi trafiği',
    aciklama: 'Web sitenizi doğru kullanıcıların ziyaret etmesini sağlayın',
    icon: '🌐',
  },
  {
    id: 'uygulama',
    label: 'Uygulama tanıtımı',
    aciklama: 'Uygulamanız için daha fazla yükleme, etkileşim ve ön kayıt elde edin',
    icon: '📱',
  },
  {
    id: 'youtube',
    label: 'YouTube erişimi, görüntülemeleri ve etkileşimleri',
    aciklama: 'Ürününüzün veya markanızın bilinirliği ve değerlendirme alınma oranını artırın',
    icon: '📣',
  },
  {
    id: 'yerel',
    label: 'Yerel mağaza ziyaretleri ve tanıtımlar',
    aciklama: 'Restoran ve bayiler dahil yerel mağazalara giden müşteri sayısını artırın',
    icon: '📍',
  },
  {
    id: 'kilavuzsuz',
    label: 'Kılavuz olmadan kampanya oluştur',
    aciklama: 'Kampanyayı daha sonra seçersiniz',
    icon: '⚙️',
  },
]

export const TURLER = [
  {
    id: 'maks-performans',
    label: 'Maks. Performans',
    aciklama: 'Google Arama, YouTube, Görüntülü Reklam Ağı ve diğer kanallardaki reklamlar sayesinde doğru kullanıcılara ulaşarak potansiyel müşteriler elde edin',
    uygunHedefler: ['satis', 'potansiyel', 'web-trafik', 'yerel'],
  },
  {
    id: 'arama',
    label: 'Arama',
    aciklama: 'Metin reklamlarla Google Arama\'da potansiyel müşteriler elde edin',
    uygunHedefler: ['satis', 'potansiyel', 'web-trafik'],
  },
  {
    id: 'talep',
    label: 'Talep Yaratma',
    aciklama: 'Resim ve video reklamlar aracılığıyla YouTube, Google Görüntülü Reklam Ağı ve diğer platformlarda talebi ve dönüşümleri artırın',
    uygunHedefler: ['satis', 'potansiyel', 'youtube'],
  },
  {
    id: 'video',
    label: 'Video',
    aciklama: 'Video reklamlarınızla YouTube\'da potansiyel müşteriler elde edin',
    uygunHedefler: ['youtube', 'potansiyel', 'satis'],
  },
  {
    id: 'goruntulu',
    label: 'Görüntülü Reklam Ağı',
    aciklama: 'Reklam öğenizle 3 milyon site ve uygulamadaki potansiyel müşterilere ulaşın',
    uygunHedefler: ['youtube', 'web-trafik', 'potansiyel'],
  },
  {
    id: 'alisveris',
    label: 'Alışveriş',
    aciklama: 'Alışveriş reklamlarıyla Merchant Center\'daki ürünlerinizi Google Arama\'da tanıtın',
    uygunHedefler: ['satis'],
  },
]

// Rozet renkleri ve etiketleri (AdviceBadge tarafından kullanılır)
export const UYGUNLUK = {
  'cok-uygun':   { label: 'Çok Uygun',   color: '#0F6E56', bg: '#E1F5EE', border: '#1D9E75' },
  'uygun':       { label: 'Uygun',       color: '#1E40AF', bg: '#DBEAFE', border: '#3B82F6' },
  'az-uygun':    { label: 'Az Uygun',    color: '#92400E', bg: '#FEF3C7', border: '#F59E0B' },
  'onerilmez':   { label: 'Önerilmez',   color: '#4B5563', bg: '#F3F4F6', border: '#9CA3AF' },
}

// Aşama 3 — Alt basamak 1: Teklif verme stratejileri (Google Ads bidding)
export const TEKLIF_STRATEJILERI = [
  {
    id: 'onerilen',
    label: 'Önerilen',
    aciklama: 'Google Ads sizin için en uygun stratejiyi otomatik seçer',
  },
  {
    id: 'donusumler',
    label: 'Dönüşümler',
    aciklama: 'Bütçeniz için en fazla dönüşümü almaya odaklanır',
  },
  {
    id: 'donusum-degeri',
    label: 'Dönüşüm değeri',
    aciklama: 'Bütçeniz için toplam dönüşüm değerini en üst düzeye çıkarır',
  },
  {
    id: 'tiklamalar',
    label: 'Tıklamalar',
    aciklama: 'Bütçeniz için en fazla tıklamayı almaya odaklanır',
  },
  {
    id: 'gosterim-payi',
    label: 'Gösterim payı',
    aciklama: 'Belirli bir gösterim payı hedefine ulaşmaya çalışır',
  },
]

// Aşama 3 alt-basamakları
export const ASAMA3_ALT_ADIMLAR = [
  { no: 1, label: 'Teklif verme' },
  { no: 2, label: 'Kampanya Ayarları' },
  { no: 3, label: 'AI Max' },
  { no: 4, label: 'Reklam Oluştur' },
]

// 3.4 — Reklam Oluştur alt-adımları
export const REKLAM_ALT_ADIMLAR = [
  { no: 1, label: 'Anahtar Kelimeler' },
  { no: 2, label: 'Başlıklar' },
]

// Google Ads karakter limitleri
export const ANAHTAR_KELIME_MAX_KARAKTER = 80
export const BASLIK_MAX_KARAKTER = 30

// Aşama 3.2 — Kampanya Ayarları başlıkları (Google Ads ekranındaki bölümler)
export const KAMPANYA_AYARI_BASLIKLARI = [
  {
    id: 'aglar',
    label: 'Ağlar',
    aciklama: 'Google Arama Ağı İş Ortakları + Görüntülü Reklam Ağı seçenekleri',
  },
  {
    id: 'konumlar',
    label: 'Konumlar',
    aciklama: 'Coğrafi hedefleme: tüm dünya, ülke, şehir veya yarıçap',
  },
  {
    id: 'diller',
    label: 'Diller',
    aciklama: 'Müşterilerin tarayıcı diline göre eşleşme',
  },
  {
    id: 'ab-siyasi',
    label: 'AB siyasi reklamları',
    aciklama: 'AB tüzüğü uyarınca siyasi reklam beyanı',
  },
  {
    id: 'kitle-segmentleri',
    label: 'Kitle segmentleri',
    aciklama: 'Hedefleme vs. Gözlem · ilgi alanları, demografik segmentler',
  },
  {
    id: 'diger',
    label: 'Diğer ayarlar',
    aciklama: 'Reklam rotasyonu, başlangıç/bitiş tarihleri, zaman planlaması, URL seçenekleri',
  },
]

// Sektör input için hızlı öneri chip'leri
export const SEKTOR_ONERILERI = [
  'E-ticaret',
  'Butik kahve dükkanı',
  'Diş kliniği',
  'B2B SaaS',
  'Online eğitim',
  'Emlak',
  'Restoran',
  'Güzellik salonu',
]
