'use client'

// components/studyo/SiteAnalizi.jsx
// Site analiz platformu — tek bir URL girilir, alt sekmeler üzerinden farklı
// analizler çalıştırılır: Hız (PageSpeed), SEO Meta Denetimi, Kırık Linkler.

import { useState } from 'react'
import HizAnalizi from '@/components/studyo/HizAnalizi'
import SeoDenetimi from '@/components/studyo/SeoDenetimi'
import KirikLinkTarayici from '@/components/studyo/KirikLinkTarayici'
import AiOneriler from '@/components/studyo/AiOneriler'
import { openReport } from '@/components/studyo/siteAnaliziRapor'

const SUBS = [
  { id: 'hiz', label: '⚡ Hız', component: HizAnalizi },
  { id: 'seo', label: '🔎 SEO Meta', component: SeoDenetimi },
  { id: 'linkler', label: '🔗 Kırık Linkler', component: KirikLinkTarayici },
  { id: 'ai', label: '🤖 AI Öneriler', component: AiOneriler },
]

export default function SiteAnalizi() {
  const [url, setUrl] = useState('')
  const [active, setActive] = useState('hiz')
  const [results, setResults] = useState({ hiz: null, seo: null, linkler: null })
  const setResult = (id) => (data) => setResults((r) => ({ ...r, [id]: data }))

  const hasResults = !!(results.hiz || results.seo || results.linkler)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--color-ink, #111)' }}>
            ⚡ Site Analizi
          </h1>
          <p style={{ fontSize: 13.5, color: '#888', margin: '0 0 1.25rem' }}>
            Bir site adresi gir, hız · SEO · kırık link analizlerini tek yerden çalıştır.
          </p>
        </div>
        <button
          onClick={() => openReport(url, results)}
          disabled={!hasResults}
          title={hasResults ? 'Sonuçları PDF rapor olarak kaydet' : 'Önce bir analiz çalıştır'}
          style={{
            flexShrink: 0, padding: '9px 16px', fontSize: 13.5, fontFamily: 'inherit', borderRadius: 9,
            border: '0.5px solid #ddd', background: '#fff',
            color: hasResults ? 'var(--color-ink, #111)' : '#bbb',
            cursor: hasResults ? 'pointer' : 'not-allowed',
          }}
        >
          📄 Rapor (PDF)
        </button>
      </div>

      {/* Ortak URL girişi */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://ornek.com"
          style={{
            width: '100%', fontSize: 14, padding: '11px 14px', borderRadius: 10,
            border: '0.5px solid #ddd', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Alt sekmeler */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', borderBottom: '0.5px solid #eee' }}>
        {SUBS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              padding: '9px 16px', fontSize: 13.5, fontFamily: 'inherit', border: 'none',
              background: 'none', cursor: 'pointer',
              color: active === s.id ? 'var(--color-ink, #111)' : '#999',
              fontWeight: active === s.id ? 600 : 400,
              borderBottom: active === s.id ? '2px solid var(--color-accent, #12b347)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Paneller — hepsi mount'lu kalır, sekme değişiminde sonuçlar korunur */}
      {SUBS.map((s) => {
        const Comp = s.component
        return (
          <div key={s.id} style={{ display: active === s.id ? 'block' : 'none' }}>
            <Comp url={url} onResult={setResult(s.id)} results={results} />
          </div>
        )
      })}
    </div>
  )
}
