'use client'

// app/[lang]/studyo/page.jsx
// Erişim: sukrugencoglu.com/tr/studyo  |  sukrugencoglu.com/en/studyo
// Giriş korumalı — STUDYO_USER + STUDYO_PASS env var'larıyla

import { useState, useEffect } from 'react'

// ─── Login ekranı ─────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', fontSize: 14, padding: '9px 12px', borderRadius: 8, border: '0.5px solid #ddd', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
        />

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

// ─── Ana bileşen — sadece auth hook'ları burada ───────────────────────────────
export default function StudyoPage() {
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('studyo_auth') === '1') setAuthed(true)
    setAuthChecked(true)
  }, [])

  if (!authChecked) return null
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />
  return <StudyoContent />
}
