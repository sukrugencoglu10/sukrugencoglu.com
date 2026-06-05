'use client'

// components/studyo/KirikLinkTarayici.jsx
// Site Analizi'nin "Kırık Linkler" alt sekmesi — sayfadaki linkler taranıp
// kırık (4xx/5xx) ve erişilemeyen linkler raporlanır. URL üst bileşenden prop ile gelir.

import { useState } from 'react'

const STATE_META = {
  ok: { color: 'var(--color-accent, #12b347)', label: 'Sağlam' },
  broken: { color: '#e5484d', label: 'Kırık' },
  error: { color: 'var(--color-orange, #ff6b00)', label: 'Erişilemedi' },
}

const card = { background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 14, padding: '1.25rem' }

function LinkRow({ l }) {
  const m = STATE_META[l.state]
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0', borderBottom: '0.5px solid #f3f3f3' }}>
      <span style={{
        flexShrink: 0, minWidth: 52, textAlign: 'center', fontSize: 12, fontWeight: 700,
        color: '#fff', background: m.color, borderRadius: 6, padding: '3px 6px',
      }}>
        {l.status || '—'}
      </span>
      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: '#333', wordBreak: 'break-all' }}>
        {l.url}
      </span>
      <span style={{ flexShrink: 0, fontSize: 11, color: '#aaa' }}>
        {l.type === 'internal' ? 'iç' : 'dış'}{l.err ? ` · ${l.err}` : ''}
      </span>
    </div>
  )
}

export default function KirikLinkTarayici({ url, onResult }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [showOk, setShowOk] = useState(false)

  const scan = async () => {
    if (!url.trim() || loading) return
    setLoading(true)
    setError('')
    setData(null)
    setShowOk(false)
    onResult?.(null)
    try {
      const res = await fetch('/api/broken-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Tarama başarısız oldu')
      else { setData(json); onResult?.(json) }
    } catch {
      setError('Bağlantı hatası')
    }
    setLoading(false)
  }

  const problems = data ? data.links.filter((l) => l.state !== 'ok') : []
  const okLinks = data ? data.links.filter((l) => l.state === 'ok') : []

  return (
    <div>
      {/* Aksiyon çubuğu */}
      <div style={{ ...card, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={scan}
            disabled={loading}
            style={{
              padding: '10px 20px', fontSize: 14, fontFamily: 'inherit', border: 'none', borderRadius: 9,
              background: 'var(--color-accent, #12b347)', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontWeight: 500,
            }}
          >
            {loading ? 'Taranıyor…' : 'Linkleri Tara'}
          </button>
          <span style={{ fontSize: 12.5, color: '#999' }}>Sayfadaki bağlantılar kontrol edilir (en fazla 80 link)</span>
        </div>
        {loading && (
          <p style={{ fontSize: 12.5, color: '#999', margin: '12px 0 0' }}>
            Linkler taranıyor — sayfadaki link sayısına göre biraz sürebilir…
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
          {/* Özet */}
          <div style={{ ...card, marginBottom: '1.25rem', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {[['total', 'Toplam', '#444'], ['ok', 'Sağlam', STATE_META.ok.color], ['broken', 'Kırık', STATE_META.broken.color], ['error', 'Erişilemedi', STATE_META.error.color]].map(([k, lbl, col]) => (
              <div key={k} style={{ textAlign: 'center', minWidth: 64 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: col }}>{data.summary[k]}</div>
                <div style={{ fontSize: 11.5, color: '#888' }}>{lbl}</div>
              </div>
            ))}
            {data.summary.truncated && (
              <div style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>
                Sayfada {data.summary.foundOnPage} link bulundu; ilk 80 tanesi tarandı.
              </div>
            )}
          </div>

          {/* Sorunlu linkler */}
          <div style={{ ...card, marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 14.5, fontWeight: 600, margin: '0 0 12px' }}>
              Sorunlu Linkler {problems.length > 0 ? `(${problems.length})` : ''}
            </h2>
            {problems.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-accent, #12b347)', margin: 0 }}>
                ✓ Kırık veya erişilemeyen link bulunamadı.
              </p>
            ) : (
              <div>{problems.map((l, i) => <LinkRow key={i} l={l} />)}</div>
            )}
          </div>

          {/* Sağlam linkler (katlanır) */}
          {okLinks.length > 0 && (
            <div style={{ ...card }}>
              <button
                onClick={() => setShowOk((v) => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 600, padding: 0, color: '#222' }}
              >
                Sağlam Linkler ({okLinks.length}) {showOk ? '▾' : '▸'}
              </button>
              {showOk && <div style={{ marginTop: 12 }}>{okLinks.map((l, i) => <LinkRow key={i} l={l} />)}</div>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
