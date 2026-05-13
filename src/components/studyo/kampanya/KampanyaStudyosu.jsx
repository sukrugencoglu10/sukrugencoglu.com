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
  KAMPANYA_AYARI_BASLIKLARI,
  REKLAM_ALT_ADIMLAR,
  ANAHTAR_KELIME_MAX_KARAKTER,
  BASLIK_MAX_KARAKTER,
} from '@/lib/kampanya/constants'
import {
  hedefAnalizPrompt,
  turAnalizPrompt,
  teklifAnalizPrompt,
  ayarlarAnalizPrompt,
  anahtarKelimePrompt,
  baslikPrompt,
} from '@/lib/kampanya/prompts'
import { callClaudeJson } from '@/lib/kampanya/api'
import Stepper from './Stepper'
import SektorInput from './SektorInput'
import OptionCard from './OptionCard'
import AdviceBadge from './AdviceBadge'

const ADIMLAR = [
  { no: 1, label: 'Hedef' },
  { no: 2, label: 'Tür' },
  { no: 3, label: 'Detaylar' },
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

  // Aşama 3.2 — Kampanya Ayarları başlık önerileri
  const [ayarAnalizleri, setAyarAnalizleri] = useState({})
  const [ayarLoading, setAyarLoading] = useState(false)
  const [ayarHata, setAyarHata] = useState(null)

  // Aşama 3.4 — Reklam Oluştur (iç içe alt-adımlı)
  const [reklamAltAdim, setReklamAltAdim] = useState(1)
  const [anahtarKelimeler, setAnahtarKelimeler] = useState([])
  const [secilenKelimeler, setSecilenKelimeler] = useState(new Set())
  const [kelimeLoading, setKelimeLoading] = useState(false)
  const [kelimeHata, setKelimeHata] = useState(null)

  // 3.4.2 — Başlıklar
  const [basliklar, setBasliklar] = useState([])
  const [secilenBasliklar, setSecilenBasliklar] = useState(new Set())
  const [baslikLoading, setBaslikLoading] = useState(false)
  const [baslikHata, setBaslikHata] = useState(null)

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

  const analizEtAyarlar = async (hedefId, turId, teklifId) => {
    setAyarLoading(true)
    setAyarHata(null)
    setAyarAnalizleri({})
    try {
      const sonuc = await callClaudeJson(
        ayarlarAnalizPrompt(sektor.trim(), hedefId, turId, teklifId)
      )
      setAyarAnalizleri(sonuc)
    } catch (e) {
      setAyarHata(e.message || 'Analiz başarısız')
    }
    setAyarLoading(false)
  }

  const teklifSecVeIlerle = () => {
    if (!secilenTeklif) return
    setAsama3AltAdim(2)
    analizEtAyarlar(secilenHedef, secilenTur, secilenTeklif)
  }

  const ayarlarVeIlerle = () => {
    setAsama3AltAdim(3)
  }

  const analizEtKelimeler = async (hedefId, turId) => {
    setKelimeLoading(true)
    setKelimeHata(null)
    setAnahtarKelimeler([])
    setSecilenKelimeler(new Set())
    try {
      const sonuc = await callClaudeJson(
        anahtarKelimePrompt(sektor.trim(), hedefId, turId)
      )
      setAnahtarKelimeler(sonuc.kelimeler || [])
    } catch (e) {
      setKelimeHata(e.message || 'Analiz başarısız')
    }
    setKelimeLoading(false)
  }

  const toggleKelime = (kelime) => {
    setSecilenKelimeler((prev) => {
      const next = new Set(prev)
      if (next.has(kelime)) next.delete(kelime)
      else next.add(kelime)
      return next
    })
  }

  const analizEtBasliklar = async (hedefId, turId) => {
    setBaslikLoading(true)
    setBaslikHata(null)
    setBasliklar([])
    setSecilenBasliklar(new Set())
    try {
      const sonuc = await callClaudeJson(
        baslikPrompt(sektor.trim(), hedefId, turId)
      )
      setBasliklar(sonuc.basliklar || [])
    } catch (e) {
      setBaslikHata(e.message || 'Analiz başarısız')
    }
    setBaslikLoading(false)
  }

  const toggleBaslik = (baslik) => {
    setSecilenBasliklar((prev) => {
      const next = new Set(prev)
      if (next.has(baslik)) next.delete(baslik)
      else next.add(baslik)
      return next
    })
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

          {/* Sub-step 2: Kampanya Ayarları (başlıklar + AI önerileri) */}
          {asama3AltAdim === 2 && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Kampanya ayarları</h2>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Doğru kullanıcılara ulaşmak için başlangıç olarak kampanyanızın temel ayarlarını tanımlayın
                </p>
              </div>

              {ayarHata && <div style={hataKutusu}>{ayarHata}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.25rem' }}>
                {KAMPANYA_AYARI_BASLIKLARI.map((b) => {
                  const an = ayarAnalizleri[b.id]
                  return (
                    <div
                      key={b.id}
                      style={{
                        background: '#fff',
                        border: '0.5px solid #e8e8e8',
                        borderRadius: 12,
                        padding: '14px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{b.label}</div>
                        {ayarLoading && (
                          <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>
                            analiz ediliyor...
                          </span>
                        )}
                        {!ayarLoading && an?.oneri && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 500,
                              padding: '3px 10px',
                              borderRadius: 12,
                              background: '#E1F5EE',
                              border: '0.5px solid #1D9E75',
                              color: '#0F6E56',
                              whiteSpace: 'nowrap',
                              maxWidth: '60%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={an.oneri}
                          >
                            {an.oneri}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: an?.gerekce ? 8 : 0 }}>
                        {b.aciklama}
                      </div>
                      {an?.gerekce && (
                        <div
                          style={{
                            fontSize: 12,
                            color: '#444',
                            lineHeight: 1.5,
                            fontStyle: 'italic',
                            paddingTop: 8,
                            borderTop: '0.5px dashed #e0e0e0',
                          }}
                        >
                          {an.gerekce}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={altBar}>
                <button onClick={() => setAsama3AltAdim(1)} style={secondaryBtn}>← Teklif verme</button>
                <button onClick={ayarlarVeIlerle} style={primaryBtn(false)}>
                  Sonraki →
                </button>
              </div>
            </div>
          )}

          {/* Sub-step 3: AI Max (minimal — sadece başlık) */}
          {asama3AltAdim === 3 && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>AI Max</h2>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Yapay zeka destekli reklam optimizasyonu — içerik bir sonraki turda eklenecek.
                </p>
              </div>
              <div style={altBar}>
                <button onClick={() => setAsama3AltAdim(2)} style={secondaryBtn}>← Kampanya Ayarları</button>
                <button onClick={() => setAsama3AltAdim(4)} style={primaryBtn(false)}>Sonraki →</button>
              </div>
            </div>
          )}

          {/* Sub-step 4: Reklam Oluştur (iç içe alt-adımlı) */}
          {asama3AltAdim === 4 && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Reklam Oluştur</h2>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Reklam grubunu yapılandır · Adım {reklamAltAdim}/{REKLAM_ALT_ADIMLAR.length}
                </p>
              </div>

              {/* İç stepper */}
              <div style={{
                display: 'flex',
                gap: 4,
                marginBottom: '1rem',
                padding: '6px 10px',
                background: '#fff',
                border: '0.5px solid #eee',
                borderRadius: 10,
                overflowX: 'auto',
              }}>
                {REKLAM_ALT_ADIMLAR.map((alt, i) => {
                  const aktif = alt.no === reklamAltAdim
                  const tamam = alt.no < reklamAltAdim
                  return (
                    <div key={alt.no} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <button
                        onClick={tamam ? () => setReklamAltAdim(alt.no) : undefined}
                        disabled={!aktif && !tamam}
                        style={{
                          padding: '3px 9px',
                          borderRadius: 12,
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
                        {tamam ? '✓ ' : `${alt.no}.`} {alt.label}
                      </button>
                      {i < REKLAM_ALT_ADIMLAR.length - 1 && (
                        <span style={{ color: '#ccc', fontSize: 10, padding: '0 3px' }}>›</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* 3.4.1 Anahtar Kelimeler */}
              {reklamAltAdim === 1 && (
                <div>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0, color: '#111' }}>
                        Sektörle alakalı anahtar kelimeler
                      </h3>
                      <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                        Her kelimenin karakter sayısı gösterilir · Google Ads limiti: <strong>{ANAHTAR_KELIME_MAX_KARAKTER}</strong> karakter
                      </p>
                    </div>
                    <button
                      onClick={() => analizEtKelimeler(secilenHedef, secilenTur)}
                      disabled={kelimeLoading}
                      style={{
                        padding: '7px 14px',
                        background: kelimeLoading ? '#ddd' : '#111',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        cursor: kelimeLoading ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {kelimeLoading
                        ? 'Üretiliyor...'
                        : anahtarKelimeler.length > 0
                        ? 'Yeniden üret'
                        : 'Anahtar kelime üret'}
                    </button>
                  </div>

                  {kelimeHata && <div style={hataKutusu}>{kelimeHata}</div>}

                  {anahtarKelimeler.length === 0 && !kelimeLoading && (
                    <div style={ipucuKutusu}>
                      ↑ &quot;Anahtar kelime üret&quot; butonuna tıkla. AI sektörüne ({sektor || '—'}) göre 15 öneri çıkaracak — her birinin karakter sayısı 80 limitine göre renklendirilecek.
                    </div>
                  )}

                  {anahtarKelimeler.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                        {['islemsel', 'bilgilendirici', 'marka-yan'].map((kat) => {
                          const grup = anahtarKelimeler.filter((k) => k.kategori === kat)
                          if (grup.length === 0) return null
                          const baslik = {
                            'islemsel': 'İşlemsel (satın alma niyetli)',
                            'bilgilendirici': 'Bilgilendirici (araştırma niyetli)',
                            'marka-yan': 'Marka / yan ilgi alanları',
                          }[kat]
                          return (
                            <div key={kat} style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 6, textTransform: 'uppercase' }}>
                                {baslik}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {grup.map((k, i) => {
                                  const len = k.kelime.length
                                  const limitAsildi = len > ANAHTAR_KELIME_MAX_KARAKTER
                                  const yakin = len > ANAHTAR_KELIME_MAX_KARAKTER * 0.75
                                  const sayacRengi = limitAsildi
                                    ? { bg: '#FEE2E2', border: '#F87171', color: '#991B1B' }
                                    : yakin
                                    ? { bg: '#FEF3C7', border: '#F59E0B', color: '#92400E' }
                                    : { bg: '#E1F5EE', border: '#1D9E75', color: '#0F6E56' }
                                  const isSelected = secilenKelimeler.has(k.kelime)
                                  return (
                                    <button
                                      key={`${kat}-${i}`}
                                      onClick={() => toggleKelime(k.kelime)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 12px',
                                        background: isSelected ? '#111' : '#fff',
                                        color: isSelected ? '#fff' : '#111',
                                        border: '0.5px solid',
                                        borderColor: isSelected ? '#111' : '#e8e8e8',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: 13,
                                        textAlign: 'left',
                                        width: '100%',
                                      }}
                                    >
                                      <span style={{ flex: 1, fontWeight: 500 }}>{k.kelime}</span>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          fontWeight: 600,
                                          padding: '2px 7px',
                                          borderRadius: 10,
                                          background: isSelected ? '#fff' : sayacRengi.bg,
                                          border: `0.5px solid ${sayacRengi.border}`,
                                          color: isSelected ? sayacRengi.color : sayacRengi.color,
                                          whiteSpace: 'nowrap',
                                          fontFamily: 'monospace',
                                        }}
                                        title={limitAsildi ? 'Limit aşıldı!' : `${len}/${ANAHTAR_KELIME_MAX_KARAKTER} karakter`}
                                      >
                                        {len}/{ANAHTAR_KELIME_MAX_KARAKTER}
                                      </span>
                                      {k.neden && (
                                        <span style={{
                                          fontSize: 11,
                                          color: isSelected ? '#bbb' : '#888',
                                          fontStyle: 'italic',
                                          maxWidth: 240,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }} title={k.neden}>
                                          {k.neden}
                                        </span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div style={{ fontSize: 12, color: '#666', padding: '8px 12px', background: '#f7f7f5', borderRadius: 8, marginBottom: 12 }}>
                        Seçili: <strong>{secilenKelimeler.size}</strong> kelime · İstediğine tıklayıp seç/kaldır
                      </div>
                    </div>
                  )}

                  <div style={altBar}>
                    <button onClick={() => setAsama3AltAdim(3)} style={secondaryBtn}>← AI Max</button>
                    <button onClick={() => setReklamAltAdim(2)} style={primaryBtn(false)}>
                      Sonraki →
                    </button>
                  </div>
                </div>
              )}

              {/* 3.4.2 Başlıklar */}
              {reklamAltAdim === 2 && (
                <div>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0, color: '#111' }}>
                        Reklam başlıkları
                      </h3>
                      <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                        15 başlık önerisi · Google Ads başlık limiti: <strong>{BASLIK_MAX_KARAKTER}</strong> karakter
                      </p>
                    </div>
                    <button
                      onClick={() => analizEtBasliklar(secilenHedef, secilenTur)}
                      disabled={baslikLoading}
                      style={{
                        padding: '7px 14px',
                        background: baslikLoading ? '#ddd' : '#111',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        cursor: baslikLoading ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {baslikLoading
                        ? 'Üretiliyor...'
                        : basliklar.length > 0
                        ? 'Yeniden üret'
                        : 'Başlık üret'}
                    </button>
                  </div>

                  {baslikHata && <div style={hataKutusu}>{baslikHata}</div>}

                  {basliklar.length === 0 && !baslikLoading && (
                    <div style={ipucuKutusu}>
                      ↑ &quot;Başlık üret&quot; butonuna tıkla. AI sektörüne ({sektor || '—'}) göre 15 başlık çıkaracak — her birinin karakter sayısı 30 limitine göre renklendirilecek.
                    </div>
                  )}

                  {basliklar.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                        {['fayda', 'cta', 'guven'].map((st) => {
                          const grup = basliklar.filter((b) => b.stil === st)
                          if (grup.length === 0) return null
                          const baslik = {
                            'fayda': 'Fayda odaklı',
                            'cta': 'Eyleme çağıran (CTA)',
                            'guven': 'Güven & sosyal kanıt',
                          }[st]
                          return (
                            <div key={st} style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 6, textTransform: 'uppercase' }}>
                                {baslik}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {grup.map((b, i) => {
                                  const len = b.baslik.length
                                  const limitAsildi = len > BASLIK_MAX_KARAKTER
                                  const yakin = len > BASLIK_MAX_KARAKTER * 0.75
                                  const sayacRengi = limitAsildi
                                    ? { bg: '#FEE2E2', border: '#F87171', color: '#991B1B' }
                                    : yakin
                                    ? { bg: '#FEF3C7', border: '#F59E0B', color: '#92400E' }
                                    : { bg: '#E1F5EE', border: '#1D9E75', color: '#0F6E56' }
                                  const isSelected = secilenBasliklar.has(b.baslik)
                                  return (
                                    <button
                                      key={`${st}-${i}`}
                                      onClick={() => toggleBaslik(b.baslik)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 12px',
                                        background: isSelected ? '#111' : '#fff',
                                        color: isSelected ? '#fff' : '#111',
                                        border: '0.5px solid',
                                        borderColor: isSelected ? '#111' : '#e8e8e8',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: 13,
                                        textAlign: 'left',
                                        width: '100%',
                                      }}
                                    >
                                      <span style={{ flex: 1, fontWeight: 500 }}>{b.baslik}</span>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          fontWeight: 600,
                                          padding: '2px 7px',
                                          borderRadius: 10,
                                          background: isSelected ? '#fff' : sayacRengi.bg,
                                          border: `0.5px solid ${sayacRengi.border}`,
                                          color: sayacRengi.color,
                                          whiteSpace: 'nowrap',
                                          fontFamily: 'monospace',
                                        }}
                                        title={limitAsildi ? 'Limit aşıldı!' : `${len}/${BASLIK_MAX_KARAKTER} karakter`}
                                      >
                                        {len}/{BASLIK_MAX_KARAKTER}
                                      </span>
                                      {b.neden && (
                                        <span style={{
                                          fontSize: 11,
                                          color: isSelected ? '#bbb' : '#888',
                                          fontStyle: 'italic',
                                          maxWidth: 200,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }} title={b.neden}>
                                          {b.neden}
                                        </span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div style={{ fontSize: 12, color: '#666', padding: '8px 12px', background: '#f7f7f5', borderRadius: 8, marginBottom: 12 }}>
                        Seçili: <strong>{secilenBasliklar.size}</strong> başlık · Google Ads&apos;te en az 3, en fazla 15 başlık eklenir
                      </div>
                    </div>
                  )}

                  <div style={altBar}>
                    <button onClick={() => setReklamAltAdim(1)} style={secondaryBtn}>← Anahtar Kelimeler</button>
                    <button onClick={() => {}} disabled style={primaryBtn(true)} title="Sonraki ekran henüz tanımlanmadı">
                      Sonraki →
                    </button>
                  </div>
                </div>
              )}
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
