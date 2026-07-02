'use client'

// components/studyo/SeoDenetimi.jsx
// Site Analizi'nin "SEO" alt sekmesi — sayfanın HTML'i sunucudan çekilip
// title/description/og/canonical/robots, başlık hiyerarşisi ve teknik SEO denetlenir.
// URL üst bileşenden prop ile gelir.

import { useState } from 'react'

const STATUS_META = {
  ok: { color: 'var(--color-accent, #12b347)', icon: '✓' },
  warn: { color: 'var(--color-orange, #ff6b00)', icon: '!' },
  fail: { color: '#e5484d', icon: '✕' },
}

function StatusDot({ status }) {
  const m = STATUS_META[status] || STATUS_META.warn
  return (
    <span style={{
      flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: m.color,
      color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }}>
      {m.icon}
    </span>
  )
}

const card = { background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 14, padding: '1.25rem' }

export default function SeoDenetimi({ url, onResult }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const audit = async () => {
    if (!url.trim() || loading) return
    setLoading(true)
    setError('')
    setData(null)
    onResult?.(null)
    try {
      const res = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Denetim başarısız oldu')
      else { setData(json); onResult?.(json) }
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
            onClick={audit}
            disabled={loading}
            style={{
              padding: '10px 20px', fontSize: 14, fontFamily: 'inherit', border: 'none', borderRadius: 9,
              background: 'var(--color-accent, #12b347)', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontWeight: 500,
            }}
          >
            {loading ? 'Denetleniyor…' : 'SEO Denetle'}
          </button>
          <span style={{ fontSize: 12.5, color: '#999' }}>Meta etiketleri, sosyal kartlar, başlık hiyerarşisi ve teknik SEO</span>
        </div>
        {error && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 9, fontSize: 13,
            background: '#fdecea', color: '#c0392b', border: '0.5px solid #f5c6cb',
          }}>
            {error}
          </div>
        )}
      </div>

      {data && (
        <>
          {/* Özet */}
          <div style={{ ...card, marginBottom: '1.25rem', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {[['ok', 'Geçti'], ['warn', 'Uyarı'], ['fail', 'Sorun']].map(([k, lbl]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: STATUS_META[k].color }}>{data.summary[k]}</div>
                  <div style={{ fontSize: 11.5, color: '#888' }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '0.5px solid #eee', paddingLeft: 24, fontSize: 12.5, color: '#999', wordBreak: 'break-all' }}>
              {data.finalUrl}
            </div>
          </div>

          {/* Gruplar */}
          {data.groups.map((g) => (
            <div key={g.title} style={{ ...card, marginBottom: '1rem' }}>
              <h2 style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 12px' }}>{g.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {g.checks.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: i < g.checks.length - 1 ? '0.5px solid #f3f3f3' : 'none' }}>
                    <StatusDot status={c.status} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13.5, color: '#222', fontWeight: 500 }}>{c.label}</span>
                        <span style={{ fontSize: 12.5, color: '#777', wordBreak: 'break-all', textAlign: 'right' }}>{c.value}</span>
                      </div>
                      {c.hint && <div style={{ fontSize: 12, color: '#999', marginTop: 3 }}>{c.hint}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
