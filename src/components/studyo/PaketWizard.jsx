'use client'

// PaketWizard — 4 adımlı paket oluşturma sihirbazı
// 1) Temel  →  2) İçerik & Özellikler  →  3) Fiyat & Add-on  →  4) Yayın

import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

const CATEGORIES = ['veri', 'reklam', 'web', 'otomasyon', 'genel']
const CAT_COLORS = {
  veri: '#2563eb',
  reklam: '#EF4444',
  web: '#1D9E75',
  otomasyon: '#8B5CF6',
  genel: '#6B7280',
}
const STEP_LABELS = ['Temel', 'İçerik & Özellikler', 'Fiyat & Add-on', 'Yayın']

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const emptyPaket = () => ({
  id: 'paket_' + Math.random().toString(36).substr(2, 9),
  slug: '',
  title: '',
  tagline: '',
  description: '',
  category: 'veri',
  cover: '',
  features: [],
  pricing: {
    setup: { amount: 0, currency: 'TRY', label: 'Tek seferlik kurulum' },
    monthly: { amount: 0, currency: 'TRY', label: 'Aylık bakım' },
  },
  addons: [],
  cta: 'Teklif İste',
  published: false,
  featured: false,
  order: 999,
  publishedAt: '',
  updatedAt: new Date().toISOString(),
})

export default function PaketWizard({ initialPaket, onCancel, onSave }) {
  const [paket, setPaket] = useState(() => ({
    ...emptyPaket(),
    ...(initialPaket || {}),
    pricing: {
      ...emptyPaket().pricing,
      ...(initialPaket?.pricing || {}),
    },
  }))
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [featureInput, setFeatureInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  const update = (patch) => setPaket((p) => ({ ...p, ...patch }))
  const updatePricing = (key, patch) =>
    setPaket((p) => ({
      ...p,
      pricing: { ...p.pricing, [key]: { ...p.pricing?.[key], ...patch } },
    }))

  const accent = CAT_COLORS[paket.category] || CAT_COLORS.genel

  // ─── File upload ────────────────────────────────────────────────
  const handleFileUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/blog-image-upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yükleme başarısız')
      update({ cover: data.url })
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  // ─── Features ───────────────────────────────────────────────────
  const addFeature = () => {
    const v = featureInput.trim()
    if (!v) return
    update({ features: [...(paket.features || []), v] })
    setFeatureInput('')
  }
  const removeFeature = (i) => {
    const next = [...(paket.features || [])]
    next.splice(i, 1)
    update({ features: next })
  }

  // ─── Add-ons ────────────────────────────────────────────────────
  const addAddon = () => {
    const id = 'addon_' + Math.random().toString(36).substr(2, 6)
    update({
      addons: [
        ...(paket.addons || []),
        { id, title: 'Yeni opsiyon', price: 0, recurrence: 'once' },
      ],
    })
  }
  const updateAddon = (id, patch) => {
    update({
      addons: (paket.addons || []).map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })
  }
  const removeAddon = (id) => {
    update({ addons: (paket.addons || []).filter((a) => a.id !== id) })
  }

  // ─── Validation ─────────────────────────────────────────────────
  const canNext = () => {
    if (step === 1) return !!paket.title.trim() && !!paket.category
    if (step === 2) return paket.description.trim().length >= 10 || (paket.features || []).length > 0
    if (step === 3) return true
    return true
  }

  // ─── Publish ────────────────────────────────────────────────────
  const finalize = async (publish) => {
    setPublishing(true)
    try {
      const final = {
        ...paket,
        slug: paket.slug || slugify(paket.title) || paket.id,
        published: publish,
        publishedAt:
          publish && !paket.publishedAt
            ? new Date().toISOString()
            : paket.publishedAt,
        updatedAt: new Date().toISOString(),
      }
      await onSave(final)
    } finally {
      setPublishing(false)
    }
  }

  // ─── Styles ─────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
  }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }
  const btnPrimary = {
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  }
  const btnSecondary = {
    background: '#fff',
    color: '#555',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    cursor: 'pointer',
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      {/* Adım göstergesi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const isActive = n === step
          const isDone = n < step
          return (
            <button
              key={n}
              onClick={() => setStep(n)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: isActive ? accent : isDone ? '#f0fdf4' : '#f5f5f5',
                color: isActive ? '#fff' : isDone ? '#1D9E75' : '#999',
                border: 'none',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: isActive ? 'rgba(255,255,255,0.25)' : isDone ? '#1D9E75' : '#ddd',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                {isDone ? '✓' : n}
              </span>
              {label}
            </button>
          )
        })}
      </div>

      {/* Step 1 — Temel */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Paket Başlığı *</label>
            <input
              style={inputStyle}
              value={paket.title}
              onChange={(e) => update({ title: e.target.value, slug: paket.slug || slugify(e.target.value) })}
              placeholder="Veri Analiz Paketi"
            />
          </div>
          <div>
            <label style={labelStyle}>Slug (URL)</label>
            <input
              style={inputStyle}
              value={paket.slug}
              onChange={(e) => update({ slug: slugify(e.target.value) })}
              placeholder="veri-analiz-paketi"
            />
          </div>
          <div>
            <label style={labelStyle}>Tagline (kısa cümle)</label>
            <input
              style={inputStyle}
              value={paket.tagline}
              onChange={(e) => update({ tagline: e.target.value })}
              placeholder="GA4, Looker Studio, sunucu taraflı takip — tek paket."
            />
          </div>
          <div>
            <label style={labelStyle}>Kategori *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => update({ category: cat })}
                  style={{
                    padding: '6px 14px',
                    background: paket.category === cat ? CAT_COLORS[cat] : '#fff',
                    color: paket.category === cat ? '#fff' : '#666',
                    border: '1px solid ' + (paket.category === cat ? CAT_COLORS[cat] : '#ddd'),
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'inherit',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Kapak Görseli</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ ...btnSecondary, opacity: uploading ? 0.6 : 1 }}
              >
                {uploading ? 'Yükleniyor...' : paket.cover ? 'Değiştir' : 'Görsel Yükle'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
              {paket.cover && (
                <img
                  src={paket.cover}
                  alt=""
                  style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                />
              )}
              {uploadError && <span style={{ fontSize: 11, color: '#ef4444' }}>{uploadError}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — İçerik */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Açıklama (Markdown destekli)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 180, fontFamily: 'ui-monospace, monospace', resize: 'vertical' }}
              value={paket.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Bu paket neyi içeriyor, kim için, hangi sonuçları getiriyor..."
            />
            {paket.description && (
              <button
                onClick={() => setShowPreview((s) => !s)}
                style={{ ...btnSecondary, marginTop: 8, fontSize: 11, padding: '4px 10px' }}
              >
                {showPreview ? 'Önizlemeyi gizle' : 'Önizlemeyi göster'}
              </button>
            )}
            {showPreview && (
              <div
                style={{
                  marginTop: 10,
                  padding: 16,
                  background: '#fafafa',
                  borderRadius: 8,
                  border: '1px solid #eee',
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {paket.description}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Özellikler (Paket içeriği)</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFeature()
                  }
                }}
                placeholder="Örn: GA4 kurulumu ve özel olay yapısı"
              />
              <button onClick={addFeature} style={btnPrimary}>+ Ekle</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(paket.features || []).map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: accent }}>✓</span>
                  <span style={{ flex: 1 }}>{f}</span>
                  <button
                    onClick={() => removeFeature(i)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Fiyat & Add-on */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <label style={labelStyle}>Tek Seferlik Kurulum</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                style={{ ...inputStyle, flex: 1 }}
                value={paket.pricing?.setup?.amount || 0}
                onChange={(e) => updatePricing('setup', { amount: Number(e.target.value) })}
                placeholder="25000"
              />
              <input
                style={{ ...inputStyle, width: 100 }}
                value={paket.pricing?.setup?.currency || 'TRY'}
                onChange={(e) => updatePricing('setup', { currency: e.target.value })}
              />
            </div>
            <input
              style={{ ...inputStyle, marginTop: 6 }}
              value={paket.pricing?.setup?.label || ''}
              onChange={(e) => updatePricing('setup', { label: e.target.value })}
              placeholder="Tek seferlik kurulum"
            />
          </div>

          <div>
            <label style={labelStyle}>Aylık Bakım</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                style={{ ...inputStyle, flex: 1 }}
                value={paket.pricing?.monthly?.amount || 0}
                onChange={(e) => updatePricing('monthly', { amount: Number(e.target.value) })}
                placeholder="5000"
              />
              <input
                style={{ ...inputStyle, width: 100 }}
                value={paket.pricing?.monthly?.currency || 'TRY'}
                onChange={(e) => updatePricing('monthly', { currency: e.target.value })}
              />
            </div>
            <input
              style={{ ...inputStyle, marginTop: 6 }}
              value={paket.pricing?.monthly?.label || ''}
              onChange={(e) => updatePricing('monthly', { label: e.target.value })}
              placeholder="Aylık bakım"
            />
            <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
              0 bırakırsan görüntülenmez.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Ek Modüller (Add-on)</label>
              <button onClick={addAddon} style={{ ...btnSecondary, fontSize: 11, padding: '5px 10px' }}>
                + Yeni Add-on
              </button>
            </div>
            {(paket.addons || []).length === 0 ? (
              <p style={{ fontSize: 12, color: '#aaa', padding: '12px', background: '#fafafa', borderRadius: 8, textAlign: 'center', border: '1px dashed #e0e0e0' }}>
                Henüz add-on yok.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(paket.addons || []).map((a) => (
                  <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 100px 30px', gap: 6, alignItems: 'center', padding: 10, background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
                    <input
                      style={{ ...inputStyle, fontSize: 12, padding: '6px 10px' }}
                      value={a.title}
                      onChange={(e) => updateAddon(a.id, { title: e.target.value })}
                      placeholder="Add-on adı"
                    />
                    <input
                      type="number"
                      style={{ ...inputStyle, fontSize: 12, padding: '6px 10px' }}
                      value={a.price || 0}
                      onChange={(e) => updateAddon(a.id, { price: Number(e.target.value) })}
                      placeholder="Fiyat"
                    />
                    <select
                      style={{ ...inputStyle, fontSize: 12, padding: '6px 10px' }}
                      value={a.recurrence || 'once'}
                      onChange={(e) => updateAddon(a.id, { recurrence: e.target.value })}
                    >
                      <option value="once">Tek</option>
                      <option value="monthly">Aylık</option>
                    </select>
                    <button
                      onClick={() => removeAddon(a.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4 — Yayın */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ padding: 16, background: '#fafafa', borderRadius: 12, border: '1px solid #eee' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              Önizleme
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>{paket.title || '(başlıksız)'}</div>
            {paket.tagline && <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{paket.tagline}</div>}
            <div style={{ marginTop: 10, fontSize: 12, color: '#555' }}>
              {paket.pricing?.setup?.amount > 0 && (
                <div>
                  {paket.pricing.setup.label}: <b>{Number(paket.pricing.setup.amount).toLocaleString('tr-TR')} {paket.pricing.setup.currency}</b>
                </div>
              )}
              {paket.pricing?.monthly?.amount > 0 && (
                <div>
                  {paket.pricing.monthly.label}: <b>{Number(paket.pricing.monthly.amount).toLocaleString('tr-TR')} {paket.pricing.monthly.currency} /ay</b>
                </div>
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#999' }}>
              Slug: <code>/{paket.slug || slugify(paket.title)}</code> · {(paket.features || []).length} özellik · {(paket.addons || []).length} add-on
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 12, background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
            <input
              type="checkbox"
              checked={!!paket.featured}
              onChange={(e) => update({ featured: e.target.checked })}
              style={{ width: 16, height: 16 }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Ana sayfada öne çıkar</div>
              <div style={{ fontSize: 11, color: '#888' }}>Ana sayfa &quot;Paketler&quot; şeridinde gösterilir.</div>
            </div>
          </label>

          <div>
            <label style={labelStyle}>Sıralama (küçük = önde)</label>
            <input
              type="number"
              style={inputStyle}
              value={paket.order ?? 999}
              onChange={(e) => update({ order: Number(e.target.value) })}
            />
          </div>

          <div>
            <label style={labelStyle}>CTA butonu yazısı</label>
            <input
              style={inputStyle}
              value={paket.cta || ''}
              onChange={(e) => update({ cta: e.target.value })}
              placeholder="Teklif İste"
            />
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid #eee' }}>
            <button
              onClick={() => finalize(false)}
              disabled={publishing}
              style={{ ...btnSecondary, flex: 1, opacity: publishing ? 0.6 : 1 }}
            >
              Taslak Olarak Kaydet
            </button>
            <button
              onClick={() => finalize(true)}
              disabled={publishing}
              style={{ ...btnPrimary, flex: 1, background: accent, opacity: publishing ? 0.6 : 1 }}
            >
              {publishing ? 'Kaydediliyor...' : '🚀 Yayınla'}
            </button>
          </div>
        </div>
      )}

      {/* Adım navigasyonu (step < 4) */}
      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 16, borderTop: '1px solid #eee' }}>
          <button
            onClick={() => (step === 1 ? onCancel?.() : setStep(step - 1))}
            style={btnSecondary}
          >
            {step === 1 ? 'İptal' : '← Geri'}
          </button>
          <button
            onClick={() => canNext() && setStep(step + 1)}
            disabled={!canNext()}
            style={{ ...btnPrimary, opacity: canNext() ? 1 : 0.4, cursor: canNext() ? 'pointer' : 'not-allowed' }}
          >
            İleri →
          </button>
        </div>
      )}
    </div>
  )
}
