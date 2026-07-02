'use client'

import { SEKTOR_ONERILERI } from '@/lib/kampanya/constants'

// Sektör girişi: serbest metin + hızlı chip önerileri
export default function SektorInput({ sektor, setSektor, onAnaliz, loading, hasAnaliz }) {
  const handleEnter = (e) => {
    if (e.key === 'Enter' && sektor.trim() && !loading) {
      onAnaliz()
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid #e8e8e8',
        borderRadius: 14,
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>
        İşletmenizin sektörü
      </label>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          value={sektor}
          onChange={(e) => setSektor(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="ör. butik kahve dükkanı, B2B SaaS, diş kliniği..."
          style={{
            flex: 1,
            minWidth: 220,
            fontSize: 14,
            padding: '9px 12px',
            borderRadius: 8,
            border: '0.5px solid #ddd',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={onAnaliz}
          disabled={!sektor.trim() || loading}
          style={{
            padding: '9px 18px',
            background: !sektor.trim() || loading ? '#ddd' : '#111',
            color: '#fff',
            border: 'none',
            borderRadius: 9,
            fontSize: 13,
            fontFamily: 'inherit',
            cursor: !sektor.trim() || loading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Analiz ediliyor...' : hasAnaliz ? 'Yeniden analiz et' : 'Önerileri getir'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {SEKTOR_ONERILERI.map((s) => (
          <button
            key={s}
            onClick={() => setSektor(s)}
            style={{
              padding: '4px 10px',
              borderRadius: 14,
              border: '0.5px solid #e0e0e0',
              background: sektor === s ? '#f0f0ee' : 'transparent',
              color: '#666',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
