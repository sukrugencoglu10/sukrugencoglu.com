"use client";

import { useState, useEffect, useRef } from "react";

const NODE_W = 120;
const NODE_H = 66;

const CAT_COLORS: Record<string, { bg: string; border: string; stripe: string }> = {
  maliyet:  { bg: '#FFF3E0', border: '#E6510066', stripe: '#E65100' },
  olcum:    { bg: '#E3F2FD', border: '#1565C066', stripe: '#1565C0' },
  strateji: { bg: '#F3E5F5', border: '#6A1B9A66', stripe: '#6A1B9A' },
  eylem:    { bg: '#E8F5E9', border: '#2E7D3266', stripe: '#2E7D32' },
  kirmizi:  { bg: '#FFEBEE', border: '#C6282866', stripe: '#C62828' },
  pembe:    { bg: '#FCE4EC', border: '#AD145766', stripe: '#AD1457' },
  lacivert: { bg: '#E8EAF6', border: '#28359366', stripe: '#283593' },
  gumus:    { bg: '#F5F5F5', border: '#61616166', stripe: '#616161' },
};

const CAT_LABELS: Record<string, string> = {
  maliyet: 'Maliyet', olcum: 'Ölçüm', strateji: 'Strateji', eylem: 'Eylem',
  kirmizi: 'Kırmızı', pembe: 'Pembe', lacivert: 'Lacivert', gumus: 'Gümüş',
};

const DEFAULT_FALLBACK_COLORS = { bg: '#F5F5F5', border: '#99999966', stripe: '#999999' };

function getColors(cat: string) {
  return CAT_COLORS[cat] ?? DEFAULT_FALLBACK_COLORS;
}

function edgePoint(from: any, to: any) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: from.x, y: from.y };
  const hw = NODE_W / 2;
  const hh = NODE_H / 2;
  const scaleX = Math.abs(dx) > 0.01 ? hw / Math.abs(dx) : Infinity;
  const scaleY = Math.abs(dy) > 0.01 ? hh / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

const AD_TERMS_DEFAULT = [
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
];

const AD_CONNECTIONS_DEFAULT = [
  { from: 'cpm', to: 'ctr' }, { from: 'cta', to: 'ctr' }, { from: 'ctr', to: 'cpc' },
  { from: 'cpc', to: 'cvr' }, { from: 'cvr', to: 'ebm' }, { from: 'ebm', to: 'cac' },
  { from: 'ebm', to: 'roas' }, { from: 'cac', to: 'ltv' }, { from: 'roas', to: 'roi' },
  { from: 'ltv', to: 'roi' }, { from: 'ltv', to: 'crm' },
];

export default function ReklamKpiLiveMap() {
  const [terms, setTerms] = useState<any[]>(AD_TERMS_DEFAULT);
  const [connections, setConnections] = useState<any[]>(AD_CONNECTIONS_DEFAULT);
  const [canvasDim, setCanvasDim] = useState({ w: 1000, h: 460 });
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    if (selectedId && infoPanelRef.current) {
      infoPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  useEffect(() => {
    fetch('/api/reklam-terimleri')
      .then(res => res.json())
      .then(data => {
        if (data && !Array.isArray(data) && Array.isArray(data.terms) && data.terms.length > 0) {
          setTerms(data.terms);
          setConnections(data.connections || []);
          if (data.metadata?.w) setCanvasDim({ w: data.metadata.w, h: data.metadata.h || 460 });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (canvasAreaRef.current && canvasAreaRef.current.contains(e.target as Node)) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          setZoom(prev => parseFloat(Math.min(Math.max(prev + delta, 0.2), 3.0).toFixed(2)));
        }
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isNode = target.closest('div[style*="cursor: pointer"]') !== null;
    const isButton = target.closest('button') !== null;
    if (!isNode && !isButton) {
      setIsPanning(true);
      if (canvasAreaRef.current) {
        setPanStart({ x: e.clientX, y: e.clientY, scrollLeft: canvasAreaRef.current.scrollLeft, scrollTop: canvasAreaRef.current.scrollTop });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !canvasAreaRef.current) return;
    e.preventDefault();
    canvasAreaRef.current.scrollLeft = panStart.scrollLeft - (e.clientX - panStart.x);
    canvasAreaRef.current.scrollTop = panStart.scrollTop - (e.clientY - panStart.y);
  };

  const handleMouseUp = () => setIsPanning(false);


  const termMap = Object.fromEntries(terms.map(t => [t.id, t]));
  const activeIds = new Set<string>();
  if (selectedId) activeIds.add(selectedId);
  if (hovered) activeIds.add(hovered);
  const connectedIds = activeIds.size > 0 ? new Set([
    ...Array.from(activeIds),
    ...connections.filter(c => activeIds.has(c.from)).map(c => c.to),
    ...connections.filter(c => activeIds.has(c.to)).map(c => c.from),
  ]) : null;

  const selectedTerm = selectedId ? termMap[selectedId] : null;

  if (loading) return (
    <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 16 }}>
      <div className="animate-pulse text-gray-400">Harita yükleniyor...</div>
    </div>
  );

  return (
    <>
    <style>{`
      @keyframes kpiSlideUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `}</style>
    <div className="w-full mt-12 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap items-start gap-2 justify-between bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Canlı Reklam KPI Haritası
          </h3>
          <p className="text-sm text-gray-500 mt-1">Dijital reklamcılık kısaltmaları ve funnel içindeki hiyerarşik ilişkiler</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <span className="bg-gray-200 px-1 rounded text-gray-600">Sürükle</span> Haritayı Kaydır
            </p>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <span className="bg-gray-200 px-1 rounded text-gray-600">CTRL + Kaydır</span> Yakınlaş
            </p>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <span className="bg-gray-200 px-1 rounded text-gray-600">Tıkla</span> Detay Gör
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-3 items-center mt-2 sm:mt-0 justify-start sm:justify-end">
          {Object.entries(CAT_LABELS).map(([cat, label]) => (
            <div key={cat} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-gray-600">
              <div style={{ width: 8, height: 8, borderRadius: 2, background: getColors(cat).stripe }} />
              {label}
            </div>
          ))}
          <div className="w-full sm:w-auto sm:ml-3 sm:pl-3 sm:border-l border-gray-200 font-mono text-[11px] text-gray-400">
            %{Math.round(zoom * 100)}
          </div>
        </div>
      </div>

      <div className="flex flex-col relative">
        <div className="relative bg-[#fafafa]">
          <div
            ref={canvasAreaRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full overflow-auto p-3 sm:p-6 md:p-12 transition-all ${isPanning ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            style={{ minHeight: '320px' }}
          >
            <div style={{ width: canvasDim.w * zoom, height: canvasDim.h * zoom, flexShrink: 0, margin: '0 auto' }}>
            <div style={{
              position: 'relative',
              width: canvasDim.w,
              height: canvasDim.h,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
              pointerEvents: isPanning ? 'none' : 'auto',
            }}>
              {/* SVG Lines */}
              <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <defs>
                  <marker id="kpi-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#ddd" />
                  </marker>
                  <marker id="kpi-arr-hi" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#777" />
                  </marker>
                </defs>
                {connections.map((conn, i) => {
                  const f = termMap[conn.from];
                  const t = termMap[conn.to];
                  if (!f || !t) return null;
                  const p1 = edgePoint(f, t);
                  const p2 = edgePoint(t, f);
                  const isActive = activeIds.has(conn.from) || activeIds.has(conn.to);
                  return (
                    <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={isActive ? '#777' : '#ddd'}
                      strokeWidth={isActive ? 2 : 1.2}
                      markerEnd={isActive ? 'url(#kpi-arr-hi)' : 'url(#kpi-arr)'}
                      style={{ transition: 'all 0.3s' }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {terms.map(term => {
                const colors = getColors(term.cat);
                const isSelected = selectedId === term.id;
                const isHov = hovered === term.id;
                const isDimmed = connectedIds && !connectedIds.has(term.id);
                return (
                  <div
                    key={term.id}
                    onMouseEnter={() => setHovered(term.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(prev => prev === term.id ? null : term.id); }}
                    style={{
                      position: 'absolute',
                      left: term.x - NODE_W / 2,
                      top: term.y - NODE_H / 2,
                      width: NODE_W,
                      height: NODE_H,
                      background: isSelected ? colors.stripe + '18' : colors.bg,
                      border: `${isSelected ? 2 : 1}px solid ${isSelected ? colors.stripe : isHov ? colors.stripe : colors.border}`,
                      borderRadius: 10,
                      padding: '7px 10px',
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
                    <div style={{ fontSize: 10, color: '#555', lineHeight: 1.3, fontWeight: 500 }}>{term.tr}</div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
            <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
              <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.min(p + 0.1, 3)); }}
                className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.max(p - 0.1, 0.2)); }}
                className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setZoom(1); }}
                className="w-12 h-12 flex items-center justify-center text-accent text-[11px] font-bold hover:bg-gray-50 transition-colors bg-gray-50/50">
                RESET
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {selectedTerm ? (
          <div ref={infoPanelRef} className="w-full bg-white border-t border-gray-100 p-6"
            style={{ animation: 'kpiSlideUp 0.2s ease-out' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: getColors(selectedTerm.cat).stripe }} />
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {CAT_LABELS[selectedTerm.cat] || selectedTerm.cat}
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 leading-tight">{selectedTerm.abbr}</h4>
                <p className="text-sm font-medium text-gray-500 mt-1">{selectedTerm.tr}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selectedTerm.en}</p>
                <div className="h-px bg-gray-100 my-3" />
                <div className="text-sm text-gray-600 leading-relaxed font-normal italic" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedTerm.desc || <span className="text-gray-400 not-italic">Açıklama yakında eklenecektir.</span>}
                </div>
              </div>
              <button onClick={() => setSelectedId(null)}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </>
  );
}
