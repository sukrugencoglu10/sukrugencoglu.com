'use client'

// components/studyo/AiOneriler.jsx
// Site Analizi'nin "AI Öneriler" alt sekmesi — çalıştırılan analiz sonuçlarını
// (Hız / SEO / Kırık Linkler) Claude'a gönderip önceliklendirilmiş aksiyon planı üretir.

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const card = { background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 14, padding: '1.25rem' }

const SOURCE_LABELS = { hiz: '⚡ Hız', seo: '🔎 SEO Meta', linkler: '🔗 Kırık Linkler' }

export default function AiOneriler({ url, results }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [text, setText] = useState('')

  const available = Object.keys(SOURCE_LABELS).filter((k) => results?.[k])
  const hasAny = available.length > 0

  const generate = async () => {
    if (!hasAny || loading) return
    setLoading(true)
    setError('')
    setText('')
    try {
      const res = await fetch('/api/analiz-oneri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, results }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Öneri üretilemedi')
      else setText(json.text || '')
    } catch {
      setError('Bağlantı hatası')
    }
    setLoading(false)
  }

  return (
    <div>
      {/* Aksiyon çubuğu */}
      <div style={{ ...card, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={generate}
            disabled={loading || !hasAny}
            style={{
              padding: '10px 20px', fontSize: 14, fontFamily: 'inherit', border: 'none', borderRadius: 9,
              background: hasAny ? 'var(--color-accent, #12b347)' : '#ccc', color: '#fff',
              cursor: loading || !hasAny ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontWeight: 500,
            }}
          >
            {loading ? 'Üretiliyor…' : '🤖 Öneri Üret'}
          </button>
          <span style={{ fontSize: 12.5, color: '#999' }}>
            {hasAny
              ? `Dahil edilen analizler: ${available.map((k) => SOURCE_LABELS[k]).join(', ')}`
              : 'Önce Hız, SEO veya Kırık Linkler analizlerinden en az birini çalıştır.'}
          </span>
        </div>
        {loading && (
          <p style={{ fontSize: 12.5, color: '#999', margin: '12px 0 0' }}>
            Yapay zeka analiz sonuçlarını değerlendiriyor…
          </p>
        )}
        {error && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 9, fontSize: 13,
            background: '#fdecea', color: '#c0392b', border: '0.5px solid #f5c6cb',
          }}>
            {error}
          </div>
        )}
      </div>

      {text && (
        <div style={{ ...card, fontSize: 14, color: '#222', lineHeight: 1.6 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 8px', color: 'var(--color-ink, #111)' }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: 14.5, fontWeight: 600, margin: '14px 0 6px' }}>{children}</h3>,
              ul: ({ children }) => <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ margin: '0 0 12px', paddingLeft: 20 }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
              p: ({ children }) => <p style={{ margin: '0 0 10px' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
              code: ({ children }) => <code style={{ background: '#f4f4f4', padding: '1px 5px', borderRadius: 4, fontSize: 13 }}>{children}</code>,
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
