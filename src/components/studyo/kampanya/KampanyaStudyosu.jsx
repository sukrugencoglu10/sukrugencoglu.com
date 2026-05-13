'use client'

// Kampanya Stüdyosu — Google Ads kampanya kurulumunu AI ile destekleyen wizard
// Reusable content component — auth gate dışarıda halledilir.
// Aşama 1: Hedef · Aşama 2: Tür · Aşama 3: Kampanya Ayarları (alt-basamaklı)

import { useState } from 'react'
import {
  HEDEFLER,
  TURLER,
  TEKLIF_STRATEJILERI,
  ASAMA3_ALT_ADIMLAR,
} from '@/lib/kampanya/constants'
import {
  hedefAnalizPrompt,
  turAnalizPrompt,
  teklifAnalizPrompt,
} from '@/lib/kampanya/prompts'
import { callClaudeJson } from '@/lib/kampanya/api'
import Stepper from './Stepper'
import SektorInput from './SektorInput'
import OptionCard from './OptionCard'
import AdviceBadge from './AdviceBadge'

const ADIMLAR = [
  { no: 1, label: 'Hedef' },
  { no: 2, label: 'Tür' },
  { no: 3, label: 'Kampanya Ayarları' },
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

  // Aşama 3 — alt basamak ve seçimler
  const [asama3AltAdim, setAsama3AltAdim] = useState(1)
  const [teklifAnalizleri, setTeklifAnalizleri] = useState({})
  const [secilenTeklif, setSecilenTeklif] = useState(null)
  const [yeniMusteri, setYeniMusteri] = useState(false)
  const [teklifLoading, setTeklifLoading] = useState(false)
  const [teklifHata, setTeklifHata] = useState(null)

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

  const analizEtTeklifler = async (hedefId, turId) => {
    setTeklifLoading(true)
    setTeklifHata(null)
    setTeklifAnalizleri({})
    setSecilenTeklif(null)
    try {
      const sonuc = await callClaudeJson(
        teklifAnalizPrompt(sektor.trim(), hedefId, turId)
      )
      setTeklifAnalizleri(sonuc)
    } catch (e) {
      setTeklifHata(e.message || 'Analiz başarısız')
    }
    setTeklifLoading(false)
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
    setAsama3AltAdim(1)
    analizEtTeklifler(secilenHedef, secilenTur)
  }

  const teklifSecVeIlerle = () => {
    if (!secilenTeklif) return
    setAsama3AltAdim(2)
  }

  const geriDon = (adim) => setAktifAdim(adim)

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Kampanya Stüdyosu</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Google Ads kampanyanı sektörüne göre AI önerileriyle kur · Aşama {aktifAdim}/{ADIMLAR.length}
          {aktifAdim === 3 && ` · Adım ${asama3AltAdim}/${ASAMA3_ALT_ADIMLAR.length}`}
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

      {/* AŞAMA 1: HEDEF */}
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

      {/* AŞAMA 2: TÜR */}
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

      {/* AŞAMA 3: KAMPANYA AYARLARI (alt-basamaklı) */}
      {aktifAdim === 3 && (
        <section>
          {/* Sub-stepper */}
          <div style={{
            display: 'flex',
            gap: 4,
            marginBottom: '1.25rem',
            padding: '8px 12px',
            background: '#fafafa',
            border: '0.5px solid #eee',
            borderRadius: 10,
            overflowX: 'auto',
          }}>
            {ASAMA3_ALT_ADIMLAR.map((alt, i) => {
              const aktif = alt.no === asama3AltAdim
              const tamam = alt.no < asama3AltAdim
              return (
                <div key={alt.no} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={tamam ? () => setAsama3AltAdim(alt.no) : undefined}
                    disabled={!aktif && !tamam}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 14,
                      border: '0.5px solid',
                      borderColor: aktif ? '#111' : tamam ? '#1D9E75' : '#e0e0e0',
                      background: aktif ? '#111' : tamam ? '#E1F5EE' : 'transparent',
                      color: aktif ? '#fff' : tamam ? '#0F6E56' : '#aaa',
                      fontSize: 11,
                      fontFamily: 'inherit',
                      cursor: tamam ? 'pointer' : 'default',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{tamam ? '✓' : alt.no}</span>
                    {alt.label}
                  </button>
                  {i < ASAMA3_ALT_ADIMLAR.length - 1 && (
                    <span style={{ color: '#ccc', fontSize: 10, padding: '0 3px' }}>›</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sub-step 1: Teklif verme */}
          {asama3AltAdim === 1 && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Teklif verme</h2>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Hangi hedefe odaklanmak istiyorsunuz?{' '}
                  <span style={{ color: '#aaa' }}>
                    · Sektör: <strong>{sektor}</strong> · Tür:{' '}
                    <strong>{TURLER.find((t) => t.id === secilenTur)?.label}</strong>
                  </span>
                </p>
              </div>

              {teklifHata && <div style={hataKutusu}>{teklifHata}</div>}

              <div style={kartGrid}>
                {TEKLIF_STRATEJILERI.map((s) => (
                  <OptionCard
                    key={s.id}
                    option={s}
                    selected={secilenTeklif === s.id}
                    loading={teklifLoading}
                    analiz={teklifAnalizleri[s.id]}
                    onClick={() => setSecilenTeklif(s.id)}
                  />
                ))}
              </div>

              {/* Müşteri edinme bölümü */}
              <div style={{
                background: '#fff',
                border: '0.5px solid #e8e8e8',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: '1rem',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>
                    Müşteri edinme
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#444', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={yeniMusteri}
                      onChange={(e) => setYeniMusteri(e.target.checked)}
                      style={{ marginTop: 3 }}
                    />
                    <span>
                      Yalnızca yeni müşteriler için teklif ver
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                        Teklif stratejinizden bağımsız olarak yalnızca yeni müşterilere gösterilir
                      </div>
                    </span>
                  </label>
                </div>
                {teklifAnalizleri['yeni-musteri'] && (
                  <div style={{
                    flex: 1,
                    minWidth: 240,
                    fontSize: 12,
                    color: '#444',
                    background: '#fafafa',
                    border: '0.5px dashed #e0e0e0',
                    borderRadius: 8,
                    padding: '10px 12px',
                  }}>
                    <div style={{ marginBottom: 4 }}>
                      <AdviceBadge
                        uygunluk={teklifAnalizleri['yeni-musteri'].oneri === 'evet' ? 'cok-uygun' : 'onerilmez'}
                      />
                    </div>
                    <div style={{ lineHeight: 1.5 }}>{teklifAnalizleri['yeni-musteri'].gerekce}</div>
                  </div>
                )}
              </div>

              <div style={altBar}>
                <button onClick={() => setAktifAdim(2)} style={secondaryBtn}>← Geri</button>
                <span style={{ fontSize: 12, color: '#888' }}>
                  {secilenTeklif
                    ? `Seçili: ${TEKLIF_STRATEJILERI.find((s) => s.id === secilenTeklif)?.label}`
                    : 'Bir strateji seçin'}
                </span>
                <button
                  onClick={teklifSecVeIlerle}
                  disabled={!secilenTeklif}
                  style={primaryBtn(!secilenTeklif)}
                >
                  Sonraki →
                </button>
              </div>
            </div>
          )}

          {/* Sub-step 2 & 3 placeholders */}
          {asama3AltAdim >= 2 && (
            <div
              style={{
                background: '#fff',
                border: '0.5px dashed #d0d0d0',
                borderRadius: 14,
                padding: '3rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 500, color: '#111', marginBottom: 8 }}>
                Adım {asama3AltAdim} yakında
              </div>
              <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
                Bu ekran için içerik henüz tanımlanmadı — bir sonraki turda eklenecek.
              </p>
              <button
                onClick={() => setAsama3AltAdim(1)}
                style={{ ...secondaryBtn, marginTop: 16 }}
              >
                ← Teklif verme&apos;ye dön
              </button>
            </div>
          )}
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
  flexWrap: 'wrap',
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
