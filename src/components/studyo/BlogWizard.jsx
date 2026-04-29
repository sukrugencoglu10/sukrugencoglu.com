'use client'

// BlogWizard — 5 adımlı blog yazısı oluşturma sihirbazı
// 1) İçerik  →  2) Başlık  →  3) Görsel  →  4) Kategori + Etiket  →  5) Önizle & Yayınla

import { useState, useMemo, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

const CATEGORIES = ['genel', 'gtm', 'analytics', 'cro', 'otomasyon', 'reklam', 'seo']
const CAT_COLORS = {
  gtm: '#1D9E75', analytics: '#3B82F6', cro: '#F59E0B',
  otomasyon: '#8B5CF6', genel: '#6B7280', reklam: '#EF4444', seo: '#0EA5E9',
}
const STEP_LABELS = ['İçerik', 'Başlık', 'Görsel', 'Kategori & Etiket', 'Önizle & Yayınla']

const slugify = (s) =>
  (s || '').toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')

const readingMin = (text) => Math.max(1, Math.round((text || '').trim().split(/\s+/).filter(Boolean).length / 200))

// Yapıştırılan HTML'i (tablolar dahil) markdown'a dönüştürür.
// Google Sheets / Excel / Notion / Word kopyalamalarını destekler.
function htmlToMarkdown(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')

  // Hücre içeriği: walk() ile <b>, <a>, <i> vs. markdown'a çevrilsin; satır sonları ve | kaçırılsın
  const cellText = (c) => {
    const inner = Array.from(c.childNodes).map(walk).join('')
    return inner.trim().replace(/\s*\n+\s*/g, ' ').replace(/\|/g, '\\|')
  }
  const tableToMd = (table) => {
    const rows = Array.from(table.querySelectorAll('tr'))
    if (!rows.length) return ''
    const arrs = rows.map(r => Array.from(r.querySelectorAll('th,td')).map(cellText))
    const cols = Math.max(...arrs.map(r => r.length))
    if (!cols) return ''
    const padded = arrs.map(r => { while (r.length < cols) r.push(''); return r })
    const firstHasTh = !!rows[0].querySelector('th')
    const header = firstHasTh ? padded[0] : Array(cols).fill(' ')
    const body = firstHasTh ? padded.slice(1) : padded
    const line = (a) => '| ' + a.join(' | ') + ' |'
    const sep = '| ' + Array(cols).fill('---').join(' | ') + ' |'
    return '\n\n' + line(header) + '\n' + sep + '\n' + body.map(line).join('\n') + '\n\n'
  }

  const walk = (node) => {
    if (node.nodeType === 3) return node.textContent
    if (node.nodeType !== 1) return ''
    const tag = node.tagName.toLowerCase()
    const kids = () => Array.from(node.childNodes).map(walk).join('')
    switch (tag) {
      case 'table': return tableToMd(node)
      case 'thead': case 'tbody': case 'tfoot': case 'tr': case 'td': case 'th': case 'colgroup': case 'col': case 'caption':
        return '' // parent <table> handles content
      case 'h1': return '\n\n# ' + kids().trim() + '\n\n'
      case 'h2': return '\n\n## ' + kids().trim() + '\n\n'
      case 'h3': return '\n\n### ' + kids().trim() + '\n\n'
      case 'h4': case 'h5': case 'h6': return '\n\n#### ' + kids().trim() + '\n\n'
      case 'b': case 'strong': { const t = kids(); return t.trim() ? '**' + t + '**' : t }
      case 'i': case 'em': { const t = kids(); return t.trim() ? '*' + t + '*' : t }
      case 'code': return '`' + kids() + '`'
      case 'pre': return '\n\n```\n' + node.textContent + '\n```\n\n'
      case 'a': {
        const href = node.getAttribute('href') || ''
        const text = kids()
        return href ? `[${text}](${href})` : text
      }
      case 'ul': {
        const items = Array.from(node.children).filter(c => c.tagName?.toLowerCase() === 'li')
          .map(li => '- ' + walk(li).trim().replace(/\s*\n+\s*/g, ' '))
        return '\n\n' + items.join('\n') + '\n\n'
      }
      case 'ol': {
        const items = Array.from(node.children).filter(c => c.tagName?.toLowerCase() === 'li')
          .map((li, i) => (i + 1) + '. ' + walk(li).trim().replace(/\s*\n+\s*/g, ' '))
        return '\n\n' + items.join('\n') + '\n\n'
      }
      case 'li': return kids()
      case 'br': return '  \n'
      case 'p': case 'div': case 'section': case 'article': return kids() + '\n\n'
      case 'blockquote': return '\n> ' + kids().trim().replace(/\n/g, '\n> ') + '\n\n'
      case 'hr': return '\n\n---\n\n'
      case 'script': case 'style': case 'noscript': case 'meta': case 'link': return ''
      default: return kids()
    }
  }

  let md = walk(doc.body)
  md = md.replace(/\u00A0/g, ' ') // non-breaking space → normal space
  md = md.replace(/[ \t]+\n/g, '\n') // trim trailing whitespace on lines
  md = md.replace(/\n{3,}/g, '\n\n') // collapse 3+ blank lines
  return md.trim()
}

const emptyPost = () => ({
  id: 'blog_' + Math.random().toString(36).substr(2, 9),
  slug: '',
  titleTR: '', titleEN: '',
  summaryTR: '', summaryEN: '',
  contentTR: '', contentEN: '',
  tags: [],
  category: 'genel',
  coverEmoji: '📝',
  coverColor: '#1D9E75',
  coverImage: '',
  publishedAt: new Date().toISOString().split('T')[0],
  readingMinutes: 5,
  published: false,
})

export default function BlogWizard({ initialPost, onCancel, onSave }) {
  const [post, setPost] = useState(() => ({ ...emptyPost(), ...(initialPost || {}) }))
  const [step, setStep] = useState(1)
  const [titleMode, setTitleMode] = useState('suggest') // 'suggest' | 'manual'
  const [titleSuggestions, setTitleSuggestions] = useState([])
  const [loadingTitles, setLoadingTitles] = useState(false)
  const [titleError, setTitleError] = useState('')
  const [suggestedCategory, setSuggestedCategory] = useState(null)
  const [tagSuggestions, setTagSuggestions] = useState([])
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [metaError, setMetaError] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [manualTag, setManualTag] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  // Keyword-driven draft generation (Faz D)
  const [draftMode, setDraftMode] = useState('blank') // 'blank' | 'keyword'
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordPillar, setKeywordPillar] = useState('genel')
  const [generatingDraft, setGeneratingDraft] = useState(false)
  const [draftError, setDraftError] = useState('')

  // EN translation (Faz D)
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState('')

  const update = (patch) => setPost(p => ({ ...p, ...patch }))

  // ─── AI helpers ─────────────────────────────────────────────────
  const suggestTitles = async () => {
    setLoadingTitles(true); setTitleError('')
    try {
      const res = await fetch('/api/blog-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest_titles', contentTR: post.contentTR }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Başlıklar alınamadı')
      setTitleSuggestions(data.titles || [])
    } catch (err) {
      setTitleError(err.message)
    } finally {
      setLoadingTitles(false)
    }
  }

  const suggestCategoryAndTags = async () => {
    setLoadingMeta(true); setMetaError('')
    try {
      const res = await fetch('/api/blog-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest_category_tags', contentTR: post.contentTR }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Öneri alınamadı')
      setSuggestedCategory(data.category)
      setTagSuggestions(data.tags || [])
      if (!post.category || post.category === 'genel') update({ category: data.category })
    } catch (err) {
      setMetaError(err.message)
    } finally {
      setLoadingMeta(false)
    }
  }

  const generateDraftFromKeyword = async () => {
    if (!keywordInput.trim()) return
    setGeneratingDraft(true); setDraftError('')
    try {
      const res = await fetch('/api/blog-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_draft_from_keyword',
          keyword: keywordInput.trim(),
          pillar: keywordPillar,
          targetLength: 800,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Taslak üretilemedi')
      update({
        contentTR: data.contentTR || '',
        titleTR: data.titleTR || '',
        summaryTR: data.summaryTR || '',
        category: data.suggestedCategory || 'genel',
        tags: Array.isArray(data.suggestedTags) ? data.suggestedTags : [],
      })
      setDraftMode('blank') // ekran taslakla dolu, normal akışa geç
    } catch (err) {
      setDraftError(err.message)
    } finally {
      setGeneratingDraft(false)
    }
  }

  const translateToEn = async () => {
    if (!post.contentTR) return
    setTranslating(true); setTranslateError('')
    try {
      const res = await fetch('/api/blog-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate_to_en',
          titleTR: post.titleTR,
          summaryTR: post.summaryTR,
          contentTR: post.contentTR,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Çeviri başarısız')
      update({
        titleEN: data.titleEN || '',
        summaryEN: data.summaryEN || '',
        contentEN: data.contentEN || '',
      })
    } catch (err) {
      setTranslateError(err.message)
    } finally {
      setTranslating(false)
    }
  }

  const suggestSummary = async () => {
    if (post.summaryTR) return
    setLoadingSummary(true)
    try {
      const res = await fetch('/api/blog-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest_summary', contentTR: post.contentTR }),
      })
      const data = await res.json()
      if (res.ok && data.summary) update({ summaryTR: data.summary })
    } catch {
      // sessizce geç; kullanıcı elle yazar
    } finally {
      setLoadingSummary(false)
    }
  }

  // Auto-fetch on step change
  useEffect(() => {
    if (step === 2 && !titleSuggestions.length && post.contentTR && !loadingTitles) suggestTitles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if (step === 4 && !tagSuggestions.length && !suggestedCategory && post.contentTR && !loadingMeta) suggestCategoryAndTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if (step === 5 && !post.summaryTR && post.contentTR && !loadingSummary) suggestSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ─── File upload ────────────────────────────────────────────────
  const handleFileUpload = async (file) => {
    if (!file) return
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/blog-image-upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yükleme başarısız')
      update({ coverImage: data.url })
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  // ─── Validation / nav ───────────────────────────────────────────
  const canNext = () => {
    if (step === 1) return post.contentTR.trim().length >= 20
    if (step === 2) return !!post.titleTR.trim()
    if (step === 3) return true
    if (step === 4) return !!post.category
    return true
  }

  const go = (n) => setStep(n)

  // ─── Publish / Save ─────────────────────────────────────────────
  const finalize = async (publish) => {
    setPublishing(true)
    try {
      const final = {
        ...post,
        slug: post.slug || slugify(post.titleTR) || post.id,
        readingMinutes: post.readingMinutes || readingMin(post.contentTR),
        published: publish,
        publishedAt: publish && !post.publishedAt ? new Date().toISOString().split('T')[0] : post.publishedAt,
      }
      await onSave(final)
    } finally {
      setPublishing(false)
    }
  }

  const accent = CAT_COLORS[post.category] || '#1D9E75'

  // ─── UI ─────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, maxWidth: 900, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <div key={label} onClick={() => (done ? go(n) : null)} style={{
              flex: 1, minWidth: 120, padding: '8px 10px', borderRadius: 8,
              background: active ? accent + '18' : (done ? '#f5f5f5' : '#fafafa'),
              border: `1px solid ${active ? accent : '#eee'}`,
              color: active ? accent : (done ? '#555' : '#bbb'),
              fontSize: 11, fontWeight: 600, textAlign: 'center',
              cursor: done ? 'pointer' : 'default', transition: 'all 0.15s',
            }}>
              {n}. {label}
            </div>
          )
        })}
      </div>

      {/* STEP 1 — Content */}
      {step === 1 && (
        <div>
          {/* Mode toggle: blank / keyword */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <button
              onClick={() => setDraftMode('blank')}
              style={{
                padding: '8px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
                background: draftMode === 'blank' ? accent + '18' : '#f5f5f5',
                border: `1px solid ${draftMode === 'blank' ? accent : '#ddd'}`,
                color: draftMode === 'blank' ? accent : '#555',
              }}>
              ✎ Boş başla
            </button>
            <button
              onClick={() => setDraftMode('keyword')}
              style={{
                padding: '8px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
                background: draftMode === 'keyword' ? accent + '18' : '#f5f5f5',
                border: `1px solid ${draftMode === 'keyword' ? accent : '#ddd'}`,
                color: draftMode === 'keyword' ? accent : '#555',
              }}>
              ✨ Anahtar kelimeden AI taslak
            </button>
          </div>

          {draftMode === 'keyword' && (
            <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#888', margin: '0 0 12px' }}>
                Anahtar kelime gir, AI taslak yazıyı üretsin. Sonra düzenleyip yayınlarsın.
              </p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <input
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  placeholder="ör. google ads dönüşüm takibi kurulumu"
                  style={{ flex: 2, minWidth: 220, padding: 10, fontSize: 13, border: '1px solid #ddd', borderRadius: 6, outline: 'none' }}
                />
                <select
                  value={keywordPillar}
                  onChange={e => setKeywordPillar(e.target.value)}
                  style={{ flex: 1, minWidth: 130, padding: 10, fontSize: 13, border: '1px solid #ddd', borderRadius: 6, background: '#fff' }}>
                  <option value="genel">Genel</option>
                  <option value="reklam">Google/Meta Ads</option>
                  <option value="analytics">Analytics</option>
                  <option value="gtm">GTM</option>
                  <option value="cro">CRO</option>
                  <option value="seo">SEO</option>
                  <option value="otomasyon">Otomasyon</option>
                </select>
                <button
                  onClick={generateDraftFromKeyword}
                  disabled={generatingDraft || !keywordInput.trim()}
                  style={{
                    padding: '0 18px', background: generatingDraft || !keywordInput.trim() ? '#ccc' : accent,
                    color: '#fff', border: 'none', borderRadius: 6,
                    cursor: generatingDraft ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600,
                  }}>
                  {generatingDraft ? 'Üretiliyor...' : 'Taslak üret →'}
                </button>
              </div>
              {draftError && (
                <div style={{ padding: 10, background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 6, color: '#cf1322', fontSize: 12 }}>
                  {draftError}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>Blog metnini yapıştır</h2>
            <button
              onClick={() => setShowPreview(p => !p)}
              style={{
                padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
                background: showPreview ? accent + '18' : '#f5f5f5',
                border: `1px solid ${showPreview ? accent : '#ddd'}`,
                color: showPreview ? accent : '#555',
                transition: 'all 0.15s',
              }}
            >
              {showPreview ? '✎ Sadece Editör' : '⊞ Önizleme'}
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
            Markdown destekler (## başlık, **kalın**, - liste, vb.). Metin girildikten sonra başlık, kategori, etiket ve özet önerileri otomatik üretilir.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <textarea
              value={post.contentTR}
              onChange={e => update({ contentTR: e.target.value })}
              onPaste={e => {
                const html = e.clipboardData?.getData('text/html')
                if (!html) return
                const md = htmlToMarkdown(html)
                if (!md) return
                e.preventDefault()
                const ta = e.target
                const start = ta.selectionStart ?? ta.value.length
                const end = ta.selectionEnd ?? ta.value.length
                const next = ta.value.slice(0, start) + md + ta.value.slice(end)
                update({ contentTR: next })
                requestAnimationFrame(() => {
                  const pos = start + md.length
                  try { ta.setSelectionRange(pos, pos); ta.focus() } catch {}
                })
              }}
              rows={20}
              placeholder={'## Giriş\n\nBurada yazının gövdesi yer alır...\n\n- Madde 1\n- Madde 2\n\nİpucu: Google Sheets / Excel / Notion\'dan tablo yapıştırabilirsin — otomatik markdown tablosuna dönüşür.'}
              style={{
                flex: 1, padding: 14, fontSize: 13, lineHeight: 1.6,
                border: '1px solid #ddd', borderRadius: 8, outline: 'none',
                resize: 'vertical', fontFamily: 'monospace', background: '#f9f9f9',
                boxSizing: 'border-box', minHeight: 420,
              }}
            />
            {showPreview && (
              <div style={{
                flex: 1, padding: 16, fontSize: 14, lineHeight: 1.8,
                border: '1px solid #eee', borderRadius: 8, background: '#fff',
                overflowY: 'auto', minHeight: 420, maxHeight: 600,
                color: '#222',
              }}>
                {post.contentTR.trim() ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      h1: ({children}) => <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px', borderBottom: '1px solid #eee', paddingBottom: 6 }}>{children}</h1>,
                      h2: ({children}) => <h2 style={{ fontSize: 18, fontWeight: 700, margin: '20px 0 8px' }}>{children}</h2>,
                      h3: ({children}) => <h3 style={{ fontSize: 15, fontWeight: 600, margin: '16px 0 6px' }}>{children}</h3>,
                      p: ({children}) => <p style={{ margin: '0 0 12px' }}>{children}</p>,
                      ul: ({children}) => <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>{children}</ul>,
                      ol: ({children}) => <ol style={{ paddingLeft: 20, margin: '0 0 12px' }}>{children}</ol>,
                      li: ({children}) => <li style={{ marginBottom: 4 }}>{children}</li>,
                      strong: ({children}) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                      table: ({children}) => <table style={{ borderCollapse: 'collapse', width: '100%', margin: '0 0 12px', fontSize: 13 }}>{children}</table>,
                      th: ({children}) => <th style={{ border: '1px solid #ddd', padding: '6px 10px', background: '#f5f5f5', fontWeight: 600, textAlign: 'left' }}>{children}</th>,
                      td: ({children}) => <td style={{ border: '1px solid #ddd', padding: '6px 10px' }}>{children}</td>,
                      hr: () => <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />,
                      code: ({children, className}) => className
                        ? <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, overflow: 'auto', fontSize: 12 }}><code className={className}>{children}</code></pre>
                        : <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>{children}</code>,
                    }}
                  >
                    {post.contentTR}
                  </ReactMarkdown>
                ) : (
                  <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 13 }}>Önizleme için solda yazmaya başlayın...</span>
                )}
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
            {post.contentTR.trim().split(/\s+/).filter(Boolean).length} kelime · ~{readingMin(post.contentTR)} dk okuma
          </div>
        </div>
      )}

      {/* STEP 2 — Title */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, margin: '0 0 6px', fontWeight: 700 }}>Başlık seç</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
            Metnini analiz ettim — aşağıdaki iki başlıktan birini seç veya kendin yaz.
          </p>

          {loadingTitles && <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 13 }}>Başlıklar üretiliyor...</div>}
          {titleError && (
            <div style={{ padding: 12, background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 6, color: '#cf1322', fontSize: 12, marginBottom: 12 }}>
              {titleError} <button onClick={suggestTitles} style={{ marginLeft: 8, fontSize: 11, padding: '4px 10px', border: '1px solid #cf1322', background: '#fff', color: '#cf1322', borderRadius: 4, cursor: 'pointer' }}>Tekrar dene</button>
            </div>
          )}

          {!loadingTitles && titleSuggestions.map((t, i) => (
            <button
              key={i}
              onClick={() => { update({ titleTR: t, slug: slugify(t) }); setTitleMode('suggest') }}
              style={{
                display: 'block', width: '100%', padding: '14px 16px', marginBottom: 10,
                background: post.titleTR === t ? accent + '12' : '#fff',
                border: `2px solid ${post.titleTR === t ? accent : '#eee'}`,
                borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#111',
                transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: 10, color: '#aaa', fontWeight: 600, display: 'block', marginBottom: 3 }}>ÖNERİ {i + 1}</span>
              {t}
            </button>
          ))}

          <button
            onClick={() => setTitleMode('manual')}
            style={{
              display: 'block', width: '100%', padding: '14px 16px', marginBottom: 10,
              background: titleMode === 'manual' ? accent + '12' : '#fff',
              border: `2px dashed ${titleMode === 'manual' ? accent : '#ddd'}`,
              borderRadius: 10, textAlign: 'left', cursor: 'pointer', fontSize: 14, color: '#555',
            }}>
            ✍️ Kendim yazayım
          </button>

          {titleMode === 'manual' && (
            <input
              value={post.titleTR}
              onChange={e => update({ titleTR: e.target.value, slug: slugify(e.target.value) })}
              placeholder="Başlığını buraya yaz..."
              autoFocus
              style={{ width: '100%', padding: 12, fontSize: 15, fontWeight: 600, border: `1px solid ${accent}`, borderRadius: 8, outline: 'none', marginTop: 4, boxSizing: 'border-box' }}
            />
          )}

          {post.titleTR && (
            <details style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
              <summary style={{ cursor: 'pointer', padding: '6px 0' }}>İngilizce başlık (opsiyonel)</summary>
              <input
                value={post.titleEN}
                onChange={e => update({ titleEN: e.target.value })}
                placeholder="English title..."
                style={{ width: '100%', padding: 10, fontSize: 13, border: '1px solid #ddd', borderRadius: 6, outline: 'none', marginTop: 6, boxSizing: 'border-box' }}
              />
            </details>
          )}
        </div>
      )}

      {/* STEP 3 — Cover image */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 18, margin: '0 0 6px', fontWeight: 700 }}>Kapak görseli ekle</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
            Yazının başlığının üstünde görünecek. İstersen atla, emoji + renk kullanılır.
          </p>

          {post.coverImage ? (
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <img src={post.coverImage} alt="kapak" style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 10, border: '1px solid #eee' }} />
              <button
                onClick={() => update({ coverImage: '' })}
                style={{ position: 'absolute', top: 10, right: 10, padding: '6px 12px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                Kaldır
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault() }}
              onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files?.[0]) }}
              style={{
                border: '2px dashed #ccc', borderRadius: 12, padding: '3rem 1rem', textAlign: 'center',
                cursor: uploading ? 'wait' : 'pointer', color: '#888', background: '#fafafa', marginBottom: 14,
              }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>
                {uploading ? 'Yükleniyor...' : 'Görsel yüklemek için tıkla veya sürükle'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>JPG, PNG, WEBP, GIF · max 8MB</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={e => handleFileUpload(e.target.files?.[0])}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {uploadError && (
            <div style={{ padding: 10, background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 6, color: '#cf1322', fontSize: 12, marginBottom: 10 }}>
              {uploadError}
            </div>
          )}

          <div style={{ padding: 14, background: '#fafafa', borderRadius: 10, border: '1px solid #eee' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 600 }}>
              Görsel yoksa gösterilecek emoji + renk
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                value={post.coverEmoji}
                onChange={e => update({ coverEmoji: e.target.value })}
                maxLength={4}
                style={{ width: 60, padding: 8, fontSize: 24, textAlign: 'center', border: '1px solid #ddd', borderRadius: 6, outline: 'none' }}
              />
              <input
                type="color"
                value={post.coverColor}
                onChange={e => update({ coverColor: e.target.value })}
                style={{ width: 48, height: 40, padding: 2, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}
              />
              <div style={{
                flex: 1, height: 40, background: post.coverColor + '22', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {post.coverEmoji}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 — Category + tags */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: 18, margin: '0 0 6px', fontWeight: 700 }}>Kategori ve etiketler</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px' }}>
            Metin analiz edildi — önerilenleri seçili bıraktım, istersen değiştir.
          </p>

          {loadingMeta && <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 13 }}>Öneriler üretiliyor...</div>}
          {metaError && (
            <div style={{ padding: 12, background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 6, color: '#cf1322', fontSize: 12, marginBottom: 12 }}>
              {metaError} <button onClick={suggestCategoryAndTags} style={{ marginLeft: 8, fontSize: 11, padding: '4px 10px', border: '1px solid #cf1322', background: '#fff', color: '#cf1322', borderRadius: 4, cursor: 'pointer' }}>Tekrar dene</button>
            </div>
          )}

          {!loadingMeta && (
            <>
              {/* Category */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Kategori</label>
                <select
                  value={post.category}
                  onChange={e => update({ category: e.target.value })}
                  style={{ width: '100%', padding: 12, fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', background: '#fff', textTransform: 'capitalize' }}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}{suggestedCategory === c ? '  (önerilen)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>
                  Etiketler ({post.tags.length} seçili)
                </label>
                {tagSuggestions.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>Öneriler — tıklayarak ekle/çıkar</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tagSuggestions.map(tag => {
                        const selected = post.tags.includes(tag)
                        return (
                          <button
                            key={tag}
                            onClick={() => setPost(p => ({
                              ...p,
                              tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag],
                            }))}
                            style={{
                              padding: '5px 12px', borderRadius: 14, fontSize: 12, cursor: 'pointer',
                              background: selected ? accent : '#fff',
                              color: selected ? '#fff' : '#555',
                              border: `1px solid ${selected ? accent : '#ddd'}`,
                              fontWeight: selected ? 600 : 500,
                            }}>
                            {selected ? '✓ ' : '+ '}{tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {post.tags.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>Seçili etiketler</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {post.tags.map(tag => (
                        <span key={tag} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '4px 10px', borderRadius: 12, fontSize: 12,
                          background: '#f0f0f0', color: '#333',
                        }}>
                          {tag}
                          <button
                            onClick={() => setPost(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', padding: 0, fontSize: 14, lineHeight: 1 }}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual tag input */}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <input
                    value={manualTag}
                    onChange={e => setManualTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && manualTag.trim()) {
                        const t = manualTag.trim().toLowerCase()
                        setPost(p => (p.tags.includes(t) ? p : { ...p, tags: [...p.tags, t] }))
                        setManualTag('')
                      }
                    }}
                    placeholder="Yeni etiket yaz, Enter'a bas"
                    style={{ flex: 1, padding: 10, fontSize: 13, border: '1px solid #ddd', borderRadius: 6, outline: 'none' }}
                  />
                  <button
                    onClick={() => {
                      const t = manualTag.trim().toLowerCase()
                      if (t) setPost(p => (p.tags.includes(t) ? p : { ...p, tags: [...p.tags, t] }))
                      setManualTag('')
                    }}
                    style={{ padding: '0 16px', background: accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    Ekle
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 5 — Preview & publish */}
      {step === 5 && (
        <div>
          <h2 style={{ fontSize: 18, margin: '0 0 6px', fontWeight: 700 }}>Önizleme</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
            Yazı yayınlandığında çalışmalar sayfasında böyle görünecek.
          </p>

          {/* EN translation panel */}
          <div style={{ marginBottom: 18, padding: 14, background: '#fafafa', border: '1px solid #eee', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>İngilizce versiyon</div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                  {post.contentEN ? `✓ ${post.contentEN.length} karakter — düzenleyebilirsin` : 'Henüz çevrilmedi'}
                </div>
              </div>
              <button
                onClick={translateToEn}
                disabled={translating || !post.contentTR}
                style={{
                  padding: '8px 14px', background: translating ? '#ccc' : accent,
                  color: '#fff', border: 'none', borderRadius: 6,
                  cursor: translating ? 'wait' : 'pointer', fontSize: 12, fontWeight: 600,
                }}>
                {translating ? 'Çevriliyor...' : post.contentEN ? '↻ Yeniden çevir' : 'AI ile EN üret'}
              </button>
            </div>
            {translateError && (
              <div style={{ padding: 8, background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: 6, color: '#cf1322', fontSize: 11, marginTop: 6 }}>
                {translateError}
              </div>
            )}
            {post.contentEN && (
              <details style={{ marginTop: 10 }}>
                <summary style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>EN içeriği düzenle/görüntüle</summary>
                <input
                  value={post.titleEN}
                  onChange={e => update({ titleEN: e.target.value })}
                  placeholder="English title"
                  style={{ width: '100%', padding: 8, fontSize: 12, border: '1px solid #ddd', borderRadius: 6, outline: 'none', marginTop: 6, boxSizing: 'border-box' }}
                />
                <textarea
                  value={post.summaryEN}
                  onChange={e => update({ summaryEN: e.target.value })}
                  rows={2}
                  placeholder="English summary"
                  style={{ width: '100%', padding: 8, fontSize: 12, border: '1px solid #ddd', borderRadius: 6, outline: 'none', marginTop: 6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <textarea
                  value={post.contentEN}
                  onChange={e => update({ contentEN: e.target.value })}
                  rows={10}
                  placeholder="English content (Markdown)"
                  style={{ width: '100%', padding: 8, fontSize: 12, border: '1px solid #ddd', borderRadius: 6, outline: 'none', marginTop: 6, resize: 'vertical', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </details>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>
              Özet {loadingSummary && <span style={{ color: '#aaa', fontWeight: 400 }}>(üretiliyor...)</span>}
            </label>
            <textarea
              value={post.summaryTR}
              onChange={e => update({ summaryTR: e.target.value })}
              rows={2}
              placeholder="Kart görünümünde gösterilir..."
              style={{ width: '100%', padding: 10, fontSize: 13, border: '1px solid #ddd', borderRadius: 6, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Rendered preview */}
          <div style={{ background: '#fafafa', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
            {post.coverImage ? (
              <img src={post.coverImage} alt="" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ height: 120, background: post.coverColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                {post.coverEmoji}
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent, background: accent + '18', padding: '3px 9px', borderRadius: 20 }}>
                  {post.category}
                </span>
                <span style={{ fontSize: 11, color: '#aaa' }}>· {readingMin(post.contentTR)} dk okuma</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 10px', lineHeight: 1.25 }}>{post.titleTR}</h1>
              {post.summaryTR && <p style={{ fontSize: 14, color: '#666', margin: '0 0 16px', lineHeight: 1.55 }}>{post.summaryTR}</p>}
              {post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 10, background: '#f0f0f0', color: '#666', fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="wizard-preview-content" style={{ fontSize: 15, lineHeight: 1.75, color: '#333' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{post.contentTR}</ReactMarkdown>
              </div>
            </div>
          </div>

          <style>{`
            .wizard-preview-content h1, .wizard-preview-content h2, .wizard-preview-content h3 {
              font-weight: 700; color: #111; margin: 1.6em 0 0.6em; line-height: 1.3;
            }
            .wizard-preview-content h1 { font-size: 1.5em; }
            .wizard-preview-content h2 { font-size: 1.25em; }
            .wizard-preview-content h3 { font-size: 1.1em; }
            .wizard-preview-content p { margin: 0 0 1em; }
            .wizard-preview-content ul, .wizard-preview-content ol { padding-left: 1.4em; margin: 0 0 1em; }
            .wizard-preview-content li { margin-bottom: 0.3em; }
            .wizard-preview-content code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-size: 0.88em; font-family: monospace; color: #d63384; }
            .wizard-preview-content pre { background: #1e1e1e; color: #e8e8e8; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85em; }
            .wizard-preview-content pre code { background: none; color: inherit; padding: 0; }
            .wizard-preview-content blockquote { border-left: 3px solid #1D9E75; padding: 0.4em 1em; margin: 0 0 1em; background: rgba(29,158,117,0.05); color: #555; }
            .wizard-preview-content a { color: #1D9E75; text-decoration: underline; }
            .wizard-preview-content strong { font-weight: 700; color: #111; }
          `}</style>
        </div>
      )}

      {/* ─── Navigation ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 18, borderTop: '1px solid #eee', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{ padding: '10px 18px', background: 'none', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#555' }}>
            İptal
          </button>
          {step > 1 && (
            <button
              onClick={() => go(step - 1)}
              style={{ padding: '10px 18px', background: 'none', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#555' }}>
              ← Geri
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {step < 5 ? (
            <button
              onClick={() => go(step + 1)}
              disabled={!canNext()}
              style={{
                padding: '10px 22px', background: canNext() ? '#111' : '#ccc', color: '#fff',
                border: 'none', borderRadius: 8, cursor: canNext() ? 'pointer' : 'not-allowed',
                fontSize: 13, fontWeight: 600,
              }}>
              {step === 1 ? 'Başlıkları Öner →' : step === 2 ? 'Görsel →' : step === 3 ? 'Kategori & Etiket →' : 'Önizle →'}
            </button>
          ) : (
            <>
              <button
                onClick={() => finalize(false)}
                disabled={publishing}
                style={{ padding: '10px 18px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: 8, cursor: publishing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600 }}>
                Taslak olarak kaydet
              </button>
              <button
                onClick={() => finalize(true)}
                disabled={publishing}
                style={{ padding: '10px 22px', background: accent, color: '#fff', border: 'none', borderRadius: 8, cursor: publishing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 700 }}>
                {publishing ? 'Yayınlanıyor...' : '🚀 Yayınla'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
