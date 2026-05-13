'use client'

// Kampanya Stüdyosu — Google Ads kampanya kurulumunu AI ile destekleyen wizard
// Reusable content component — auth gate dışarıda (page veya StudyoLayout içinde halledilir)
// Aşama 1: Hedef seçimi · Aşama 2: Kampanya türü seçimi · (Sonraki 6 aşama yakında)

import { useState } from 'react'
import { HEDEFLER, TURLER } from '@/lib/kampanya/constants'
import { hedefAnalizPrompt, turAnalizPrompt } from '@/lib/kampanya/prompts'
import { callClaudeJson } from '@/lib/kampanya/api'
import Stepper from './Stepper'
import SektorInput from './SektorInput'
import OptionCard from './OptionCard'

const ADIMLAR = [
  { no: 1, label: 'Hedef' },
  { no: 2, label: 'Tür' },
  { no: 3, label: 'Anahtar Kelimeler' },
  { no: 4, label: 'Bütçe' },
  { no: 5, label: 'Hedef Kitle' },
  { no: 6, label: 'Lokasyon' },
  { no: 7, label: 'Varlıklar' },
  { no: 8, label: 'Özet' },
]

export default function KampanyaStudyosu() {
  const [sektor, setSektor] = useState('')
  const [aktifAdim, setAktifAdim] = useState(1)
  const [tamamlanan, setTamamlanan] = useState([])

  // Aşama 1
  const [hedefAnalizleri, setHedefAnalizleri] = useState({})
  const [secilenHedef, setSecilenHedef] = useState(null)
  const [hedefLoading, setHedefLoading] = useState(false)
  const [hedefHata, setHedefHata] = useState(null)

  // Aşama 2
  const [turAnalizleri, setTurAnalizleri] = useState({})
  const [secilenTur, setSecilenTur] = useState(null)
  const [turLoading, setTurLoading] = useState(false)
  const [turHata, setTurHata] = useState(null)

  const analizEtHedefler = async () => {
    if (!sektor.trim()) return
    setHedefLoading(true)
    setHedefHata(null)
    setHedefAnalizleri({})
    setSecilenHedef(null)
    try {
      const sonuc = await callClaudeJson(hedefAnalizPrompt(sektor.trim()))
      sonuc['kilavuzsuz'] = {
        uygunluk: 'uygun',
        gerekce: 'Sonra karar vermek isteyenler için.',
      }
      setHedefAnalizleri(sonuc)
    } catch (e) {
      setHedefHata(e.message || 'Analiz başarısız')
    }
    setHedefLoading(false)
  }

  const analizEtTurler = async (hedefId) => {
    setTurLoading(true)
    setTurHata(null)
    setTurAnalizleri({})
    setSecilenTur(null)
    try {
      const sonuc = await callClaudeJson(turAnalizPrompt(sektor.trim(), hedefId))
      setTurAnalizleri(sonuc)
    } catch (e) {
      setTurHata(e.message || 'Analiz başarısız')
    }
    setTurLoading(false)
  }

  const hedefSecVeIlerle = () => {
    if (!secilenHedef) return
    setTamamlanan((t) => Array.from(new Set([...t, 1])))
    setAktifAdim(2)
    analizEtTurler(secilenHedef)
  }

  const turSecVeIlerle = () => {
    if (!secilenTur) return
    setTamamlanan((t) => Array.from(new Set([...t, 1, 2])))
    setAktifAdim(3)
  }

  const geriDon = (adim) => setAktifAdim(adim)

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Kampanya Stüdyosu</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Google Ads kampanyanı sektörüne göre AI önerileriyle kur · Aşama {aktifAdim}/{ADIMLAR.length}
        </p>
      </div>

      <Stepper adimlar={ADIMLAR} aktif={aktifAdim} tamamlanan={tamamlanan} onAdimTik={geriDon} />

      <SektorInput
        sektor={sektor}
        setSektor={setSektor}
        onAnaliz={analizEtHedefler}
        loading={hedefLoading}
        hasAnaliz={Object.keys(hedefAnalizleri).length > 0}
      />

      {aktifAdim === 1 && (
        <section>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Kampanya hedefiniz nedir?</h2>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              Deneyiminizi, kampanyanıza en uygun hedef ve ayarları olarak tasarlamak için bir hedef seçin
            </p>
          </div>

          {hedefHata && <div style={hataKutusu}>{hedefHata}</div>}

          {!sektor.trim() && Object.keys(hedefAnalizleri).length === 0 && (
            <div style={ipucuKutusu}>
              ↑ Önce sektörünüzü girin. AI her hedefin sizin için ne kadar uygun olduğunu değerlendirecek.
            </div>
          )}

          <div style={kartGrid}>
            {HEDEFLER.map((h) => (
              <OptionCard
                key={h.id}
                option={h}
                selected={secilenHedef === h.id}
                disabled={!sektor.trim() && Object.keys(hedefAnalizleri).length === 0}
                loading={hedefLoading}
                analiz={hedefAnalizleri[h.id]}
                onClick={() => setSecilenHedef(h.id)}
              />
            ))}
          </div>

          <div style={altBar}>
            <span style={{ fontSize: 12, color: '#888' }}>
              {secilenHedef
                ? `Seçili: ${HEDEFLER.find((h) => h.id === secilenHedef)?.label}`
                : 'Bir hedef seçin'}
            </span>
            <button onClick={hedefSecVeIlerle} disabled={!secilenHedef} style={primaryBtn(!secilenHedef)}>
              Devam →
            </button>
          </div>
        </section>
      )}

      {aktifAdim === 2 && (
        <section>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Bir kampanya türü seçin</h2>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              Seçilen hedef:{' '}
              <strong style={{ color: '#111' }}>
                {HEDEFLER.find((h) => h.id === secilenHedef)?.label}
              </strong>
            </p>
          </div>

          {turHata && <div style={hataKutusu}>{turHata}</div>}

          <div style={kartGrid}>
            {TURLER.map((t) => (
              <OptionCard
                key={t.id}
                option={t}
                selected={secilenTur === t.id}
                loading={turLoading}
                analiz={turAnalizleri[t.id]}
                onClick={() => setSecilenTur(t.id)}
              />
            ))}
          </div>

          <div style={altBar}>
            <button onClick={() => setAktifAdim(1)} style={secondaryBtn}>← Geri</button>
            <button onClick={turSecVeIlerle} disabled={!secilenTur} style={primaryBtn(!secilenTur)}>
              Devam →
            </button>
          </div>
        </section>
      )}

      {aktifAdim >= 3 && (
        <section
          style={{
            background: '#fff',
            border: '0.5px dashed #d0d0d0',
            borderRadius: 14,
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 500, color: '#111', marginBottom: 8 }}>
            Sonraki aşamalar yakında
          </div>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            Anahtar kelimeler · Bütçe · Hedef kitle · Lokasyon · Varlıklar · Özet
          </p>
          <button onClick={() => setAktifAdim(2)} style={{ ...secondaryBtn, marginTop: 16 }}>
            ← Tür seçimine dön
          </button>
        </section>
      )}
    </div>
  )
}

const kartGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 12,
  marginBottom: '1.25rem',
}

const altBar = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  paddingTop: '1rem',
  borderTop: '0.5px solid #eee',
}

const primaryBtn = (disabled) => ({
  padding: '9px 18px',
  background: disabled ? '#ddd' : '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 9,
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: disabled ? 'not-allowed' : 'pointer',
})

const secondaryBtn = {
  padding: '9px 14px',
  background: 'transparent',
  color: '#666',
  border: '0.5px solid #d0d0d0',
  borderRadius: 9,
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const hataKutusu = {
  padding: '10px 14px',
  background: '#FEF2F2',
  border: '0.5px solid #FCA5A5',
  borderRadius: 8,
  fontSize: 13,
  color: '#991B1B',
  marginBottom: 12,
}

const ipucuKutusu = {
  padding: '12px 16px',
  background: '#f7f7f5',
  border: '0.5px solid #e0e0e0',
  borderRadius: 10,
  fontSize: 13,
  color: '#666',
  marginBottom: 12,
}
