// Mantık haritalarında kullanılan ortak kategori tanımları.
// Yeni bir mantık haritası eklerken bu dosyayı import et — yeniden tanımlama.

export type MapCategory =
  | 'web' | 'seo' | 'ads' | 'sosyal'
  | 'kirmizi' | 'pembe' | 'lacivert' | 'gumus';

export const CAT_COLORS: Record<string, { bg: string; border: string; stripe: string }> = {
  web:      { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  seo:      { bg: '#FFF8E1', border: '#F57F1766', stripe: '#F57F17' },
  ads:      { bg: '#E8F5E9', border: '#1B5E2066', stripe: '#1B5E20' },
  sosyal:   { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
  kirmizi:  { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:    { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert: { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:    { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
};

export const CAT_LABELS: Record<string, string> = {
  web: 'Web Merkezi',
  seo: 'Organik Büyüme',
  ads: 'Ücretli Reklam',
  sosyal: 'Sosyal Medya',
  kirmizi: 'Kırmızı',
  pembe: 'Pembe',
  lacivert: 'Lacivert',
  gumus: 'Gümüş',
};

export function getCatColors(cat?: string) {
  return CAT_COLORS[cat || 'web'] || CAT_COLORS.web;
}
