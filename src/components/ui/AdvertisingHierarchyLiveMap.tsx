"use client";

import { useState, useEffect, useRef } from "react";

const RH_NODE_W = 136;
const RH_NODE_H = 66;

type Category = 'web' | 'seo' | 'ads' | 'sosyal';

const RH_CAT_COLORS: Record<string, { bg: string, border: string, stripe: string }> = {
  web: { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  seo: { bg: '#FFF8E1', border: '#F57F1766', stripe: '#F57F17' },
  ads: { bg: '#E8F5E9', border: '#1B5E2066', stripe: '#1B5E20' },
  sosyal: { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
};

const RH_CAT_LABELS: Record<string, string> = {
  web: 'Web Merkezi', seo: 'Organik Büyüme', ads: 'Ücretli Reklam', sosyal: 'Sosyal Medya',
};

function rhEdgePoint(from: any, to: any) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y };
  const hw = RH_NODE_W / 2;
  const hh = RH_NODE_H / 2;
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

export default function AdvertisingHierarchyLiveMap() {
  const [terms, setTerms] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [canvasDim, setCanvasDim] = useState({ w: 800, h: 500 });
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/reklam-hiyerarsisi-harita')
      .then(res => res.json())
      .then(data => {
        if (data && data.terms) {
          setTerms(data.terms);
          setConnections(data.connections || []);
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Harita yükleme hatası:', err);
        setLoading(false);
      });
  }, []);

  // Zoom logic for wheel - Using window level listener when hovering to ensure prevention of browser zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if mouse is within the map area
      if (canvasAreaRef.current && canvasAreaRef.current.contains(e.target as Node)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          setZoom(prev => {
            const next = Math.min(Math.max(prev + delta, 0.2), 3.0);
            return parseFloat(next.toFixed(2));
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2));
  const handleZoomReset = () => setZoom(1);

  const termMap = Object.fromEntries(terms.map(t => [t.id, t]));
  const activeIds = new Set<string>();
  if (selectedId) activeIds.add(selectedId);
  if (hovered) activeIds.add(hovered);

  const connectedIds = activeIds.size > 0 ? new Set([
    ...Array.from(activeIds),
    ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
    ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null;

  if (loading) return (
    <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 16 }}>
      <div className="animate-pulse text-gray-400">Harita yükleniyor...</div>
    </div>
  );

  if (terms.length === 0) return null;

  const selectedTerm = selectedId ? termMap[selectedId] : null;

  return (
    <div className="w-full mt-12 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-bottom border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Canlı Reklam Hiyerarşisi Haritası
          </h3>
          <p className="text-sm text-gray-500 mt-1">Stüdyo'da hazırlanan güncel reklam stratejisi ve web hiyerarşisi</p>
          <div className="flex gap-4 mt-3">
             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1">
               <span className="bg-gray-200 px-1 rounded text-gray-600">CTRL + Kaydır</span> Yakınlaş / Uzaklaş
             </p>
             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1">
               <span className="bg-gray-200 px-1 rounded text-gray-600">Tıkla</span> Detayları Gör
             </p>
          </div>
        </div>
        <div className="hidden sm:flex gap-4 items-center">
          {Object.entries(RH_CAT_LABELS).map(([cat, label]) => (
            <div key={cat} className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div style={{ width: 8, height: 8, borderRadius: 2, background: (RH_CAT_COLORS[cat] || RH_CAT_COLORS.web).stripe }} />
              {label}
            </div>
          ))}
          <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-1 font-mono text-[11px] text-gray-400">
             <span>%{Math.round(zoom * 100)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row relative">
        {/* Main View Area (Relative for fixed zoom controls) */}
        <div className="flex-1 relative bg-[#fafafa]">
          {/* Scrollable Container */}
          <div 
            ref={canvasAreaRef}
            className="w-full overflow-auto p-8" 
            style={{ maxHeight: '78vh', minHeight: '500px' }}
          >
            {/* Zoomable Canvas */}
            <div style={{ 
              position: "relative", 
              width: canvasDim.w, 
              height: canvasDim.h, 
              margin: '0 auto',
              transform: `scale(${zoom})`,
              transformOrigin: 'center top',
              transition: 'transform 0.15s ease-out',
              paddingBottom: 40
            }}>
              {/* SVG Lines */}
              <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <defs>
                  <marker id="rh-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#ddd" />
                  </marker>
                  <marker id="rh-arr-hi" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#777" />
                  </marker>
                </defs>
                {connections.map((conn, i) => {
                  const f = termMap[conn.from];
                  const t = termMap[conn.to];
                  if (!f || !t) return null;
                  const p1 = rhEdgePoint(f, t);
                  const p2 = rhEdgePoint(t, f);
                  const isActive = activeIds.has(conn.from) || activeIds.has(conn.to);
                  return (
                    <line
                      key={i}
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={isActive ? '#777' : '#ddd'}
                      strokeWidth={isActive ? 2 : 1.2}
                      markerEnd={isActive ? 'url(#rh-arr-hi)' : 'url(#rh-arr)'}
                      style={{ transition: 'all 0.3s' }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {terms.map(term => {
                const colors = RH_CAT_COLORS[term.cat] || RH_CAT_COLORS.web;
                const isSelected = selectedId === term.id;
                const isHov = hovered === term.id;
                const isDimmed = connectedIds && !connectedIds.has(term.id);

                return (
                  <div
                    key={term.id}
                    onMouseEnter={() => setHovered(term.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelectedId(prev => prev === term.id ? null : term.id)}
                    style={{
                      position: 'absolute',
                      left: term.x - RH_NODE_W / 2,
                      top: term.y - RH_NODE_H / 2,
                      width: RH_NODE_W,
                      height: RH_NODE_H,
                      background: isSelected ? colors.stripe + '18' : colors.bg,
                      border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.stripe : (isHov ? colors.stripe : colors.border)}`,
                      borderRadius: 10,
                      padding: '8px 10px',
                      opacity: isDimmed ? 0.3 : 1,
                      boxShadow: isSelected
                        ? `inset 3px 0 0 ${colors.stripe}, 0 0 0 3px ${colors.stripe}22, 0 8px 24px ${colors.stripe}22`
                        : isHov
                          ? `inset 3px 0 0 ${colors.stripe}, 0 4px 12px ${colors.stripe}33`
                          : `inset 3px 0 0 ${colors.stripe}, 0 1px 3px rgba(0,0,0,0.05)`,
                      transition: 'all 0.2s',
                      zIndex: isSelected ? 3 : isHov ? 2 : 1,
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      cursor: 'pointer', userSelect: 'none',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: colors.stripe, lineHeight: 1.2, marginBottom: 2 }}>{term.abbr}</div>
                    <div style={{ fontSize: 10, color: '#666', lineHeight: 1.3, fontWeight: 500 }}>{term.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fixed Zoom Controls - Relative to flex-1, outside scroll area */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
             <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
                <button 
                  onClick={handleZoomIn}
                  className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  title="Yakınlaştır (+)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  title="Uzaklaştır (-)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button 
                  onClick={handleZoomReset}
                  className="w-12 h-12 flex items-center justify-center text-accent text-[11px] font-bold hover:bg-gray-50 transition-colors bg-gray-50/50"
                  title="Orijinal Boyut"
                >
                  RESET
                </button>
             </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-80 bg-white p-6 border-l border-gray-50 flex flex-col gap-4">
          {selectedTerm ? (
            <>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: (RH_CAT_COLORS[selectedTerm.cat] || RH_CAT_COLORS.web).stripe }} />
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {(RH_CAT_LABELS[selectedTerm.cat] || 'Kategori')}
                </span>
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 leading-tight">{selectedTerm.abbr}</h4>
              <p className="text-sm font-medium text-gray-500">{selectedTerm.sub}</p>
              <div className="h-px bg-gray-100 my-2" />
              <div className="text-sm text-gray-600 leading-relaxed font-normal italic">
                {selectedTerm.desc || "Bu öğe için henüz bir açıklama girilmemiş."}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3 text-gray-300">
              <div className="text-4xl">◎</div>
              <p className="text-sm font-medium">Strateji detaylarını görmek için<br/>bir kutuya tıklayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
