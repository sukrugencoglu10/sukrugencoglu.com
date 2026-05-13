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
