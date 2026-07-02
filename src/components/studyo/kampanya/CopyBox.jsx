'use client'

import { useState } from 'react'

// Reusable: AI'dan gelen önerilerin satır satır kopyalanmasını sağlar
// items: string[] (tüm öneriler)
// secili: Set<string> (sadece seçili olanlar)
// label: bölüm başlığı (örn. "anahtar kelime", "başlık", "açıklama")
export default function CopyBox({ items, secili, label = 'öğe' }) {
  const [mode, setMode] = useState('all') // 'all' | 'selected'
  const [copied, setCopied] = useState(false)

  const liste = mode === 'all' ? items : items.filter((it) => secili.has(it))
  const text = liste.join('\n')

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback yok — modern tarayıcılar destekler
    }
  }

  const seciliSayi = items.filter((it) => secili.has(it)).length

  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid #e8e8e8',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 8,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 12, color: '#888', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          📋 Kopyala-Yapıştır
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', borderRadius: 6, border: '0.5px solid #e0e0e0', overflow: 'hidden' }}>
            <button
              onClick={() => setMode('all')}
              style={{
                padding: '4px 10px',
                background: mode === 'all' ? '#111' : 'transparent',
                color: mode === 'all' ? '#fff' : '#666',
                border: 'none',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Tümü ({items.length})
            </button>
            <button
              onClick={() => setMode('selected')}
              disabled={seciliSayi === 0}
              style={{
                padding: '4px 10px',
                background: mode === 'selected' ? '#111' : 'transparent',
                color: mode === 'selected' ? '#fff' : seciliSayi === 0 ? '#ccc' : '#666',
                border: 'none',
                borderLeft: '0.5px solid #e0e0e0',
                fontSize: 11,
                cursor: seciliSayi === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Sadece Seçili ({seciliSayi})
            </button>
          </div>
          <button
            onClick={handleCopy}
            disabled={!text}
            style={{
              padding: '4px 12px',
              background: copied ? '#E1F5EE' : !text ? '#f0f0ee' : '#111',
              color: copied ? '#0F6E56' : !text ? '#aaa' : '#fff',
              border: copied ? '0.5px solid #1D9E75' : 'none',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              cursor: !text ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {copied ? '✓ Kopyalandı' : 'Kopyala'}
          </button>
        </div>
      </div>

      <textarea
        readOnly
        value={text}
        onClick={(e) => e.target.select()}
        placeholder={mode === 'selected' && seciliSayi === 0 ? `Önce ${label} seç...` : ''}
        style={{
          width: '100%',
          minHeight: Math.min(Math.max(60, liste.length * 22), 240),
          fontSize: 12,
          fontFamily: 'monospace',
          padding: '10px 12px',
          borderRadius: 8,
          border: '0.5px solid #e0e0e0',
          background: '#fafafa',
          color: '#444',
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.5,
          boxSizing: 'border-box',
        }}
      />
      <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>
        Her satır bir {label} · Google Ads&apos;e satır satır yapıştırabilirsin
      </div>
    </div>
  )
}
