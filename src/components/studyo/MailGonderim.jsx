'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { SEKTOR_ONERILERI } from '@/lib/kampanya/constants'

const ACCENT = '#1D9E75'
const DARK = '#0F6E56'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const VARSAYILAN_KONU = 'Merhaba {ad}, size özel bir teklifimiz var'
const VARSAYILAN_GOVDE = `<div style="font-family: Arial, sans-serif; max-width:560px; margin:0 auto; color:#222; line-height:1.5;">
  <h2 style="margin:0 0 10px; color:#0F6E56;">Merhaba {ad},</h2>
  <p style="margin:0 0 12px;">{firma} ekibi olarak {sektor} alanında size nasıl yardımcı olabileceğimizi konuşmak isteriz.</p>
  <p style="margin:0 0 12px;">
    <a href="https://sukrugencoglu.com" style="display:inline-block; background:#1D9E75; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none;">Detaylı bilgi</a>
  </p>
  <p style="margin:0; font-size:13px; color:#888;">Şükrü Gençoğlu · sukrugencoglu.com</p>
</div>`

// Görseli Supabase'e yükler, public URL döndürür (blog ile aynı endpoint)
async function gorselYukle(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/blog-image-upload', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Yükleme başarısız')
  return data.url
}
const IMG_HTML = (url) => `<img src="${url}" alt="" style="max-width:100%; height:auto; border-radius:8px;" />`

// Editör ve önizlemede satır aralığı / blok boşluklarını standart ve sıkı tutar
const MAIL_BODY_CSS = `
.mg-mail-body { line-height: 1.5; }
.mg-mail-body p { margin: 0 0 12px; }
.mg-mail-body h1, .mg-mail-body h2, .mg-mail-body h3 { margin: 0 0 10px; line-height: 1.3; }
.mg-mail-body ul, .mg-mail-body ol { margin: 0 0 12px; padding-left: 22px; }
.mg-mail-body li { margin: 0 0 4px; }
.mg-mail-body > *:last-child { margin-bottom: 0; }
`

// ── ortak stiller ──────────────────────────────────────────────
const card = {
  background: '#fff',
  border: '0.5px solid #e8e8e8',
  borderRadius: 14,
  padding: '1.25rem 1.5rem',
  marginBottom: '1.25rem',
}
const inputStyle = {
  width: '100%',
  fontSize: 14,
  padding: '9px 12px',
  borderRadius: 8,
  border: '0.5px solid #ddd',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}
const labelStyle = { fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }
const primaryBtn = (disabled) => ({
  padding: '9px 18px',
  background: disabled ? '#ddd' : '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 9,
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: disabled ? 'not-allowed' : 'pointer',
  whiteSpace: 'nowrap',
})
const ghostBtn = {
  padding: '7px 14px',
  background: 'transparent',
  color: '#666',
  border: '0.5px solid #ddd',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

export default function MailGonderim() {
  const [tab, setTab] = useState('gruplar')
  const [gruplar, setGruplar] = useState([])
  const [loading, setLoading] = useState(true)
  const [kaydetDurum, setKaydetDurum] = useState('') // '', 'kaydediliyor', 'kaydedildi', 'hata'

  // ── yükleme ──
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/studyo-mail-listeleri')
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setGruplar(data)
      } catch {
        /* sessiz */
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // ── kalıcı kaydet ──
  const kaydet = async (next) => {
    setGruplar(next)
    setKaydetDurum('kaydediliyor')
    try {
      const res = await fetch('/api/studyo-mail-listeleri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error()
      setKaydetDurum('kaydedildi')
      setTimeout(() => setKaydetDurum(''), 2000)
    } catch {
      setKaydetDurum('hata')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <style>{MAIL_BODY_CSS}</style>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>✉️ Mail Gönderim</h1>
        <p style={{ fontSize: 13, color: '#888', margin: '6px 0 0' }}>
          Sektör bazlı gruplar oluştur, her alıcıya kişiselleştirilmiş HTML mail gönder.
        </p>
      </div>

      {/* Sekmeler */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { id: 'gruplar', label: '👥 Gruplar & Kişiler' },
          { id: 'gonder', label: '📨 Şablon & Gönder' },
          { id: 'gecmis', label: '🕑 Geçmiş' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 9,
              border: tab === t.id ? `0.5px solid ${ACCENT}` : '0.5px solid #e0e0e0',
              background: tab === t.id ? '#E1F5EE' : '#fff',
              color: tab === t.id ? DARK : '#666',
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#aaa', fontStyle: 'italic' }}>Yükleniyor...</p>
      ) : (
        <>
          {tab === 'gruplar' && (
            <GruplarSekmesi gruplar={gruplar} kaydet={kaydet} kaydetDurum={kaydetDurum} />
          )}
          {tab === 'gonder' && <GonderSekmesi gruplar={gruplar} />}
          {tab === 'gecmis' && <GecmisSekmesi />}
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SEKME 1 — Gruplar & Kişiler
// ─────────────────────────────────────────────────────────────
function GruplarSekmesi({ gruplar, kaydet, kaydetDurum }) {
  const [seciliId, setSeciliId] = useState(gruplar[0]?.id || null)
  const [yeniAd, setYeniAd] = useState('')
  const [yeniSektor, setYeniSektor] = useState('')

  // tekil ekleme
  const [email, setEmail] = useState('')
  const [ad, setAd] = useState('')
  const [firma, setFirma] = useState('')
  // toplu yapıştır
  const [toplu, setToplu] = useState('')
  const [topluMesaj, setTopluMesaj] = useState('')

  const secili = gruplar.find((g) => g.id === seciliId) || null

  const grupEkle = () => {
    if (!yeniAd.trim()) return
    const yeni = { id: uid(), ad: yeniAd.trim(), sektor: yeniSektor.trim(), kisiler: [] }
    kaydet([...gruplar, yeni])
    setSeciliId(yeni.id)
    setYeniAd('')
    setYeniSektor('')
  }

  const grupSil = (id) => {
    if (!confirm('Bu grup ve içindeki tüm kişiler silinsin mi?')) return
    const next = gruplar.filter((g) => g.id !== id)
    kaydet(next)
    if (seciliId === id) setSeciliId(next[0]?.id || null)
  }

  const grupGuncelle = (id, patch) =>
    kaydet(gruplar.map((g) => (g.id === id ? { ...g, ...patch } : g)))

  const kisilerGuncelle = (kisiler) => grupGuncelle(secili.id, { kisiler })

  const kisiEkle = () => {
    const e = email.trim().toLowerCase()
    if (!emailRegex.test(e)) return
    if (secili.kisiler.some((k) => k.email.toLowerCase() === e)) {
      setEmail('')
      return
    }
    kisilerGuncelle([
      ...secili.kisiler,
      { id: uid(), email: e, ad: ad.trim(), firma: firma.trim(), sektor: secili.sektor || '', eklenmeTarihi: new Date().toISOString() },
    ])
    setEmail('')
    setAd('')
    setFirma('')
  }

  const kisiSil = (id) => kisilerGuncelle(secili.kisiler.filter((k) => k.id !== id))

  // Toplu yapıştır — "email, Ad, Firma" veya sadece "email" satırları (virgül/; ayrımlı)
  const topluEkle = () => {
    const satirlar = toplu.split(/[\n;]+/).map((s) => s.trim()).filter(Boolean)
    let eklenen = 0
    let gecersiz = 0
    let tekrar = 0
    const mevcutSet = new Set(secili.kisiler.map((k) => k.email.toLowerCase()))
    const yeniler = []
    for (const satir of satirlar) {
      const parcalar = satir.split(',').map((p) => p.trim())
      const e = (parcalar[0] || '').toLowerCase()
      if (!emailRegex.test(e)) { gecersiz++; continue }
      if (mevcutSet.has(e)) { tekrar++; continue }
      mevcutSet.add(e)
      yeniler.push({
        id: uid(),
        email: e,
        ad: parcalar[1] || '',
        firma: parcalar[2] || '',
        sektor: secili.sektor || '',
        eklenmeTarihi: new Date().toISOString(),
      })
      eklenen++
    }
    if (yeniler.length) kisilerGuncelle([...secili.kisiler, ...yeniler])
    setToplu('')
    setTopluMesaj(`${eklenen} eklendi${tekrar ? `, ${tekrar} tekrar atlandı` : ''}${gecersiz ? `, ${gecersiz} geçersiz` : ''}.`)
    setTimeout(() => setTopluMesaj(''), 5000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem', alignItems: 'start' }}>
      {/* Sol — grup listesi */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Gruplar</span>
          <KaydetRozeti durum={kaydetDurum} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {gruplar.length === 0 && (
            <p style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', margin: 0 }}>Henüz grup yok.</p>
          )}
          {gruplar.map((g) => (
            <div
              key={g.id}
              onClick={() => setSeciliId(g.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 10px',
                borderRadius: 8,
                cursor: 'pointer',
                background: seciliId === g.id ? '#E1F5EE' : '#f7f7f5',
                border: seciliId === g.id ? `0.5px solid ${ACCENT}` : '0.5px solid transparent',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.ad}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{g.kisiler.length} kişi{g.sektor ? ` · ${g.sektor}` : ''}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); grupSil(g.id) }} style={{ ...ghostBtn, padding: '2px 7px', border: 'none', color: '#c0392b' }} title="Sil">✕</button>
            </div>
          ))}
        </div>

        {/* Yeni grup */}
        <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}>
          <label style={labelStyle}>Yeni grup adı</label>
          <input value={yeniAd} onChange={(e) => setYeniAd(e.target.value)} placeholder="ör. Diş Klinikleri" style={{ ...inputStyle, marginBottom: 8 }} />
          <label style={labelStyle}>Sektör</label>
          <input value={yeniSektor} onChange={(e) => setYeniSektor(e.target.value)} placeholder="ör. Sağlık" style={{ ...inputStyle, marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {SEKTOR_ONERILERI.map((s) => (
              <button key={s} onClick={() => setYeniSektor(s)} style={{ padding: '3px 9px', borderRadius: 12, border: '0.5px solid #e0e0e0', background: yeniSektor === s ? '#f0f0ee' : 'transparent', color: '#666', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
            ))}
          </div>
          <button onClick={grupEkle} disabled={!yeniAd.trim()} style={{ ...primaryBtn(!yeniAd.trim()), width: '100%' }}>+ Grup oluştur</button>
        </div>
      </div>

      {/* Sağ — seçili grubun kişileri */}
      <div>
        {!secili ? (
          <div style={card}>
            <p style={{ color: '#aaa', fontStyle: 'italic', margin: 0 }}>Soldan bir grup seç veya yeni grup oluştur.</p>
          </div>
        ) : (
          <>
            <div style={card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{secili.ad}</h3>
              <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px' }}>{secili.kisiler.length} kişi{secili.sektor ? ` · ${secili.sektor} sektörü` : ''}</p>

              {/* Tekil ekleme */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-posta *" style={{ ...inputStyle, flex: 2, minWidth: 180 }} onKeyDown={(e) => e.key === 'Enter' && kisiEkle()} />
                <input value={ad} onChange={(e) => setAd(e.target.value)} placeholder="ad" style={{ ...inputStyle, flex: 1, minWidth: 110 }} onKeyDown={(e) => e.key === 'Enter' && kisiEkle()} />
                <input value={firma} onChange={(e) => setFirma(e.target.value)} placeholder="firma" style={{ ...inputStyle, flex: 1, minWidth: 110 }} onKeyDown={(e) => e.key === 'Enter' && kisiEkle()} />
                <button onClick={kisiEkle} disabled={!emailRegex.test(email.trim())} style={primaryBtn(!emailRegex.test(email.trim()))}>+ Ekle</button>
              </div>
            </div>

            {/* Toplu yapıştır */}
            <div style={card}>
              <label style={labelStyle}>Toplu ekle — her satıra bir kayıt: <code style={{ color: DARK }}>email, ad, firma</code> (ad/firma opsiyonel)</label>
              <textarea
                value={toplu}
                onChange={(e) => setToplu(e.target.value)}
                rows={5}
                placeholder={'ornek@firma.com, Ali Veli, Firma A\nbilgi@xyz.com\ninfo@abc.com, , Firma C'}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 90, lineHeight: 1.6, marginBottom: 8 }}
              />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={topluEkle} disabled={!toplu.trim()} style={primaryBtn(!toplu.trim())}>Listeyi içe aktar</button>
                {topluMesaj && <span style={{ fontSize: 12, color: DARK }}>{topluMesaj}</span>}
              </div>
            </div>

            {/* Kişi listesi */}
            <div style={card}>
              {secili.kisiler.length === 0 ? (
                <p style={{ color: '#aaa', fontStyle: 'italic', margin: 0 }}>Bu grupta henüz kişi yok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {secili.kisiler.map((k) => (
                    <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 7, background: '#f7f7f5' }}>
                      <div style={{ overflow: 'hidden' }}>
                        <span style={{ fontSize: 13, color: '#111', fontWeight: 600 }}>{k.email}</span>
                        {(k.ad || k.firma) && (
                          <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>
                            {[k.ad, k.firma].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </div>
                      <button onClick={() => kisiSil(k.id)} style={{ ...ghostBtn, padding: '2px 8px', border: 'none', color: '#c0392b' }} title="Sil">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SEKME 2 — Şablon & Gönder
// ─────────────────────────────────────────────────────────────
function GonderSekmesi({ gruplar }) {
  const [seciliGrupIds, setSeciliGrupIds] = useState([])
  const [from, setFrom] = useState('')
  const [konu, setKonu] = useState(VARSAYILAN_KONU)
  const [govde, setGovde] = useState(VARSAYILAN_GOVDE)
  const [gonderiliyor, setGonderiliyor] = useState(false)
  const [sonuc, setSonuc] = useState(null)
  const [hata, setHata] = useState('')

  const [gorunum, setGorunum] = useState('editor') // 'editor' | 'html'

  // HTML kaynağı modu için resim ekleme / yapıştırma
  const govdeRef = useRef(null)
  const dosyaRef = useRef(null)
  const [resimYukleniyor, setResimYukleniyor] = useState(false)
  const [resimHata, setResimHata] = useState('')

  // İmlecin bulunduğu yere metin ekler (textarea'nın canlı değerinden okur)
  const metneEkle = (snippet) => {
    const el = govdeRef.current
    if (!el) { setGovde((g) => g + snippet); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const cur = el.value
    setGovde(cur.slice(0, start) + snippet + cur.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }

  const resimYukle = async (file) => {
    if (!file) return
    if (!file.type || !file.type.startsWith('image/')) { setResimHata('Sadece görsel dosyası eklenebilir.'); return }
    setResimYukleniyor(true)
    setResimHata('')
    try {
      metneEkle('\n' + IMG_HTML(await gorselYukle(file)) + '\n')
    } catch (err) {
      setResimHata(err.message)
    } finally {
      setResimYukleniyor(false)
    }
  }

  // Panodan resim yapıştırma — görsel varsa yükle, yoksa normal metin yapıştırması devam eder
  const govdeYapistir = (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const it of items) {
      if (it.type && it.type.startsWith('image/')) {
        const file = it.getAsFile()
        if (file) {
          e.preventDefault()
          resimYukle(file)
          return
        }
      }
    }
  }

  const alicilar = useMemo(() => {
    const set = new Map()
    for (const g of gruplar) {
      if (!seciliGrupIds.includes(g.id)) continue
      for (const k of g.kisiler) {
        if (!set.has(k.email.toLowerCase())) {
          set.set(k.email.toLowerCase(), { email: k.email, ad: k.ad, firma: k.firma, sektor: k.sektor || g.sektor || '' })
        }
      }
    }
    return [...set.values()]
  }, [gruplar, seciliGrupIds])

  const onizlemeAlici = alicilar[0] || { ad: 'Ahmet Yılmaz', firma: 'Örnek Firma', sektor: 'Sağlık', email: 'ornek@firma.com' }
  const doldur = (t) => (t || '')
    .replace(/\{ad\}/g, onizlemeAlici.ad || '')
    .replace(/\{firma\}/g, onizlemeAlici.firma || '')
    .replace(/\{sektor\}/g, onizlemeAlici.sektor || '')
    .replace(/\{email\}/g, onizlemeAlici.email || '')

  const toggleGrup = (id) =>
    setSeciliGrupIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const gonder = async () => {
    if (alicilar.length === 0 || !konu.trim() || !govde.trim()) return
    if (!confirm(`${alicilar.length} alıcıya mail gönderilecek. Onaylıyor musun?`)) return
    setGonderiliyor(true)
    setSonuc(null)
    setHata('')
    try {
      const res = await fetch('/api/studyo-mail-gonder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from.trim() || undefined, konu, htmlGovde: govde, alicilar }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gönderim başarısız')
      setSonuc(data)
      // Geçmişe yaz
      const grupAdlari = gruplar.filter((g) => seciliGrupIds.includes(g.id)).map((g) => g.ad).join(', ')
      fetch('/api/studyo-mail-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uid(),
          tarih: new Date().toISOString(),
          grupAd: grupAdlari,
          konu,
          toplam: data.toplam,
          basarili: data.basarili,
          basarisiz: data.basarisiz,
          sonuclar: data.sonuclar,
        }),
      }).catch(() => {})
    } catch (err) {
      setHata(err.message)
    } finally {
      setGonderiliyor(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
      {/* Sol — kompozisyon */}
      <div>
        <div style={card}>
          <label style={labelStyle}>Hedef gruplar</label>
          {gruplar.length === 0 ? (
            <p style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', margin: 0 }}>Önce "Gruplar & Kişiler" sekmesinde grup oluştur.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {gruplar.map((g) => (
                <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#111', cursor: 'pointer' }}>
                  <input type="checkbox" checked={seciliGrupIds.includes(g.id)} onChange={() => toggleGrup(g.id)} />
                  {g.ad} <span style={{ color: '#888', fontSize: 12 }}>({g.kisiler.length} kişi)</span>
                </label>
              ))}
            </div>
          )}
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: alicilar.length ? DARK : '#aaa' }}>
            Toplam {alicilar.length} benzersiz alıcı
            {alicilar.length > 90 && <span style={{ color: '#92400E', fontWeight: 500 }}> · ⚠️ Resend ücretsiz limiti ~100/gün</span>}
          </div>
        </div>

        <div style={card}>
          <label style={labelStyle}>Gönderici (boş bırakılırsa varsayılan)</label>
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Şükrü Gençoğlu <bilgi@sukrugencoglu.com>" style={{ ...inputStyle, marginBottom: 12 }} />

          <label style={labelStyle}>Konu</label>
          <input value={konu} onChange={(e) => setKonu(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Mail içeriği</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => setGorunum('editor')} style={{ ...ghostBtn, padding: '5px 11px', background: gorunum === 'editor' ? '#E1F5EE' : 'transparent', color: gorunum === 'editor' ? DARK : '#666', borderColor: gorunum === 'editor' ? ACCENT : '#ddd' }}>✏️ Görsel</button>
              <button type="button" onClick={() => setGorunum('html')} style={{ ...ghostBtn, padding: '5px 11px', fontFamily: 'ui-monospace, monospace', background: gorunum === 'html' ? '#E1F5EE' : 'transparent', color: gorunum === 'html' ? DARK : '#666', borderColor: gorunum === 'html' ? ACCENT : '#ddd' }}>{'</>'} HTML</button>
            </div>
          </div>

          {gorunum === 'editor' ? (
            <RichEditor value={govde} onChange={setGovde} />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {resimHata && <span style={{ fontSize: 11, color: '#c0392b' }}>{resimHata}</span>}
                <button
                  type="button"
                  onClick={() => dosyaRef.current?.click()}
                  disabled={resimYukleniyor}
                  style={{ ...ghostBtn, padding: '5px 11px', color: resimYukleniyor ? '#aaa' : DARK, borderColor: resimYukleniyor ? '#eee' : ACCENT, cursor: resimYukleniyor ? 'not-allowed' : 'pointer' }}
                >
                  {resimYukleniyor ? 'Yükleniyor...' : '🖼 Resim ekle'}
                </button>
                <input
                  ref={dosyaRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => { resimYukle(e.target.files?.[0]); e.target.value = '' }}
                  style={{ display: 'none' }}
                />
              </div>
              <textarea ref={govdeRef} value={govde} onChange={(e) => setGovde(e.target.value)} onPaste={govdeYapistir} rows={12} style={{ ...inputStyle, resize: 'vertical', minHeight: 200, fontFamily: 'ui-monospace, monospace', fontSize: 12.5, lineHeight: 1.6 }} />
            </>
          )}

          <p style={{ fontSize: 11.5, color: '#888', margin: '8px 0 0' }}>
            Kişiselleştirme: <code style={{ color: DARK }}>{'{ad}'}</code> <code style={{ color: DARK }}>{'{firma}'}</code> <code style={{ color: DARK }}>{'{sektor}'}</code> <code style={{ color: DARK }}>{'{email}'}</code>
            <br />🖼 Resim: araç çubuğundan ekle veya doğrudan <strong>Ctrl+V</strong> ile yapıştır.
          </p>
        </div>

        <button onClick={gonder} disabled={gonderiliyor || alicilar.length === 0 || !konu.trim() || !govde.trim()} style={{ ...primaryBtn(gonderiliyor || alicilar.length === 0 || !konu.trim() || !govde.trim()), width: '100%', padding: '12px', fontSize: 14 }}>
          {gonderiliyor ? 'Gönderiliyor...' : `📨 ${alicilar.length} alıcıya gönder`}
        </button>

        {hata && (
          <div style={{ ...card, marginTop: 12, background: '#FEF2F2', border: '0.5px solid #FCA5A5', color: '#991B1B', fontSize: 13 }}>
            <strong>Hata:</strong> {hata}
          </div>
        )}

        {sonuc && (
          <div style={{ ...card, marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              <span style={{ color: DARK }}>✓ {sonuc.basarili} başarılı</span>
              {sonuc.basarisiz > 0 && <span style={{ color: '#c0392b', marginLeft: 12 }}>✕ {sonuc.basarisiz} başarısız</span>}
            </div>
            {sonuc.sonuclar.filter((s) => !s.ok).length > 0 && (
              <div style={{ fontSize: 12, color: '#888', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {sonuc.sonuclar.filter((s) => !s.ok).map((s, i) => (
                  <div key={i}><strong style={{ color: '#c0392b' }}>{s.email}</strong> — {s.hata}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sağ — önizleme */}
      <div style={card}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>
          Önizleme {alicilar.length > 0 ? `(${onizlemeAlici.email})` : '(örnek veri)'}
        </div>
        <div style={{ borderBottom: '0.5px solid #eee', paddingBottom: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#aaa' }}>Konu</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{doldur(konu)}</div>
        </div>
        <div className="mg-mail-body" style={{ border: '0.5px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fff', overflow: 'auto', maxHeight: 480 }} dangerouslySetInnerHTML={{ __html: doldur(govde) }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SEKME 3 — Geçmiş
// ─────────────────────────────────────────────────────────────
function GecmisSekmesi() {
  const [kayitlar, setKayitlar] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/studyo-mail-log')
        const data = await res.json()
        setKayitlar(res.ok && Array.isArray(data) ? data : [])
      } catch {
        setKayitlar([])
      }
    })()
  }, [])

  if (kayitlar === null) return <p style={{ color: '#aaa', fontStyle: 'italic' }}>Yükleniyor...</p>
  if (kayitlar.length === 0) return <div style={card}><p style={{ color: '#aaa', fontStyle: 'italic', margin: 0 }}>Henüz gönderim yapılmadı.</p></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {kayitlar.map((k) => (
        <div key={k.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{k.konu}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{k.grupAd || '—'} · {new Date(k.tarih).toLocaleString('tr-TR')}</div>
            </div>
            <div style={{ fontSize: 12, whiteSpace: 'nowrap', textAlign: 'right' }}>
              <span style={{ color: DARK, fontWeight: 600 }}>✓ {k.basarili}</span>
              {k.basarisiz > 0 && <span style={{ color: '#c0392b', fontWeight: 600, marginLeft: 8 }}>✕ {k.basarisiz}</span>}
              <div style={{ color: '#aaa' }}>{k.toplam} toplam</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Gmail benzeri zengin metin (WYSIWYG) editörü — contentEditable + execCommand
// ─────────────────────────────────────────────────────────────
function RichEditor({ value, onChange }) {
  const ref = useRef(null)
  const dosyaRef = useRef(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  // Dışarıdan gelen değeri yalnızca editör içeriğinden farklıysa uygula (imleç sıçramasını önler)
  useEffect(() => {
    const el = ref.current
    if (el && value !== el.innerHTML) el.innerHTML = value || ''
  }, [value])

  const emit = () => { if (ref.current) onChange(ref.current.innerHTML) }
  const komut = (cmd, arg) => { ref.current?.focus(); document.execCommand(cmd, false, arg); emit() }
  const ekleHTML = (html) => { ref.current?.focus(); document.execCommand('insertHTML', false, html); emit() }

  // Seçimi sakla (araç çubuğuyla etkileşimde editör odağı kaybolduğunda geri yüklemek için)
  const savedRange = useRef(null)
  const selKaydet = () => {
    const s = window.getSelection()
    if (s && s.rangeCount && ref.current && ref.current.contains(s.anchorNode)) {
      savedRange.current = s.getRangeAt(0).cloneRange()
    }
  }
  // Editör içindeki her seçim değişikliğini sakla — renk/boyut uygularken güvenilir geri yükleme
  useEffect(() => {
    document.addEventListener('selectionchange', selKaydet)
    return () => document.removeEventListener('selectionchange', selKaydet)
  }, [])
  // Seçili metne piksel cinsinden yazı boyutu uygular (execCommand + <font> → <span> dönüşümü)
  const boyutUygula = (px) => {
    if (!px) return
    ref.current?.focus()
    const s = window.getSelection()
    if (savedRange.current) { s.removeAllRanges(); s.addRange(savedRange.current) }
    if (s.isCollapsed) return // seçim yoksa uygulanmaz
    document.execCommand('fontSize', false, '7')
    ref.current.querySelectorAll('font[size="7"]').forEach((f) => {
      const span = document.createElement('span')
      span.style.fontSize = px + 'px'
      span.innerHTML = f.innerHTML
      f.replaceWith(span)
    })
    emit()
  }
  // Seçili metne renk uygular — seçimi geri yükler, inline style üretir (mail-uyumlu)
  const renkUygula = (color) => {
    ref.current?.focus()
    const s = window.getSelection()
    if (savedRange.current) { s.removeAllRanges(); s.addRange(savedRange.current) }
    document.execCommand('styleWithCSS', false, true)
    document.execCommand('foreColor', false, color)
    document.execCommand('styleWithCSS', false, false)
    emit()
  }

  const linkEkle = () => {
    const url = prompt('Bağlantı adresi (https://...)')
    if (!url) return
    const sel = window.getSelection()
    if (sel && !sel.isCollapsed) komut('createLink', url)
    else ekleHTML(`<a href="${url}">${url}</a>`)
  }

  const gorsel = async (file) => {
    if (!file) return
    if (!file.type || !file.type.startsWith('image/')) { setHata('Sadece görsel'); return }
    setYukleniyor(true); setHata('')
    try { ekleHTML(IMG_HTML(await gorselYukle(file))) }
    catch (e) { setHata(e.message) }
    finally { setYukleniyor(false) }
  }

  const yapistir = (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const it of items) {
      if (it.type && it.type.startsWith('image/')) {
        const f = it.getAsFile()
        if (f) { e.preventDefault(); gorsel(f); return }
      }
    }
  }

  const TBtn = ({ onClick, title, children, mono }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{ minWidth: 30, height: 30, padding: '0 8px', border: '0.5px solid #e0e0e0', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: mono ? 'ui-monospace, monospace' : 'inherit', color: '#333' }}
    >
      {children}
    </button>
  )
  const ayrac = <span style={{ width: 1, height: 18, background: '#e0e0e0', margin: '0 2px' }} />

  return (
    <div style={{ border: '0.5px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 6, borderBottom: '0.5px solid #eee', background: '#fafafa', alignItems: 'center' }}>
        <TBtn title="Kalın" onClick={() => komut('bold')}><b>B</b></TBtn>
        <TBtn title="İtalik" onClick={() => komut('italic')}><i>I</i></TBtn>
        <TBtn title="Altı çizili" onClick={() => komut('underline')}><u>U</u></TBtn>
        {ayrac}
        <select
          title="Yazı boyutu (önce metni seç)"
          value=""
          onMouseDown={selKaydet}
          onChange={(e) => { boyutUygula(e.target.value); e.target.value = '' }}
          style={{ height: 30, border: '0.5px solid #e0e0e0', borderRadius: 6, background: '#fff', fontSize: 12, color: '#333', cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit' }}
        >
          <option value="" disabled>Boyut</option>
          <option value="12">Küçük</option>
          <option value="14">Normal</option>
          <option value="16">Orta</option>
          <option value="20">Büyük</option>
          <option value="26">Çok büyük</option>
        </select>
        {ayrac}
        <TBtn title="Başlık" onClick={() => komut('formatBlock', 'H3')}>H</TBtn>
        <TBtn title="Madde işaretli liste" onClick={() => komut('insertUnorderedList')}>•</TBtn>
        <TBtn title="Numaralı liste" onClick={() => komut('insertOrderedList')} mono>1.</TBtn>
        {ayrac}
        <label title="Yazı rengi (önce metni seç)" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height: 30, padding: '0 6px', border: '0.5px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', background: '#fff' }}>
          <span style={{ fontSize: 12, color: '#333' }}>A</span>
          <input type="color" onMouseDown={selKaydet} onChange={(e) => renkUygula(e.target.value)} style={{ width: 18, height: 18, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }} />
        </label>
        <TBtn title="Bağlantı ekle" onClick={linkEkle}>🔗</TBtn>
        <TBtn title="Resim ekle" onClick={() => dosyaRef.current?.click()}>{yukleniyor ? '⏳' : '🖼'}</TBtn>
        <TBtn title="Biçimi temizle" onClick={() => komut('removeFormat')}>⌫</TBtn>
        {ayrac}
        {['{ad}', '{firma}', '{sektor}', '{email}'].map((t) => (
          <TBtn key={t} mono title={'Ekle: ' + t} onClick={() => ekleHTML(t)}>{t}</TBtn>
        ))}
        {hata && <span style={{ fontSize: 11, color: '#c0392b', marginLeft: 6 }}>{hata}</span>}
        <input ref={dosyaRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { gorsel(e.target.files?.[0]); e.target.value = '' }} style={{ display: 'none' }} />
      </div>
      <div
        ref={ref}
        className="mg-mail-body"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={yapistir}
        onKeyUp={selKaydet}
        onMouseUp={selKaydet}
        style={{ minHeight: 260, maxHeight: 480, overflow: 'auto', padding: '14px 16px', fontSize: 14, lineHeight: 1.5, color: '#222', outline: 'none', fontFamily: 'Arial, sans-serif', background: '#fff' }}
      />
    </div>
  )
}

// ── küçük yardımcı ──
function KaydetRozeti({ durum }) {
  if (!durum) return null
  const map = {
    kaydediliyor: { t: 'Kaydediliyor...', c: '#888' },
    kaydedildi: { t: '✓ Kaydedildi', c: DARK },
    hata: { t: '✕ Kayıt hatası', c: '#c0392b' },
  }
  const s = map[durum]
  return <span style={{ fontSize: 11, color: s.c }}>{s.t}</span>
}
