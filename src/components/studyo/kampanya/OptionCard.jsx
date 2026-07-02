'use client'

import AdviceBadge from './AdviceBadge'

// Google Ads tarzı seçenek kartı (hedef veya tür)
// option: { id, label, aciklama, icon? }
// analiz: { uygunluk, gerekce } | undefined
export default function OptionCard({ option, selected, disabled, loading, analiz, onClick }) {
  const sinirRengi = selected ? '#111' : '#e8e8e8'
  const arkaPlan = disabled ? '#fafafa' : '#fff'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        textAlign: 'left',
        background: arkaPlan,
        border: selected ? '1.5px solid #111' : '0.5px solid #e8e8e8',
        borderColor: sinirRengi,
        borderRadius: 12,
        padding: '14px 16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: disabled ? 0.55 : 1,
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Üst satır: ikon + rozet */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{option.icon || '•'}</span>
        {(analiz || loading) && <AdviceBadge uygunluk={analiz?.uygunluk} loading={loading} />}
      </div>

      {/* Başlık */}
      <div style={{ fontSize: 14, fontWeight: 500, color: '#111', lineHeight: 1.3 }}>
        {option.label}
      </div>

      {/* Resmi açıklama */}
      <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
        {option.aciklama}
      </div>

      {/* AI gerekçesi */}
      {analiz?.gerekce && (
        <div
          style={{
            marginTop: 4,
            paddingTop: 8,
            borderTop: '0.5px dashed #e0e0e0',
            fontSize: 12,
            color: '#444',
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          {analiz.gerekce}
        </div>
      )}
    </button>
  )
}
