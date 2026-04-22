'use client'

// app/[lang]/studyo/page.jsx
// Erişim: sukrugencoglu.com/tr/studyo  |  sukrugencoglu.com/en/studyo
// Giriş korumalı — STUDYO_USER + STUDYO_PASS env var'larıyla

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import BlogWizard from '@/components/studyo/BlogWizard'
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

// ─── GTM Ekosistemi Zihin Haritası ───────────────────────────────────────────
const GTM_NW = 140
const GTM_NH = 56

const GTM_CAT_COLORS = {
  veri:      { bg: '#FFF8E1', border: '#F9A82566', stripe: '#F57F17' },
  merkez:    { bg: '#E8F5E9', border: '#2E7D3266', stripe: '#2E7D32' },
  bileşen:   { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  hedef:     { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
  kirmizi:   { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:     { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert:  { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:     { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
}
const GTM_CAT_LABELS = {
  veri: 'Veri Kaynağı', merkez: 'Merkez', 'bileşen': 'GTM Bileşeni', hedef: 'Hedef Platform',
  kirmizi: 'Kırmızı', pembe: 'Pembe', lacivert: 'Lacivert', gumus: 'Gümüş',
}

const GTM_TERMS = [
  {
    id: 'datalayer', abbr: 'Data Layer', sub: 'Veri Katmanı', cat: 'veri', x: 400, y: 50,
    desc: 'Web sitesindeki tüm olay ve kullanıcı verilerinin toplandığı JavaScript nesnesi. GTM bu katmandan veri okur. Örneğin bir kullanıcı butona tıkladığında "purchase" eventi, ürün adı, fiyat gibi bilgiler buraya yazılır.',
  },
  {
    id: 'gtm', abbr: 'GTM', sub: 'Google Tag Manager', cat: 'merkez', x: 400, y: 170,
    desc: 'Google Tag Manager — tüm takip kodlarını (etiketleri) merkezi bir panelden yönetmeyi sağlayan ücretsiz araç. Kod yazmaya gerek kalmadan etiket ekleyip, tetikleyici ve değişken tanımlayabilirsin. Data Layer\'dan veri okur, koşullara göre etiketleri ateşler.',
  },
  {
    id: 'variable', abbr: 'Variable', sub: 'Değişken', cat: 'bileşen', x: 150, y: 300,
    desc: 'GTM\'nin veri taşıyıcısı. Data Layer\'daki değerleri (sayfa URL, ürün fiyatı, kullanıcı ID vb.) yakalayıp etiketlere ve tetikleyicilere iletir. Örneğin {{Page URL}} değişkeni o anki sayfa adresini döner.',
  },
  {
    id: 'trigger', abbr: 'Trigger', sub: 'Tetikleyici', cat: 'bileşen', x: 400, y: 300,
    desc: 'Bir etiketin ne zaman çalışacağını belirleyen koşul/kural. "Kullanıcı formu gönderdiğinde", "Sayfa yüklendiğinde", "Butona tıklandığında" gibi olayları dinler ve eşleştiğinde ilgili etiketi ateşler.',
  },
  {
    id: 'tag', abbr: 'Tag', sub: 'Etiket', cat: 'bileşen', x: 650, y: 300,
    desc: 'Üçüncü parti platformlara veri gönderen kod parçacığı. Google Ads dönüşüm kodu, GA4 olay etiketi, Facebook Pixel gibi. Tetikleyici koşulu sağlandığında GTM bu etiketi çalıştırır ve veriyi ilgili platforma iletir.',
  },
  {
    id: 'googleads', abbr: 'Google Ads', sub: 'Dönüşüm Takibi', cat: 'hedef', x: 880, y: 220,
    desc: 'Google Ads dönüşüm etiketi — reklam tıklamalarından gelen kullanıcıların sitede gerçekleştirdiği değerli eylemleri (satın alma, form doldurma, arama) takip eder. "Conversion Linker" ve "Google Ads Conversion Tracking" etiketleri GTM üzerinden kurulur.',
  },
  {
    id: 'ga4', abbr: 'GA4', sub: 'Google Analytics 4', cat: 'hedef', x: 880, y: 300,
    desc: 'Google Analytics 4 — olay tabanlı (event-based) yeni nesil analitik platformu. Sayfa görüntüleme, tıklama, kaydırma gibi etkileşimleri ölçer. GTM üzerinden "GA4 Configuration" ve "GA4 Event" etiketleri ile kurulur.',
  },
  {
    id: 'fbcapi', abbr: 'FB Pixel\n& CAPI', sub: 'Facebook / Meta', cat: 'hedef', x: 880, y: 380,
    desc: 'Facebook Pixel (tarayıcı taraflı) ve Conversions API (sunucu taraflı) — Meta reklamlarının dönüşüm verilerini almasını sağlar. iOS 14+ kısıtlamaları nedeniyle Pixel tek başına yeterli değildir; CAPI ile sunucu üzerinden de veri gönderilerek veri kaybı minimuma indirilir.',
  },
]

const GTM_CONNECTIONS = [
  { from: 'datalayer', to: 'gtm' },
  { from: 'gtm', to: 'variable' },
  { from: 'gtm', to: 'trigger' },
  { from: 'gtm', to: 'tag' },
  { from: 'tag', to: 'googleads' },
  { from: 'tag', to: 'ga4' },
  { from: 'tag', to: 'fbcapi' },
  { from: 'variable', to: 'trigger' },
  { from: 'trigger', to: 'tag' },
]

function gtmEdgePoint(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y }
  const hw = GTM_NW / 2
  const hh = GTM_NH / 2
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity
  const scale = Math.min(scaleX, scaleY)
  return { x: from.x + dx * scale, y: from.y + dy * scale }
}

function GtmZihinHaritasi() {
  const containerRef = useRef(null)
  const [canvasDim, setCanvasDim] = useState({ w: 880, h: 555 })
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [terms, setTerms] = useState(GTM_TERMS)
  const [connections, setConnections] = useState(GTM_CONNECTIONS)
  const [dragging, setDragging] = useState(null)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const canvasZoomRef = useRef(1)
  const setZoom = (z) => { canvasZoomRef.current = z; setCanvasZoom(z) }
  const selectionBoxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch('/api/gtm-ekosistemi')
      .then(res => res.json())
      .then(data => {
        if (data && !Array.isArray(data) && data.terms) {
          setTerms(data.terms)
          setConnections(data.connections || [])
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h || 600 })
        } else if (data && Array.isArray(data) && data.length > 0) {
          // Eski format (dizi)
          setTerms(data)
        }
      })
      .catch(err => console.error('GTM yükleme hatası:', err))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          const next = parseFloat(Math.min(Math.max(canvasZoomRef.current + delta, 0.3), 2.5).toFixed(2))
          setZoom(next)
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    if (terms.length === 0) return
    const maxX = Math.max(...terms.map(t => t.x)) + GTM_NW / 2 + 120
    const maxY = Math.max(...terms.map(t => t.y)) + GTM_NH / 2 + 120
    setCanvasDim(prev => ({ w: Math.max(prev.w, maxX), h: Math.max(prev.h, maxY) }))
  }, [terms])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/gtm-ekosistemi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms, connections, metadata: canvasDim }),
      })
      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString())
      } else {
        alert('Kaydedilemedi')
      }
    } catch (err) {
      alert('Hata: ' + err.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      const dx = (e.clientX - dragging.startMouseX) / canvasZoomRef.current
      const dy = (e.clientY - dragging.startMouseY) / canvasZoomRef.current
      setTerms(prev => prev.map(t => {
        if (dragging.startPositions && dragging.startPositions[t.id]) {
          return { ...t, x: dragging.startPositions[t.id].x + dx, y: dragging.startPositions[t.id].y + dy }
        }
        return t
      }))
    }
    
    const handleMouseUp = () => setDragging(null)

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]))
  const selectedTerm = selectedIds.length === 1 ? termMap[selectedIds[0]] : null

  const activeIds = new Set(selectedIds)
  if (hovered) activeIds.add(hovered)
  const connectedIds = activeIds.size > 0 ? new Set([
     ...activeIds,
     ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
     ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null

  const handleAddNode = () => {
    const newId = 'node_' + Math.random().toString(36).substr(2, 9)
    const newNode = {
      id: newId,
      abbr: 'Yeni Kutu',
      sub: 'Açıklama alt başlığı',
      cat: 'veri',
      x: 400 + (Math.random() * 100),
      y: 200 + (Math.random() * 100),
      desc: 'Bu kutu için açıklama yazın...'
    }
    setTerms([...terms, newNode])
    setSelectedIds([newId])
    setEditId(newId)
  }

  const handleAddConnection = (targetId) => {
    if (selectedIds.length !== 1 || !targetId || selectedIds[0] === targetId) return
    const from = selectedIds[0]
    const to = targetId
    if (connections.find(c => c.from === from && c.to === to)) return
    setConnections([...connections, { from, to }])
  }

  const handleRemoveConnection = (targetId) => {
    setConnections(connections.filter(c => !(c.from === selectedIds[0] && c.to === targetId)))
  }



  return (
    <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>GTM Ekosistemi</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            Data Layer → GTM → Etiket akışı · kutucuğu tutup sürükle, tıklayarak açıklamayı oku
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button onClick={() => setZoom(Math.min(parseFloat((canvasZoom + 0.15).toFixed(2)), 2.5))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <span style={{ fontSize: 11, color: '#888', minWidth: 36, textAlign: 'center' }}>{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(parseFloat((canvasZoom - 0.15).toFixed(2)), 0.3))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setZoom(1)} title="Sıfırla" style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
          </div>
          <button
            onClick={handleAddNode}
            style={{
              background: '#fff', border: '1px solid #ddd', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6, color: '#444'
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Kutu Ekle
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(GTM_CAT_LABELS).map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: GTM_CAT_COLORS[cat].stripe }} />
            {label}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ overflow: 'auto', background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '12px 0' }}>
        <div style={{ width: canvasDim.w * canvasZoom, height: canvasDim.h * canvasZoom, flexShrink: 0 }}>
        <div ref={canvasRef} style={{ position: "relative", width: canvasDim.w, height: canvasDim.h, margin: 0, transform: `scale(${canvasZoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}
             onMouseDown={(e) => {
               if (e.button !== 0) return
               if (e.target !== e.currentTarget && e.target.tagName !== 'svg') return
               const cssZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
               const rect = e.currentTarget.getBoundingClientRect()
               const x = (e.clientX / cssZoom - rect.left) / canvasZoomRef.current
               const y = (e.clientY / cssZoom - rect.top) / canvasZoomRef.current
               const box = { startX: x, startY: y, currX: x, currY: y }
               selectionBoxRef.current = box
               setSelectionBox(box)
               const wasShift = e.shiftKey
               if (!e.shiftKey) setSelectedIds([])
               setEditId(null)
               const onWinMove = (me) => {
                 if (!selectionBoxRef.current || !canvasRef.current) return
                 const cz = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
                 const r = canvasRef.current.getBoundingClientRect()
                 const nb = { ...selectionBoxRef.current, currX: (me.clientX / cz - r.left) / canvasZoomRef.current, currY: (me.clientY / cz - r.top) / canvasZoomRef.current }
                 selectionBoxRef.current = nb
                 setSelectionBox(nb)
               }
               const onWinUp = () => {
                 const sb = selectionBoxRef.current
                 if (sb) {
                   const minX = Math.min(sb.startX, sb.currX), maxX = Math.max(sb.startX, sb.currX)
                   const minY = Math.min(sb.startY, sb.currY), maxY = Math.max(sb.startY, sb.currY)
                   const newlySelected = terms.filter(t => {
                     const hw = GTM_NW / 2, hh = GTM_NH / 2
                     return t.x - hw < maxX && t.x + hw > minX && t.y - hh < maxY && t.y + hh > minY
                   }).map(t => t.id)
                   if (wasShift) setSelectedIds(prev => Array.from(new Set([...prev, ...newlySelected])))
                   else setSelectedIds(newlySelected)
                   selectionBoxRef.current = null
                   setSelectionBox(null)
                 }
                 window.removeEventListener('mousemove', onWinMove)
                 window.removeEventListener('mouseup', onWinUp)
               }
               window.addEventListener('mousemove', onWinMove)
               window.addEventListener('mouseup', onWinUp)
             }}
          >

          {/* SVG bağlantı çizgileri */}
          <svg
            width={canvasDim.w} height={canvasDim.h}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}
          >
            <defs>
              <marker id="gtm-arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
              </marker>
              <marker id="gtm-arr-hi" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#888" />
              </marker>
            </defs>
            {connections.map((conn, i) => {
              const from = termMap[conn.from]
              const to = termMap[conn.to]
              if (!from || !to) return null
              const p1 = gtmEdgePoint(from, to)
              const p2 = gtmEdgePoint(to, from)
              const isActive = activeIds.has(conn.from) || activeIds.has(conn.to)
              return (
                <line
                  key={i}
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isActive ? '#888' : '#ddd'}
                  strokeWidth={isActive ? 2 : 1.5}
                  markerEnd={isActive ? 'url(#gtm-arr-hi)' : 'url(#gtm-arr)'}
                />
              )
            })}
          </svg>
            {selectionBox && (
              <div style={{
                position: 'absolute',
                border: '1px solid rgba(29, 158, 117, 0.5)',
                background: 'rgba(29, 158, 117, 0.1)',
                left: Math.min(selectionBox.startX, selectionBox.currX),
                top: Math.min(selectionBox.startY, selectionBox.currY),
                width: Math.abs(selectionBox.currX - selectionBox.startX),
                height: Math.abs(selectionBox.currY - selectionBox.startY),
                pointerEvents: 'none',
                zIndex: 10,
                borderRadius: 4
              }} />
            )}


          {/* Node'lar */}
          {terms.map(term => {
            const colors = GTM_CAT_COLORS[term.cat]
            const isSelected = selectedIds.includes(term.id)
            const isHov = hovered === term.id
            const isDimmed = connectedIds && !connectedIds.has(term.id)
            const isDragging = dragging?.id === term.id
            
            return (
              <div
                key={term.id}
                onClick={(e) => {
                    e.stopPropagation()
                    if (dragging && (Math.abs(e.clientX - dragging.startMouseX) > 5 || Math.abs(e.clientY - dragging.startMouseY) > 5)) {
                      return
                    }
                  }}
                onMouseEnter={() => setHovered(term.id)}
                onMouseLeave={() => setHovered(null)}
                onMouseDown={(e) => {
                    if (e.button !== 0) return
                    e.stopPropagation()
                    
                    let currentSelected = selectedIds;
                    if (!selectedIds.includes(term.id)) {
                      if (e.shiftKey) {
                        currentSelected = [...selectedIds, term.id]
                        setSelectedIds(currentSelected)
                      } else {
                        currentSelected = [term.id]
                        setSelectedIds(currentSelected)
                        if (editId !== term.id) setEditId(null)
                      }
                    }

                    const startPositions = {}
                    terms.forEach(t => {
                      if (currentSelected.includes(t.id)) {
                        startPositions[t.id] = { x: t.x, y: t.y }
                      }
                    })

                    setDragging({
                      startMouseX: e.clientX,
                      startMouseY: e.clientY,
                      startPositions
                    })
                  }}
                style={{
                  position: 'absolute',
                  left: term.x - GTM_NW / 2,
                  top: term.y - GTM_NH / 2,
                  width: GTM_NW,
                  height: GTM_NH,
                  background: colors.bg,
                  border: `1.5px solid ${isSelected ? colors.stripe : isHov ? colors.stripe : colors.border}`,
                  boxShadow: isSelected
                    ? `inset 3px 0 0 ${colors.stripe}, 0 4px 16px ${colors.stripe}44`
                    : isHov
                    ? `inset 3px 0 0 ${colors.stripe}, 0 3px 12px ${colors.stripe}33`
                    : `inset 3px 0 0 ${colors.stripe}, 0 1px 3px rgba(0,0,0,0.06)`,
                  borderRadius: 8,
                  padding: '6px 10px 6px 12px',
                  opacity: isDimmed && !isDragging ? 0.25 : 1,
                  transition: isDragging ? 'none' : 'all 0.15s',
                  zIndex: isDragging ? 4 : isSelected ? 3 : isHov ? 2 : 1,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  boxSizing: 'border-box', overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.stripe, lineHeight: 1.2, marginBottom: 2, whiteSpace: 'pre-line' }}>{term.abbr}</div>
                <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>{term.sub}</div>
              </div>
            )
          })}
        </div>
        </div>
      </div>

      {/* Açıklama paneli — haritanın altında */}
      <div style={{
        marginTop: 16,
        background: selectedTerm ? '#fff' : '#fafafa',
        border: `0.5px solid ${selectedTerm ? GTM_CAT_COLORS[selectedTerm.cat].stripe + '44' : '#e8e8e8'}`,
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        minHeight: 80,
        transition: 'all 0.2s',
      }}>
        {selectedIds.length > 1 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 28, color: '#1D9E75', marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{selectedIds.length} Kutu Seçili</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Şu anda birden fazla terim seçtiniz. Bunları birlikte taşıyabilir veya toplu olarak silebilirsiniz.</div>
            <button
               onClick={() => {
                 if (confirm(`Seçili ${selectedIds.length} kutuyu ve bağlantılarını silmek istediğinize emin misiniz?`)) {
                   setConnections(connections.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to)))
                   setTerms(terms.filter(t => !selectedIds.includes(t.id)))
                   setSelectedIds([]); setEditId(null);
                 }
               }}
               style={{ padding: '10px 14px', background: '#ffefef', border: '1px solid #ffccc7', color: '#f5222d', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}            >
              Toplu Sil
            </button>
          </div>
        ) : selectedTerm ? (          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: GTM_CAT_COLORS[selectedTerm.cat].stripe, flexShrink: 0 }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: GTM_CAT_COLORS[selectedTerm.cat].stripe, whiteSpace: 'pre-line' }}>
                  {selectedTerm.abbr}
                </span>
                <span style={{ fontSize: 12, color: '#aaa', marginLeft: 4 }}>{selectedTerm.sub}</span>
              </div>
              <button
                onClick={() => setEditId(prev => prev === selectedTerm.id ? null : selectedTerm.id)}
                style={{
                  fontSize: 11, cursor: 'pointer', padding: '4px 10px',
                  borderRadius: 6, border: '0.5px solid #d0d0d0', background: '#fff', color: '#555'
                }}
              >
                {editId === selectedTerm.id ? 'Bitti' : 'Düzenle'}
              </button>
            </div>
            {editId === selectedTerm.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Kısa Ad</label>
                    <input
                      value={selectedTerm.abbr}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, abbr: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Alt Başlık</label>
                    <input
                      value={selectedTerm.sub}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, sub: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Renk</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {Object.entries(GTM_CAT_COLORS).map(([cat, colors]) => (
                        <div
                          key={cat}
                          onClick={() => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, cat } : t))}
                          title={GTM_CAT_LABELS[cat] || cat}
                          style={{
                            width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
                            background: colors.bg,
                            border: selectedTerm.cat === cat ? `2.5px solid ${colors.stripe}` : `1.5px solid ${colors.border}`,
                            boxShadow: selectedTerm.cat === cat ? `0 0 0 2px ${colors.stripe}44` : 'none',
                            display: 'flex', alignItems: 'flex-end', padding: '0 3px 3px',
                            transition: 'all 0.1s', boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ width: '100%', height: 3, borderRadius: 2, background: colors.stripe }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Açıklama</label>
                  <textarea
                    value={selectedTerm.desc}
                    onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: e.target.value } : t))}
                    onPaste={(e) => {
                      e.preventDefault()
                      const html = e.clipboardData.getData('text/html')
                      const plain = e.clipboardData.getData('text/plain')
                      let pasted = plain
                      if (html) {
                        const div = document.createElement('div')
                        div.innerHTML = html
                        div.querySelectorAll('table').forEach(table => {
                          let rows = ''
                          table.querySelectorAll('tr').forEach(tr => {
                            const cells = [...tr.querySelectorAll('td,th')].map(c => c.innerText.trim())
                            rows += '| ' + cells.join(' | ') + ' |\n'
                          })
                          table.replaceWith(document.createTextNode('\n' + rows))
                        })
                        div.querySelectorAll('h1').forEach(el => el.replaceWith(document.createTextNode('# ' + el.innerText + '\n')))
                        div.querySelectorAll('h2').forEach(el => el.replaceWith(document.createTextNode('## ' + el.innerText + '\n')))
                        div.querySelectorAll('h3,h4,h5,h6').forEach(el => el.replaceWith(document.createTextNode('### ' + el.innerText + '\n')))
                        div.querySelectorAll('ol > li').forEach((li, i) => li.prepend(document.createTextNode((i + 1) + '. ')))
                        div.querySelectorAll('ul > li').forEach(li => li.prepend(document.createTextNode('• ')))
                        div.querySelectorAll('li,p,div,br').forEach(el => el.after(document.createTextNode('\n')))
                        pasted = div.innerText.replace(/\n{3,}/g, '\n\n').trim()
                      }
                      const el = e.target
                      const start = el.selectionStart
                      const end = el.selectionEnd
                      const current = el.value
                      const newValue = current.substring(0, start) + pasted + current.substring(end)
                      setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: newValue } : t))
                      setTimeout(() => { el.selectionStart = el.selectionEnd = start + pasted.length }, 0)
                    }}
                    style={{
                      width: '100%', minHeight: 100, padding: 12, fontSize: 14, lineHeight: 1.8,
                      color: '#333', border: '0.5px solid #ccc', borderRadius: 8,
                      outline: 'none', resize: 'vertical', fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8, fontWeight: 600 }}>BAĞLANTI YÖNETİMİ</label>
                  
                  {/* Yeni bağlantı ekle */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ padding: '5px 10px', fontSize: 12, background: '#f0f0f0', border: '0.5px solid #ccc', borderRadius: 6, fontWeight: 700, whiteSpace: 'nowrap', color: '#333' }}>
                      A: {selectedTerm.abbr}
                    </div>
                    <span style={{ fontSize: 16, color: '#999' }}>→</span>
                    <select
                      id="target-node-select"
                      style={{ flex: 1, padding: '6px 10px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none', background: '#fff' }}
                    >
                      <option value="">B kutusunu seç...</option>
                      {terms.filter(t => t.id !== selectedTerm.id).map(t => (
                        <option key={t.id} value={t.id}>{t.abbr} ({t.sub})</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const sel = document.getElementById('target-node-select')
                        if (sel.value) handleAddConnection(sel.value)
                      }}
                      style={{ padding: '6px 14px', fontSize: 12, background: '#f5f5f5', border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer' }}
                    >
                      Ekle
                    </button>
                  </div>

                  {/* Mevcut bağlantılar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {connections.filter(c => c.from === selectedTerm.id).map(c => {
                      const target = termMap[c.to]
                      if (!target) return null
                      return (
                        <div key={c.to} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#f9f9f9', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11 }}>
                          <span>→ <b>{target.abbr}</b></span>
                          <button onClick={() => handleRemoveConnection(c.to)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontWeight: 'bold', marginLeft: 4 }}>×</button>
                        </div>
                      )
                    })}
                    {connections.filter(c => c.to === selectedTerm.id).map(c => {
                      const source = termMap[c.from]
                      if (!source) return null
                      return (
                        <div key={c.from} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#fff', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11, color: '#888', borderStyle: 'dashed' }}>
                          <span>← <b>{source.abbr}</b> (Gelen)</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                    <button
                      onClick={() => {
                        if (confirm('Bu kutuyu ve tüm bağlantılarını silmek istediğinize emin misiniz?')) {
                          setConnections(connections.filter(c => c.from !== selectedTerm.id && c.to !== selectedTerm.id))
                          setTerms(terms.filter(t => t.id !== selectedTerm.id))
                          setSelectedIds([]); setEditId(null);
                        }
                      }}
                      style={{ color: '#ff4d4f', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Kutuyu Sil
                    </button>
                 </div>
               </div>
            ) : (
              <div style={{ fontSize: 14, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{selectedTerm.desc}</div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ccc', minHeight: 60 }}>
            <span style={{ fontSize: 20 }}>◎</span>
            <span style={{ fontSize: 13 }}>Bir kutucuğa tıkla, açıklamasını oku</span>
          </div>
        )}
      </div>

      {/* Kaydet butonu — sağ alt */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
        {lastSaved && <span style={{ fontSize: 11, color: '#1D9E75' }}>Kaydedildi: {lastSaved}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: '#111', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 14px', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
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
  kirmizi:  { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:    { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert: { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:    { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
}
const CAT_LABELS = {
  maliyet: 'Maliyet', olcum: 'Ölçüm', strateji: 'Strateji', eylem: 'Eylem',
  kirmizi: 'Kırmızı', pembe: 'Pembe', lacivert: 'Lacivert', gumus: 'Gümüş',
}
const CAT_COLORS_DEFAULT = { bg: '#F5F5F5', border: '#99999966', stripe: '#999999' }
function getCatColors(cat) { return CAT_COLORS[cat] ?? CAT_COLORS_DEFAULT }

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
  const containerRef = useRef(null)
  const [canvasDim, setCanvasDim] = useState({ w: 1000, h: 460 })
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [terms, setTerms] = useState(AD_TERMS)
  const [connections, setConnections] = useState(CONNECTIONS)
  const [dragging, setDragging] = useState(null)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const canvasZoomRef = useRef(1)
  const setZoom = (z) => { canvasZoomRef.current = z; setCanvasZoom(z) }
  const selectionBoxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch('/api/reklam-terimleri')
      .then(res => res.json())
      .then(data => {
        if (data && !Array.isArray(data) && Array.isArray(data.terms) && data.terms.length > 0) {
          setTerms(data.terms)
          setConnections(data.connections || [])
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h || 600 })
        } else if (data && Array.isArray(data) && data.length > 0) {
          setTerms(data)
        }
      })
      .catch(err => console.error('Reklam Terimleri yükleme hatası:', err))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          const next = parseFloat(Math.min(Math.max(canvasZoomRef.current + delta, 0.3), 2.5).toFixed(2))
          setZoom(next)
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    if (terms.length === 0) return
    const maxX = Math.max(...terms.map(t => t.x)) + NODE_W / 2 + 120
    const maxY = Math.max(...terms.map(t => t.y)) + NODE_H / 2 + 120
    setCanvasDim(prev => ({ w: Math.max(prev.w, maxX), h: Math.max(prev.h, maxY) }))
  }, [terms])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/reklam-terimleri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms, connections, metadata: canvasDim }),
      })
      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString())
      } else {
        alert('Kaydedilemedi')
      }
    } catch (err) {
      alert('Hata: ' + err.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      const dx = (e.clientX - dragging.startMouseX) / canvasZoomRef.current
      const dy = (e.clientY - dragging.startMouseY) / canvasZoomRef.current
      setTerms(prev => prev.map(t => {
        if (dragging.startPositions && dragging.startPositions[t.id]) {
          return { ...t, x: dragging.startPositions[t.id].x + dx, y: dragging.startPositions[t.id].y + dy }
        }
        return t
      }))
    }
    
    const handleMouseUp = () => setDragging(null)

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]))
  const selectedTerm = selectedIds.length === 1 ? termMap[selectedIds[0]] : null

  const activeIds = new Set(selectedIds)
  if (hovered) activeIds.add(hovered)
  const connectedIds = activeIds.size > 0 ? new Set([
     ...activeIds,
     ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
     ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null

  const handleAddNode = () => {
    const newId = 'node_' + Math.random().toString(36).substr(2, 9)
    const newNode = {
      id: newId,
      abbr: 'Yeni Terim',
      tr: 'Türkçe Açıklama',
      en: 'English Translation',
      cat: 'olcum',
      x: 400 + (Math.random() * 100),
      y: 200 + (Math.random() * 100),
      desc: 'Bu terim için detaylı açıklama yazın...'
    }
    setTerms([...terms, newNode])
    setSelectedIds([newId])
    setEditId(newId)
  }

  const handleAddConnection = (targetId) => {
    if (selectedIds.length !== 1 || !targetId || selectedIds[0] === targetId) return
    const from = selectedIds[0]
    const to = targetId
    if (connections.find(c => c.from === from && c.to === to)) return
    setConnections([...connections, { from, to }])
  }

  const handleRemoveConnection = (targetId) => {
    setConnections(connections.filter(c => !(c.from === selectedIds[0] && c.to === targetId)))
  }



  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Reklam KPI</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            Dijital reklamcılık kısaltmaları ve funnel içindeki hiyerarşik ilişkileri
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button onClick={() => setZoom(Math.min(parseFloat((canvasZoom + 0.15).toFixed(2)), 2.5))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <span style={{ fontSize: 11, color: '#888', minWidth: 36, textAlign: 'center' }}>{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(parseFloat((canvasZoom - 0.15).toFixed(2)), 0.3))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setZoom(1)} title="Sıfırla" style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
          </div>
          <button
            onClick={handleAddNode}
            style={{
              background: '#fff', border: '1px solid #ddd', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6, color: '#444'
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Kutu Ekle
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(CAT_LABELS).map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: getCatColors(cat).stripe }} />
            {label}
          </div>
        ))}
        <div style={{ fontSize: 12, color: '#bbb', marginLeft: 4 }}>· Üzerine gel: ilişkileri gör</div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ overflow: 'auto', background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 12px' }}>
        <div style={{ width: canvasDim.w * canvasZoom, height: canvasDim.h * canvasZoom, flexShrink: 0 }}>
        <div ref={canvasRef} style={{ position: "relative", width: canvasDim.w, height: canvasDim.h, margin: 0, transform: `scale(${canvasZoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}
             onMouseDown={(e) => {
               if (e.button !== 0) return
               if (e.target !== e.currentTarget && e.target.tagName !== 'svg') return
               const cssZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
               const rect = e.currentTarget.getBoundingClientRect()
               const x = (e.clientX / cssZoom - rect.left) / canvasZoomRef.current
               const y = (e.clientY / cssZoom - rect.top) / canvasZoomRef.current
               const box = { startX: x, startY: y, currX: x, currY: y }
               selectionBoxRef.current = box
               setSelectionBox(box)
               const wasShift = e.shiftKey
               if (!e.shiftKey) setSelectedIds([])
               setEditId(null)
               const onWinMove = (me) => {
                 if (!selectionBoxRef.current || !canvasRef.current) return
                 const cz = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
                 const r = canvasRef.current.getBoundingClientRect()
                 const nb = { ...selectionBoxRef.current, currX: (me.clientX / cz - r.left) / canvasZoomRef.current, currY: (me.clientY / cz - r.top) / canvasZoomRef.current }
                 selectionBoxRef.current = nb
                 setSelectionBox(nb)
               }
               const onWinUp = () => {
                 const sb = selectionBoxRef.current
                 if (sb) {
                   const minX = Math.min(sb.startX, sb.currX), maxX = Math.max(sb.startX, sb.currX)
                   const minY = Math.min(sb.startY, sb.currY), maxY = Math.max(sb.startY, sb.currY)
                   const newlySelected = terms.filter(t => {
                     const hw = NODE_W / 2, hh = NODE_H / 2
                     return t.x - hw < maxX && t.x + hw > minX && t.y - hh < maxY && t.y + hh > minY
                   }).map(t => t.id)
                   if (wasShift) setSelectedIds(prev => Array.from(new Set([...prev, ...newlySelected])))
                   else setSelectedIds(newlySelected)
                   selectionBoxRef.current = null
                   setSelectionBox(null)
                 }
                 window.removeEventListener('mousemove', onWinMove)
                 window.removeEventListener('mouseup', onWinUp)
               }
               window.addEventListener('mousemove', onWinMove)
               window.addEventListener('mouseup', onWinUp)
             }}
          >

          {/* SVG bağlantı çizgileri */}
          <svg
            width={canvasDim.w} height={canvasDim.h}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}
          >
            <defs>
              <marker id="arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
              </marker>
              <marker id="arr-hi" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill="#888" />
              </marker>
            </defs>
            {connections.map((conn, i) => {
              const from = termMap[conn.from]
              const to = termMap[conn.to]
              if (!from || !to) return null
              const p1 = edgePoint(from, to)
              const p2 = edgePoint(to, from)
              const isActive = activeIds.has(conn.from) || activeIds.has(conn.to)
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
            {selectionBox && (
              <div style={{
                position: 'absolute',
                border: '1px solid rgba(29, 158, 117, 0.5)',
                background: 'rgba(29, 158, 117, 0.1)',
                left: Math.min(selectionBox.startX, selectionBox.currX),
                top: Math.min(selectionBox.startY, selectionBox.currY),
                width: Math.abs(selectionBox.currX - selectionBox.startX),
                height: Math.abs(selectionBox.currY - selectionBox.startY),
                pointerEvents: 'none',
                zIndex: 10,
                borderRadius: 4
              }} />
            )}


          {/* Tüm node'lar */}
          {terms.map(term => {
            const colors = getCatColors(term.cat)
            const isSelected = selectedIds.includes(term.id)
            const isHov = hovered === term.id
            const isDimmed = connectedIds && !connectedIds.has(term.id)
            const isDragging = dragging?.id === term.id
            return (
              <div
                key={term.id}
                onMouseEnter={() => setHovered(term.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                    e.stopPropagation()
                    if (dragging && (Math.abs(e.clientX - dragging.startMouseX) > 5 || Math.abs(e.clientY - dragging.startMouseY) > 5)) {
                      return
                    }
                  }}
                onMouseDown={(e) => {
                    if (e.button !== 0) return
                    e.stopPropagation()
                    
                    let currentSelected = selectedIds;
                    if (!selectedIds.includes(term.id)) {
                      if (e.shiftKey) {
                        currentSelected = [...selectedIds, term.id]
                        setSelectedIds(currentSelected)
                      } else {
                        currentSelected = [term.id]
                        setSelectedIds(currentSelected)
                        if (editId !== term.id) setEditId(null)
                      }
                    }

                    const startPositions = {}
                    terms.forEach(t => {
                      if (currentSelected.includes(t.id)) {
                        startPositions[t.id] = { x: t.x, y: t.y }
                      }
                    })

                    setDragging({
                      startMouseX: e.clientX,
                      startMouseY: e.clientY,
                      startPositions
                    })
                  }}
                style={{
                  position: 'absolute',
                  left: term.x - NODE_W / 2,
                  top: term.y - NODE_H / 2,
                  width: NODE_W,
                  height: NODE_H,
                  background: colors.bg,
                  border: `1.5px solid ${isSelected ? colors.stripe : isHov ? colors.stripe : colors.border}`,
                  boxShadow: isSelected
                    ? `inset 3px 0 0 ${colors.stripe}, 0 4px 16px ${colors.stripe}44`
                    : isHov
                    ? `inset 3px 0 0 ${colors.stripe}, 0 3px 12px ${colors.stripe}33`
                    : `inset 3px 0 0 ${colors.stripe}, 0 1px 4px rgba(0,0,0,0.07)`,
                  borderRadius: 8,
                  padding: '7px 10px 7px 12px',
                  opacity: isDimmed && !isDragging ? 0.25 : 1,
                  transition: isDragging ? 'none' : 'all 0.15s',
                  zIndex: isDragging ? 4 : isSelected ? 3 : isHov ? 2 : 1,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  userSelect: 'none', cursor: isDragging ? 'grabbing' : 'grab',
                  boxSizing: 'border-box', overflow: 'hidden'
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

      {/* Açıklama paneli — haritanın altında */}
      <div style={{
        marginTop: 16,
        background: selectedTerm ? '#fff' : '#fafafa',
        border: `0.5px solid ${selectedTerm ? getCatColors(selectedTerm.cat).stripe + '44' : '#e8e8e8'}`,
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        minHeight: 80,
        transition: 'all 0.2s',
      }}>
        {selectedIds.length > 1 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 28, color: '#1D9E75', marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{selectedIds.length} Kutu Seçili</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Şu anda birden fazla terim seçtiniz. Bunları birlikte taşıyabilir veya toplu olarak silebilirsiniz.</div>
            <button
               onClick={() => {
                 if (confirm(`Seçili ${selectedIds.length} kutuyu ve bağlantılarını silmek istediğinize emin misiniz?`)) {
                   setConnections(connections.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to)))
                   setTerms(terms.filter(t => !selectedIds.includes(t.id)))
                   setSelectedIds([]); setEditId(null);
                 }
               }}
               style={{ padding: '10px 14px', background: '#ffefef', border: '1px solid #ffccc7', color: '#f5222d', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}            >
              Toplu Sil
            </button>
          </div>
        ) : selectedTerm ? (          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: getCatColors(selectedTerm.cat).stripe, flexShrink: 0 }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: getCatColors(selectedTerm.cat).stripe }}>
                  {selectedTerm.abbr}
                </span>
                <span style={{ fontSize: 12, color: '#aaa', marginLeft: 4 }}>{selectedTerm.tr} / {selectedTerm.en}</span>
              </div>
              <button
                onClick={() => setEditId(prev => prev === selectedTerm.id ? null : selectedTerm.id)}
                style={{
                  fontSize: 11, cursor: 'pointer', padding: '4px 10px',
                  borderRadius: 6, border: '0.5px solid #d0d0d0', background: '#fff', color: '#555'
                }}
              >
                {editId === selectedTerm.id ? 'Bitti' : 'Düzenle'}
              </button>
            </div>
            
            {editId === selectedTerm.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Kısaltma</label>
                    <input
                      value={selectedTerm.abbr}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, abbr: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Türkçe</label>
                    <input
                      value={selectedTerm.tr}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, tr: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>İngilizce</label>
                    <input
                      value={selectedTerm.en}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, en: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Renk</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {Object.entries(CAT_COLORS).map(([cat, colors]) => (
                        <div
                          key={cat}
                          onClick={() => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, cat } : t))}
                          title={CAT_LABELS[cat] || cat}
                          style={{
                            width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
                            background: colors.bg,
                            border: selectedTerm.cat === cat ? `2.5px solid ${colors.stripe}` : `1.5px solid ${colors.border}`,
                            boxShadow: selectedTerm.cat === cat ? `0 0 0 2px ${colors.stripe}44` : 'none',
                            display: 'flex', alignItems: 'flex-end', padding: '0 3px 3px',
                            transition: 'all 0.1s', boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ width: '100%', height: 3, borderRadius: 2, background: colors.stripe }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Açıklama</label>
                  <textarea
                    value={selectedTerm.desc}
                    onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: e.target.value } : t))}
                    onPaste={(e) => {
                      e.preventDefault()
                      const html = e.clipboardData.getData('text/html')
                      const plain = e.clipboardData.getData('text/plain')
                      let pasted = plain
                      if (html) {
                        const div = document.createElement('div')
                        div.innerHTML = html
                        div.querySelectorAll('table').forEach(table => {
                          let rows = ''
                          table.querySelectorAll('tr').forEach(tr => {
                            const cells = [...tr.querySelectorAll('td,th')].map(c => c.innerText.trim())
                            rows += '| ' + cells.join(' | ') + ' |\n'
                          })
                          table.replaceWith(document.createTextNode('\n' + rows))
                        })
                        div.querySelectorAll('h1').forEach(el => el.replaceWith(document.createTextNode('# ' + el.innerText + '\n')))
                        div.querySelectorAll('h2').forEach(el => el.replaceWith(document.createTextNode('## ' + el.innerText + '\n')))
                        div.querySelectorAll('h3,h4,h5,h6').forEach(el => el.replaceWith(document.createTextNode('### ' + el.innerText + '\n')))
                        div.querySelectorAll('ol > li').forEach((li, i) => li.prepend(document.createTextNode((i + 1) + '. ')))
                        div.querySelectorAll('ul > li').forEach(li => li.prepend(document.createTextNode('• ')))
                        div.querySelectorAll('li,p,div,br').forEach(el => el.after(document.createTextNode('\n')))
                        pasted = div.innerText.replace(/\n{3,}/g, '\n\n').trim()
                      }
                      const el = e.target
                      const start = el.selectionStart
                      const end = el.selectionEnd
                      const current = el.value
                      const newValue = current.substring(0, start) + pasted + current.substring(end)
                      setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: newValue } : t))
                      setTimeout(() => { el.selectionStart = el.selectionEnd = start + pasted.length }, 0)
                    }}
                    style={{
                      width: '100%', minHeight: 100, padding: 12, fontSize: 14, lineHeight: 1.8,
                      color: '#333', border: '0.5px solid #ccc', borderRadius: 8,
                      outline: 'none', resize: 'vertical', fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8, fontWeight: 600 }}>BAĞLANTI YÖNETİMİ</label>
                  
                  {/* Yeni bağlantı ekle */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ padding: '5px 10px', fontSize: 12, background: '#f0f0f0', border: '0.5px solid #ccc', borderRadius: 6, fontWeight: 700, whiteSpace: 'nowrap', color: '#333' }}>
                      A: {selectedTerm.abbr}
                    </div>
                    <span style={{ fontSize: 16, color: '#999' }}>→</span>
                    <select
                      id="reklam-target-select"
                      style={{ flex: 1, padding: '6px 10px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none', background: '#fff' }}
                    >
                      <option value="">B kutusunu seç...</option>
                      {terms.filter(t => t.id !== selectedTerm.id).map(t => (
                        <option key={t.id} value={t.id}>{t.abbr} ({t.tr})</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const sel = document.getElementById('reklam-target-select')
                        if (sel.value) handleAddConnection(sel.value)
                      }}
                      style={{ padding: '6px 14px', fontSize: 12, background: '#f5f5f5', border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer' }}
                    >
                      Ekle
                    </button>
                  </div>

                  {/* Mevcut bağlantılar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {connections.filter(c => c.from === selectedTerm.id).map(c => {
                      const target = termMap[c.to]
                      if (!target) return null
                      return (
                        <div key={c.to} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#f9f9f9', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11 }}>
                          <span>→ <b>{target.abbr}</b></span>
                          <button onClick={() => handleRemoveConnection(c.to)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontWeight: 'bold', marginLeft: 4 }}>×</button>
                        </div>
                      )
                    })}
                    {connections.filter(c => c.to === selectedTerm.id).map(c => {
                      const source = termMap[c.from]
                      if (!source) return null
                      return (
                        <div key={c.from} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#fff', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11, color: '#888', borderStyle: 'dashed' }}>
                          <span>← <b>{source.abbr}</b> (Gelen)</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                   <button
                    onClick={() => {
                      if (confirm('Bu kutuyu ve tüm bağlantılarını silmek istediğinize emin misiniz?')) {
                        setConnections(connections.filter(c => c.from !== selectedTerm.id && c.to !== selectedTerm.id))
                        setTerms(terms.filter(t => t.id !== selectedTerm.id))
                        setSelectedIds([]); setEditId(null);
                      }
                    }}
                    style={{ color: '#ff4d4f', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                   >
                    Kutuyu Sil
                   </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{selectedTerm.desc}</div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ccc', minHeight: 60 }}>
            <span style={{ fontSize: 20 }}>◎</span>
            <span style={{ fontSize: 13 }}>Bir kutucuğa tıkla, açıklamasını oku</span>
          </div>
        )}
      </div>

      {/* Kaydet butonu — sağ alt */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
        {lastSaved && <span style={{ fontSize: 11, color: '#1D9E75' }}>Kaydedildi: {lastSaved}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: '#111', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 14px', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
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
  kirmizi:   { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:     { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert:  { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:     { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
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
  kirmizi: 'Kırmızı', pembe: 'Pembe', lacivert: 'Lacivert', gumus: 'Gümüş',
}

function YzHaritasi() {
  const containerRef = useRef(null)
  const [canvasDim, setCanvasDim] = useState({ w: 880, h: 555 })
  const [hovered, setHovered] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [terms, setTerms] = useState(AI_TERMS)
  const [connections, setConnections] = useState(AI_CONNECTIONS)
  const [dragging, setDragging] = useState(null)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const canvasZoomRef = useRef(1)
  const setZoom = (z) => { canvasZoomRef.current = z; setCanvasZoom(z) }
  const selectionBoxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch('/api/ai-terimleri')
      .then(res => res.json())
      .then(data => {
        if (data && !Array.isArray(data) && data.terms) {
          setTerms(data.terms)
          setConnections(data.connections || [])
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h || 600 })
        } else if (data && Array.isArray(data) && data.length > 0) {
          setTerms(data)
        }
      })
      .catch(err => console.error('AI Terimleri yükleme hatası:', err))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          const next = parseFloat(Math.min(Math.max(canvasZoomRef.current + delta, 0.3), 2.5).toFixed(2))
          setZoom(next)
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])


  useEffect(() => {
    if (terms.length === 0) return
    const maxX = Math.max(...terms.map(t => t.x)) + AI_NODE_W / 2 + 120
    const maxY = Math.max(...terms.map(t => t.y)) + AI_NODE_H / 2 + 120
    setCanvasDim(prev => ({ w: Math.max(prev.w, maxX), h: Math.max(prev.h, maxY) }))
  }, [terms])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/ai-terimleri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms, connections, metadata: canvasDim }),
      })
      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString())
      } else {
        alert('Kaydedilemedi')
      }
    } catch (err) {
      alert('Hata: ' + err.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      const dx = (e.clientX - dragging.startMouseX) / canvasZoomRef.current
      const dy = (e.clientY - dragging.startMouseY) / canvasZoomRef.current
      setTerms(prev => prev.map(t => {
        if (dragging.startPositions && dragging.startPositions[t.id]) {
          return { ...t, x: dragging.startPositions[t.id].x + dx, y: dragging.startPositions[t.id].y + dy }
        }
        return t
      }))
    }
    
    const handleMouseUp = () => setDragging(null)

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]))
  const selectedTerm = selectedIds.length === 1 ? termMap[selectedIds[0]] : null

  const activeIds = new Set(selectedIds)
  if (hovered) activeIds.add(hovered)
  const connectedIds = activeIds.size > 0 ? new Set([
     ...activeIds,
     ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
     ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null

  const handleAddNode = () => {
    const newId = 'node_' + Math.random().toString(36).substr(2, 9)
    const newNode = {
      id: newId,
      abbr: 'Yeni AI Terimi',
      sub: 'Alt başlık...',
      cat: 'temel',
      x: 300 + (Math.random() * 100),
      y: 200 + (Math.random() * 100),
      desc: 'Bu AI kavramı için açıklama yazın...'
    }
    setTerms([...terms, newNode])
    setSelectedIds([newId])
    setEditId(newId)
  }

  const handleAddConnection = (targetId) => {
    if (selectedIds.length !== 1 || !targetId || selectedIds[0] === targetId) return
    const from = selectedIds[0]
    const to = targetId
    if (connections.find(c => c.from === from && c.to === to)) return
    setConnections([...connections, { from, to }])
  }

  const handleRemoveConnection = (targetId) => {
    setConnections(connections.filter(c => !(c.from === selectedIds[0] && c.to === targetId)))
  }



  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Yapay Zeka Terimleri</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            AI ekosisteminin temel kavramları ve aralarındaki ilişkiler · Terime tıkla: açıklamayı gör
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button onClick={() => setZoom(Math.min(parseFloat((canvasZoom + 0.15).toFixed(2)), 2.5))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <span style={{ fontSize: 11, color: '#888', minWidth: 36, textAlign: 'center' }}>{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(parseFloat((canvasZoom - 0.15).toFixed(2)), 0.3))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setZoom(1)} title="Sıfırla" style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
          </div>
          <button
            onClick={handleAddNode}
            style={{
              background: '#fff', border: '1px solid #ddd', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6, color: '#444'
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Kutu Ekle
          </button>
        </div>
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
        <div ref={containerRef} style={{ flex: 1, overflow: "auto", resize: "both", minHeight: 400, background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 10px' }}>
          <div style={{ width: canvasDim.w * canvasZoom, height: canvasDim.h * canvasZoom, flexShrink: 0 }}>
          <div ref={canvasRef} style={{ position: "relative", width: canvasDim.w, height: canvasDim.h, margin: 0, transform: `scale(${canvasZoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}
             onMouseDown={(e) => {
               if (e.button !== 0) return
               if (e.target !== e.currentTarget && e.target.tagName !== 'svg') return
               const cssZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
               const rect = e.currentTarget.getBoundingClientRect()
               const x = (e.clientX / cssZoom - rect.left) / canvasZoomRef.current
               const y = (e.clientY / cssZoom - rect.top) / canvasZoomRef.current
               const box = { startX: x, startY: y, currX: x, currY: y }
               selectionBoxRef.current = box
               setSelectionBox(box)
               const wasShift = e.shiftKey
               if (!e.shiftKey) setSelectedIds([])
               setEditId(null)
               const onWinMove = (me) => {
                 if (!selectionBoxRef.current || !canvasRef.current) return
                 const cz = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
                 const r = canvasRef.current.getBoundingClientRect()
                 const nb = { ...selectionBoxRef.current, currX: (me.clientX / cz - r.left) / canvasZoomRef.current, currY: (me.clientY / cz - r.top) / canvasZoomRef.current }
                 selectionBoxRef.current = nb
                 setSelectionBox(nb)
               }
               const onWinUp = () => {
                 const sb = selectionBoxRef.current
                 if (sb) {
                   const minX = Math.min(sb.startX, sb.currX), maxX = Math.max(sb.startX, sb.currX)
                   const minY = Math.min(sb.startY, sb.currY), maxY = Math.max(sb.startY, sb.currY)
                   const newlySelected = terms.filter(t => {
                     const hw = AI_NODE_W / 2, hh = AI_NODE_H / 2
                     return t.x - hw < maxX && t.x + hw > minX && t.y - hh < maxY && t.y + hh > minY
                   }).map(t => t.id)
                   if (wasShift) setSelectedIds(prev => Array.from(new Set([...prev, ...newlySelected])))
                   else setSelectedIds(newlySelected)
                   selectionBoxRef.current = null
                   setSelectionBox(null)
                 }
                 window.removeEventListener('mousemove', onWinMove)
                 window.removeEventListener('mouseup', onWinUp)
               }
               window.addEventListener('mousemove', onWinMove)
               window.addEventListener('mouseup', onWinUp)
             }}
          >

            {/* SVG çizgiler */}
            <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}>
              <defs>
                <marker id="ai-arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
                </marker>
                <marker id="ai-arr-hi" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#777" />
                </marker>
              </defs>
            {connections.map((conn, i) => {
                const from = termMap[conn.from]
                const to = termMap[conn.to]
                if (!from || !to) return null
                const p1 = aiEdgePoint(from, to)
                const p2 = aiEdgePoint(to, from)
                const isActive = activeIds.has(conn.from) || activeIds.has(conn.to)
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
            {selectionBox && (
              <div style={{
                position: 'absolute',
                border: '1px solid rgba(29, 158, 117, 0.5)',
                background: 'rgba(29, 158, 117, 0.1)',
                left: Math.min(selectionBox.startX, selectionBox.currX),
                top: Math.min(selectionBox.startY, selectionBox.currY),
                width: Math.abs(selectionBox.currX - selectionBox.startX),
                height: Math.abs(selectionBox.currY - selectionBox.startY),
                pointerEvents: 'none',
                zIndex: 10,
                borderRadius: 4
              }} />
            )}


            {/* Node'lar */}
            {terms.map(term => {
              const colors = AI_CAT_COLORS[term.cat]
              const isHovered = hovered === term.id
              const isSelected = selectedIds.includes(term.id)
              const isDimmed = connectedIds && !connectedIds.has(term.id)
              const isDragging = dragging?.id === term.id

              return (
                <div
                  key={term.id}
                  onMouseEnter={() => setHovered(term.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (dragging && (Math.abs(e.clientX - dragging.startMouseX) > 5 || Math.abs(e.clientY - dragging.startMouseY) > 5)) {
                      return
                    }
                  }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return
                    e.stopPropagation()
                    
                    let currentSelected = selectedIds;
                    if (!selectedIds.includes(term.id)) {
                      if (e.shiftKey) {
                        currentSelected = [...selectedIds, term.id]
                        setSelectedIds(currentSelected)
                      } else {
                        currentSelected = [term.id]
                        setSelectedIds(currentSelected)
                        if (editId !== term.id) setEditId(null)
                      }
                    }

                    const startPositions = {}
                    terms.forEach(t => {
                      if (currentSelected.includes(t.id)) {
                        startPositions[t.id] = { x: t.x, y: t.y }
                      }
                    })

                    setDragging({
                      startMouseX: e.clientX,
                      startMouseY: e.clientY,
                      startPositions
                    })
                  }}
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
                    opacity: isDimmed && !isDragging ? 0.22 : 1,
                    boxShadow: isSelected
                      ? `inset 3px 0 0 ${colors.stripe}, 0 0 0 3px ${colors.stripe}33, 0 4px 16px ${colors.stripe}22`
                      : isHovered
                        ? `inset 3px 0 0 ${colors.stripe}, 0 3px 12px ${colors.stripe}33`
                        : `inset 3px 0 0 ${colors.stripe}, 0 1px 3px rgba(0,0,0,0.06)`,
                    transition: isDragging ? 'none' : 'all 0.13s',
                    zIndex: isDragging ? 4 : isSelected ? 3 : isHovered ? 2 : 1,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
                    boxSizing: 'border-box', overflow: 'hidden',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.stripe, lineHeight: 1.2, marginBottom: 3, whiteSpace: 'pre-line' }}>{term.abbr}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>{term.sub}</div>
                </div>
              )
            })}
          </div>
          </div>
        </div>

        {/* Açıklama paneli */}
        <div style={{
          width: 300,
          flexShrink: 0,
          background: '#fff',
          border: '0.5px solid #e8e8e8',
          borderRadius: 12,
          padding: '1.25rem',
          minHeight: 200,
          maxHeight: '80vh',
          overflowY: 'auto',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: 80,
          transition: 'all 0.2s',
          boxShadow: selectedTerm ? '0 8px 24px rgba(0,0,0,0.05)' : 'none'
        }}>
          {selectedIds.length > 1 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 28, color: '#1D9E75', marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{selectedIds.length} Kutu Seçili</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Şu anda birden fazla terim seçtiniz. Bunları birlikte taşıyabilir veya toplu olarak silebilirsiniz.</div>
            <button
               onClick={() => {
                 if (confirm(`Seçili ${selectedIds.length} kutuyu ve bağlantılarını silmek istediğinize emin misiniz?`)) {
                   setConnections(connections.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to)))
                   setTerms(terms.filter(t => !selectedIds.includes(t.id)))
                   setSelectedIds([]); setEditId(null);
                 }
               }}
               style={{ padding: '10px 14px', background: '#ffefef', border: '1px solid #ffccc7', color: '#f5222d', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}            >
              Toplu Sil
            </button>
          </div>
        ) : selectedTerm ? (            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: AI_CAT_COLORS[selectedTerm.cat].stripe, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: AI_CAT_COLORS[selectedTerm.cat].stripe, fontWeight: 600 }}>
                    {AI_CAT_LABELS[selectedTerm.cat].toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setEditId(prev => prev === selectedTerm.id ? null : selectedTerm.id)}
                  style={{
                    fontSize: 11, cursor: 'pointer', padding: '4px 10px',
                    borderRadius: 6, border: '0.5px solid #d0d0d0', background: '#fff', color: '#555'
                  }}
                >
                  {editId === selectedTerm.id ? 'Bitti' : 'Düzenle'}
                </button>
              </div>

              {editId === selectedTerm.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Başlık</label>
                    <input
                      value={selectedTerm.abbr}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, abbr: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Alt Başlık</label>
                    <input
                      value={selectedTerm.sub}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, sub: e.target.value } : t))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Renk</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {Object.entries(AI_CAT_COLORS).map(([cat, colors]) => (
                        <div
                          key={cat}
                          onClick={() => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, cat } : t))}
                          title={AI_CAT_LABELS[cat] || cat}
                          style={{
                            width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
                            background: colors.bg,
                            border: selectedTerm.cat === cat ? `2.5px solid ${colors.stripe}` : `1.5px solid ${colors.border}`,
                            boxShadow: selectedTerm.cat === cat ? `0 0 0 2px ${colors.stripe}44` : 'none',
                            display: 'flex', alignItems: 'flex-end', padding: '0 3px 3px',
                            transition: 'all 0.1s', boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ width: '100%', height: 3, borderRadius: 2, background: colors.stripe }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* TEXTAREA_MOVED */}

                  <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8, fontWeight: 600 }}>BAĞLANTI YÖNETİMİ</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ padding: '5px 10px', fontSize: 12, background: '#f0f0f0', border: '0.5px solid #ccc', borderRadius: 6, fontWeight: 700, whiteSpace: 'nowrap', color: '#333' }}>
                          A: {selectedTerm.abbr}
                        </div>
                        <span style={{ fontSize: 16, color: '#999' }}>→</span>
                        <select
                          id="ai-target-select"
                          style={{ flex: 1, padding: '6px 10px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none', background: '#fff' }}
                        >
                          <option value="">B kutusunu seç...</option>
                          {terms.filter(t => t.id !== selectedTerm.id).map(t => (
                            <option key={t.id} value={t.id}>{t.abbr} ({t.sub})</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const sel = document.getElementById('ai-target-select')
                            if (sel.value) handleAddConnection(sel.value)
                          }}
                          style={{ padding: '6px 14px', fontSize: 12, background: '#f5f5f5', border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer' }}
                        >
                          Ekle
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {connections.filter(c => c.from === selectedTerm.id).map(c => {
                        const target = termMap[c.to]
                        if (!target) return null
                        return (
                          <div key={c.to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#f9f9f9', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11 }}>
                            <span>→ {target.abbr}</span>
                            <button onClick={() => handleRemoveConnection(c.to)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f' }}>Kaldır</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '0.5px solid #eee', display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        if (confirm('Bu kutuyu ve tüm bağlantılarını silmek istediğinize emin misiniz?')) {
                          setConnections(connections.filter(c => c.from !== selectedTerm.id && c.to !== selectedTerm.id))
                          setTerms(terms.filter(t => t.id !== selectedTerm.id))
                          setSelectedIds([]); setEditId(null);
                        }
                      }}
                      style={{ color: '#ff4d4f', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Kutuyu Tamamen Sil
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, color: AI_CAT_COLORS[selectedTerm.cat].stripe, marginBottom: 4, whiteSpace: 'pre-line' }}>
                    {selectedTerm.abbr}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{selectedTerm.sub}</div>
                  {/* PREVIEW_MOVED */}
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 8, color: '#ccc', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>◎</div>
              <div style={{ fontSize: 12 }}>Bir terime tıkla,<br />açıklamasını gör</div>
            </div>
          )}
        </div>

      </div>

      {/* Kaydet butonu — sağ alt */}

      {selectedTerm && (
        <div style={{ 
          marginTop: 20, 
          padding: 20, 
          background: "#fff", 
          border: "1px solid #e8e8e8", 
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: (AI_CAT_COLORS[selectedTerm.cat] || AI_CAT_COLORS['web'] || AI_CAT_COLORS[Object.keys(AI_CAT_COLORS)[0]]).stripe }}></span>
            AÇIKLAMA DÜZENLEME & DETAY
          </div>
          {editId === selectedTerm.id ? (
            <div>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Açıklama</label>
                    <textarea
                      value={selectedTerm.desc}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: e.target.value } : t))}
                      onPaste={(e) => {
                        e.preventDefault()
                        const html = e.clipboardData.getData('text/html')
                        const plain = e.clipboardData.getData('text/plain')
                        let pasted = plain
                        if (html) {
                          const div = document.createElement('div')
                          div.innerHTML = html
                          div.querySelectorAll('table').forEach(table => {
                            let rows = ''
                            table.querySelectorAll('tr').forEach(tr => {
                              const cells = [...tr.querySelectorAll('td,th')].map(c => c.innerText.trim())
                              rows += '| ' + cells.join(' | ') + ' |\n'
                            })
                            table.replaceWith(document.createTextNode('\n' + rows))
                          })
                          div.querySelectorAll('h1').forEach(el => el.replaceWith(document.createTextNode('# ' + el.innerText + '\n')))
                          div.querySelectorAll('h2').forEach(el => el.replaceWith(document.createTextNode('## ' + el.innerText + '\n')))
                          div.querySelectorAll('h3,h4,h5,h6').forEach(el => el.replaceWith(document.createTextNode('### ' + el.innerText + '\n')))
                          div.querySelectorAll('ol > li').forEach((li, i) => li.prepend(document.createTextNode((i + 1) + '. ')))
                          div.querySelectorAll('ul > li').forEach(li => li.prepend(document.createTextNode('• ')))
                          div.querySelectorAll('li,p,div,br').forEach(el => el.after(document.createTextNode('\n')))
                          pasted = div.innerText.replace(/\n{3,}/g, '\n\n').trim()
                        }
                        const el = e.target
                        const start = el.selectionStart
                        const end = el.selectionEnd
                        const current = el.value
                        const newValue = current.substring(0, start) + pasted + current.substring(end)
                        setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: newValue } : t))
                        setTimeout(() => { el.selectionStart = el.selectionEnd = start + pasted.length }, 0)
                      }}
                      style={{
                        width: '100%', minHeight: 300, padding: 12, fontSize: 15, lineHeight: 1.7,
                        color: '#333', border: '0.5px solid #ccc', borderRadius: 8,
                        outline: 'none', resize: 'vertical', fontFamily: 'inherit'
                      }}
                    />
                  </div>
          ) : (
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{selectedTerm.desc}</div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
        {lastSaved && <span style={{ fontSize: 11, color: '#1D9E75' }}>Kaydedildi: {lastSaved}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: '#111', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 14px', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  )
}

// ─── Reklam Hiyerarşisi aracı ─────────────────────────────────────────────────
function ReklamHiyerarsisi({
  apiPath = '/api/reklam-hiyerarsisi',
  headerText = 'Reklam Hiyerarşisi',
  headerSubtext = 'Başlıkları ve açıklamaları düzenle, kaydet',
  emptyText = 'Henüz hiyerarşi öğesi yok.',
  emptyIcon = '◐',
  titlePlaceholder = 'Başlık...',
  descPlaceholder = 'Açıklama yaz...',
  searchPlaceholder = 'Başlık veya açıklamada ara...',
  titleFallback = 'Başlık yok',
  descFallback = 'Açıklama yok',
  showNestedFaq = true,
  addToTop = false,
  descMinHeight = 80,
  focusedLeftWidth = 290,
  focusedDescMinHeight = 320,
  focusedDescFontSize = 14,
  focusedDescLineHeight = 1.8,
} = {}) {
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
    fetch(apiPath)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [apiPath])

  const addItem = (afterId = null) => {
    const newItem = { id: Date.now(), title: '', description: '', expanded: true, faq: [] }
    setItems(prev => {
      if (!afterId) return addToTop ? [newItem, ...prev] : [...prev, newItem]
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

    // Tabloları sütun | sütun formatına çevir (diğer işlemlerden önce)
    div.querySelectorAll('table').forEach(table => {
      let rows = ''
      table.querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.querySelectorAll('td,th')].map(c => c.textContent.trim())
        rows += cells.join(' | ') + '\n'
      })
      table.replaceWith(document.createTextNode('\n' + rows + '\n'))
    })

    // Sıralı listeler: doğrudan li çocuklarına "1. " numaraları ekle
    div.querySelectorAll('ol').forEach(ol => {
      ;[...ol.querySelectorAll(':scope > li')].forEach((li, i) => {
        li.prepend(document.createTextNode(`${i + 1}. `))
      })
    })

    // Sırasız listeler: her li'ye "• " ekle
    div.querySelectorAll('ul > li').forEach(li => {
      li.prepend(document.createTextNode('• '))
    })

    // Başlıklar: önce satır sonu, sonra tek satır sonu
    div.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
      el.before(document.createTextNode('\n'))
      el.after(document.createTextNode('\n'))
    })

    // Paragraflar: sonrasına tek satır sonu (önceden \n\n idi, boşlukları çok açıyordu)
    div.querySelectorAll('p').forEach(el => el.after(document.createTextNode('\n')))

    // Liste öğeleri: sonrasına satır sonu
    div.querySelectorAll('li').forEach(el => el.after(document.createTextNode('\n')))

    // <br> → newline
    div.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')))

    // Block div/section elementleri
    div.querySelectorAll('div,section,article').forEach(el => el.after(document.createTextNode('\n')))

    return div.textContent
      .replace(/[ \t]+/g, ' ')      // çoklu boşluk → tek
      .replace(/\n[ \t]+/g, '\n')   // satır başı boşlukları temizle
      .replace(/[ \t]+\n/g, '\n')   // satır sonu boşluklarını temizle
      .replace(/\n{2,}/g, '\n')     // art arda 2 veya daha fazla boş satırı TEK satıra indir
      .trim()
  }

  // Genel paste handler — herhangi bir textarea için (description, SSS cevap, vs.)
  // onUpdate: (newValue) => void  -- state güncelleme callback'i
  const handleSmartPaste = (e, currentVal, onUpdate) => {
    const html = e.clipboardData?.getData('text/html') || ''
    const plain = e.clipboardData?.getData('text/plain') || ''
    let text = html ? parseHtmlToText(html) : ''
    if (!text) text = plain  // HTML yoksa veya parse boş gelirse düz metni kullan
    if (!text) return
    e.preventDefault()

    // Güvenlik katmanı: Düz metinden gelse dahi çift/gereksiz boşlukları temizle
    text = text.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n')

    const el = e.target
    const before = currentVal.slice(0, el.selectionStart)
    const after  = currentVal.slice(el.selectionEnd)
    const sep = before.length > 0 && !before.endsWith('\n') ? '\n' : ''
    onUpdate(before + sep + text + after)
  }

  const handleDescriptionPaste = (e, id, currentVal) => {
    handleSmartPaste(e, currentVal, (v) => updateItem(id, 'description', v))
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
      const res = await fetch(apiPath, {
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
    minHeight: descMinHeight,
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

      {/* Başlık + ekle + kaydet — mobil editor modunda gizle */}
      {!mobileEditorMode && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, margin: '0 0 4px' }}>{headerText}</h1>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{headerSubtext}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {error && <span style={{ fontSize: 12, color: '#c0392b' }}>{error}</span>}
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
            {items.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 18px',
                  background: saved ? '#1D9E75' : '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 9,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'background 0.2s',
                }}
              >
                {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Kaydet'}
              </button>
            )}
          </div>
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
              placeholder={searchPlaceholder}
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
          <div style={{ fontSize: 24, marginBottom: 8 }}>{emptyIcon}</div>
          <div style={{ fontSize: 13 }}>{emptyText}<br />Sağ üstten ekleyin.</div>
        </div>
      )}

      {/* Split panel veya tek sütun */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: (focusedId && !isMobile) ? `${focusedLeftWidth}px 1fr` : '1fr',
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
                        placeholder={titlePlaceholder}
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
                        placeholder={descPlaceholder}
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
                {focusedItem.title || <span style={{ color: '#ccc' }}>{titleFallback}</span>}
              </div>
            ) : (
              <input
                type="text"
                placeholder={titlePlaceholder}
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
                fontSize: focusedDescFontSize, color: '#444',
                lineHeight: focusedDescLineHeight, whiteSpace: 'pre-wrap',
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
                  : <span style={{ color: '#ccc', fontStyle: 'italic' }}>{descFallback}</span>
                }
              </div>
            ) : (
              <textarea
                placeholder={descPlaceholder}
                value={focusedItem.description}
                onChange={e => updateItem(focusedId, 'description', e.target.value)}
                onPaste={e => handleDescriptionPaste(e, focusedId, focusedItem.description)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  fontSize: focusedDescFontSize, padding: 0,
                  borderRadius: 0, border: 'none',
                  fontFamily: 'inherit', outline: 'none',
                  resize: 'vertical', minHeight: focusedDescMinHeight,
                  lineHeight: focusedDescLineHeight, color: '#444',
                  background: 'transparent',
                }}
                draggable={false}
              />
            )}

            {/* ── SSS Bölümü ── */}
            {showNestedFaq && (
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
                                onPaste={e => handleSmartPaste(e, faqItem.answer, (v) => updateFaq(focusedId, faqItem.id, 'answer', v))}
                                style={{
                                  width: '100%', boxSizing: 'border-box',
                                  fontSize: 14, padding: '12px 14px',
                                  borderRadius: 8, border: '0.5px solid #e0e0e0',
                                  fontFamily: 'inherit', outline: 'none',
                                  resize: 'vertical', minHeight: 280,
                                  lineHeight: 1.75, color: '#333', background: '#fff',
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Kod Blokları Zihin Haritası ──────────────────────────────────────────────
const KB_NODE_W = 140
const KB_NODE_H = 60

const KB_CAT_COLORS = {
  frontend:   { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  backend:    { bg: '#E8F5E9', border: '#2E7D3266', stripe: '#2E7D32' },
  devops:     { bg: '#FFF3E0', border: '#E6510066', stripe: '#E65100' },
  veritabani: { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
  yardimci:   { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
  kirmizi:    { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:      { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert:   { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:      { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
}

const KB_CAT_LABELS = {
  frontend: 'Frontend', backend: 'Backend', devops: 'DevOps', veritabani: 'Veritabanı', yardimci: 'Yardımcı',
  kirmizi: 'Kırmızı', pembe: 'Pembe', lacivert: 'Lacivert', gumus: 'Gümüş',
}

function kbEdgePoint(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y }
  const hw = KB_NODE_W / 2
  const hh = KB_NODE_H / 2
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity
  const scale = Math.min(scaleX, scaleY)
  return { x: from.x + dx * scale, y: from.y + dy * scale }
}

function KodBloklariHaritasi() {
  const containerRef = useRef(null)
  const [canvasDim, setCanvasDim] = useState({ w: 880, h: 555 })
  const [hovered, setHovered] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [terms, setTerms] = useState([])
  const [connections, setConnections] = useState([])
  const [dragging, setDragging] = useState(null)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const canvasZoomRef = useRef(1)
  const setZoom = (z) => { canvasZoomRef.current = z; setCanvasZoom(z) }
  const selectionBoxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch('/api/kod-bloklari')
      .then(res => res.json())
      .then(data => {
        console.log('Kod Blokları Yüklenen Veri:', data)
        if (data && data.terms) {
          setTerms(data.terms)
          setConnections(data.connections || [])
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h || 600 })
        }
      })
      .catch(err => console.error('Kod Blokları yükleme hatası:', err))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          const next = parseFloat(Math.min(Math.max(canvasZoomRef.current + delta, 0.3), 2.5).toFixed(2))
          setZoom(next)
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    if (terms.length === 0) return
    const maxX = Math.max(...terms.map(t => t.x)) + KB_NODE_W / 2 + 120
    const maxY = Math.max(...terms.map(t => t.y)) + KB_NODE_H / 2 + 120
    setCanvasDim(prev => ({ w: Math.max(prev.w, maxX), h: Math.max(prev.h, maxY) }))
  }, [terms])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { terms, connections, metadata: canvasDim }
      console.log('Kod Blokları Kaydedilecek veri:', payload)

      const res = await fetch('/api/kod-bloklari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const result = await res.json()

      if (res.ok && result.ok) {
        setLastSaved(new Date().toLocaleTimeString())
      } else {
        console.error('Kod Blokları sunucu hatası:', result)
        alert('Kaydedilemedi: ' + (result.error || 'Bilinmeyen hata'))
      }
    } catch (err) {
      console.error('Kod Blokları bağlantı hatası:', err)
      alert('Hata: ' + err.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      const dx = (e.clientX - dragging.startMouseX) / canvasZoomRef.current
      const dy = (e.clientY - dragging.startMouseY) / canvasZoomRef.current
      setTerms(prev => prev.map(t => {
        if (dragging.startPositions && dragging.startPositions[t.id]) {
          return { ...t, x: dragging.startPositions[t.id].x + dx, y: dragging.startPositions[t.id].y + dy }
        }
        return t
      }))
    }
    const handleMouseUp = () => setDragging(null)
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]))
  const selectedTerm = selectedIds.length === 1 ? termMap[selectedIds[0]] : null

  const activeIds = new Set(selectedIds)
  if (hovered) activeIds.add(hovered)
  const connectedIds = activeIds.size > 0 ? new Set([
     ...activeIds,
     ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
     ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null

  const handleAddNode = () => {
    const newId = 'kb_' + Math.random().toString(36).substr(2, 9)
    const newNode = {
      id: newId,
      abbr: 'Yeni Blok',
      sub: 'Alt başlık...',
      cat: 'frontend',
      x: 300 + (Math.random() * 100),
      y: 200 + (Math.random() * 100),
      desc: '// Kod parçacığını buraya yapıştırın veya açıklama yazın...'
    }
    setTerms([...terms, newNode])
    setSelectedIds([newId])
    setEditId(newId)
  }

  const handleAddConnection = (targetId) => {
    if (selectedIds.length !== 1 || !targetId || selectedIds[0] === targetId) return
    const from = selectedIds[0]
    const to = targetId
    if (connections.find(c => c.from === from && c.to === to)) return
    setConnections([...connections, { from, to }])
  }

  const handleRemoveConnection = (targetId) => {
    setConnections(connections.filter(c => !(c.from === selectedIds[0] && c.to === targetId)))
  }

  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Kod Blokları</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            Teknik mimari, kod parçacıkları ve yapılar arası ilişkiler
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button onClick={() => setZoom(Math.min(parseFloat((canvasZoom + 0.15).toFixed(2)), 2.5))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <span style={{ fontSize: 11, color: '#888', minWidth: 36, textAlign: 'center' }}>{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(parseFloat((canvasZoom - 0.15).toFixed(2)), 0.3))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setZoom(1)} title="Sıfırla" style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
          </div>
          <button
            onClick={handleAddNode}
            style={{
              background: '#fff', border: '1px solid #ddd', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6, color: '#444'
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Blok Ekle
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(KB_CAT_LABELS).map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: KB_CAT_COLORS[cat].stripe }} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div ref={containerRef} style={{ flex: 1, overflow: "auto", minHeight: 400, background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 10px' }}>
          <div style={{ width: canvasDim.w * canvasZoom, height: canvasDim.h * canvasZoom, flexShrink: 0 }}>
          <div ref={canvasRef} style={{ position: "relative", width: canvasDim.w, height: canvasDim.h, margin: 0, transform: `scale(${canvasZoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}
             onMouseDown={(e) => {
               if (e.button !== 0) return
               if (e.target !== e.currentTarget && e.target.tagName !== 'svg') return
               const rect = e.currentTarget.getBoundingClientRect()
               const x = (e.clientX - rect.left) / canvasZoomRef.current
               const y = (e.clientY - rect.top) / canvasZoomRef.current
               const box = { startX: x, startY: y, currX: x, currY: y }
               selectionBoxRef.current = box
               setSelectionBox(box)
               const wasShift = e.shiftKey
               if (!e.shiftKey) setSelectedIds([])
               setEditId(null)
               const onWinMove = (me) => {
                 if (!selectionBoxRef.current || !canvasRef.current) return
                 const r = canvasRef.current.getBoundingClientRect()
                 const nb = { ...selectionBoxRef.current, currX: (me.clientX - r.left) / canvasZoomRef.current, currY: (me.clientY - r.top) / canvasZoomRef.current }
                 selectionBoxRef.current = nb
                 setSelectionBox(nb)
               }
               const onWinUp = () => {
                 const sb = selectionBoxRef.current
                 if (sb) {
                   const x1 = Math.min(sb.startX, sb.currX), x2 = Math.max(sb.startX, sb.currX)
                   const y1 = Math.min(sb.startY, sb.currY), y2 = Math.max(sb.startY, sb.currY)
                   const newly = terms.filter(t => t.x > x1 && t.x < x2 && t.y > y1 && t.y < y2).map(t => t.id)
                   if (wasShift) setSelectedIds(prev => Array.from(new Set([...prev, ...newly])))
                   else setSelectedIds(newly)
                   selectionBoxRef.current = null
                   setSelectionBox(null)
                 }
                 window.removeEventListener('mousemove', onWinMove)
                 window.removeEventListener('mouseup', onWinUp)
               }
               window.addEventListener('mousemove', onWinMove)
               window.addEventListener('mouseup', onWinUp)
             }}
          >
            <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}>
              <defs>
                <marker id="kb-arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" /></marker>
                <marker id="kb-arr-hi" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#777" /></marker>
              </defs>
              {connections.map((conn, i) => {
                const from = termMap[conn.from], to = termMap[conn.to]
                if (!from || !to) return null
                const p1 = kbEdgePoint(from, to), p2 = kbEdgePoint(to, from)
                const isActive = activeIds.has(conn.from) || activeIds.has(conn.to)
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isActive ? '#777' : '#ddd'} strokeWidth={isActive ? 2 : 1.5} markerEnd={isActive ? 'url(#kb-arr-hi)' : 'url(#kb-arr)'} />
              })}
            </svg>
            {selectionBox && (
              <div style={{ position: 'absolute', border: '1px solid rgba(29, 158, 117, 0.5)', background: 'rgba(29, 158, 117, 0.1)', left: Math.min(selectionBox.startX, selectionBox.currX), top: Math.min(selectionBox.startY, selectionBox.currY), width: Math.abs(selectionBox.currX - selectionBox.startX), height: Math.abs(selectionBox.currY - selectionBox.startY), pointerEvents: 'none', zIndex: 10, borderRadius: 4 }} />
            )}
            {terms.map(term => {
              const colors = KB_CAT_COLORS[term.cat], isHovered = hovered === term.id, isSelected = selectedIds.includes(term.id), isDimmed = connectedIds && !connectedIds.has(term.id), isDragging = dragging?.id === term.id
              return (
                <div key={term.id} onMouseEnter={() => setHovered(term.id)} onMouseLeave={() => setHovered(null)}
                  onClick={(e) => { e.stopPropagation(); if (dragging && (Math.abs(e.clientX - dragging.startMouseX) > 5 || Math.abs(e.clientY - dragging.startMouseY) > 5)) return; }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return; e.stopPropagation()
                    let currentSelected = selectedIds; if (!selectedIds.includes(term.id)) { if (e.shiftKey) currentSelected = [...selectedIds, term.id]; else currentSelected = [term.id]; setSelectedIds(currentSelected); if (editId !== term.id) setEditId(null) }
                    const pos = {}; terms.forEach(t => { if (currentSelected.includes(t.id)) pos[t.id] = { x: t.x, y: t.y } })
                    setDragging({ startMouseX: e.clientX, startMouseY: e.clientY, startPositions: pos, id: term.id })
                  }}
                  style={{
                    position: 'absolute', left: term.x - KB_NODE_W / 2, top: term.y - KB_NODE_H / 2, width: KB_NODE_W, height: KB_NODE_H,
                    background: isSelected ? colors.stripe + '18' : colors.bg, border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.stripe : (isHovered ? colors.stripe : colors.border)}`,
                    borderRadius: 8, padding: '6px 10px 6px 12px', opacity: isDimmed && !isDragging ? 0.22 : 1, transition: isDragging ? 'none' : 'all 0.13s', zIndex: isDragging ? 4 : isSelected ? 3 : isHovered ? 2 : 1,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', boxSizing: 'border-box', overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.stripe, lineHeight: 1.2, marginBottom: 3, whiteSpace: 'pre-line' }}>{term.abbr}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>{term.sub}</div>
                </div>
              )
            })}
          </div>
          </div>
        </div>

        <div style={{ width: 300, flexShrink: 0, background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '1.25rem', minHeight: 200, maxHeight: '80vh', overflowY: 'auto', alignSelf: 'flex-start', position: 'sticky', top: 80, transition: 'all 0.2s', boxShadow: selectedTerm ? '0 8px 24px rgba(0,0,0,0.05)' : 'none' }}>
          {selectedIds.length > 1 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: '#1D9E75', marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{selectedIds.length} Blok Seçili</div>
              <button onClick={() => { if (confirm(`Seçili ${selectedIds.length} bloğu silmek istediğinize emin misiniz?`)) { setConnections(connections.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to))); setTerms(terms.filter(t => !selectedIds.includes(t.id))); setSelectedIds([]); setEditId(null); } }} style={{ padding: '10px 14px', background: '#ffefef', border: '1px solid #ffccc7', color: '#f5222d', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>Toplu Sil</button>
            </div>
          ) : selectedTerm ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: KB_CAT_COLORS[selectedTerm.cat].stripe, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: KB_CAT_COLORS[selectedTerm.cat].stripe, fontWeight: 600 }}>{KB_CAT_LABELS[selectedTerm.cat].toUpperCase()}</span>
                </div>
                <button onClick={() => setEditId(prev => prev === selectedTerm.id ? null : selectedTerm.id)} style={{ fontSize: 11, cursor: 'pointer', padding: '4px 10px', borderRadius: 6, border: '0.5px solid #d0d0d0', background: '#fff', color: '#555' }}>{editId === selectedTerm.id ? 'Bitti' : 'Düzenle'}</button>
              </div>
              {editId === selectedTerm.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Başlık</label><input value={selectedTerm.abbr} onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, abbr: e.target.value } : t))} style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }} /></div>
                  <div><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Alt Başlık</label><input value={selectedTerm.sub} onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, sub: e.target.value } : t))} style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }} /></div>
                  <div><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Renk</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{Object.entries(KB_CAT_COLORS).map(([cat, colors]) => (<div key={cat} onClick={() => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, cat } : t))} style={{ width: 26, height: 26, borderRadius: 6, cursor: 'pointer', background: colors.bg, border: selectedTerm.cat === cat ? `2.5px solid ${colors.stripe}` : `1.5px solid ${colors.border}`, display: 'flex', alignItems: 'flex-end', padding: '0 3px 3px', boxSizing: 'border-box' }}><div style={{ width: '100%', height: 3, borderRadius: 2, background: colors.stripe }} /></div>))}</div></div>
                  <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8, fontWeight: 600 }}>BAĞLANTI YÖNETİMİ</label><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><div style={{ padding: '5px 10px', fontSize: 12, background: '#f0f0f0', border: '0.5px solid #ccc', borderRadius: 6, fontWeight: 700, whiteSpace: 'nowrap', color: '#333' }}>A: {selectedTerm.abbr}</div><span style={{ fontSize: 16, color: '#999' }}>→</span><select id="kb-target-select" style={{ flex: 1, padding: '6px 10px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none', background: '#fff' }}><option value="">B bloğunu seç...</option>{terms.filter(t => t.id !== selectedTerm.id).map(t => (<option key={t.id} value={t.id}>{t.abbr} ({t.sub})</option>))}</select><button onClick={() => { const sel = document.getElementById('kb-target-select'); if (sel.value) handleAddConnection(sel.value) }} style={{ padding: '6px 14px', fontSize: 12, background: '#f5f5f5', border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer' }}>Ekle</button></div><div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>{connections.filter(c => c.from === selectedTerm.id).map(c => { const target = termMap[c.to]; if (!target) return null; return (<div key={c.to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#f9f9f9', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11 }}><span>→ {target.abbr}</span><button onClick={() => handleRemoveConnection(c.to)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f' }}>Kaldır</button></div>) })}</div></div>
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '0.5px solid #eee', display: 'flex', justifyContent: 'center' }}><button onClick={() => { if (confirm('Bu bloğu silmek istediğinize emin misiniz?')) { setConnections(connections.filter(c => c.from !== selectedTerm.id && c.to !== selectedTerm.id)); setTerms(terms.filter(t => t.id !== selectedTerm.id)); setSelectedIds([]); setEditId(null); } }} style={{ color: '#ff4d4f', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Bloğu Tamamen Sil</button></div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, color: KB_CAT_COLORS[selectedTerm.cat].stripe, marginBottom: 4 }}>{selectedTerm.abbr}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{selectedTerm.sub}</div>
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 8, color: '#ccc', textAlign: 'center' }}><div style={{ fontSize: 28 }}>◎</div><div style={{ fontSize: 12 }}>Bir bloğa tıkla,<br />açıklamasını gör</div></div>
          )}
        </div>
      </div>

      {selectedTerm && (
        <div style={{ marginTop: 20, padding: 20, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: KB_CAT_COLORS[selectedTerm.cat].stripe }}></span>İÇERİK DÜZENLEME & DETAY</div>
          {editId === selectedTerm.id ? (
            <textarea value={selectedTerm.desc} onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: e.target.value } : t))} style={{ width: '100%', minHeight: 400, padding: 12, fontSize: 14, lineHeight: 1.7, color: '#333', border: '0.5px solid #ccc', borderRadius: 8, outline: 'none', resize: 'vertical', fontFamily: 'monospace', background: '#f8f8f8' }} />
          ) : (
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', background: '#f8f8f8', padding: 16, borderRadius: 8, border: '0.5px solid #eee' }}>{selectedTerm.desc}</div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
        {lastSaved && <span style={{ fontSize: 11, color: '#1D9E75' }}>Kaydedildi: {lastSaved}</span>}
        <button onClick={handleSave} disabled={saving} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'all 0.2s' }}>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</button>
      </div>
    </div>
  )
}

// ─── Vaka Çalışmaları aracı — ana sayfa proje tablosunu yönetir ─────────────
function VakaCalismalari() {
  const [items, setItems] = useState([])
  const [focusedId, setFocusedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/vaka-calismalari')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // HTML clipboard → düz metin (SSS'deki parseHtmlToText'in birebir kopyası)
  const parseHtmlToText = (html) => {
    if (typeof document === 'undefined') return ''
    const div = document.createElement('div')
    div.innerHTML = html

    div.querySelectorAll('table').forEach(table => {
      let rows = ''
      table.querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.querySelectorAll('td,th')].map(c => c.textContent.trim())
        rows += cells.join(' | ') + '\n'
      })
      table.replaceWith(document.createTextNode('\n' + rows + '\n'))
    })

    div.querySelectorAll('ol').forEach(ol => {
      ;[...ol.querySelectorAll(':scope > li')].forEach((li, i) => {
        li.prepend(document.createTextNode(`${i + 1}. `))
      })
    })

    div.querySelectorAll('ul > li').forEach(li => {
      li.prepend(document.createTextNode('• '))
    })

    div.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
      el.before(document.createTextNode('\n'))
      el.after(document.createTextNode('\n'))
    })

    div.querySelectorAll('p').forEach(el => el.after(document.createTextNode('\n')))
    div.querySelectorAll('li').forEach(el => el.after(document.createTextNode('\n')))
    div.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')))
    div.querySelectorAll('div,section,article').forEach(el => el.after(document.createTextNode('\n')))

    return div.textContent
      .replace(/[ \t]+/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim()
  }

  const handleSmartPaste = (e, currentVal, onUpdate) => {
    const html = e.clipboardData?.getData('text/html') || ''
    const plain = e.clipboardData?.getData('text/plain') || ''
    let text = html ? parseHtmlToText(html) : ''
    if (!text) text = plain
    if (!text) return
    e.preventDefault()

    text = text.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n')

    const el = e.target
    const before = currentVal.slice(0, el.selectionStart)
    const after  = currentVal.slice(el.selectionEnd)
    const next = before + text + after
    onUpdate(next)
    requestAnimationFrame(() => {
      const pos = before.length + text.length
      el.selectionStart = el.selectionEnd = pos
    })
  }

  const blankProject = () => ({
    id: `vaka-${Date.now()}`,
    titleTR: '',
    titleEN: '',
    company: '',
    logo: '',
    categoryTR: '',
    categoryEN: '',
    resultTR: '',
    resultEN: '',
    tags: [],
    imageSeed: Math.floor(Math.random() * 100),
    problemTR: '',
    problemEN: '',
    solutionTR: '',
    solutionEN: '',
    metrics: [],
  })

  const addItem = (afterId = null) => {
    const newItem = blankProject()
    setItems(prev => {
      if (!afterId) return [...prev, newItem]
      const idx = prev.findIndex(i => i.id === afterId)
      if (idx === -1) return [...prev, newItem]
      const next = [...prev]
      next.splice(idx + 1, 0, newItem)
      return next
    })
    setFocusedId(newItem.id)
  }

  const removeItem = (id) => {
    if (!confirm('Bu vaka çalışmasını silmek istediğinden emin misin?')) return
    setItems(prev => prev.filter(i => i.id !== id))
    if (focusedId === id) setFocusedId(null)
  }

  const updateField = (id, key, val) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i))
  }

  const updateMetric = (itemId, metricIdx, key, val) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i
      const metrics = [...(i.metrics || [])]
      metrics[metricIdx] = { ...metrics[metricIdx], [key]: val }
      return { ...i, metrics }
    }))
  }

  const addMetric = (itemId) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i
      return { ...i, metrics: [...(i.metrics || []), { value: '', labelTR: '', labelEN: '' }] }
    }))
  }

  const removeMetric = (itemId, metricIdx) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i
      const metrics = [...(i.metrics || [])]
      metrics.splice(metricIdx, 1)
      return { ...i, metrics }
    }))
  }

  const handleDragStart = (id) => setDragId(id)
  const handleDragOver = (e, id) => {
    e.preventDefault()
    setDragOverId(id)
  }
  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (!dragId || dragId === targetId) {
      setDragId(null)
      setDragOverId(null)
      return
    }
    setItems(prev => {
      const fromIdx = prev.findIndex(i => i.id === dragId)
      const toIdx = prev.findIndex(i => i.id === targetId)
      if (fromIdx === -1 || toIdx === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      return next
    })
    setDragId(null)
    setDragOverId(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/vaka-calismalari', {
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

  const filtered = items.filter(it => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (it.company || '').toLowerCase().includes(q) ||
      (it.titleTR || '').toLowerCase().includes(q) ||
      (it.titleEN || '').toLowerCase().includes(q) ||
      (it.categoryTR || '').toLowerCase().includes(q)
    )
  })

  const focused = focusedId ? items.find(i => i.id === focusedId) : null

  // ─── Stiller ─────────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'inherit',
    background: '#fff',
    outline: 'none',
  }
  const labelStyle = {
    display: 'block',
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: 600,
  }
  const sectionStyle = {
    background: '#fafafa',
    border: '1px solid #eee',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  }
  const sectionTitleStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 14 }}>
        Yükleniyor...
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#111' }}>Vaka Çalışmaları</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Ana sayfada görünen projeleri ekle, düzenle, sırala</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => addItem()}
            style={{
              padding: '8px 14px',
              background: '#fff',
              color: '#111',
              border: '1px solid #111',
              borderRadius: 9,
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            + Ekle
          </button>
          {items.length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '8px 18px',
                background: saved ? '#1D9E75' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'background 0.2s',
                fontWeight: 600,
              }}
            >
              {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Kaydet'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: 10, background: '#fee', color: '#c33', borderRadius: 6, fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Search */}
      {items.length > 0 && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Şirket, başlık veya kategori ara..."
          style={{
            ...inputStyle,
            marginBottom: 14,
            padding: '10px 14px',
            fontSize: 13,
          }}
        />
      )}

      {items.length === 0 && (
        <div style={{
          padding: 40,
          textAlign: 'center',
          color: '#888',
          background: '#fafafa',
          border: '1px dashed #ddd',
          borderRadius: 8,
          fontSize: 14,
        }}>
          ◆ Henüz vaka çalışması yok. <strong style={{ color: '#111', cursor: 'pointer' }} onClick={() => addItem()}>+ Ekle</strong> ile başla.
        </div>
      )}

      {/* Split layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: focused ? '320px 1fr' : '1fr',
        gap: 16,
        alignItems: 'start',
      }}>
        {/* Sol — liste */}
        {items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((it, idx) => {
              const isDragOver = dragOverId === it.id && dragId !== it.id
              const isFocused = focusedId === it.id
              return (
                <div
                  key={it.id}
                  draggable
                  onDragStart={() => handleDragStart(it.id)}
                  onDragOver={(e) => handleDragOver(e, it.id)}
                  onDrop={(e) => handleDrop(e, it.id)}
                  onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    background: isFocused ? '#fff' : '#fafafa',
                    border: isFocused ? '1px solid #111' : '1px solid #eee',
                    borderTop: isDragOver ? '2px solid #111' : (isFocused ? '1px solid #111' : '1px solid #eee'),
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onClick={() => setFocusedId(it.id)}
                >
                  <span style={{ color: '#bbb', fontSize: 14, cursor: 'grab' }}>⠿</span>
                  <span style={{ color: '#bbb', fontSize: 11, minWidth: 18 }}>{String(idx + 1).padStart(2, '0')}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.company || 'İsimsiz'}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.titleTR || '(başlık yok)'}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); addItem(it.id) }}
                    title="Bu vakanın altına ekle"
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14, padding: 4 }}
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(it.id) }}
                    title="Sil"
                    style={{ background: 'none', border: 'none', color: '#c33', cursor: 'pointer', fontSize: 12, padding: 4 }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Sağ — odaklı düzenleyici */}
        {focused && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: 18 }}>
            {/* Üst bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
                {String(items.findIndex(i => i.id === focused.id) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => setFocusedId(null)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13 }}
              >
                ✕ Kapat
              </button>
            </div>

            {/* Kimlik */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Kimlik</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={labelStyle}>ID (slug)</label>
                  <input
                    type="text"
                    value={focused.id}
                    onChange={(e) => updateField(focused.id, 'id', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Şirket</label>
                  <input
                    type="text"
                    value={focused.company || ''}
                    onChange={(e) => updateField(focused.id, 'company', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Logo (URL, /pek.svg veya yükle)</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {focused.logo && (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          border: '1px solid #e5e5e5',
                          borderRadius: 6,
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={focused.logo}
                          alt="Logo önizleme"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 2 }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={focused.logo || ''}
                      onChange={(e) => updateField(focused.id, 'logo', e.target.value)}
                      placeholder="/logo.svg"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <label
                      style={{
                        padding: '8px 10px',
                        background: '#fff',
                        color: '#111',
                        border: '1px solid #111',
                        borderRadius: 6,
                        fontSize: 11,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      ↑ Yükle
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          if (file.size > 500 * 1024) {
                            alert('Logo dosyası 500 KB\'dan büyük olamaz. SVG veya küçük PNG kullan.')
                            e.target.value = ''
                            return
                          }
                          const reader = new FileReader()
                          reader.onload = () => {
                            updateField(focused.id, 'logo', reader.result)
                          }
                          reader.readAsDataURL(file)
                          e.target.value = ''
                        }}
                      />
                    </label>
                    {focused.logo && (
                      <button
                        onClick={() => updateField(focused.id, 'logo', '')}
                        title="Logoyu kaldır"
                        style={{
                          padding: '8px 10px',
                          background: 'none',
                          border: '1px solid #eee',
                          borderRadius: 6,
                          color: '#c33',
                          fontSize: 11,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Image Seed</label>
                  <input
                    type="number"
                    value={focused.imageSeed ?? 0}
                    onChange={(e) => updateField(focused.id, 'imageSeed', Number(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Başlık */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Başlık</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>TR</label>
                  <input
                    type="text"
                    value={focused.titleTR || ''}
                    onChange={(e) => updateField(focused.id, 'titleTR', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EN</label>
                  <input
                    type="text"
                    value={focused.titleEN || ''}
                    onChange={(e) => updateField(focused.id, 'titleEN', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Kategori */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Kategori</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>TR</label>
                  <input
                    type="text"
                    value={focused.categoryTR || ''}
                    onChange={(e) => updateField(focused.id, 'categoryTR', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EN</label>
                  <input
                    type="text"
                    value={focused.categoryEN || ''}
                    onChange={(e) => updateField(focused.id, 'categoryEN', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Sonuç */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Ana Sonuç</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>TR</label>
                  <input
                    type="text"
                    value={focused.resultTR || ''}
                    onChange={(e) => updateField(focused.id, 'resultTR', e.target.value)}
                    placeholder="%92 Dönüşüm Artışı"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EN</label>
                  <input
                    type="text"
                    value={focused.resultEN || ''}
                    onChange={(e) => updateField(focused.id, 'resultEN', e.target.value)}
                    placeholder="+92% Conversion"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Problem */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Problem</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>TR</label>
                  <textarea
                    value={focused.problemTR || ''}
                    onChange={(e) => updateField(focused.id, 'problemTR', e.target.value)}
                    onPaste={(e) => handleSmartPaste(e, focused.problemTR || '', (v) => updateField(focused.id, 'problemTR', v))}
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EN</label>
                  <textarea
                    value={focused.problemEN || ''}
                    onChange={(e) => updateField(focused.id, 'problemEN', e.target.value)}
                    onPaste={(e) => handleSmartPaste(e, focused.problemEN || '', (v) => updateField(focused.id, 'problemEN', v))}
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                </div>
              </div>
            </div>

            {/* Çözüm */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Çözüm</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>TR</label>
                  <textarea
                    value={focused.solutionTR || ''}
                    onChange={(e) => updateField(focused.id, 'solutionTR', e.target.value)}
                    onPaste={(e) => handleSmartPaste(e, focused.solutionTR || '', (v) => updateField(focused.id, 'solutionTR', v))}
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EN</label>
                  <textarea
                    value={focused.solutionEN || ''}
                    onChange={(e) => updateField(focused.id, 'solutionEN', e.target.value)}
                    onPaste={(e) => handleSmartPaste(e, focused.solutionEN || '', (v) => updateField(focused.id, 'solutionEN', v))}
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                </div>
              </div>
            </div>

            {/* Etiketler */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Etiketler (virgülle ayır)</div>
              <input
                type="text"
                value={(focused.tags || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  updateField(focused.id, 'tags', arr)
                }}
                placeholder="Landing Pages, GTM, CRO, Meta Ads"
                style={inputStyle}
              />
            </div>

            {/* Metrikler */}
            <div style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ ...sectionTitleStyle, marginBottom: 0 }}>Metrikler</div>
                <button
                  onClick={() => addMetric(focused.id)}
                  style={{
                    padding: '6px 10px',
                    background: '#fff',
                    color: '#111',
                    border: '1px solid #111',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  + Metrik Ekle
                </button>
              </div>
              {(focused.metrics || []).length === 0 && (
                <div style={{ fontSize: 12, color: '#aaa', textAlign: 'center', padding: 8 }}>
                  Henüz metrik yok.
                </div>
              )}
              {(focused.metrics || []).map((m, mi) => (
                <div key={mi} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 30px', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={m.value || ''}
                    onChange={(e) => updateMetric(focused.id, mi, 'value', e.target.value)}
                    placeholder="+92%"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={m.labelTR || ''}
                    onChange={(e) => updateMetric(focused.id, mi, 'labelTR', e.target.value)}
                    placeholder="Etiket TR"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={m.labelEN || ''}
                    onChange={(e) => updateMetric(focused.id, mi, 'labelEN', e.target.value)}
                    placeholder="Label EN"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => removeMetric(focused.id, mi)}
                    title="Sil"
                    style={{ background: 'none', border: '1px solid #eee', borderRadius: 6, color: '#c33', cursor: 'pointer', fontSize: 12 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Dijital Anons aracı ──────────────────────────────────────────────────────
function DijitalAnons() {
  const [items, setItems] = useState([])
  const [focusedId, setFocusedId] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dijital-anons')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const blankAnons = () => ({
    id: `anons-${Date.now()}`,
    label: '',
    text: '',
    active: false,
  })

  const addItem = () => setItems(prev => [...prev, blankAnons()])

  const removeItem = (id) => {
    setItems(prev => {
      const next = prev.filter(it => it.id !== id)
      // Silinen aktifse — ilk kalan item'ı aktif yap
      const deleted = prev.find(it => it.id === id)
      if (deleted?.active && next.length > 0) {
        next[0].active = true
      }
      return next
    })
    if (focusedId === id) setFocusedId(null)
  }

  const updateField = (id, key, val) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it))

  const setActive = (id) =>
    setItems(prev => prev.map(it => ({ ...it, active: it.id === id })))

  // Drag-drop
  const handleDragStart = (id) => setDragId(id)
  const handleDragOver = (e, id) => { e.preventDefault(); if (id !== dragId) setDragOverId(id) }
  const handleDrop = () => {
    if (!dragId || !dragOverId || dragId === dragOverId) { setDragId(null); setDragOverId(null); return }
    setItems(prev => {
      const arr = [...prev]
      const from = arr.findIndex(i => i.id === dragId)
      const to   = arr.findIndex(i => i.id === dragOverId)
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return arr
    })
    setDragId(null)
    setDragOverId(null)
  }

  // Smart paste
  const parseHtmlToText = (html) => {
    if (typeof document === 'undefined') return ''
    const div = document.createElement('div')
    div.innerHTML = html
    div.querySelectorAll('table').forEach(table => {
      let rows = ''
      table.querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.querySelectorAll('td,th')].map(c => c.textContent.trim())
        rows += cells.join(' | ') + '\n'
      })
      table.replaceWith(document.createTextNode('\n' + rows + '\n'))
    })
    div.querySelectorAll('ol').forEach(ol => {
      ;[...ol.querySelectorAll(':scope > li')].forEach((li, i) => {
        li.prepend(document.createTextNode(`${i + 1}. `))
      })
    })
    div.querySelectorAll('ul > li').forEach(li => li.prepend(document.createTextNode('• ')))
    div.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
      el.before(document.createTextNode('\n'))
      el.after(document.createTextNode('\n'))
    })
    div.querySelectorAll('p').forEach(el => el.after(document.createTextNode('\n')))
    div.querySelectorAll('li').forEach(el => el.after(document.createTextNode('\n')))
    div.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')))
    div.querySelectorAll('div,section,article').forEach(el => el.after(document.createTextNode('\n')))
    return div.textContent
      .replace(/[ \t]+/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim()
  }

  const handleSmartPaste = (e, currentVal, onUpdate) => {
    const html = e.clipboardData?.getData('text/html') || ''
    const plain = e.clipboardData?.getData('text/plain') || ''
    let text = html ? parseHtmlToText(html) : ''
    if (!text) text = plain
    if (!text) return
    e.preventDefault()
    
    text = text.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n')

    const el = e.target
    const before = currentVal.slice(0, el.selectionStart)
    const after  = currentVal.slice(el.selectionEnd)
    const next = before + text + after
    onUpdate(next)
    requestAnimationFrame(() => {
      const pos = before.length + text.length
      el.selectionStart = el.selectionEnd = pos
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/dijital-anons', {
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

  const focused = items.find(it => it.id === focusedId) || null

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'inherit',
    background: '#fff',
    color: '#111',
    outline: 'none',
    boxSizing: 'border-box',
  }
  const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: 4 }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 13 }}>Yükleniyor…</div>

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>Dijital Anons</div>
            <div style={{ fontSize: 12, color: '#999' }}>Ana sayfadaki kayan metni düzenle; aktif anons yayına girer</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {error && <span style={{ fontSize: 12, color: '#c33' }}>{error}</span>}
            <button
              onClick={addItem}
              style={{
                padding: '8px 14px', background: '#fff', color: '#111',
                border: '1px solid #111', borderRadius: 8, fontSize: 13,
                fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
              }}
            >
              + Yeni Anons
            </button>
            {items.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 18px',
                  background: saved ? '#1D9E75' : '#111',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 13, fontFamily: 'inherit',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'background 0.2s',
                }}
              >
                {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Kaydet'}
              </button>
            )}
          </div>
        </div>
      </div>

      {items.length === 0 && (
        <div style={{
          padding: 40, textAlign: 'center', color: '#888',
          background: '#fafafa', border: '1px dashed #ddd',
          borderRadius: 8, fontSize: 14,
        }}>
          ▶ Henüz anons yok.{' '}
          <strong style={{ color: '#111', cursor: 'pointer' }} onClick={addItem}>+ Yeni Anons</strong>{' '}
          ile başla.
        </div>
      )}

      {/* Split layout */}
      {items.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: focused ? '280px 1fr' : '1fr',
          gap: 16,
          alignItems: 'start',
        }}>
          {/* Sol — liste */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(it => {
              const isDragOver = dragOverId === it.id && dragId !== it.id
              const isFocused = focusedId === it.id
              return (
                <div
                  key={it.id}
                  draggable
                  onDragStart={() => handleDragStart(it.id)}
                  onDragOver={(e) => handleDragOver(e, it.id)}
                  onDrop={handleDrop}
                  onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                  onClick={() => setFocusedId(isFocused ? null : it.id)}
                  style={{
                    border: `1px solid ${isDragOver ? '#e879a0' : isFocused ? '#111' : '#e5e5e5'}`,
                    borderLeft: `4px solid ${it.active ? '#e879a0' : '#e5e5e5'}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    background: isFocused ? '#fafafa' : '#fff',
                    cursor: 'pointer',
                    opacity: dragId === it.id ? 0.4 : 1,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{ cursor: 'grab', color: '#ccc', fontSize: 14, lineHeight: 1, flexShrink: 0 }}
                      onMouseDown={e => e.stopPropagation()}
                    >⠿</span>
                    <span style={{
                      flex: 1, fontSize: 13, fontWeight: 600, color: '#111',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {it.label || <span style={{ color: '#bbb', fontWeight: 400 }}>İsimsiz anons</span>}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(it.id) }}
                      style={{
                        background: 'none', border: 'none', color: '#ccc',
                        cursor: 'pointer', fontSize: 13, padding: 2, flexShrink: 0,
                      }}
                    >✕</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: it.active ? '#e879a0' : '#bbb',
                      letterSpacing: 0.5,
                    }}>
                      {it.active ? '● Yayında' : '○ Pasif'}
                    </span>
                    {!it.active && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setActive(it.id) }}
                        style={{
                          fontSize: 11, padding: '2px 8px',
                          background: '#fff', border: '1px solid #e879a0',
                          borderRadius: 4, color: '#e879a0',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        Aktif Yap
                      </button>
                    )}
                  </div>
                  {it.text && (
                    <div style={{
                      marginTop: 6, fontSize: 11, color: '#aaa',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {it.text.slice(0, 80)}{it.text.length > 80 ? '…' : ''}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sağ — odaklı düzenleyici */}
          {focused && (
            <div style={{
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              padding: 20,
              background: '#fff',
              position: 'sticky',
              top: 16,
            }}>
              {/* Panel header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: '#999' }}>
                  {items.findIndex(i => i.id === focused.id) + 1} / {items.length}
                </span>
                <button
                  onClick={() => setFocusedId(null)}
                  style={{
                    background: 'none', border: '1px solid #e5e5e5', borderRadius: 6,
                    fontSize: 12, color: '#999', cursor: 'pointer', padding: '4px 10px',
                    fontFamily: 'inherit',
                  }}
                >
                  × Kapat
                </button>
              </div>

              {/* Label */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Anons Etiketi (sadece adminde görünür)</label>
                <input
                  type="text"
                  value={focused.label}
                  onChange={e => updateField(focused.id, 'label', e.target.value)}
                  placeholder="örn. Q2 2025 Kampanya"
                  style={inputStyle}
                />
              </div>

              {/* Aktif toggle */}
              <div style={{ marginBottom: 16 }}>
                {focused.active ? (
                  <div style={{
                    padding: '10px 16px', background: '#f0faf6',
                    border: '1px solid #1D9E75', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, color: '#1D9E75',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span>✓</span> Yayında — Bu anons şu an ana sayfada gösteriliyor
                  </div>
                ) : (
                  <button
                    onClick={() => setActive(focused.id)}
                    style={{
                      width: '100%', padding: '10px 16px',
                      background: '#fff', border: '2px solid #e879a0',
                      borderRadius: 8, fontSize: 13, fontWeight: 700,
                      color: '#e879a0', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff0f6' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                  >
                    ● Aktif Yap — Ana sayfada bu metni göster
                  </button>
                )}
              </div>

              {/* Metin */}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Kayan Metin</label>
                <textarea
                  value={focused.text}
                  onChange={e => updateField(focused.id, 'text', e.target.value)}
                  onPaste={e => handleSmartPaste(e, focused.text, val => updateField(focused.id, 'text', val))}
                  placeholder="Ana sayfada kayan metin içeriği..."
                  style={{
                    ...inputStyle,
                    minHeight: 360,
                    resize: 'vertical',
                    lineHeight: 1.8,
                    fontSize: 14,
                    padding: '12px 14px',
                  }}
                />
                <div style={{
                  textAlign: 'right', fontSize: 11, color: '#bbb',
                  marginTop: 4,
                }}>
                  {(focused.text || '').length} karakter
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── SSS aracı — ReklamHiyerarsisi'nin SSS varyantı ──────────────────────────
function SSS() {
  return (
    <ReklamHiyerarsisi
      apiPath="/api/sss"
      headerText="Sık Sorulan Sorular"
      headerSubtext="Soru ve cevapları düzenle, kaydet"
      emptyText="Henüz soru yok."
      emptyIcon="?"
      titlePlaceholder="Soru..."
      descPlaceholder="Cevap yaz..."
      searchPlaceholder="Soru veya cevapta ara..."
      titleFallback="Soru yok"
      descFallback="Cevap yok"
      showNestedFaq={false}
      addToTop={true}
      descMinHeight={200}
      focusedLeftWidth={220}
      focusedDescMinHeight={520}
      focusedDescFontSize={15}
      focusedDescLineHeight={1.9}
    />
  )
}

// ─── Renkler — marka renk paleti referansı ────────────────────────────────────
const BRAND_COLORS = [
  { group: 'Logo Renkleri', colors: [
    { name: 'Pembe',  hex: '#e95578', desc: 'Logo sol kare' },
    { name: 'Sarı',   hex: '#f4bd13', desc: 'Logo büyük yay' },
    { name: 'Mavi',   hex: '#1e6296', desc: 'Logo alt yay' },
    { name: 'Mor',    hex: '#81358a', desc: 'Logo sağ üçgen' },
  ]},
  { group: 'Ana Sayfa Renkleri', colors: [
    { name: 'Yeşil (Accent)',  hex: '#12b347', desc: 'CTA butonları, vurgular' },
    { name: 'Yeşil Açık',      hex: '#3ecf6a', desc: 'Hover / açık varyant' },
    { name: 'Yeşil Koyu',      hex: '#0e933a', desc: 'Aktif / koyu varyant' },
    { name: 'Turuncu',         hex: '#ff6b00', desc: 'Hizmetler CTA, badge' },
    { name: 'Turuncu Koyu',    hex: '#e56000', desc: 'Hover varyant' },
  ]},
  { group: 'Nötr Tonlar', colors: [
    { name: 'Siyah (Ink)',     hex: '#111111', desc: 'Ana metin rengi' },
    { name: 'Gri Koyu',       hex: '#444444', desc: 'İkincil metin' },
    { name: 'Gri',            hex: '#666666', desc: 'Soluk metin' },
    { name: 'Pembe Nav',      hex: '#e879a0', desc: 'Navbar hover / aktif dot' },
  ]},
]

function Renkler() {
  const [copiedHex, setCopiedHex] = useState(null)

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 1500)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Marka Renkleri</h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Logo ve ana sayfa renk paleti · tıkla kopyala
        </p>
      </div>

      {BRAND_COLORS.map(group => (
        <div key={group.group} style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: '#aaa',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>{group.group}</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {group.colors.map(c => {
              const isCopied = copiedHex === c.hex
              return (
                <div
                  key={c.hex + c.name}
                  onClick={() => copyHex(c.hex)}
                  style={{
                    background: '#fff',
                    border: isCopied ? '1.5px solid #1D9E75' : '0.5px solid #e8e8e8',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isCopied ? '0 0 0 2px #1D9E7533' : 'none',
                  }}
                >
                  {/* Renk önizleme */}
                  <div style={{
                    height: 56,
                    background: c.hex,
                    borderRadius: '12px 12px 0 0',
                  }} />
                  {/* Bilgi */}
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{c.name}</div>
                    <div style={{
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: isCopied ? '#1D9E75' : '#888',
                      fontWeight: isCopied ? 600 : 400,
                      marginBottom: 4,
                    }}>
                      {isCopied ? '✓ Kopyalandı' : c.hex}
                    </div>
                    <div style={{ fontSize: 11, color: '#bbb', lineHeight: 1.3 }}>{c.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Reklam Hiyerarşisi Zihin Haritası ───────────────────────────────────────
const RH_NODE_W = 136
const RH_NODE_H = 66

const RH_CAT_COLORS = {
  web:      { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  seo:      { bg: '#FFF8E1', border: '#F57F1766', stripe: '#F57F17' },
  ads:      { bg: '#E8F5E9', border: '#1B5E2066', stripe: '#1B5E20' },
  sosyal:   { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
  kirmizi:  { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:    { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert: { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:    { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
}

const RH_TERMS = [
  {
    id: 'web', abbr: 'Web', sub: 'web', cat: 'web', x: 400, y: 200,
    desc: 'Web hiyerarşisi merkezi.',
  }
]

const RH_CONNECTIONS = []

function rhEdgePoint(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y }
  const hw = RH_NODE_W / 2
  const hh = RH_NODE_H / 2
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity
  const scale = Math.min(scaleX, scaleY)
  return { x: from.x + dx * scale, y: from.y + dy * scale }
}

const RH_CAT_LABELS = {
  web: 'Web Merkezi', seo: 'Organik Büyüme', ads: 'Ücretli Reklam', sosyal: 'Sosyal Medya',
  kirmizi: 'Kırmızı', pembe: 'Pembe', lacivert: 'Lacivert', gumus: 'Gümüş',
}

function ReklamHiyerarsisiHaritasi() {
  const containerRef = useRef(null)
  const [canvasDim, setCanvasDim] = useState({ w: 1400, h: 900 })
  const [hovered, setHovered] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [terms, setTerms] = useState(RH_TERMS)
  const [connections, setConnections] = useState(RH_CONNECTIONS)
  const [dragging, setDragging] = useState(null)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const canvasZoomRef = useRef(1)
  const setZoom = (z) => { canvasZoomRef.current = z; setCanvasZoom(z) }
  const selectionBoxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch('/api/reklam-hiyerarsisi-harita')
      .then(res => res.json())
      .then(data => {
        if (data && !Array.isArray(data) && data.terms) {
          setTerms(data.terms)
          setConnections(data.connections || [])
          if (data.metadata?.w) setCanvasDim({ w: Math.max(data.metadata.w, 1400), h: Math.max(data.metadata.h || 600, 900) })
        } else if (data && Array.isArray(data) && data.length > 0) {
          setTerms(data)
        }
      })
      .catch(err => console.error('Reklam Hiyerarsisi Haritası yükleme hatası:', err))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          const next = parseFloat(Math.min(Math.max(canvasZoomRef.current + delta, 0.3), 2.5).toFixed(2))
          setZoom(next)
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Canvas otomatik büyür — node dışarı taşınca canvas genişler
  useEffect(() => {
    if (terms.length === 0) return
    const padX = RH_NODE_W / 2 + 120
    const padY = RH_NODE_H / 2 + 120
    const maxX = Math.max(...terms.map(t => t.x)) + padX
    const maxY = Math.max(...terms.map(t => t.y)) + padY
    setCanvasDim(prev => ({
      w: Math.max(prev.w, maxX),
      h: Math.max(prev.h, maxY)
    }))
  }, [terms])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/reklam-hiyerarsisi-harita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms, connections, metadata: canvasDim }),
      })
      if (res.ok) {
        setLastSaved(new Date().toLocaleTimeString())
      } else {
        alert('Kaydedilemedi')
      }
    } catch (err) {
      alert('Hata: ' + err.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      const dx = (e.clientX - dragging.startMouseX) / canvasZoomRef.current
      const dy = (e.clientY - dragging.startMouseY) / canvasZoomRef.current
      setTerms(prev => prev.map(t => {
        if (dragging.startPositions && dragging.startPositions[t.id]) {
          return { ...t, x: dragging.startPositions[t.id].x + dx, y: dragging.startPositions[t.id].y + dy }
        }
        return t
      }))
    }
    
    const handleMouseUp = () => setDragging(null)

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]))
  const selectedTerm = selectedIds.length === 1 ? termMap[selectedIds[0]] : null

  const activeIds = new Set(selectedIds)
  if (hovered) activeIds.add(hovered)
  const connectedIds = activeIds.size > 0 ? new Set([
     ...activeIds,
     ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
     ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null

  const handleAddNode = () => {
    const newId = 'node_' + Math.random().toString(36).substr(2, 9)
    const newNode = {
      id: newId,
      abbr: 'Yeni Öğe',
      sub: 'Alt başlık...',
      cat: 'web',
      x: 300 + (Math.random() * 100),
      y: 200 + (Math.random() * 100),
      desc: 'Açıklama yazın...'
    }
    setTerms([...terms, newNode])
    setSelectedIds([newId])
    setEditId(newId)
  }

  const handleAddConnection = (targetId) => {
    if (selectedIds.length !== 1 || !targetId || selectedIds[0] === targetId) return
    const from = selectedIds[0]
    const to = targetId
    if (connections.find(c => c.from === from && c.to === to)) return
    setConnections([...connections, { from, to }])
  }

  const handleRemoveConnection = (targetId) => {
    setConnections(connections.filter(c => !(c.from === selectedIds[0] && c.to === targetId)))
  }



  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Reklam Hiyerarşisi Haritası</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
            Web ve reklam hiyerarşisi ilişkileri · Terime tıkla: açıklamayı gör
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {lastSaved && <span style={{ fontSize: 11, color: '#1D9E75' }}>Kaydedildi: {lastSaved}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: '#111', color: '#fff', border: 'none', borderRadius: 8,
              padding: '6px 14px', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
            }}
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
          <button
            onClick={handleAddNode}
            style={{
              background: '#fff', border: '1px solid #ddd', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6, color: '#444'
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Kutu Ekle
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(RH_CAT_LABELS).map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: RH_CAT_COLORS[cat].stripe }} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        <div ref={containerRef}
          style={{ flex: 1, overflow: "auto", resize: "both", minHeight: 400, background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 10px' }}
        >
          <div style={{ width: canvasDim.w * canvasZoom, height: canvasDim.h * canvasZoom, flexShrink: 0 }}>
          <div ref={canvasRef} style={{ position: "relative", width: canvasDim.w, height: canvasDim.h, margin: 0, transform: `scale(${canvasZoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}
             onMouseDown={(e) => {
               if (e.button !== 0) return
               if (e.target !== e.currentTarget && e.target.tagName !== 'svg') return
               const cssZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
               const rect = e.currentTarget.getBoundingClientRect()
               const x = (e.clientX / cssZoom - rect.left) / canvasZoomRef.current
               const y = (e.clientY / cssZoom - rect.top) / canvasZoomRef.current
               const box = { startX: x, startY: y, currX: x, currY: y }
               selectionBoxRef.current = box
               setSelectionBox(box)
               const wasShift = e.shiftKey
               if (!e.shiftKey) setSelectedIds([])
               setEditId(null)
               const onWinMove = (me) => {
                 if (!selectionBoxRef.current || !canvasRef.current) return
                 const cz = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
                 const r = canvasRef.current.getBoundingClientRect()
                 const nb = { ...selectionBoxRef.current, currX: (me.clientX / cz - r.left) / canvasZoomRef.current, currY: (me.clientY / cz - r.top) / canvasZoomRef.current }
                 selectionBoxRef.current = nb
                 setSelectionBox(nb)
               }
               const onWinUp = () => {
                 const sb = selectionBoxRef.current
                 if (sb) {
                   const minX = Math.min(sb.startX, sb.currX), maxX = Math.max(sb.startX, sb.currX)
                   const minY = Math.min(sb.startY, sb.currY), maxY = Math.max(sb.startY, sb.currY)
                   const newlySelected = terms.filter(t => {
                     const hw = RH_NODE_W / 2, hh = RH_NODE_H / 2
                     return t.x - hw < maxX && t.x + hw > minX && t.y - hh < maxY && t.y + hh > minY
                   }).map(t => t.id)
                   if (wasShift) setSelectedIds(prev => Array.from(new Set([...prev, ...newlySelected])))
                   else setSelectedIds(newlySelected)
                   selectionBoxRef.current = null
                   setSelectionBox(null)
                 }
                 window.removeEventListener('mousemove', onWinMove)
                 window.removeEventListener('mouseup', onWinUp)
               }
               window.addEventListener('mousemove', onWinMove)
               window.addEventListener('mouseup', onWinUp)
             }}
          >

            <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}>
              <defs>
                <marker id="rh-arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
                </marker>
                <marker id="rh-arr-hi" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#777" />
                </marker>
              </defs>
            {connections.map((conn, i) => {
                const from = termMap[conn.from]
                const to = termMap[conn.to]
                if (!from || !to) return null
                const p1 = rhEdgePoint(from, to)
                const p2 = rhEdgePoint(to, from)
                const isActive = activeIds.has(conn.from) || activeIds.has(conn.to)
                return (
                  <line
                    key={i}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={isActive ? '#777' : '#ddd'}
                    strokeWidth={isActive ? 2 : 1.5}
                    markerEnd={isActive ? 'url(#rh-arr-hi)' : 'url(#rh-arr)'}
                  />
                )
              })}
            </svg>
            {selectionBox && (
              <div style={{
                position: 'absolute',
                border: '1px solid rgba(29, 158, 117, 0.5)',
                background: 'rgba(29, 158, 117, 0.1)',
                left: Math.min(selectionBox.startX, selectionBox.currX),
                top: Math.min(selectionBox.startY, selectionBox.currY),
                width: Math.abs(selectionBox.currX - selectionBox.startX),
                height: Math.abs(selectionBox.currY - selectionBox.startY),
                pointerEvents: 'none',
                zIndex: 10,
                borderRadius: 4
              }} />
            )}


            {terms.map(term => {
              const colors = RH_CAT_COLORS[term.cat] || RH_CAT_COLORS['web']
              const isHovered = hovered === term.id
              const isSelected = selectedIds.includes(term.id)
              const isDimmed = connectedIds && !connectedIds.has(term.id)
              const isDragging = dragging?.id === term.id

              return (
                <div
                  key={term.id}
                  onMouseEnter={() => setHovered(term.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (dragging && (Math.abs(e.clientX - dragging.startMouseX) > 5 || Math.abs(e.clientY - dragging.startMouseY) > 5)) {
                      return
                    }
                  }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return
                    e.stopPropagation()
                    
                    let currentSelected = selectedIds;
                    if (!selectedIds.includes(term.id)) {
                      if (e.shiftKey) {
                        currentSelected = [...selectedIds, term.id]
                        setSelectedIds(currentSelected)
                      } else {
                        currentSelected = [term.id]
                        setSelectedIds(currentSelected)
                        if (editId !== term.id) setEditId(null)
                      }
                    }

                    const startPositions = {}
                    terms.forEach(t => {
                      if (currentSelected.includes(t.id)) {
                        startPositions[t.id] = { x: t.x, y: t.y }
                      }
                    })

                    setDragging({
                      startMouseX: e.clientX,
                      startMouseY: e.clientY,
                      startPositions
                    })
                  }}
                  style={{
                    position: 'absolute',
                    left: term.x - RH_NODE_W / 2,
                    top: term.y - RH_NODE_H / 2,
                    width: RH_NODE_W,
                    height: RH_NODE_H,
                    background: isSelected ? colors.stripe + '18' : colors.bg,
                    border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.stripe : (isHovered ? colors.stripe : colors.border)}`,
                    borderRadius: 8,
                    padding: '6px 10px 6px 12px',
                    opacity: isDimmed && !isDragging ? 0.22 : 1,
                    boxShadow: isSelected
                      ? `inset 3px 0 0 ${colors.stripe}, 0 0 0 3px ${colors.stripe}33, 0 4px 16px ${colors.stripe}22`
                      : isHovered
                        ? `inset 3px 0 0 ${colors.stripe}, 0 3px 12px ${colors.stripe}33`
                        : `inset 3px 0 0 ${colors.stripe}, 0 1px 3px rgba(0,0,0,0.06)`,
                    transition: isDragging ? 'none' : 'all 0.13s',
                    zIndex: isDragging ? 4 : isSelected ? 3 : isHovered ? 2 : 1,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
                    boxSizing: 'border-box', overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.stripe, lineHeight: 1.2, marginBottom: 3, whiteSpace: 'pre-line' }}>{term.abbr}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>{term.sub}</div>
                </div>
              )
            })}
          </div>
          </div>
        </div>

        <div style={{
          width: 300,
          flexShrink: 0,
          background: '#fff',
          border: '0.5px solid #e8e8e8',
          borderRadius: 12,
          padding: '1.25rem',
          minHeight: 200,
          maxHeight: '80vh',
          overflowY: 'auto',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: 80,
          transition: 'all 0.2s',
          boxShadow: selectedTerm ? '0 8px 24px rgba(0,0,0,0.05)' : 'none'
        }}>
          {selectedIds.length > 1 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 28, color: '#1D9E75', marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{selectedIds.length} Kutu Seçili</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Şu anda birden fazla terim seçtiniz. Bunları birlikte taşıyabilir veya toplu olarak silebilirsiniz.</div>
            <button
               onClick={() => {
                 if (confirm(`Seçili ${selectedIds.length} kutuyu ve bağlantılarını silmek istediğinize emin misiniz?`)) {
                   setConnections(connections.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to)))
                   setTerms(terms.filter(t => !selectedIds.includes(t.id)))
                   setSelectedIds([]); setEditId(null);
                 }
               }}
               style={{ padding: '10px 14px', background: '#ffefef', border: '1px solid #ffccc7', color: '#f5222d', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}            >
              Toplu Sil
            </button>
          </div>
        ) : selectedTerm ? (            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: (RH_CAT_COLORS[selectedTerm.cat] || RH_CAT_COLORS['web']).stripe, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: (RH_CAT_COLORS[selectedTerm.cat] || RH_CAT_COLORS['web']).stripe, fontWeight: 700 }}>
                    {(RH_CAT_LABELS[selectedTerm.cat] || 'Kategori').toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setEditId(prev => prev === selectedTerm.id ? null : selectedTerm.id)}
                  style={{
                    fontSize: 12, cursor: 'pointer', padding: '5px 12px',
                    borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff', color: '#444', fontWeight: 500
                  }}
                >
                  {editId === selectedTerm.id ? 'Bitti' : 'Düzenle'}
                </button>
              </div>

              {editId === selectedTerm.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>Başlık</label>
                    <input
                      value={selectedTerm.abbr}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, abbr: e.target.value } : t))}
                      style={{ width: '100%', padding: '8px 10px', fontSize: 14, border: '1px solid #ddd', borderRadius: 7, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>Alt Başlık</label>
                    <input
                      value={selectedTerm.sub}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, sub: e.target.value } : t))}
                      style={{ width: '100%', padding: '8px 10px', fontSize: 14, border: '1px solid #ddd', borderRadius: 7, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5, fontWeight: 600 }}>Renk</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {Object.entries(RH_CAT_COLORS).map(([cat, colors]) => (
                        <div
                          key={cat}
                          onClick={() => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, cat } : t))}
                          title={RH_CAT_LABELS[cat] || cat}
                          style={{
                            width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
                            background: colors.bg,
                            border: selectedTerm.cat === cat ? `2.5px solid ${colors.stripe}` : `1.5px solid ${colors.border}`,
                            boxShadow: selectedTerm.cat === cat ? `0 0 0 2px ${colors.stripe}44` : 'none',
                            display: 'flex', alignItems: 'flex-end', padding: '0 3px 3px',
                            transition: 'all 0.1s', boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ width: '100%', height: 3, borderRadius: 2, background: colors.stripe }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* TEXTAREA_MOVED */}

                  <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 10, fontWeight: 700, letterSpacing: '0.04em' }}>BAĞLANTI YÖNETİMİ</label>

                    {/* GİDEN: Bu → Hedef */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: '#888', paddingLeft: 2 }}>
                        <span style={{ fontWeight: 700, color: '#444' }}>Bu</span> → hedef seç:
                      </div>
                      <select
                        id="rh-target-select"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, border: '1px solid #ddd', borderRadius: 7, outline: 'none', background: '#fff', color: '#333' }}
                      >
                        <option value="">— Hedef kutuyu seç —</option>
                        {terms.filter(t => t.id !== selectedTerm.id).map(t => (
                          <option key={t.id} value={t.id}>{t.abbr} ({t.sub})</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const sel = document.getElementById('rh-target-select')
                          if (sel && sel.value) { handleAddConnection(sel.value); sel.value = '' }
                        }}
                        style={{ width: '100%', padding: '7px 14px', fontSize: 13, fontWeight: 600, background: '#111', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer' }}
                      >
                        + Giden Ok Ekle
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {connections.filter(c => c.from === selectedTerm.id).map(c => {
                          const target = termMap[c.to]
                          if (!target) return null
                          return (
                            <div key={c.to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: 7, fontSize: 13 }}>
                              <span style={{ color: '#333' }}>→ {target.abbr}</span>
                              <button onClick={() => handleRemoveConnection(c.to)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontSize: 12 }}>Kaldır</button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* GELEN: Kaynak → Bu */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: '0.5px solid #f0f0f0' }}>
                      <div style={{ fontSize: 12, color: '#888', paddingLeft: 2 }}>
                        kaynak seç → <span style={{ fontWeight: 700, color: '#444' }}>Bu</span>:
                      </div>
                      <select
                        id="rh-source-select"
                        style={{ width: '100%', padding: '7px 10px', fontSize: 13, border: '1px solid #ddd', borderRadius: 7, outline: 'none', background: '#fff', color: '#333' }}
                      >
                        <option value="">— Kaynak kutuyu seç —</option>
                        {terms.filter(t => t.id !== selectedTerm.id).map(t => (
                          <option key={t.id} value={t.id}>{t.abbr} ({t.sub})</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const sel = document.getElementById('rh-source-select')
                          if (sel && sel.value) {
                            const sourceId = sel.value
                            if (!connections.find(c => c.from === sourceId && c.to === selectedTerm.id)) {
                              setConnections(prev => [...prev, { from: sourceId, to: selectedTerm.id }])
                            }
                            sel.value = ''
                          }
                        }}
                        style={{ width: '100%', padding: '7px 14px', fontSize: 13, fontWeight: 600, background: '#444', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer' }}
                      >
                        + Gelen Ok Ekle
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {connections.filter(c => c.to === selectedTerm.id).map(c => {
                          const source = termMap[c.from]
                          if (!source) return null
                          return (
                            <div key={c.from} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: 7, fontSize: 13 }}>
                              <span style={{ color: '#333' }}>{source.abbr} →</span>
                              <button
                                onClick={() => setConnections(prev => prev.filter(c2 => !(c2.from === c.from && c2.to === selectedTerm.id)))}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', fontSize: 12 }}
                              >Kaldır</button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '0.5px solid #eee', display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        if (confirm('Bu kutuyu ve tüm bağlantılarını silmek istediğinize emin misiniz?')) {
                          setConnections(connections.filter(c => c.from !== selectedTerm.id && c.to !== selectedTerm.id))
                          setTerms(terms.filter(t => t.id !== selectedTerm.id))
                          setSelectedIds([]); setEditId(null);
                        }
                      }}
                      style={{ color: '#ff4d4f', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Kutuyu Tamamen Sil
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 19, fontWeight: 700, color: (RH_CAT_COLORS[selectedTerm.cat] || RH_CAT_COLORS['web']).stripe, marginBottom: 6, whiteSpace: 'pre-line' }}>
                    {selectedTerm.abbr}
                  </div>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>{selectedTerm.sub}</div>
                  {/* PREVIEW_MOVED */}
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 8, color: '#ccc', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>◎</div>
              <div style={{ fontSize: 12 }}>Bir terime tıkla,<br />açıklamasını gör</div>
            </div>
          )}
        </div>

      </div>


      {selectedTerm && (
        <div style={{
          marginTop: 20,
          padding: 20,
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: (RH_CAT_COLORS[selectedTerm.cat] || RH_CAT_COLORS['web'] || RH_CAT_COLORS[Object.keys(RH_CAT_COLORS)[0]]).stripe }}></span>
            AÇIKLAMA DÜZENLEME & DETAY
          </div>
          {editId === selectedTerm.id ? (
            <div>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Açıklama</label>
                    <textarea
                      value={selectedTerm.desc}
                      onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: e.target.value } : t))}
                      onPaste={(e) => {
                        e.preventDefault()
                        const html = e.clipboardData.getData('text/html')
                        const plain = e.clipboardData.getData('text/plain')
                        let pasted = plain
                        if (html) {
                          const div = document.createElement('div')
                          div.innerHTML = html
                          div.querySelectorAll('table').forEach(table => {
                            let rows = ''
                            table.querySelectorAll('tr').forEach(tr => {
                              const cells = [...tr.querySelectorAll('td,th')].map(c => c.innerText.trim())
                              rows += '| ' + cells.join(' | ') + ' |\n'
                            })
                            table.replaceWith(document.createTextNode('\n' + rows))
                          })
                          div.querySelectorAll('h1').forEach(el => el.replaceWith(document.createTextNode('# ' + el.innerText + '\n')))
                          div.querySelectorAll('h2').forEach(el => el.replaceWith(document.createTextNode('## ' + el.innerText + '\n')))
                          div.querySelectorAll('h3,h4,h5,h6').forEach(el => el.replaceWith(document.createTextNode('### ' + el.innerText + '\n')))
                          div.querySelectorAll('ol > li').forEach((li, i) => li.prepend(document.createTextNode((i + 1) + '. ')))
                          div.querySelectorAll('ul > li').forEach(li => li.prepend(document.createTextNode('• ')))
                          div.querySelectorAll('li,p,div,br').forEach(el => el.after(document.createTextNode('\n')))
                          pasted = div.innerText.replace(/\n{3,}/g, '\n\n').trim()
                        }
                        const el = e.target
                        const start = el.selectionStart
                        const end = el.selectionEnd
                        const current = el.value
                        const newValue = current.substring(0, start) + pasted + current.substring(end)
                        setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: newValue } : t))
                        setTimeout(() => { el.selectionStart = el.selectionEnd = start + pasted.length }, 0)
                      }}
                      style={{
                        width: '100%', minHeight: 300, padding: 12, fontSize: 15, lineHeight: 1.7,
                        color: '#333', border: '0.5px solid #ccc', borderRadius: 8,
                        outline: 'none', resize: 'vertical', fontFamily: 'inherit'
                      }}
                    />
                  </div>
          ) : (
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{selectedTerm.desc}</div>
          )}
        </div>
      )}

      {/* Reklam Hiyerarşisi içerik editörü — haritanın altında */}
      <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 24 }}>
        <ReklamHiyerarsisi />
      </div>

    </div>
  )
}

// ─── Kısa Notlar Aracı ────────────────────────────────────────────────────────
function KisaNotlar() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [draggedId, setDraggedId] = useState(null)

  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (!draggedId) return
    const draggedIndex = notes.findIndex(n => n.id === draggedId)
    if (draggedIndex === index) return

    const newNotes = [...notes]
    const [draggedItem] = newNotes.splice(draggedIndex, 1)
    newNotes.splice(index, 0, draggedItem)
    setNotes(newNotes) // optimistik sıra değişimi
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    saveNotes(notes)
  }

  useEffect(() => {
    fetch('/api/kisa-notlar')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotes(data)
        setLoading(false)
      })
  }, [])

  const saveNotes = async (newNotes) => {
    setSaving(true)
    try {
      await fetch('/api/kisa-notlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotes)
      })
    } catch {}
    setSaving(false)
  }

  const addNote = () => {
    const newId = Date.now().toString()
    const newNote = {
      id: newId,
      title: '',
      content: '',
      color: '#ffffff'
    }
    const newNotes = [newNote, ...notes]
    setNotes(newNotes)
    saveNotes(newNotes)
    setExpandedId(newId)
  }

  const changeNoteColor = (id, color) => {
    const newNotes = notes.map(n => n.id === id ? { ...n, color } : n)
    setNotes(newNotes)
    saveNotes(newNotes)
  }

  const deleteNote = (id) => {
    if(!confirm('Bu notu silmek istediğinize emin misiniz?')) return;
    const newNotes = notes.filter(n => n.id !== id)
    setNotes(newNotes)
    saveNotes(newNotes)
    if(expandedId === id) setExpandedId(null)
  }

  const COLORS = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed']

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Yükleniyor...</div>

  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Kısa Notlar</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Renk kodlu hızlı notlar al, düzenle, kaydet. Notların üzerine tıklayarak geniş ekranda düzenleyebilirsin.</p>
        </div>
        <button onClick={addNote} disabled={saving} style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'opacity 0.2s', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Kaydediliyor...' : '+ Yeni Not Ekle'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {notes.length === 0 && <div style={{ color: '#aaa', fontSize: 13, minHeight: 160, display: 'flex', alignItems: 'center' }}>Henüz not eklenmedi. Sağ üstten yeni not oluşturabilirsiniz.</div>}
        {notes.map((note, idx) => (
          <div key={note.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            onClick={() => setExpandedId(note.id)}
            style={{
              width: 250, background: note.color || '#fff', 
              border: '1px solid #e0e0e0', borderRadius: 12, 
              padding: 16, display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              position: 'relative', cursor: 'grab',
              transition: 'transform 0.15s, opacity 0.2s',
              opacity: draggedId === note.id ? 0.3 : 1
            }}
            onMouseEnter={e => draggedId ? null : e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => draggedId ? null : e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, fontFamily: 'inherit', color: '#222', minHeight: 22 }}>
              {note.title || <span style={{color:'#bbb', fontStyle:'italic'}}>Başlıksız</span>}
            </div>
            <div 
              className="kisa-notlar-preview"
              style={{ 
                fontSize: 14, lineHeight: 1.6, fontFamily: 'inherit', color: '#444', 
                flex: 1, minHeight: 180, whiteSpace: 'pre-wrap', overflow: 'hidden',
                display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical'
              }}
              dangerouslySetInnerHTML={{ __html: note.content || '<span style="color:#bbb; font-style:italic">Notunuz boştur...</span>' }} />
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12 }}>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', width: 170 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => changeNoteColor(note.id, c)} title="Renk Değiştir" style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: note.color === c ? '2.5px solid #555' : '1px solid #ccc', cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
              <button onClick={() => deleteNote(note.id)} title="Notu sil" style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Sil</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL / GENİŞ EKRAN */}
      {expandedId && typeof window !== 'undefined' && createPortal(
        <div 
          onClick={() => { setExpandedId(null); saveNotes(notes); }}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'transparent', zIndex: 999999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
            pointerEvents: 'auto'
          }}
        >
          <style>{`
            .kisa-notlar-modal::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
            .kisa-notlar-modal { scrollbar-width: none !important; -ms-overflow-style: none !important; }
            
            .kisa-notlar-modal h1, .kisa-notlar-modal font[size="6"] { font-size: 2em; font-weight: 800; margin: 0; line-height: 1.2; display: block; }
            .kisa-notlar-modal h2, .kisa-notlar-modal font[size="5"] { font-size: 1.5em; font-weight: 700; margin: 0; line-height: 1.3; display: block; }
            .kisa-notlar-modal h3, .kisa-notlar-modal font[size="4"] { font-size: 1.17em; font-weight: 600; margin: 0; line-height: 1.4; display: block; }
            .kisa-notlar-modal p, .kisa-notlar-modal font[size="3"] { font-size: 1em; font-weight: 400; margin: 0; display: block; }
            .kisa-notlar-modal ul { list-style-type: disc; padding-left: 2em; margin: 0.5em 0; display: block; }
            .kisa-notlar-modal ol { list-style-type: decimal; padding-left: 2em; margin: 0.5em 0; display: block; }
            .kisa-notlar-modal b, .kisa-notlar-modal strong { font-weight: 800; }
            .kisa-notlar-modal i, .kisa-notlar-modal em { font-style: italic; }
            .kisa-notlar-modal table { border-collapse: collapse; width: 100%; margin: 0.75em 0; display: table; }
            .kisa-notlar-modal th { background: rgba(0,0,0,0.06); font-weight: 700; text-align: left; padding: 7px 12px; border: 1px solid rgba(0,0,0,0.12); font-size: 0.85em; }
            .kisa-notlar-modal td { padding: 6px 12px; border: 1px solid rgba(0,0,0,0.1); font-size: 0.9em; vertical-align: top; }
            .kisa-notlar-modal tr:nth-child(even) td { background: rgba(0,0,0,0.025); }
            
            .kisa-notlar-preview h1, .kisa-notlar-preview font[size="6"] { font-size: 1.25em; font-weight: bold; margin: 0; line-height: 1.2; display: block; }
            .kisa-notlar-preview h2, .kisa-notlar-preview font[size="5"] { font-size: 1.1em; font-weight: bold; margin: 0; line-height: 1.2; display: block; }
            .kisa-notlar-preview h3, .kisa-notlar-preview font[size="4"] { font-size: 1em; font-weight: bold; margin: 0; line-height: 1.2; display: block; }
            .kisa-notlar-preview p, .kisa-notlar-preview font[size="3"] { font-size: 1em; font-weight: 400; margin: 0; display: block; }
            .kisa-notlar-preview ul { list-style-type: disc; padding-left: 1.5em; margin: 0; display: block; }
            .kisa-notlar-preview ol { list-style-type: decimal; padding-left: 1.5em; margin: 0; display: block; }
            .kisa-notlar-preview b, .kisa-notlar-preview strong { font-weight: 800; }
            .kisa-notlar-preview i, .kisa-notlar-preview em { font-style: italic; }
            .kisa-notlar-preview table { border-collapse: collapse; width: 100%; margin: 0.3em 0; display: table; font-size: 0.8em; }
            .kisa-notlar-preview th { background: rgba(0,0,0,0.06); font-weight: 700; text-align: left; padding: 4px 8px; border: 1px solid rgba(0,0,0,0.12); }
            .kisa-notlar-preview td { padding: 3px 8px; border: 1px solid rgba(0,0,0,0.1); vertical-align: top; }
          `}</style>
          {(() => {
            const activeNote = notes.find(n => n.id === expandedId)
            if (!activeNote) return null;
            return (
              <div 
                className="kisa-notlar-modal"
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%', maxWidth: 960, background: activeNote.color || '#fff',
                  borderRadius: 16, padding: '2rem', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                  display: 'flex', flexDirection: 'column', position: 'relative',
                  maxHeight: '92vh', overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                <textarea 
                  value={activeNote.title || ''}
                  onChange={e => {
                    setNotes(notes.map(n => n.id === activeNote.id ? { ...n, title: e.target.value } : n));
                  }}
                  onBlur={() => saveNotes(notes)}
                  ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                  placeholder="Başlık..."
                  rows={1}
                  style={{ flexShrink: 0, width: '100%', background: 'transparent', border: 'none', outline: 'none', fontWeight: 700, fontSize: 24, margin: '0 0 1rem 0', fontFamily: 'inherit', color: '#111', resize: 'none', overflow: 'hidden', lineHeight: 1.4 }}
                />

                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const html = e.currentTarget.innerHTML;
                    setNotes(notes.map(n => n.id === activeNote.id ? { ...n, content: html } : n));
                    saveNotes(notes.map(n => n.id === activeNote.id ? { ...n, content: html } : n));
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const html = e.clipboardData.getData('text/html');
                    const text = e.clipboardData.getData('text/plain');
                    if (html) {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(html, 'text/html');
                    const cleanNode = (node) => {
                        if (node.nodeType === 3) return document.createTextNode(node.textContent);
                        if (node.nodeType !== 1) return null;
                        const tag = node.tagName.toUpperCase();
                        let target = tag;
                        const allowed = ['H1','H2','H3','P','UL','OL','LI','B','STRONG','I','EM','U','BR','DIV','TABLE','THEAD','TBODY','TR','TD','TH'];
                        if (['H4','H5','H6'].includes(tag)) target = 'H3';
                        if (allowed.includes(target)) {
                          const res = document.createElement(target);
                          // TD/TH için colspan/rowspan koru
                          if (target === 'TD' || target === 'TH') {
                            if (node.getAttribute('colspan')) res.setAttribute('colspan', node.getAttribute('colspan'));
                            if (node.getAttribute('rowspan')) res.setAttribute('rowspan', node.getAttribute('rowspan'));
                          }
                          node.childNodes.forEach(c => { const cl = cleanNode(c); if(cl) res.appendChild(cl); });
                          return res;
                        }
                        const frag = document.createDocumentFragment();
                        node.childNodes.forEach(c => { const cl = cleanNode(c); if(cl) frag.appendChild(cl); });
                        return frag;
                      };
                      const cleaned = cleanNode(doc.body);
                      const wrap = document.createElement('div');
                      wrap.appendChild(cleaned);
                      document.execCommand('insertHTML', false, wrap.innerHTML);
                    } else {
                      const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
                      document.execCommand('insertHTML', false, escaped);
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: activeNote.content }}
                  className="kisa-notlar-modal"
                  style={{ 
                    flex: 1, overflowY: 'auto', 
                    width: '100%', background: 'transparent', border: 'none', outline: 'none', 
                    minHeight: 200, fontSize: 16, lineHeight: 1.8, fontFamily: 'inherit', color: '#333', 
                    scrollbarWidth: 'none', msOverflowStyle: 'none' 
                  }}
                />

                <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Renkler */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {COLORS.map(c => (
                        <button key={c} onClick={() => changeNoteColor(activeNote.id, c)} title="Renk Değiştir" style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: activeNote.color === c ? '2.5px solid #555' : '1px solid #ccc', cursor: 'pointer', padding: 0 }} />
                      ))}
                    </div>

                    <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)' }} />

                    {/* Zengin Metin Menüsü */}
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onMouseDown={e => { e.preventDefault(); document.execCommand('fontSize', false, '6') }} style={{ padding: '6px 12px', fontSize: 14, fontWeight: 700, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#111' }}>h1</button>
                      <button onMouseDown={e => { e.preventDefault(); document.execCommand('fontSize', false, '5') }} style={{ padding: '6px 12px', fontSize: 14, fontWeight: 600, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#222' }}>h2</button>
                      <button onMouseDown={e => { e.preventDefault(); document.execCommand('fontSize', false, '3') }} style={{ padding: '6px 12px', fontSize: 14, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#444' }}>p</button>
                      <button onMouseDown={e => { e.preventDefault(); document.execCommand('bold', false, null) }} style={{ padding: '6px 12px', fontSize: 14, fontWeight: 'bold', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer' }}>B</button>
                      <button onMouseDown={e => { e.preventDefault(); document.execCommand('italic', false, null) }} style={{ padding: '6px 12px', fontSize: 14, fontStyle: 'italic', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer' }}>I</button>
                      <button onMouseDown={e => { e.preventDefault(); document.execCommand('insertUnorderedList', false, null) }} style={{ padding: '6px 12px', fontSize: 14, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 4, cursor: 'pointer' }}>•</button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <button onClick={() => deleteNote(activeNote.id)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Sil</button>
                    <button onClick={() => { setExpandedId(null); saveNotes(notes); }} style={{ padding: '10px 24px', background: 'transparent', color: '#111', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', borderRadius: 8 }}>
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── Blog Yazıları — Sihirbaz tabanlı oluşturma/düzenleme ────────────────────
function BlogYazilari() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activePost, setActivePost] = useState(null) // null → liste, obje → sihirbaz

  useEffect(() => {
    fetch('/api/blog-yazilari')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPosts(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const persistPosts = async (newPosts) => {
    setSaving(true)
    try {
      const res = await fetch('/api/blog-yazilari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPosts),
      })
      const result = await res.json()
      if (!res.ok || !result.ok) {
        alert('Kaydedilemedi: ' + (result.error || 'Bilinmeyen hata'))
        return false
      }
      return true
    } catch (err) {
      alert('Hata: ' + err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleNew = () => {
    setActivePost({}) // boş → BlogWizard emptyPost() üretir
  }

  const handleEdit = (p) => {
    setActivePost(p)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return
    const updated = posts.filter(p => p.id !== id)
    if (await persistPosts(updated)) setPosts(updated)
  }

  const handleWizardSave = async (finalPost) => {
    const exists = posts.some(p => p.id === finalPost.id)
    const updated = exists
      ? posts.map(p => p.id === finalPost.id ? finalPost : p)
      : [finalPost, ...posts]
    if (await persistPosts(updated)) {
      setPosts(updated)
      setActivePost(null)
    }
  }

  const CAT_COLORS = { gtm: '#1D9E75', analytics: '#3B82F6', cro: '#F59E0B', otomasyon: '#8B5CF6', genel: '#6B7280', reklam: '#EF4444' }

  if (loading) return <div style={{ padding: '2rem', color: '#888', fontSize: 14 }}>Yükleniyor...</div>

  // ─── Wizard aktif ───────────────────────────────────────────
  if (activePost !== null) {
    return (
      <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => { if (confirm('Değişiklikler kaybolabilir. Listeye dönülsün mü?')) setActivePost(null) }}
            style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#555' }}>
            ← Yazı Listesi
          </button>
          {saving && <span style={{ fontSize: 11, color: '#888' }}>Kaydediliyor...</span>}
        </div>
        <BlogWizard
          initialPost={activePost.id ? activePost : undefined}
          onCancel={() => setActivePost(null)}
          onSave={handleWizardSave}
        />
      </div>
    )
  }

  // ─── Liste ──────────────────────────────────────────────────
  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Blog Yazıları</h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{posts.length} yazı · {posts.filter(p => p.published).length} yayında</p>
        </div>
        <button
          onClick={handleNew}
          style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Yazı
        </button>
      </div>

      {posts.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#bbb', fontSize: 14, background: '#fafafa', borderRadius: 12, border: '1px dashed #e0e0e0' }}>
          Henüz yazı yok. Yeni bir yazı oluştur — önce metni gir, sistem sana başlık, kategori ve etiket önerileri getirsin.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {posts.map(p => {
            const accent = CAT_COLORS[p.category] || '#6B7280'
            return (
              <div
                key={p.id}
                onClick={() => handleEdit(p)}
                style={{
                  background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden',
                  cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {p.coverImage ? (
                  <img src={p.coverImage} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ height: 80, background: (p.coverColor || accent) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                    {p.coverEmoji || '📝'}
                  </div>
                )}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent }}>
                      {p.category}
                    </span>
                    <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: p.published ? 'rgba(29,158,117,0.1)' : '#f5f5f5', color: p.published ? '#1D9E75' : '#999', fontWeight: 600, marginLeft: 'auto' }}>
                      {p.published ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111', lineHeight: 1.3, marginBottom: 6 }}>
                    {p.titleTR || '(başlıksız)'}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{p.publishedAt}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                      style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: 11, padding: '2px 6px' }}>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Araç listesi ─────────────────────────────────────────────────────────────
// ─── ANA Blok Zihin Haritası ──────────────────────────────────────────────────
function AnaHaritasi() {
  const containerRef = useRef(null)
  const draggingRef = useRef(null)
  const [canvasDim, setCanvasDim] = useState({ w: 880, h: 555 })
  const [hovered, setHovered] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionBox, setSelectionBox] = useState(null)
  const [terms, setTerms] = useState([])
  const [connections, setConnections] = useState([])
  const [dragging, setDragging] = useState(null)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const canvasZoomRef = useRef(1)
  const setZoom = (z) => { canvasZoomRef.current = z; setCanvasZoom(z) }
  const selectionBoxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch('/api/ana-harita')
      .then(r => r.json())
      .then(data => {
        if (data && data.terms) {
          setTerms(data.terms)
          setConnections(data.connections || [])
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h || 555 })
        }
      })
      .catch(err => console.error('ANA yükleme hatası:', err))
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          const next = parseFloat(Math.min(Math.max(canvasZoomRef.current + delta, 0.3), 2.5).toFixed(2))
          setZoom(next)
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    if (terms.length === 0) return
    const maxX = Math.max(...terms.map(t => t.x)) + KB_NODE_W / 2 + 120
    const maxY = Math.max(...terms.map(t => t.y)) + KB_NODE_H / 2 + 120
    setCanvasDim(prev => ({ w: Math.max(prev.w, maxX), h: Math.max(prev.h, maxY) }))
  }, [terms])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/ana-harita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms, connections, metadata: canvasDim }),
      })
      const result = await res.json()
      if (res.ok && result.ok) setLastSaved(new Date().toLocaleTimeString())
      else alert('Kaydedilemedi: ' + (result.error || 'Bilinmeyen hata'))
    } catch (err) { alert('Hata: ' + err.message) }
    setSaving(false)
  }

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]))
  const selectedTerm = selectedIds.length === 1 ? termMap[selectedIds[0]] : null
  const activeIds = new Set(selectedIds)
  if (hovered) activeIds.add(hovered)
  const connectedIds = activeIds.size > 0 ? new Set([...activeIds, ...connections.filter(c => activeIds.has(c.from)).map(c => c.to), ...connections.filter(c => activeIds.has(c.to)).map(c => c.from)]) : null

  const handleAddNode = () => {
    const id = 'ana_' + Math.random().toString(36).substr(2, 9)
    const node = { id, abbr: 'Yeni Düğüm', sub: 'Alt başlık...', cat: 'frontend', x: 300 + Math.random() * 100, y: 200 + Math.random() * 100, desc: 'Açıklama...' }
    setTerms([...terms, node]); setSelectedIds([id]); setEditId(id)
  }
  const handleAddConnection = (targetId) => {
    if (selectedIds.length !== 1 || !targetId || selectedIds[0] === targetId) return
    if (connections.find(c => c.from === selectedIds[0] && c.to === targetId)) return
    setConnections([...connections, { from: selectedIds[0], to: targetId }])
  }
  const handleRemoveConnection = (targetId) => setConnections(connections.filter(c => !(c.from === selectedIds[0] && c.to === targetId)))

  return (
    <div style={{ padding: '2rem 1.25rem', fontFamily: 'inherit' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>ANA Blok</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Zihin haritası — düğüm ekle, bağlantı kur, kaydet</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button onClick={() => setZoom(Math.min(parseFloat((canvasZoom + 0.15).toFixed(2)), 2.5))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <span style={{ fontSize: 11, color: '#888', minWidth: 36, textAlign: 'center' }}>{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(parseFloat((canvasZoom - 0.15).toFixed(2)), 0.3))} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => setZoom(1)} title="Sıfırla" style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
          </div>
          <button onClick={handleAddNode} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#444' }}>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span> Yeni Düğüm Ekle
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(KB_CAT_LABELS).map(([cat, label]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: KB_CAT_COLORS[cat].stripe }} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div ref={containerRef} style={{ flex: 1, overflow: 'auto', minHeight: 400, background: '#fafafa', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '8px 0 10px' }}>
          <div style={{ width: canvasDim.w * canvasZoom, height: canvasDim.h * canvasZoom, flexShrink: 0 }}>
          <div ref={canvasRef} style={{ position: 'relative', width: canvasDim.w, height: canvasDim.h, transform: `scale(${canvasZoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease-out' }}
            onMouseDown={(e) => {
              if (e.button !== 0) return
              if (e.target !== e.currentTarget && e.target.tagName !== 'svg') return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = (e.clientX - rect.left) / canvasZoomRef.current
              const y = (e.clientY - rect.top) / canvasZoomRef.current
              const box = { startX: x, startY: y, currX: x, currY: y }
              selectionBoxRef.current = box
              setSelectionBox(box)
              const wasShift = e.shiftKey
              if (!e.shiftKey) setSelectedIds([])
              setEditId(null)
              const onWinMove = (me) => {
                if (!selectionBoxRef.current || !canvasRef.current) return
                const r = canvasRef.current.getBoundingClientRect()
                const nb = { ...selectionBoxRef.current, currX: (me.clientX - r.left) / canvasZoomRef.current, currY: (me.clientY - r.top) / canvasZoomRef.current }
                selectionBoxRef.current = nb
                setSelectionBox(nb)
              }
              const onWinUp = () => {
                const sb = selectionBoxRef.current
                if (sb) {
                  const x1 = Math.min(sb.startX, sb.currX), x2 = Math.max(sb.startX, sb.currX)
                  const y1 = Math.min(sb.startY, sb.currY), y2 = Math.max(sb.startY, sb.currY)
                  const newly = terms.filter(t => t.x > x1 && t.x < x2 && t.y > y1 && t.y < y2).map(t => t.id)
                  if (wasShift) setSelectedIds(prev => Array.from(new Set([...prev, ...newly])))
                  else setSelectedIds(newly)
                  selectionBoxRef.current = null
                  setSelectionBox(null)
                }
                window.removeEventListener('mousemove', onWinMove)
                window.removeEventListener('mouseup', onWinUp)
              }
              window.addEventListener('mousemove', onWinMove)
              window.addEventListener('mouseup', onWinUp)
            }}
          >
            <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}>
              <defs>
                <marker id="ana-arr" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" /></marker>
                <marker id="ana-arr-hi" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#777" /></marker>
              </defs>
              {connections.map((conn, i) => {
                const from = termMap[conn.from], to = termMap[conn.to]
                if (!from || !to) return null
                const p1 = kbEdgePoint(from, to), p2 = kbEdgePoint(to, from)
                const isActive = activeIds.has(conn.from) || activeIds.has(conn.to)
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isActive ? '#777' : '#ddd'} strokeWidth={isActive ? 2 : 1.5} markerEnd={isActive ? 'url(#ana-arr-hi)' : 'url(#ana-arr)'} />
              })}
            </svg>
            {selectionBox && <div style={{ position: 'absolute', border: '1px solid rgba(29,158,117,0.5)', background: 'rgba(29,158,117,0.1)', left: Math.min(selectionBox.startX, selectionBox.currX), top: Math.min(selectionBox.startY, selectionBox.currY), width: Math.abs(selectionBox.currX - selectionBox.startX), height: Math.abs(selectionBox.currY - selectionBox.startY), pointerEvents: 'none', zIndex: 10, borderRadius: 4 }} />}
            {terms.map(term => {
              const colors = KB_CAT_COLORS[term.cat] || KB_CAT_COLORS.frontend
              const isHovered = hovered === term.id, isSelected = selectedIds.includes(term.id), isDimmed = connectedIds && !connectedIds.has(term.id), isDragging = dragging?.id === term.id
              return (
                <div key={term.id}
                  onMouseEnter={() => setHovered(term.id)} onMouseLeave={() => setHovered(null)}
                  onClick={(e) => { e.stopPropagation(); if (draggingRef.current && (Math.abs(e.clientX - draggingRef.current.startMouseX) > 5 || Math.abs(e.clientY - draggingRef.current.startMouseY) > 5)) return }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return; e.stopPropagation()
                    let cur = selectedIds; if (!selectedIds.includes(term.id)) { cur = e.shiftKey ? [...selectedIds, term.id] : [term.id]; setSelectedIds(cur); if (editId !== term.id) setEditId(null) }
                    const pos = {}; terms.forEach(t => { if (cur.includes(t.id)) pos[t.id] = { x: t.x, y: t.y } })
                    const dragState = { startMouseX: e.clientX, startMouseY: e.clientY, startPositions: pos, id: term.id }
                    draggingRef.current = dragState
                    setDragging(dragState)
                    const onMove = (me) => {
                      if (!draggingRef.current) return
                      const dx = (me.clientX - draggingRef.current.startMouseX) / canvasZoomRef.current, dy = (me.clientY - draggingRef.current.startMouseY) / canvasZoomRef.current
                      setTerms(prev => prev.map(t => draggingRef.current?.startPositions?.[t.id] ? { ...t, x: draggingRef.current.startPositions[t.id].x + dx, y: draggingRef.current.startPositions[t.id].y + dy } : t))
                    }
                    const onUp = () => { draggingRef.current = null; setDragging(null); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
                    window.addEventListener('mousemove', onMove)
                    window.addEventListener('mouseup', onUp)
                  }}
                  style={{ position: 'absolute', left: term.x - KB_NODE_W / 2, top: term.y - KB_NODE_H / 2, width: KB_NODE_W, height: KB_NODE_H, background: isSelected ? colors.stripe + '18' : colors.bg, border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.stripe : isHovered ? colors.stripe : colors.border}`, borderRadius: 8, padding: '6px 10px 6px 12px', opacity: isDimmed && !isDragging ? 0.22 : 1, transition: isDragging ? 'none' : 'all 0.13s', zIndex: isDragging ? 4 : isSelected ? 3 : isHovered ? 2 : 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', boxSizing: 'border-box', overflow: 'hidden' }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.stripe, lineHeight: 1.2, marginBottom: 3, whiteSpace: 'pre-line' }}>{term.abbr}</div>
                  <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>{term.sub}</div>
                </div>
              )
            })}
          </div>
          </div>
        </div>

        <div style={{ width: 300, flexShrink: 0, background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: 12, padding: '1.25rem', minHeight: 200, maxHeight: '80vh', overflowY: 'auto', alignSelf: 'flex-start', position: 'sticky', top: 80, transition: 'all 0.2s', boxShadow: selectedTerm ? '0 8px 24px rgba(0,0,0,0.05)' : 'none' }}>
          {selectedIds.length > 1 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: '#1D9E75', marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{selectedIds.length} Düğüm Seçili</div>
              <button onClick={() => { if (confirm(`Seçili ${selectedIds.length} düğümü silmek istiyor musunuz?`)) { setConnections(connections.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to))); setTerms(terms.filter(t => !selectedIds.includes(t.id))); setSelectedIds([]); setEditId(null) } }} style={{ padding: '10px 14px', background: '#ffefef', border: '1px solid #ffccc7', color: '#f5222d', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>Toplu Sil</button>
            </div>
          ) : selectedTerm ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: KB_CAT_COLORS[selectedTerm.cat]?.stripe || '#888', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: KB_CAT_COLORS[selectedTerm.cat]?.stripe || '#888', fontWeight: 600 }}>{(KB_CAT_LABELS[selectedTerm.cat] || selectedTerm.cat).toUpperCase()}</span>
                </div>
                <button onClick={() => setEditId(prev => prev === selectedTerm.id ? null : selectedTerm.id)} style={{ fontSize: 11, cursor: 'pointer', padding: '4px 10px', borderRadius: 6, border: '0.5px solid #d0d0d0', background: '#fff', color: '#555' }}>{editId === selectedTerm.id ? 'Bitti' : 'Düzenle'}</button>
              </div>
              {editId === selectedTerm.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Başlık</label><input value={selectedTerm.abbr} onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, abbr: e.target.value } : t))} style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }} /></div>
                  <div><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Alt Başlık</label><input value={selectedTerm.sub} onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, sub: e.target.value } : t))} style={{ width: '100%', padding: '6px 10px', fontSize: 13, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none' }} /></div>
                  <div><label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Renk</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{Object.entries(KB_CAT_COLORS).map(([cat, colors]) => (<div key={cat} onClick={() => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, cat } : t))} style={{ width: 26, height: 26, borderRadius: 6, cursor: 'pointer', background: colors.bg, border: selectedTerm.cat === cat ? `2.5px solid ${colors.stripe}` : `1.5px solid ${colors.border}`, display: 'flex', alignItems: 'flex-end', padding: '0 3px 3px', boxSizing: 'border-box' }}><div style={{ width: '100%', height: 3, borderRadius: 2, background: colors.stripe }} /></div>))}</div></div>
                  <div style={{ borderTop: '0.5px solid #eee', paddingTop: 12 }}>
                    <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8, fontWeight: 600 }}>BAĞLANTI YÖNETİMİ</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ padding: '5px 10px', fontSize: 12, background: '#f0f0f0', border: '0.5px solid #ccc', borderRadius: 6, fontWeight: 700, whiteSpace: 'nowrap', color: '#333' }}>A: {selectedTerm.abbr}</div>
                      <span style={{ fontSize: 16, color: '#999' }}>→</span>
                      <select id="ana-target-select" style={{ flex: 1, padding: '6px 10px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, outline: 'none', background: '#fff' }}>
                        <option value="">B düğümünü seç...</option>
                        {terms.filter(t => t.id !== selectedTerm.id).map(t => (<option key={t.id} value={t.id}>{t.abbr} ({t.sub})</option>))}
                      </select>
                      <button onClick={() => { const sel = document.getElementById('ana-target-select'); if (sel.value) handleAddConnection(sel.value) }} style={{ padding: '6px 14px', fontSize: 12, background: '#f5f5f5', border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer' }}>Ekle</button>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {connections.filter(c => c.from === selectedTerm.id).map(c => { const target = termMap[c.to]; if (!target) return null; return (<div key={c.to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#f9f9f9', border: '0.5px solid #eee', borderRadius: 6, fontSize: 11 }}><span>→ {target.abbr}</span><button onClick={() => handleRemoveConnection(c.to)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f' }}>Kaldır</button></div>) })}
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '0.5px solid #eee', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => { if (confirm('Bu düğümü silmek istiyor musunuz?')) { setConnections(connections.filter(c => c.from !== selectedTerm.id && c.to !== selectedTerm.id)); setTerms(terms.filter(t => t.id !== selectedTerm.id)); setSelectedIds([]); setEditId(null) } }} style={{ color: '#ff4d4f', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Düğümü Sil</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, color: KB_CAT_COLORS[selectedTerm.cat]?.stripe || '#333', marginBottom: 4 }}>{selectedTerm.abbr}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{selectedTerm.sub}</div>
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 8, color: '#ccc', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>◎</div>
              <div style={{ fontSize: 12 }}>Bir düğüme tıkla,<br />düzenle veya bağlantı kur</div>
            </div>
          )}
        </div>
      </div>

      {selectedTerm && (
        <div style={{ marginTop: 20, padding: 20, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: KB_CAT_COLORS[selectedTerm.cat]?.stripe || '#888' }}></span>İÇERİK DÜZENLEME & DETAY
          </div>
          {editId === selectedTerm.id ? (
            <textarea value={selectedTerm.desc} onChange={e => setTerms(prev => prev.map(t => t.id === selectedTerm.id ? { ...t, desc: e.target.value } : t))} style={{ width: '100%', minHeight: 400, padding: 12, fontSize: 14, lineHeight: 1.7, color: '#333', border: '0.5px solid #ccc', borderRadius: 8, outline: 'none', resize: 'vertical', fontFamily: 'monospace', background: '#f8f8f8' }} />
          ) : (
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', background: '#f8f8f8', padding: 16, borderRadius: 8, border: '0.5px solid #eee' }}>{selectedTerm.desc}</div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
        {lastSaved && <span style={{ fontSize: 11, color: '#1D9E75' }}>Kaydedildi: {lastSaved}</span>}
        <button onClick={handleSave} disabled={saving} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'all 0.2s' }}>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</button>
      </div>
    </div>
  )
}

const TOOLS = [
  {
    id: 'reklam-hiyerarsisi-harita',
    label: 'Reklam Hiyerarşisi',
    icon: '⬡',
    component: ReklamHiyerarsisiHaritasi,
  },
  {
    id: 'mantik-haritasi',
    label: 'Reklam KPI',
    icon: '⬡',
    component: MantiKHaritasi,
  },
  {
    id: 'yz-haritasi',
    label: 'Şablonlar',
    icon: '◉',
    component: YzHaritasi,
  },
  {
    id: 'kod-bloklari',
    label: 'Kod Blokları',
    icon: '〈 〉',
    component: KodBloklariHaritasi,
  },
  {
    id: 'dijital-anons',
    label: 'Dijital Anons',
    icon: '▶',
    component: DijitalAnons,
  },
  {
    id: 'vaka-calismalari',
    label: 'Vaka Çalışmaları',
    icon: '◆',
    component: VakaCalismalari,
  },
  {
    id: 'renkler',
    label: 'Renkler',
    icon: '◕',
    component: Renkler,
  },
  {
    id: 'sss',
    label: 'SSS',
    icon: '?',
    component: SSS,
  },
  {
    id: 'kisa-notlar',
    label: 'Kısa Notlar',
    icon: '📝',
    component: KisaNotlar,
  },
  {
    id: 'ana-harita',
    label: 'ANA Blok',
    icon: '⬡',
    component: AnaHaritasi,
  },
  {
    id: 'blog-yazilari',
    label: 'Blog Yazıları',
    icon: '✍️',
    component: BlogYazilari,
  },
]

// ─── Stüdyo düzeni — hamburger toggle sidebar + içerik alanı ─────────────────
function StudyoLayout({ onLogout }) {
  const [activeId, setActiveId] = useState(TOOLS[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const ActiveTool = TOOLS.find(t => t.id === activeId)?.component ?? null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'inherit', position: 'relative' }}>

      {/* Hamburger butonu — açıkken sidebar'ın iç sağ kenarında, kapalıyken sol üstte */}
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        style={{
          position: 'fixed',
          top: 92,
          left: sidebarOpen ? 158 : 14,
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
        top: 78,
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
