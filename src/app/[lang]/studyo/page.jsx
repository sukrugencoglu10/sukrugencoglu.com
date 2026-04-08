'use client'

// app/[lang]/studyo/page.jsx
// Erişim: sukrugencoglu.com/tr/studyo  |  sukrugencoglu.com/en/studyo
// Giriş korumalı — STUDYO_USER + STUDYO_PASS env var'larıyla

import { useState, useEffect } from 'react'

// ─── Login ekranı ─────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/studyo-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.ok) {
        sessionStorage.setItem('studyo_auth', '1')
        onSuccess()
      } else {
        setError(data.error || 'Giriş başarısız')
      }
    } catch {
      setError('Bağlantı hatası')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      fontFamily: 'inherit',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        border: '0.5px solid #e8e8e8',
        borderRadius: 16,
        padding: '2rem',
        width: '100%',
        maxWidth: 360,
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, margin: '0 0 4px' }}>İçerik Stüdyosu</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 0, marginBottom: '1.5rem' }}>Devam etmek için giriş yap</p>

        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Kullanıcı adı</label>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', fontSize: 14, padding: '9px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
        />

        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Şifre</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', fontSize: 14, padding: '9px 40px 9px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#aaa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        {error && <p style={{ fontSize: 13, color: '#c0392b', marginBottom: 12, marginTop: 0 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#111', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Kontrol ediliyor...' : 'Giriş yap'}
        </button>
      </form>
    </div>
  )
}

// ─── Sabitler ─────────────────────────────────────────────────────────────────
const PLATFORMS = ['Instagram', 'Google Ads', 'Meta Ads', 'LinkedIn']
const TONES = ['İlham verici', 'Samimi', 'Profesyonel', 'Eğlenceli']

// ─── Yardımcı: API çağrısı ───────────────────────────────────────────────────
async function callClaude(prompt) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'API hatası')
  }
  const data = await res.json()
  return data.text
}

// ─── Chip bileşeni ────────────────────────────────────────────────────────────
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 20,
        border: active ? '1.5px solid #111' : '0.5px solid #d0d0d0',
        background: active ? '#111' : 'transparent',
        color: active ? '#fff' : '#666',
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.12s',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )
}

// ─── Çıktı kutusu ─────────────────────────────────────────────────────────────
function OutputBox({ text, loading }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          background: '#f7f7f5',
          border: '0.5px solid #e0e0e0',
          borderRadius: 10,
          padding: '14px 16px',
          fontSize: 14,
          lineHeight: 1.75,
          color: loading ? '#aaa' : '#111',
          fontStyle: loading ? 'italic' : 'normal',
          whiteSpace: 'pre-wrap',
          minHeight: 80,
        }}
      >
        {loading ? 'Oluşturuluyor...' : text}
      </div>
      {!loading && text && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button
            onClick={copy}
            style={{
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 8,
              border: copied ? '0.5px solid #1D9E75' : '0.5px solid #d0d0d0',
              background: 'transparent',
              color: copied ? '#0F6E56' : '#666',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── İçerik bileşeni (tüm hook'lar burada) ────────────────────────────────────
function StudyoContent() {
  // Adım 1 state
  const [konu, setKonu] = useState('')
  const [kitle, setKitle] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [ton, setTon] = useState('İlham verici')
  const [postText, setPostText] = useState('')
  const [postLoading, setPostLoading] = useState(false)

  // Adım 2 state
  const [nlText, setNlText] = useState('')
  const [captionText, setCaptionText] = useState('')
  const [captionLoading, setCaptionLoading] = useState(false)

  // ── Post metni üret ──
  const generatePost = async () => {
    if (!konu.trim()) return
    setPostLoading(true)
    setPostText('')
    const isAd = platform === 'Google Ads' || platform === 'Meta Ads'
    const prompt = `Sen bir sosyal medya metin yazarısın. Aşağıdaki bilgilere göre ${platform} için bir post metni yaz.

Konu: ${konu}
Hedef kitle: ${kitle || 'genel'}
Ton: ${ton.toLowerCase()}
Platform: ${platform}

Kurallar:
- Türkçe yaz
- Samimi ve akıcı bir dil kullan
- Emojileri organik şekilde yerleştir
- İlgili hashtagleri sona ekle (5-10 adet)
- ${isAd ? 'Reklam için güçlü bir call-to-action ekle, kısa ve öz tut (maks 150 kelime)' : 'Instagram post için etkileyici bir açılış cümlesi kullan (maks 200 kelime)'}
- Sadece metni ver, başka açıklama ekleme`

    try {
      const text = await callClaude(prompt)
      setPostText(text)
    } catch (e) {
      setPostText('Hata: ' + e.message)
    }
    setPostLoading(false)
  }

  // ── Açıklamayı çevir ──
  const generateCaption = async () => {
    if (!nlText.trim()) return
    setCaptionLoading(true)
    setCaptionText('')
    const prompt = `Aşağıdaki metni Instagram post açıklaması olarak birinci tekil şahıs (ben) ağzından yeniden yaz. Sanki bu deneyimi/bilgiyi yaşayan ya da paylaşan kişinin kendi sesiyle konuşuyor gibi olsun. Türkçe, samimi, akıcı ve kişisel bir ton kullan. Robota benzer veya resmi bir dil kullanma. Sadece yeniden yazılmış metni ver, başka açıklama ekleme.

Orijinal metin:
${nlText}`

    try {
      const text = await callClaude(prompt)
      setCaptionText(text)
    } catch (e) {
      setCaptionText('Hata: ' + e.message)
    }
    setCaptionLoading(false)
  }

  // ── Stil sabitleri ──
  const card = {
    background: '#fff',
    border: '0.5px solid #e8e8e8',
    borderRadius: 14,
    padding: '1.5rem',
    marginBottom: '1rem',
  }
  const label = {
    fontSize: 12,
    color: '#888',
    display: 'block',
    marginBottom: 5,
  }
  const input = {
    width: '100%',
    fontSize: 14,
    padding: '9px 12px',
    borderRadius: 8,
    border: '0.5px solid #ddd',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  }
  const primaryBtn = {
    width: '100%',
    padding: '10px',
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
    marginTop: 4,
  }
  const stepBadge = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#E1F5EE',
    border: '0.5px solid #1D9E75',
    fontSize: 11,
    fontWeight: 500,
    color: '#0F6E56',
    marginRight: 8,
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'inherit' }}>

      {/* Başlık */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>İçerik Stüdyosu</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Post metni üret · açıklamayı kişiselleştir · kopyala
        </p>
      </div>

      {/* Akış göstergesi */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { label: 'Post metni üret', auto: true },
          { label: '→', auto: null },
          { label: 'NotebookLM infografik', auto: false },
          { label: '→', auto: null },
          { label: 'Yazıyı sil', auto: false },
          { label: '→', auto: null },
          { label: 'Açıklamayı çevir', auto: true },
          { label: '→', auto: null },
          { label: 'IG paylaş', auto: false },
        ].map((item, i) =>
          item.auto === null ? (
            <span key={i} style={{ fontSize: 11, color: '#bbb', padding: '0 2px', display: 'flex', alignItems: 'center' }}>›</span>
          ) : (
            <div
              key={i}
              style={{
                fontSize: 11,
                padding: '5px 9px',
                borderRadius: 8,
                border: '0.5px solid',
                borderColor: item.auto ? '#5DCAA5' : '#e0e0e0',
                background: item.auto ? '#E1F5EE' : '#f7f7f5',
                color: item.auto ? '#0F6E56' : '#888',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {item.label}
            </div>
          )
        )}
      </div>

      {/* ADIM 1 */}
      <div style={card}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <span style={stepBadge}>1</span>
          POST METNİ ÜRETİMİ
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 150 }}>
            <label style={label}>Konu / ürün / mesaj</label>
            <input
              style={input}
              value={konu}
              onChange={e => setKonu(e.target.value)}
              placeholder="ör. sabah rutini, yeni koleksiyon..."
            />
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <label style={label}>Hedef kitle</label>
            <input
              style={input}
              value={kitle}
              onChange={e => setKitle(e.target.value)}
              placeholder="ör. girişimciler..."
            />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={label}>Platform</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => (
              <Chip key={p} label={p} active={platform === p} onClick={() => setPlatform(p)} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={label}>Ton</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TONES.map(t => (
              <Chip key={t} label={t} active={ton === t} onClick={() => setTon(t)} />
            ))}
          </div>
        </div>

        <button style={primaryBtn} onClick={generatePost} disabled={postLoading}>
          {postLoading ? 'Oluşturuluyor...' : 'Post metni üret'}
        </button>

        {(postText || postLoading) && (
          <OutputBox text={postText} loading={postLoading} />
        )}
      </div>

      {/* Manuel adım bilgisi */}
      <div style={{
        padding: '12px 16px',
        background: '#f7f7f5',
        border: '0.5px solid #e0e0e0',
        borderRadius: 10,
        marginBottom: '1rem',
        fontSize: 13,
        color: '#666',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: '#111', fontWeight: 500 }}>Sırada manuel adımlar:</strong> Post metnini NotebookLM&apos;e kaynak ekle → infografik oluştur → sağ alttaki yazıyı sil → otomatik açıklamayı kopyala → aşağıya yapıştır
      </div>

      {/* ADIM 2 */}
      <div style={card}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <span style={stepBadge}>2</span>
          AÇIKLAMAYI KİŞİSELLEŞTİR
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={label}>NotebookLM&apos;in verdiği açıklama</label>
          <textarea
            style={{ ...input, minHeight: 100, resize: 'vertical' }}
            value={nlText}
            onChange={e => setNlText(e.target.value)}
            placeholder="NotebookLM'in otomatik oluşturduğu açıklamayı buraya yapıştır..."
          />
        </div>

        <button style={primaryBtn} onClick={generateCaption} disabled={captionLoading}>
          {captionLoading ? 'Çevriliyor...' : '1. tekil şahsa çevir'}
        </button>

        {(captionText || captionLoading) && (
          <OutputBox text={captionText} loading={captionLoading} />
        )}
      </div>

      {/* Son adımlar */}
      <div style={{
        padding: '12px 16px',
        background: '#f7f7f5',
        border: '0.5px solid #e0e0e0',
        borderRadius: 10,
        fontSize: 13,
        color: '#666',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: '#111', fontWeight: 500 }}>Son adımlar:</strong> Görseli Instagram masaüstü uygulamasına yükle → çevrilen metni ekle → taslak kaydet → telefondan müzik ekle ve paylaş
      </div>

    </div>
  )
}

// ─── Google Ads RSA Üreticisi ─────────────────────────────────────────────────
const CTA_OPTIONS = ['Hemen Ara', 'Teklif Al', 'Ücretsiz Dene', 'Daha Fazla Bilgi']

function CharRow({ text, limit, onCopy }) {
  const [copied, setCopied] = useState(false)
  const len = text.length
  const over = len > limit

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      borderRadius: 7,
      background: over ? '#FFF5F5' : '#f7f7f5',
      border: `0.5px solid ${over ? '#FFCDD2' : '#e0e0e0'}`,
      marginBottom: 4,
    }}>
      <span style={{ flex: 1, fontSize: 13, color: '#111', lineHeight: 1.4 }}>{text}</span>
      <span style={{
        fontSize: 11,
        fontVariantNumeric: 'tabular-nums',
        color: over ? '#c0392b' : '#1D9E75',
        minWidth: 32,
        textAlign: 'right',
      }}>{len}/{limit}</span>
      <button
        onClick={copy}
        style={{
          fontSize: 11,
          padding: '3px 9px',
          borderRadius: 6,
          border: copied ? '0.5px solid #1D9E75' : '0.5px solid #d0d0d0',
          background: 'transparent',
          color: copied ? '#0F6E56' : '#888',
          cursor: 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        {copied ? '✓' : 'Kopyala'}
      </button>
    </div>
  )
}

function RsaUreticisi() {
  const [urun, setUrun] = useState('')
  const [kitle, setKitle] = useState('')
  const [faydalar, setFaydalar] = useState('')
  const [cta, setCta] = useState('Hemen Ara')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedAll, setCopiedAll] = useState('')

  const generate = async () => {
    if (!urun.trim()) return
    setLoading(true)
    setResult(null)
    setError('')

    const prompt = `Google Ads Responsive Search Ad (RSA) için metin üret.

Ürün/Hizmet: ${urun}
Hedef kitle: ${kitle || 'genel'}
Öne çıkan faydalar: ${faydalar || 'belirtilmedi'}
CTA: ${cta}

Kurallar:
- Türkçe yaz
- Tam olarak 15 başlık üret, her biri maksimum 30 karakter
- Tam olarak 4 açıklama üret, her biri maksimum 90 karakter
- Başlıklarda çeşitlilik sağla: fayda, özellik, CTA, sosyal kanıt, aciliyet
- Sadece JSON döndür, başka açıklama ekleme:
{"headlines":["..."],"descriptions":["..."]}`

    try {
      const text = await callClaude(prompt)
      const json = JSON.parse(text.replace(/```json|```/g, '').trim())
      setResult(json)
    } catch (e) {
      setError('Hata: ' + e.message)
    }
    setLoading(false)
  }

  const copyAll = (type) => {
    const items = type === 'headlines' ? result?.headlines : result?.descriptions
    if (!items) return
    navigator.clipboard.writeText(items.join('\n'))
    setCopiedAll(type)
    setTimeout(() => setCopiedAll(''), 1800)
  }

  const card = { background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }
  const label = { fontSize: 12, color: '#888', display: 'block', marginBottom: 5 }
  const input = { width: '100%', fontSize: 14, padding: '9px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const primaryBtn = { width: '100%', padding: '10px', background: '#111', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', marginTop: 4 }
  const sectionHead = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'inherit' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Google Ads RSA Üreticisi</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          15 başlık · 4 açıklama · karakter limiti kontrolü
        </p>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 150 }}>
            <label style={label}>Ürün / hizmet</label>
            <input style={input} value={urun} onChange={e => setUrun(e.target.value)} placeholder="ör. SEO danışmanlığı, e-ticaret sitesi..." />
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <label style={label}>Hedef kitle</label>
            <input style={input} value={kitle} onChange={e => setKitle(e.target.value)} placeholder="ör. KOBİ sahipleri..." />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={label}>Öne çıkan faydalar (virgülle ayır)</label>
          <input style={input} value={faydalar} onChange={e => setFaydalar(e.target.value)} placeholder="ör. ücretsiz analiz, 7/24 destek, garantili sonuç..." />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={label}>CTA tercihi</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CTA_OPTIONS.map(c => (
              <Chip key={c} label={c} active={cta === c} onClick={() => setCta(c)} />
            ))}
          </div>
        </div>

        <button style={primaryBtn} onClick={generate} disabled={loading}>
          {loading ? 'Üretiliyor...' : 'RSA Üret'}
        </button>

        {error && <p style={{ fontSize: 13, color: '#c0392b', marginTop: 10 }}>{error}</p>}
      </div>

      {loading && (
        <div style={{ ...card, color: '#aaa', fontSize: 14, fontStyle: 'italic' }}>Başlıklar ve açıklamalar oluşturuluyor...</div>
      )}

      {result && (
        <>
          <div style={card}>
            <div style={sectionHead}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>BAŞLIKLAR <span style={{ color: '#bbb', fontWeight: 400 }}>({result.headlines.length}/15 · maks 30 karakter)</span></span>
              <button
                onClick={() => copyAll('headlines')}
                style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: copiedAll === 'headlines' ? '0.5px solid #1D9E75' : '0.5px solid #d0d0d0', background: 'transparent', color: copiedAll === 'headlines' ? '#0F6E56' : '#888', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {copiedAll === 'headlines' ? 'Kopyalandı' : 'Tümünü Kopyala'}
              </button>
            </div>
            {result.headlines.map((h, i) => (
              <CharRow key={i} text={h} limit={30} />
            ))}
          </div>

          <div style={card}>
            <div style={sectionHead}>
              <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>AÇIKLAMALAR <span style={{ color: '#bbb', fontWeight: 400 }}>({result.descriptions.length}/4 · maks 90 karakter)</span></span>
              <button
                onClick={() => copyAll('descriptions')}
                style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: copiedAll === 'descriptions' ? '0.5px solid #1D9E75' : '0.5px solid #d0d0d0', background: 'transparent', color: copiedAll === 'descriptions' ? '#0F6E56' : '#888', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {copiedAll === 'descriptions' ? 'Kopyalandı' : 'Tümünü Kopyala'}
              </button>
            </div>
            {result.descriptions.map((d, i) => (
              <CharRow key={i} text={d} limit={90} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Reklam Terimleri Mantık Haritası ────────────────────────────────────────
const NODE_W = 144
const NODE_H = 70

const CAT_COLORS = {
  maliyet:  { bg: '#FFF3E0', border: '#E6510066', stripe: '#E65100' },
  olcum:    { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  strateji: { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
  eylem:    { bg: '#E8F5E9', border: '#2E7D3266', stripe: '#2E7D32' },
}

const AD_TERMS = [
  { id: 'kpi',  abbr: 'KPI',  tr: 'Temel Performans Göstergesi', en: 'Key Performance Indicator', cat: 'strateji', x: 480, y: 55  },
  { id: 'cpm',  abbr: 'CPM',  tr: 'Bin Gösterim Başına Maliyet', en: 'Cost Per Mille',             cat: 'maliyet',  x: 60,  y: 200 },
  { id: 'cta',  abbr: 'CTA',  tr: 'Harekete Geçirici Mesaj',     en: 'Call To Action',             cat: 'eylem',    x: 240, y: 125 },
  { id: 'ctr',  abbr: 'CTR',  tr: 'Tıklama Oranı',               en: 'Click Through Rate',         cat: 'olcum',    x: 240, y: 245 },
  { id: 'cpc',  abbr: 'CPC',  tr: 'Tıklama Başına Maliyet',      en: 'Cost Per Click',             cat: 'maliyet',  x: 400, y: 200 },
  { id: 'cvr',  abbr: 'CVR',  tr: 'Dönüşüm Oranı',               en: 'Conversion Rate',            cat: 'olcum',    x: 400, y: 320 },
  { id: 'ebm',  abbr: 'EBM',  tr: 'Edinim Başına Maliyet',       en: 'Cost Per Acquisition',       cat: 'maliyet',  x: 560, y: 260 },
  { id: 'cac',  abbr: 'CAC',  tr: 'Müşteri Edinim Maliyeti',     en: 'Customer Acquisition Cost',  cat: 'maliyet',  x: 560, y: 385 },
  { id: 'roas', abbr: 'ROAS', tr: 'Reklam Harcaması Getirisi',   en: 'Return on Ad Spend',         cat: 'olcum',    x: 720, y: 200 },
  { id: 'roi',  abbr: 'ROI',  tr: 'Yatırım Getirisi',            en: 'Return on Investment',       cat: 'strateji', x: 880, y: 260 },
  { id: 'ltv',  abbr: 'LTV',  tr: 'Yaşam Boyu Değer',            en: 'Lifetime Value',             cat: 'strateji', x: 720, y: 385 },
  { id: 'crm',  abbr: 'CRM',  tr: 'Müşteri İlişkileri Yönetimi', en: 'Customer Relationship Mgmt', cat: 'strateji', x: 880, y: 385 },
]

const CONNECTIONS = [
  { from: 'cpm',  to: 'ctr'  },
  { from: 'cta',  to: 'ctr'  },
  { from: 'ctr',  to: 'cpc'  },
  { from: 'cpc',  to: 'cvr'  },
  { from: 'cvr',  to: 'ebm'  },
  { from: 'ebm',  to: 'cac'  },
  { from: 'ebm',  to: 'roas' },
  { from: 'cac',  to: 'ltv'  },
  { from: 'roas', to: 'roi'  },
  { from: 'ltv',  to: 'roi'  },
  { from: 'ltv',  to: 'crm'  },
]

function edgePoint(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y }
  const hw = NODE_W / 2
  const hh = NODE_H / 2
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity
  const scale = Math.min(scaleX, scaleY)
  return { x: from.x + dx * scale, y: from.y + dy * scale }
}

function MantiKHaritasi() {
  const [hovered, setHovered] = useState(null)

  const termMap = Object.fromEntries(AD_TERMS.map(t => [t.id, t]))

  const connectedIds = hovered ? new Set([
    hovered,
    ...CONNECTIONS.filter(c => c.from === hovered || c.to === hovered).flatMap(c => [c.from, c.to]),
  ]) : null

  const CANVAS_W = 1000
  const CANVAS_H = 460

  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Reklam Terimleri</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Dijital reklamcılık kısaltmaları ve funnel içindeki hiyerarşik ilişkileri
        </p>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[['maliyet', 'Maliyet'], ['olcum', 'Ölçüm'], ['strateji', 'Strateji'], ['eylem', 'Eylem']].map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: CAT_COLORS[cat].stripe }} />
            {label}
          </div>
        ))}
        <div style={{ fontSize: 12, color: '#bbb', marginLeft: 4 }}>· Üzerine gel: ilişkileri gör</div>
      </div>

      {/* Canvas */}
      <div style={{ overflowX: 'auto', background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 12px' }}>
        <div style={{ position: 'relative', width: CANVAS_W, height: CANVAS_H, margin: '0 auto' }}>

          {/* SVG bağlantı çizgileri */}
          <svg
            width={CANVAS_W} height={CANVAS_H}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <defs>
              <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
              </marker>
              <marker id="arr-hi" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#888" />
              </marker>
            </defs>
            {CONNECTIONS.map((conn, i) => {
              const from = termMap[conn.from]
              const to = termMap[conn.to]
              if (!from || !to) return null
              const p1 = edgePoint(from, to)
              const p2 = edgePoint(to, from)
              const isActive = hovered && (conn.from === hovered || conn.to === hovered)
              return (
                <line
                  key={i}
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isActive ? '#888' : '#ddd'}
                  strokeWidth={isActive ? 2 : 1.5}
                  markerEnd={isActive ? 'url(#arr-hi)' : 'url(#arr)'}
                />
              )
            })}
          </svg>

          {/* KPI ayrı gösterge olarak üstte */}
          {(() => {
            const t = termMap['kpi']
            const colors = CAT_COLORS[t.cat]
            const isHovered = hovered === t.id
            const isDimmed = connectedIds && !connectedIds.has(t.id)
            return (
              <div
                key={t.id}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'absolute',
                  left: t.x - NODE_W / 2,
                  top: t.y - NODE_H / 2,
                  width: NODE_W,
                  height: NODE_H,
                  background: colors.bg,
                  border: `1px solid ${isHovered ? colors.stripe : colors.border}`,
                  boxShadow: isHovered
                    ? `inset 3px 0 0 ${colors.stripe}, 0 4px 16px ${colors.stripe}44`
                    : `inset 3px 0 0 ${colors.stripe}, 0 1px 4px rgba(0,0,0,0.07)`,
                  borderRadius: 8,
                  padding: '7px 10px 7px 12px',
                  opacity: isDimmed ? 0.25 : 1,
                  transition: 'all 0.15s',
                  zIndex: isHovered ? 2 : 1,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  userSelect: 'none', cursor: 'default',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.stripe, lineHeight: 1, marginBottom: 3 }}>{t.abbr}</div>
                <div style={{ fontSize: 11, color: '#333', lineHeight: 1.3, fontWeight: 500 }}>{t.tr}</div>
                <div style={{ fontSize: 10, color: '#999', lineHeight: 1.2, marginTop: 2 }}>{t.en}</div>
              </div>
            )
          })()}

          {/* Diğer node'lar */}
          {AD_TERMS.filter(t => t.id !== 'kpi').map(term => {
            const colors = CAT_COLORS[term.cat]
            const isHovered = hovered === term.id
            const isDimmed = connectedIds && !connectedIds.has(term.id)
            return (
              <div
                key={term.id}
                onMouseEnter={() => setHovered(term.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'absolute',
                  left: term.x - NODE_W / 2,
                  top: term.y - NODE_H / 2,
                  width: NODE_W,
                  height: NODE_H,
                  background: colors.bg,
                  border: `1px solid ${isHovered ? colors.stripe : colors.border}`,
                  boxShadow: isHovered
                    ? `inset 3px 0 0 ${colors.stripe}, 0 4px 16px ${colors.stripe}44`
                    : `inset 3px 0 0 ${colors.stripe}, 0 1px 4px rgba(0,0,0,0.07)`,
                  borderRadius: 8,
                  padding: '7px 10px 7px 12px',
                  opacity: isDimmed ? 0.25 : 1,
                  transition: 'all 0.15s',
                  zIndex: isHovered ? 2 : 1,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  userSelect: 'none', cursor: 'default',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.stripe, lineHeight: 1, marginBottom: 3 }}>{term.abbr}</div>
                <div style={{ fontSize: 11, color: '#333', lineHeight: 1.3, fontWeight: 500 }}>{term.tr}</div>
                <div style={{ fontSize: 10, color: '#999', lineHeight: 1.2, marginTop: 2 }}>{term.en}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sütun etiketleri */}
      <div style={{ display: 'flex', marginTop: 8, paddingLeft: 4, fontSize: 11, color: '#bbb', overflowX: 'auto' }}>
        {[
          { label: 'Görünürlük', left: 60 - 60 },
          { label: 'Etkileşim',  left: 240 - 60 },
          { label: 'Tıklama',    left: 400 - 60 },
          { label: 'Edinim',     left: 560 - 60 },
          { label: 'Karlılık',   left: 720 - 60 },
          { label: 'Getiri',     left: 880 - 60 },
        ].map(({ label, left }) => (
          <div key={label} style={{ position: 'relative', width: 160, flexShrink: 0, textAlign: 'center' }}>{label}</div>
        ))}
      </div>
    </div>
  )
}

// ─── Yapay Zeka Terimleri Mantık Haritası ────────────────────────────────────
const AI_NODE_W = 136
const AI_NODE_H = 66

const AI_CAT_COLORS = {
  temel:     { bg: '#EDE7F6', border: '#4527A066', stripe: '#4527A0' },
  arayuz:    { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  iletisim:  { bg: '#FFF8E1', border: '#F57F1766', stripe: '#F57F17' },
  otomasyon: { bg: '#E8F5E9', border: '#1B5E2066', stripe: '#1B5E20' },
  bilgi:     { bg: '#E0F2F1', border: '#004D4066', stripe: '#004D40' },
}

const AI_TERMS = [
  {
    id: 'llm', abbr: 'LLM', sub: 'Büyük Dil Modeli', cat: 'temel', x: 430, y: 60,
    desc: 'İnsan dilini anlayan ve üreten büyük sinir ağı modeli. GPT, Claude, Gemini bunun örnekleri.',
  },
  {
    id: 'model', abbr: 'Model', sub: 'Eğitilmiş AI Örneği', cat: 'temel', x: 200, y: 165,
    desc: 'Belirli bir görev için eğitilmiş LLM örneği. claude-sonnet-4-6, gpt-4o gibi. Her modelin farklı yetenek, bağlam penceresi ve maliyeti vardır.',
  },
  {
    id: 'api', abbr: 'API', sub: 'Uygulama Arayüzü', cat: 'arayuz', x: 660, y: 165,
    desc: 'Uygulamaların birbirleriyle konuşmasını sağlayan standart arayüz. AI modeline istek göndermek ve yanıt almak için kullanılır.',
  },
  {
    id: 'token', abbr: 'Token', sub: 'Metin Birimi', cat: 'iletisim', x: 80, y: 280,
    desc: 'Modelin işlediği en küçük metin birimi. Yaklaşık ¾ kelimeye eşit. Maliyet ve bağlam sınırı token sayısına göre hesaplanır.',
  },
  {
    id: 'prompt', abbr: 'Prompt', sub: 'Yönerge / Soru', cat: 'iletisim', x: 250, y: 280,
    desc: 'Modele verilen yönerge, bağlam veya soru. Prompt kalitesi çıktı kalitesini doğrudan belirler.',
  },
  {
    id: 'finetuning', abbr: 'Fine-tuning', sub: 'Özelleştirme', cat: 'bilgi', x: 430, y: 280,
    desc: 'Modeli özel bir veri setiyle yeniden eğitme işlemi. Belirli bir domain, ton veya davranış için modeli özelleştirir.',
  },
  {
    id: 'sdk', abbr: 'SDK', sub: 'Geliştirici Paketi', cat: 'arayuz', x: 620, y: 280,
    desc: 'API\'yi kolayca kullanmak için hazır kod kütüphanesi. Python\'da `anthropic`, JS\'de `@anthropic-ai/sdk` gibi paketler SDK\'dır.',
  },
  {
    id: 'apikey', abbr: 'API Key', sub: 'Erişim Anahtarı', cat: 'arayuz', x: 780, y: 280,
    desc: 'API\'ye erişim izni veren benzersiz gizli anahtar. Kişisel şifre gibi; herkesle paylaşılmamalı, kod içine gömülmemeli.',
  },
  {
    id: 'contextwin', abbr: 'Context\nWindow', sub: 'Bağlam Penceresi', cat: 'iletisim', x: 80, y: 390,
    desc: 'Modelin tek bir konuşmada görebildiği maksimum token sayısı. "Çalışma belleği" gibi düşün. Aşılınca eski içerik unutulur.',
  },
  {
    id: 'embedding', abbr: 'Embedding', sub: 'Vektör Temsili', cat: 'bilgi', x: 240, y: 390,
    desc: 'Metni sayısal vektöre dönüştürme işlemi. Anlam benzerliğini matematiksel olarak ölçmeyi sağlar. Arama ve sınıflandırmada kullanılır.',
  },
  {
    id: 'agent', abbr: 'Agent', sub: 'Otonom AI Sistemi', cat: 'otomasyon', x: 430, y: 390,
    desc: 'Bir amacı gerçekleştirmek için kendi başına karar alan, araçlar kullanan ve adım adım ilerleyen yapay zeka sistemi.',
  },
  {
    id: 'skill', abbr: 'Skill', sub: 'Yetenek Şablonu', cat: 'otomasyon', x: 610, y: 390,
    desc: 'Claude Code gibi sistemlerde önceden tanımlanmış, tetiklenebilir görev kalıpları. /commit, /review-pr gibi komutlar birer skill\'dir.',
  },
  {
    id: 'rag', abbr: 'RAG', sub: 'Bilgi Destekli Üretim', cat: 'bilgi', x: 80, y: 490,
    desc: 'Retrieval-Augmented Generation. Model cevap üretmeden önce harici bir bilgi tabanından ilgili içeriği çekerek kullanır.',
  },
  {
    id: 'tool', abbr: 'Tool', sub: 'Dış Araç / Fonksiyon', cat: 'otomasyon', x: 430, y: 490,
    desc: 'Agentin çağırabileceği dış fonksiyon. Web arama, kod çalıştırma, veritabanı sorgusu, API çağrısı bunlara örnektir.',
  },
  {
    id: 'mcp', abbr: 'MCP', sub: 'Model Context Protocol', cat: 'otomasyon', x: 610, y: 490,
    desc: 'Model Context Protocol. Agentlerin harici araçlara standart ve güvenli biçimde bağlanması için Anthropic tarafından tasarlanan protokol.',
  },
]

const AI_CONNECTIONS = [
  { from: 'llm',     to: 'model'      },
  { from: 'llm',     to: 'api'        },
  { from: 'llm',     to: 'finetuning' },
  { from: 'model',   to: 'token'      },
  { from: 'model',   to: 'prompt'     },
  { from: 'model',   to: 'embedding'  },
  { from: 'api',     to: 'sdk'        },
  { from: 'api',     to: 'apikey'     },
  { from: 'api',     to: 'token'      },
  { from: 'token',   to: 'contextwin' },
  { from: 'prompt',  to: 'agent'      },
  { from: 'embedding', to: 'rag'      },
  { from: 'agent',   to: 'tool'       },
  { from: 'tool',    to: 'mcp'        },
  { from: 'agent',   to: 'skill'      },
]

function aiEdgePoint(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y }
  const hw = AI_NODE_W / 2
  const hh = AI_NODE_H / 2
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity
  const scale = Math.min(scaleX, scaleY)
  return { x: from.x + dx * scale, y: from.y + dy * scale }
}

const AI_CAT_LABELS = {
  temel: 'Temel', arayuz: 'Arayüz', iletisim: 'İletişim', otomasyon: 'Otomasyon', bilgi: 'Bilgi',
}

function YzHaritasi() {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  const termMap = Object.fromEntries(AI_TERMS.map(t => [t.id, t]))
  const selectedTerm = selected ? termMap[selected] : null

  const connectedIds = hovered ? new Set([
    hovered,
    ...AI_CONNECTIONS.filter(c => c.from === hovered || c.to === hovered).flatMap(c => [c.from, c.to]),
  ]) : null

  const CANVAS_W = 880
  const CANVAS_H = 555

  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Yapay Zeka Terimleri</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          AI ekosisteminin temel kavramları ve aralarındaki ilişkiler · Terime tıkla: açıklamayı gör
        </p>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 14, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(AI_CAT_LABELS).map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: AI_CAT_COLORS[cat].stripe }} />
            {label}
          </div>
        ))}
      </div>

      {/* Ana alan: harita + panel */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Canvas */}
        <div style={{ flex: 1, overflowX: 'auto', background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 10px' }}>
          <div style={{ position: 'relative', width: CANVAS_W, height: CANVAS_H, margin: '0 auto' }}>

            {/* SVG çizgiler */}
            <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <defs>
                <marker id="ai-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
                </marker>
                <marker id="ai-arr-hi" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#777" />
                </marker>
              </defs>
              {AI_CONNECTIONS.map((conn, i) => {
                const from = termMap[conn.from]
                const to = termMap[conn.to]
                if (!from || !to) return null
                const p1 = aiEdgePoint(from, to)
                const p2 = aiEdgePoint(to, from)
                const isActive = hovered && (conn.from === hovered || conn.to === hovered)
                return (
                  <line
                    key={i}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={isActive ? '#777' : '#ddd'}
                    strokeWidth={isActive ? 2 : 1.5}
                    markerEnd={isActive ? 'url(#ai-arr-hi)' : 'url(#ai-arr)'}
                  />
                )
              })}
            </svg>

            {/* Node'lar */}
            {AI_TERMS.map(term => {
              const colors = AI_CAT_COLORS[term.cat]
              const isHovered = hovered === term.id
              const isSelected = selected === term.id
              const isDimmed = connectedIds && !connectedIds.has(term.id)
              return (
                <div
                  key={term.id}
                  onMouseEnter={() => setHovered(term.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(isSelected ? null : term.id)}
                  style={{
                    position: 'absolute',
                    left: term.x - AI_NODE_W / 2,
                    top: term.y - AI_NODE_H / 2,
                    width: AI_NODE_W,
                    height: AI_NODE_H,
                    background: isSelected ? colors.stripe + '18' : colors.bg,
                    border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.stripe : (isHovered ? colors.stripe : colors.border)}`,
                    borderRadius: 8,
                    padding: '6px 10px 6px 12px',
                    opacity: isDimmed ? 0.22 : 1,
                    boxShadow: isSelected
                      ? `inset 3px 0 0 ${colors.stripe}, 0 0 0 3px ${colors.stripe}33, 0 4px 16px ${colors.stripe}22`
                      : isHovered
                        ? `inset 3px 0 0 ${colors.stripe}, 0 3px 12px ${colors.stripe}33`
                        : `inset 3px 0 0 ${colors.stripe}, 0 1px 3px rgba(0,0,0,0.06)`,
                    transition: 'all 0.13s',
                    zIndex: isSelected ? 3 : isHovered ? 2 : 1,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    cursor: 'pointer', userSelect: 'none',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.stripe, lineHeight: 1.2, marginBottom: 3, whiteSpace: 'pre-line' }}>{term.abbr}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>{term.sub}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Açıklama paneli */}
        <div style={{
          width: 240,
          flexShrink: 0,
          background: '#fff',
          border: '0.5px solid #e8e8e8',
          borderRadius: 12,
          padding: '1.25rem',
          minHeight: 200,
          alignSelf: 'flex-start',
          position: 'sticky',
          top: 80,
        }}>
          {selectedTerm ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: AI_CAT_COLORS[selectedTerm.cat].stripe, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: AI_CAT_COLORS[selectedTerm.cat].stripe, fontWeight: 600 }}>
                  {AI_CAT_LABELS[selectedTerm.cat].toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: AI_CAT_COLORS[selectedTerm.cat].stripe, marginBottom: 4, whiteSpace: 'pre-line' }}>
                {selectedTerm.abbr}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{selectedTerm.sub}</div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{selectedTerm.desc}</div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 8, color: '#ccc', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>◎</div>
              <div style={{ fontSize: 12 }}>Bir terime tıkla,<br />açıklamasını gör</div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Reklam Hiyerarşisi aracı ─────────────────────────────────────────────────
function ReklamHiyerarsisi() {
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedId, setFocusedId] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [openAdminFaqIds, setOpenAdminFaqIds] = useState(new Set())

  const toggleAdminFaq = (faqId) => {
    setOpenAdminFaqIds(prev => {
      const isOpening = !prev.has(faqId)
      const next = new Set(prev)
      isOpening ? next.add(faqId) : next.delete(faqId)
      if (isOpening) {
        setTimeout(() => {
          const el = document.querySelector(`[data-faq-answer="${faqId}"]`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 60)
      }
      return next
    })
  }

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/reklam-hiyerarsisi')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addItem = (afterId = null) => {
    const newItem = { id: Date.now(), title: '', description: '', expanded: true, faq: [] }
    setItems(prev => {
      if (!afterId) return [...prev, newItem]
      const idx = prev.findIndex(i => i.id === afterId)
      const updated = [...prev]
      updated.splice(idx + 1, 0, newItem)
      return updated
    })
    setSaved(false)
  }

  const addFaq = (itemId) => {
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, faq: [...(i.faq || []), { id: Date.now(), question: '', answer: '' }] }
        : i
    ))
    setSaved(false)
  }

  const updateFaq = (itemId, faqId, field, val) => {
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, faq: (i.faq || []).map(f => f.id === faqId ? { ...f, [field]: val } : f) }
        : i
    ))
    setSaved(false)
  }

  const removeFaq = (itemId, faqId) => {
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, faq: (i.faq || []).filter(f => f.id !== faqId) }
        : i
    ))
    setSaved(false)
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setSaved(false)
  }

  const updateItem = (id, key, val) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i))
    setSaved(false)
  }

  const toggleItem = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, expanded: !i.expanded } : i))
  }

  const handleDragStart = (e, id) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (id !== dragId) setDragOverId(id)
  }

  const handleDrop = (e, id) => {
    e.preventDefault()
    if (!dragId || dragId === id) { setDragId(null); setDragOverId(null); return }
    setItems(prev => {
      const from = prev.findIndex(i => i.id === dragId)
      const to   = prev.findIndex(i => i.id === id)
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
    setSaved(false)
    setDragId(null)
    setDragOverId(null)
  }

  // HTML clipboard → düz metin dönüştürücü (Gemini/ChatGPT yapıştırma için)
  const parseHtmlToText = (html) => {
    if (typeof document === 'undefined') return ''
    const div = document.createElement('div')
    div.innerHTML = html

    // Tabloları sütun | sütun formatına çevir
    div.querySelectorAll('table').forEach(table => {
      let rows = ''
      table.querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.querySelectorAll('td,th')].map(c => c.textContent.trim())
        rows += cells.join(' | ') + '\n'
      })
      table.replaceWith(document.createTextNode('\n' + rows))
    })

    // <br> → newline
    div.querySelectorAll('br').forEach(br => br.replaceWith('\n'))

    // Block elementlerin arkasına satır sonu ekle
    div.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,div').forEach(el => {
      el.after('\n')
    })

    return div.textContent
      .replace(/[ \t]+/g, ' ')      // çoklu boşluk → tek
      .replace(/\n[ \t]+/g, '\n')   // satır başı boşlukları temizle
      .replace(/\n{3,}/g, '\n\n')   // fazla boş satırları sıkıştır
      .trim()
  }

  const handleDescriptionPaste = (e, id, currentVal) => {
    const html = e.clipboardData?.getData('text/html')
    if (!html) return
    const text = parseHtmlToText(html)
    if (!text) return
    e.preventDefault()
    const el = e.target
    const before = currentVal.slice(0, el.selectionStart)
    const after  = currentVal.slice(el.selectionEnd)
    const sep = before.length > 0 && !before.endsWith('\n') ? '\n' : ''
    updateItem(id, 'description', before + sep + text + after)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setDragOverId(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/reklam-hiyerarsisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      const data = await res.json()
      if (data.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setError(data.error || 'Kayıt başarısız')
      }
    } catch {
      setError('Bağlantı hatası')
    }
    setSaving(false)
  }

  const inputStyle = {
    flex: 1,
    fontSize: 13,
    padding: '7px 10px',
    borderRadius: 7,
    border: '0.5px solid #ddd',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
  }
  const textareaStyle = {
    width: '100%',
    fontSize: 13,
    padding: '9px 12px',
    borderRadius: 8,
    border: '0.5px solid #ddd',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
    minHeight: 80,
    lineHeight: 1.6,
    boxSizing: 'border-box',
    background: '#fff',
  }

  // Arama eşleşmelerini vurgula
  const highlight = (text, query) => {
    if (!query.trim() || !text) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} style={{ background: '#fff176', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
        : part
    )
  }

  const q = searchQuery.trim().toLowerCase()
  const filteredItems = q
    ? items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      )
    : items

  const focusedItem = items.find(i => i.id === focusedId) ?? null
  const focusedIdx = items.findIndex(i => i.id === focusedId)

  // Mobilde focusedId varsa → sadece sağ panel göster
  const mobileEditorMode = isMobile && !!focusedId

  return (
    <div style={{ maxWidth: (focusedId && !isMobile) ? 'none' : 700, margin: '0 auto', padding: '1.5rem 1rem', fontFamily: 'inherit', transition: 'max-width 0.2s ease' }}>

      {/* Mobil geri butonu */}
      {mobileEditorMode && (
        <button
          onClick={() => { setFocusedId(null); setPreviewMode(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 0', marginBottom: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, color: '#555', fontFamily: 'inherit',
          }}
        >
          ← Geri
        </button>
      )}

      {/* Başlık + ekle — mobil editor modunda gizle */}
      {!mobileEditorMode && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, margin: '0 0 4px' }}>Reklam Hiyerarşisi</h1>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Başlıkları ve açıklamaları düzenle, kaydet</p>
          </div>
          <button
            onClick={() => addItem()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9,
              border: '0.5px solid #d0d0d0', background: '#fff',
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#333',
              transition: 'all 0.1s',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Ekle
          </button>
        </div>
      )}

      {/* Arama kutusu — mobil editor modunda gizle */}
      {!mobileEditorMode && (
        <>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <span style={{
              position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, color: '#bbb', pointerEvents: 'none',
            }}>⌕</span>
            <input
              type="text"
              placeholder="Başlık veya açıklamada ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                fontSize: 13, padding: '9px 36px 9px 30px',
                borderRadius: 9, border: '0.5px solid #ddd',
                fontFamily: 'inherit', outline: 'none', background: '#fff',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#bbb', padding: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Temizle"
              >✕</button>
            )}
          </div>
          {q && (
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: '1rem', marginTop: '-0.75rem' }}>
              {filteredItems.length} sonuç bulundu
            </div>
          )}
        </>
      )}

      {loading && (
        <div style={{ color: '#aaa', fontSize: 13, marginBottom: '1rem' }}>Yükleniyor...</div>
      )}

      {!loading && items.length === 0 && (
        <div style={{
          border: '0.5px dashed #d0d0d0', borderRadius: 12,
          padding: '2.5rem', textAlign: 'center', color: '#aaa', marginBottom: '1rem',
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>◐</div>
          <div style={{ fontSize: 13 }}>Henüz hiyerarşi öğesi yok.<br />Sağ üstten ekleyin.</div>
        </div>
      )}

      {/* Split panel veya tek sütun */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: (focusedId && !isMobile) ? '290px 1fr' : '1fr',
        gap: (focusedId && !isMobile) ? '1.5rem' : 0,
        alignItems: 'start',
        transition: 'grid-template-columns 0.2s ease',
      }}>
        {/* Sol — öğe listesi (mobil editor modunda gizlenir) */}
        <div style={{ display: mobileEditorMode ? 'none' : 'block' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: focusedId ? 4 : 10, marginBottom: '1.5rem' }}>
            {filteredItems.map((item) => {
              const itemIdx = items.findIndex(i => i.id === item.id)
              const isFocused = item.id === focusedId
              const isDragging = dragId === item.id
              const isOver = dragOverId === item.id
              const titleMatch = q && item.title.toLowerCase().includes(q)
              const descMatch = q && item.description.toLowerCase().includes(q)
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item.id)}
                  onDragOver={e => handleDragOver(e, item.id)}
                  onDrop={e => handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                  style={{
                    background: '#fff',
                    border: isFocused ? '0.5px solid #111' : isOver ? '0.5px solid #111' : '0.5px solid #e8e8e8',
                    borderRadius: focusedId ? 10 : 12,
                    overflow: 'hidden',
                    opacity: isDragging ? 0.4 : 1,
                    boxShadow: isFocused ? 'inset 3px 0 0 #111' : isOver ? 'inset 3px 0 0 #111' : 'none',
                    transition: 'opacity 0.15s, box-shadow 0.15s, border-color 0.15s',
                  }}
                >
                  {/* Başlık satırı */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: (focusedId && !isMobile) ? '8px 10px' : '10px 12px', minHeight: isMobile ? 52 : 'auto' }}>
                    <button
                      onClick={() => setFocusedId(prev => prev === item.id ? null : item.id)}
                      style={{
                        flexShrink: 0, width: isMobile ? 32 : 22, height: isMobile ? 32 : 22,
                        border: 'none', background: 'transparent',
                        cursor: 'pointer', fontSize: 13,
                        color: isFocused ? '#111' : '#888',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.15s, color 0.15s',
                        transform: isFocused ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                      title={isFocused ? 'Kapat' : 'Aç'}
                    >
                      ▶
                    </button>
                    <span style={{ fontSize: 11, color: isFocused ? '#888' : '#ccc', fontWeight: 600, flexShrink: 0 }}>
                      {String(itemIdx + 1).padStart(2, '0')}
                    </span>
                    {(focusedId && !isFocused && !isMobile) ? (
                      /* Desktop split modunda odaklanmamış öğe: tıklanabilir metin */
                      <span
                        onClick={() => setFocusedId(item.id)}
                        style={{
                          flex: 1, fontSize: 13, color: '#555', cursor: 'pointer',
                          lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          borderColor: titleMatch ? '#facc15' : undefined,
                        }}
                      >
                        {highlight(item.title || '—', searchQuery)}
                      </span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Başlık..."
                        value={item.title}
                        onChange={e => updateItem(item.id, 'title', e.target.value)}
                        style={{ ...inputStyle, borderColor: titleMatch ? '#facc15' : undefined, fontSize: isMobile ? 14 : 13 }}
                        draggable={false}
                      />
                    )}
                    {/* Taşıma handle — mobilde gizle */}
                    {!isMobile && (
                      <button
                        style={{
                          flexShrink: 0, width: 26, height: 26,
                          border: '0.5px solid #eee', borderRadius: 7,
                          background: 'transparent', cursor: 'grab',
                          fontSize: 15, color: '#ccc',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          userSelect: 'none',
                        }}
                        title="Taşı"
                        onMouseDown={e => e.stopPropagation()}
                      >
                        ⠿
                      </button>
                    )}
                    {/* Araya ekle */}
                    <button
                      onClick={() => addItem(item.id)}
                      style={{
                        flexShrink: 0, width: isMobile ? 36 : 26, height: isMobile ? 36 : 26,
                        border: '0.5px solid #eee', borderRadius: 7,
                        background: 'transparent', cursor: 'pointer',
                        fontSize: isMobile ? 18 : 16, color: '#bbb', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.1s',
                      }}
                      title="Altına ekle"
                    >
                      +
                    </button>
                    {/* Sil */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        flexShrink: 0, width: isMobile ? 36 : 26, height: isMobile ? 36 : 26,
                        border: '0.5px solid #eee', borderRadius: 7,
                        background: 'transparent', cursor: 'pointer',
                        fontSize: isMobile ? 16 : 14, color: '#bbb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.1s',
                      }}
                      title="Sil"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Açıklama alanı — sadece split mod KAPALI iken göster */}
                  {!focusedId && (item.expanded || descMatch) && (
                    <div style={{ padding: '0 12px 12px', borderTop: '0.5px solid #f0f0f0', paddingTop: 10 }}>
                      <textarea
                        placeholder="Açıklama yaz..."
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        onPaste={e => handleDescriptionPaste(e, item.id, item.description)}
                        style={{ ...textareaStyle, borderColor: descMatch ? '#facc15' : undefined }}
                        draggable={false}
                      />
                      {descMatch && (
                        <div style={{
                          marginTop: 6, padding: '6px 10px',
                          background: '#fffde7', borderRadius: 6,
                          fontSize: 12, color: '#555', lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {highlight(item.description, searchQuery)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Kaydet */}
          {items.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
              {error && <span style={{ fontSize: 13, color: '#c0392b' }}>{error}</span>}
              {saved && <span style={{ fontSize: 13, color: '#1D9E75' }}>✓ Kaydedildi</span>}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '9px 20px',
                  background: saved ? '#1D9E75' : '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 9,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'background 0.2s',
                }}
              >
                {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Kaydet'}
              </button>
            </div>
          )}
        </div>

        {/* Sağ — odaklanmış öğe editörü */}
        {focusedItem && (
          <div style={{
            background: '#fff',
            border: '0.5px solid #e8e8e8',
            borderRadius: '4px 16px 16px 16px',
            padding: '2rem',
            boxShadow: 'inset 0 3px 0 #111, 0 2px 16px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 16,
          }}>
            {/* Üst bar: konum + toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.08em' }}>
                {String(focusedIdx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </div>
              <button
                onClick={() => setPreviewMode(p => !p)}
                style={{
                  fontSize: 11, padding: '4px 10px',
                  borderRadius: 6, border: '0.5px solid #ddd',
                  background: previewMode ? '#111' : 'transparent',
                  color: previewMode ? '#fff' : '#888',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {previewMode ? '✎ Düzenle' : '👁 Önizle'}
              </button>
            </div>

            {/* Başlık */}
            {previewMode ? (
              <div style={{
                fontSize: 20, fontWeight: 700,
                paddingBottom: 10,
                borderBottom: '0.5px solid #eee',
                marginBottom: '1.25rem',
                color: '#111',
                lineHeight: 1.3,
              }}>
                {focusedItem.title || <span style={{ color: '#ccc' }}>Başlık yok</span>}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Başlık..."
                value={focusedItem.title}
                onChange={e => updateItem(focusedId, 'title', e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  fontSize: 20, fontWeight: 700,
                  padding: '0 0 10px',
                  borderRadius: 0, border: 'none',
                  borderBottom: '0.5px solid #eee',
                  fontFamily: 'inherit', outline: 'none',
                  marginBottom: '1.25rem',
                  color: '#111', background: 'transparent',
                }}
                draggable={false}
              />
            )}

            {/* Açıklama */}
            {previewMode ? (
              <div style={{
                fontSize: 14, color: '#444',
                lineHeight: 1.8, whiteSpace: 'pre-wrap',
                minHeight: 120,
              }}>
                {focusedItem.description
                  ? focusedItem.description.split(/(https?:\/\/[^\s]+)/gi).map((part, i) =>
                      /^https?:\/\//i.test(part) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}>
                          {part}
                        </a>
                      ) : part
                    )
                  : <span style={{ color: '#ccc', fontStyle: 'italic' }}>Açıklama yok</span>
                }
              </div>
            ) : (
              <textarea
                placeholder="Açıklama yaz..."
                value={focusedItem.description}
                onChange={e => updateItem(focusedId, 'description', e.target.value)}
                onPaste={e => handleDescriptionPaste(e, focusedId, focusedItem.description)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  fontSize: 14, padding: 0,
                  borderRadius: 0, border: 'none',
                  fontFamily: 'inherit', outline: 'none',
                  resize: 'vertical', minHeight: 320,
                  lineHeight: 1.8, color: '#444',
                  background: 'transparent',
                }}
                draggable={false}
              />
            )}

            {/* ── SSS Bölümü ── */}
            <div style={{ marginTop: '2rem', borderTop: '0.5px solid #f0f0f0', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.08em' }}>
                  SSS — SIK SORULAN SORULAR
                </div>
                {!previewMode && (
                  <button
                    onClick={() => addFaq(focusedId)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 11, padding: '4px 10px',
                      borderRadius: 6, border: '0.5px solid #ddd',
                      background: 'transparent', color: '#555',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Soru Ekle
                  </button>
                )}
              </div>

              {(focusedItem.faq || []).length === 0 && (
                <div style={{ fontSize: 13, color: '#ccc', fontStyle: 'italic' }}>
                  {previewMode ? 'Soru eklenmemiş.' : 'Henüz soru yok. + Soru Ekle ile başla.'}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(focusedItem.faq || []).map((faqItem, fIdx) =>
                  (() => {
                    const isOpen = openAdminFaqIds.has(faqItem.id)
                    return (
                      <div key={faqItem.id} style={{
                        background: '#fafafa',
                        borderRadius: 10,
                        border: isOpen ? '0.5px solid #d0d0d0' : '0.5px solid #eee',
                        overflow: 'hidden',
                        transition: 'border-color 0.15s',
                      }}>
                        {/* Toggle başlık satırı */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px' }}>
                          <button
                            onClick={() => toggleAdminFaq(faqItem.id)}
                            style={{
                              flexShrink: 0, width: 22, height: 22,
                              border: 'none', background: 'transparent',
                              cursor: 'pointer', fontSize: 11,
                              color: isOpen ? '#111' : '#aaa',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'transform 0.15s, color 0.15s',
                              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            }}
                          >▶</button>
                          <span style={{ fontSize: 11, color: '#bbb', fontWeight: 700, flexShrink: 0 }}>
                            S{fIdx + 1}
                          </span>
                          {previewMode ? (
                            <span
                              onClick={() => toggleAdminFaq(faqItem.id)}
                              style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#111', cursor: 'pointer', lineHeight: 1.35 }}
                            >
                              {faqItem.question || <span style={{ color: '#ccc' }}>Soru girilmemiş</span>}
                            </span>
                          ) : (
                            <input
                              placeholder={`Soru ${fIdx + 1}...`}
                              value={faqItem.question}
                              onChange={e => updateFaq(focusedId, faqItem.id, 'question', e.target.value)}
                              style={{
                                flex: 1, fontSize: 13, fontWeight: 600,
                                padding: '4px 8px', borderRadius: 6,
                                border: '0.5px solid #e0e0e0',
                                fontFamily: 'inherit', outline: 'none', background: '#fff',
                              }}
                            />
                          )}
                          {!previewMode && (
                            <button
                              onClick={() => removeFaq(focusedId, faqItem.id)}
                              style={{
                                flexShrink: 0, width: 24, height: 24,
                                border: '0.5px solid #eee', borderRadius: 6,
                                background: 'transparent', cursor: 'pointer',
                                fontSize: 12, color: '#bbb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                              title="Soruyu sil"
                            >✕</button>
                          )}
                        </div>

                        {/* Cevap — toggle ile açılır */}
                        {isOpen && (
                          <div data-faq-answer={faqItem.id} style={{ padding: '0 12px 12px 42px', borderTop: '0.5px solid #f0f0f0', paddingTop: 10 }}>
                            {previewMode ? (
                              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                {faqItem.answer || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Cevap girilmemiş</span>}
                              </div>
                            ) : (
                              <textarea
                                placeholder="Cevap..."
                                value={faqItem.answer}
                                onChange={e => updateFaq(focusedId, faqItem.id, 'answer', e.target.value)}
                                style={{
                                  width: '100%', boxSizing: 'border-box',
                                  fontSize: 13, padding: '7px 8px',
                                  borderRadius: 6, border: '0.5px solid #e0e0e0',
                                  fontFamily: 'inherit', outline: 'none',
                                  resize: 'vertical', minHeight: 70,
                                  lineHeight: 1.6, color: '#444', background: '#fff',
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Araç listesi ─────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: 'icerik-studyosu',
    label: 'İçerik Stüdyosu',
    icon: '✦',
    component: StudyoContent,
  },
  {
    id: 'reklam-hiyerarsisi',
    label: 'Reklam Hiyerarşisi',
    icon: '◐',
    component: ReklamHiyerarsisi,
  },
  {
    id: 'rsa-ureticisi',
    label: 'RSA Üreticisi',
    icon: '◈',
    component: RsaUreticisi,
  },
  {
    id: 'mantik-haritasi',
    label: 'Terimler',
    icon: '⬡',
    component: MantiKHaritasi,
  },
  {
    id: 'yz-haritasi',
    label: 'YZ Haritası',
    icon: '◉',
    component: YzHaritasi,
  },
]

// ─── Stüdyo düzeni — hamburger toggle sidebar + içerik alanı ─────────────────
function StudyoLayout({ onLogout }) {
  const [activeId, setActiveId] = useState(TOOLS[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const ActiveTool = TOOLS.find(t => t.id === activeId)?.component ?? null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'inherit', position: 'relative' }}>

      {/* Hamburger butonu */}
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        style={{
          position: 'fixed',
          top: 14,
          left: sidebarOpen ? 210 : 14,
          zIndex: 200,
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '0.5px solid #e0e0e0',
          background: '#fff',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4.5,
          padding: 0,
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          transition: 'left 0.22s ease',
        }}
        title={sidebarOpen ? 'Menüyü kapat' : 'Menüyü aç'}
      >
        {sidebarOpen ? (
          <span style={{ fontSize: 14, color: '#555', lineHeight: 1, marginTop: -1 }}>✕</span>
        ) : (
          <>
            <span style={{ width: 14, height: 1.5, background: '#555', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 14, height: 1.5, background: '#555', borderRadius: 2, display: 'block' }} />
            <span style={{ width: 14, height: 1.5, background: '#555', borderRadius: 2, display: 'block' }} />
          </>
        )}
      </button>

      {/* Sol sidebar */}
      <aside style={{
        width: 200,
        flexShrink: 0,
        background: '#fafafa',
        borderRight: '0.5px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '1.5rem',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-200px)',
        transition: 'transform 0.22s ease',
        overflowY: 'auto',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#bbb', letterSpacing: '0.08em', padding: '0 16px', marginBottom: '0.75rem' }}>
          STÜDYO
        </div>
        <nav style={{ flex: 1 }}>
          {TOOLS.map(tool => {
            const active = tool.id === activeId
            return (
              <button
                key={tool.id}
                onClick={() => setActiveId(tool.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '9px 16px',
                  background: active ? '#fff' : 'transparent',
                  border: 'none',
                  boxShadow: active ? 'inset 2px 0 0 #111' : 'none',
                  color: active ? '#111' : '#888',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s',
                }}
              >
                <span style={{ fontSize: 12, opacity: active ? 1 : 0.5 }}>{tool.icon}</span>
                {tool.label}
              </button>
            )
          })}
        </nav>

        {/* Çıkış butonu */}
        <div style={{ padding: '12px 10px', borderTop: '0.5px solid #e8e8e8' }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px 10px',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              color: '#aaa',
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#555'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}
            title="Oturumu kapat"
          >
            <span style={{ fontSize: 13 }}>⎋</span>
            Çıkış yap
          </button>
        </div>
      </aside>

      {/* İçerik alanı */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        marginLeft: sidebarOpen ? 200 : 0,
        transition: 'margin-left 0.22s ease',
        paddingTop: '0.5rem',
      }}>
        {ActiveTool && <ActiveTool />}
      </main>
    </div>
  )
}

// ─── Ana bileşen — sadece auth hook'ları burada ───────────────────────────────
export default function StudyoPage() {
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('studyo_auth') === '1') setAuthed(true)
    setAuthChecked(true)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('studyo_auth')
    setAuthed(false)
  }

  if (!authChecked) return null
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />
  return <StudyoLayout onLogout={handleLogout} />
}
