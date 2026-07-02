'use client'

// components/studyo/HizAnalizi.jsx
// Site Analizi'nin "Hız" alt sekmesi — Google PageSpeed Insights ile Lighthouse
// skorları + Core Web Vitals + iyileştirme fırsatları. URL üst bileşenden prop ile gelir.

import { useState } from 'react'

const SCORE_LABELS = {
  performance: 'Performans',
  seo: 'SEO',
  accessibility: 'Erişilebilirlik',
  'best-practices': 'En İyi Uygulamalar',
}
const SCORE_ORDER = ['performance', 'accessibility', 'best-practices', 'seo']

function scoreColor(s) {
  if (s == null) return '#999'
  if (s >= 90) return 'var(--color-accent, #12b347)'
  if (s >= 50) return 'var(--color-orange, #ff6b00)'
  return '#e5484d'
}

function auditColor(s) {
  if (s == null) return '#999'
  if (s >= 0.9) return 'var(--color-accent, #12b347)'
  if (s >= 0.5) return 'var(--color-orange, #ff6b00)'
  return '#e5484d'
}

function ScoreRing({ value, label }) {
  const color = scoreColor(value)
  const pct = value == null ? 0 : value
  const deg = (pct / 100) * 360
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 84, height: 84, borderRadius: '50%',
        background: `conic-gradient(${color} ${deg}deg, #eee ${deg}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 66, height: 66, borderRadius: '50%', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 600, color,
        }}>
          {value == null ? '—' : value}
        </div>
      </div>
      <span style={{ fontSize: 12.5, color: '#555', textAlign: 'center' }}>{label}</span>
    </div>
  )
}

const card = { background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 14, padding: '1.25rem' }

export default function HizAnalizi({ url, onResult }) {
  const [strategy, setStrategy] = useState('mobile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [openOpp, setOpenOpp] = useState(null)

  const analyze = async () => {
    if (!url.trim() || loading) return
    setLoading(true)
    setError('')
    setData(null)
    setOpenOpp(null)
    onResult?.(null)
    try {
      const res = await fetch('/api/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, strategy }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Analiz başarısız oldu')
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '0.5px solid #ddd', borderRadius: 9, overflow: 'hidden' }}>
            {[['mobile', '📱 Mobil'], ['desktop', '🖥️ Masaüstü']].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setStrategy(val)}
                style={{
                  padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', border: 'none', cursor: 'pointer',
                  background: strategy === val ? '#111' : '#fff',
                  color: strategy === val ? '#fff' : '#555',
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              padding: '10px 20px', fontSize: 14, fontFamily: 'inherit', border: 'none', borderRadius: 9,
              background: 'var(--color-accent, #12b347)', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontWeight: 500,
            }}
          >
            {loading ? 'Analiz ediliyor…' : 'Hızı Ölç'}
          </button>
          <span style={{ fontSize: 12.5, color: '#999' }}>Google PageSpeed Insights ile Lighthouse skorları</span>
        </div>
        {loading && (
          <p style={{ fontSize: 12.5, color: '#999', margin: '12px 0 0' }}>
            PageSpeed analizi 10–30 saniye sürebilir, lütfen bekle…
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

      {data && (
        <>
          {/* Skor kartları */}
          <div style={{ ...card, marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, flexWrap: 'wrap', gap: 6 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Lighthouse Skorları</h2>
              <span style={{ fontSize: 12, color: '#999', wordBreak: 'break-all' }}>
                {data.strategy === 'desktop' ? 'Masaüstü' : 'Mobil'} · {data.finalUrl}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {SCORE_ORDER.map((key) => (
                <ScoreRing key={key} value={data.scores?.[key]} label={SCORE_LABELS[key]} />
              ))}
            </div>
          </div>

          {/* Core Web Vitals */}
          {data.metrics?.length > 0 && (
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 14px' }}>Hız Metrikleri (Core Web Vitals)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                {data.metrics.map((m) => (
                  <div key={m.id} style={{ padding: '12px 14px', border: '0.5px solid #eee', borderRadius: 10 }}>
                    <div style={{ fontSize: 11.5, color: '#888', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: auditColor(m.score) }}>{m.displayValue}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İyileştirme fırsatları */}
          {data.opportunities?.length > 0 && (
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>İyileştirme Fırsatları</h2>
              <p style={{ fontSize: 12.5, color: '#999', margin: '0 0 14px' }}>
                Lighthouse'un önerileri — en çok kazanç sağlayan üstte.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.opportunities.map((o) => {
                  const open = openOpp === o.id
                  return (
                    <div key={o.id} style={{ border: '0.5px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenOpp(open ? null : o.id)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                          padding: '12px 14px', background: '#fff', border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit', textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 13.5, color: '#222' }}>{o.title}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          {o.displayValue && (
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-orange, #ff6b00)' }}>{o.displayValue}</span>
                          )}
                          <span style={{ fontSize: 12, color: '#bbb', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>▶</span>
                        </span>
                      </button>
                      {open && o.description && (
                        <div style={{ padding: '0 14px 12px', fontSize: 12.5, color: '#666', lineHeight: 1.55 }}>
                          {o.description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tanılama */}
          {data.diagnostics?.length > 0 && (
            <div style={{ ...card }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 14px' }}>Tanılama</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.diagnostics.map((d) => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '8px 0', borderBottom: '0.5px solid #f2f2f2' }}>
                    <span style={{ color: '#444' }}>{d.title}</span>
                    {d.displayValue && <span style={{ color: '#999', flexShrink: 0 }}>{d.displayValue}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
