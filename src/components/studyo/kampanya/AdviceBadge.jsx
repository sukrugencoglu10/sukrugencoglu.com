'use client'

import { UYGUNLUK } from '@/lib/kampanya/constants'

// Sektöre göre uygunluk rozeti
// uygunluk: 'cok-uygun' | 'uygun' | 'az-uygun' | 'onerilmez' | null
export default function AdviceBadge({ uygunluk, loading }) {
  if (loading) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 12,
          background: '#f7f7f5',
          border: '0.5px solid #e0e0e0',
          fontSize: 11,
          color: '#aaa',
          fontStyle: 'italic',
        }}
      >
        analiz ediliyor...
      </span>
    )
  }

  if (!uygunluk || !UYGUNLUK[uygunluk]) return null
  const u = UYGUNLUK[uygunluk]

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 12,
        background: u.bg,
        border: `0.5px solid ${u.border}`,
        fontSize: 11,
        fontWeight: 500,
        color: u.color,
        whiteSpace: 'nowrap',
      }}
    >
      {u.label}
    </span>
  )
}
