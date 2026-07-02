"use client";

import { useState, useEffect, useRef } from "react";
import { CAT_COLORS, CAT_LABELS, getCatColors } from "@/lib/maps/categories";
import DetailModal from "@/components/ui/DetailModal";
import { NODE_W, NODE_H, edgePoint } from "@/lib/maps/canvas";

export default function ReklamStratejisiLiveMap() {
  const [terms, setTerms] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [canvasDim, setCanvasDim] = useState({ w: 800, h: 500 });
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dblNode, setDblNode] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<{ id: string | null; time: number }>({ id: null, time: 0 });
  const handleDoubleTap = (e: React.TouchEvent, term: any) => {
    const now = Date.now();
    const last = lastTapRef.current;
    if (last.id === term.id && now - last.time < 300) {
      e.preventDefault();
      lastTapRef.current = { id: null, time: 0 };
      setDblNode(term);
    } else {
      lastTapRef.current = { id: term.id, time: now };
    }
  };

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    if (selectedId && infoPanelRef.current) {
      infoPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  useEffect(() => {
    fetch('/api/reklam-stratejisi-harita')
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
        console.error('Reklam stratejisi haritası yükleme hatası:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isNode = target.closest('div[style*="cursor: pointer"]') !== null;
    const isButton = target.closest('button') !== null;
    if (!isNode && !isButton) {
      setIsPanning(true);
      if (canvasAreaRef.current) {
        setPanStart({
          x: e.clientX,
          y: e.clientY,
          scrollLeft: canvasAreaRef.current.scrollLeft,
          scrollTop: canvasAreaRef.current.scrollTop
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !canvasAreaRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    canvasAreaRef.current.scrollLeft = panStart.scrollLeft - dx;
    canvasAreaRef.current.scrollTop = panStart.scrollTop - dy;
  };

  const handleMouseUp = () => setIsPanning(false);

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
      <div className="animate-pulse text-gray-400">Reklam stratejisi haritası yükleniyor...</div>
    </div>
  );

  if (terms.length === 0) return null;

  const selectedTerm = selectedId ? termMap[selectedId] : null;

  return (
    <>
    <style>{`
      @keyframes rsSlideUp {
        from { transform: translateY(100%); opacity: 0; }
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
            Canlı Reklam Stratejisi Haritası
          </h3>
          <p className="text-sm text-gray-500 mt-1">Reklam stratejisinin adımları, kararlar ve aralarındaki bağlantılar</p>
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
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center mt-3 sm:mt-0">
          {Object.entries(CAT_LABELS).map(([cat, label]) => (
            <div key={cat} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-gray-600">
              <div style={{ width: 8, height: 8, borderRadius: 2, background: getCatColors(cat).stripe }} />
              {label}
            </div>
          ))}
          <div className="w-full sm:w-auto sm:ml-4 sm:pl-4 sm:border-l border-gray-200 flex items-center gap-1 font-mono text-[11px] text-gray-400">
             <span>%{Math.round(zoom * 100)}</span>
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
            style={{ overflow: 'auto' }}
          >
            <div style={{ width: canvasDim.w * zoom, height: canvasDim.h * zoom, flexShrink: 0, margin: '0 auto' }}>
            <div style={{
              position: "relative",
              width: canvasDim.w,
              height: canvasDim.h,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
              pointerEvents: isPanning ? 'none' : 'auto',
            }}>
              <svg width={canvasDim.w} height={canvasDim.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <defs>
                  <marker id="rs-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#ddd" />
                  </marker>
                  <marker id="rs-arr-hi" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
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
                    <line
                      key={i}
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={isActive ? '#777' : '#ddd'}
                      strokeWidth={isActive ? 2 : 1.2}
                      markerEnd={isActive ? 'url(#rs-arr-hi)' : 'url(#rs-arr)'}
                      style={{ transition: 'all 0.3s' }}
                    />
                  );
                })}
              </svg>

              {terms.map(term => {
                const colors = getCatColors(term.cat);
                const isSelected = selectedId === term.id;
                const isHov = hovered === term.id;
                const isDimmed = connectedIds && !connectedIds.has(term.id);

                return (
                  <div
                    key={term.id}
                    onMouseEnter={() => setHovered(term.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(prev => prev === term.id ? null : term.id);
                    }}
                    onDoubleClick={(e) => { e.stopPropagation(); setDblNode(term); }}
                    onTouchEnd={(e) => handleDoubleTap(e, term)}
                    style={{
                      position: 'absolute',
                      left: term.x - NODE_W / 2,
                      top: term.y - NODE_H / 2,
                      width: NODE_W,
                      height: NODE_H,
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
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
             <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                  className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  title="Yakınlaştır (+)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                  className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  title="Uzaklaştır (-)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleZoomReset(); }}
                  className="w-12 h-12 flex items-center justify-center text-accent text-[11px] font-bold hover:bg-gray-50 transition-colors bg-gray-50/50"
                  title="Orijinal Boyut"
                >
                  RESET
                </button>
             </div>
          </div>
        </div>

        {dblNode && (
          <DetailModal
            title={dblNode.abbr}
            subtitle={dblNode.sub}
            description={dblNode.desc}
            accentColor={getCatColors(dblNode.cat).stripe}
            badge={CAT_LABELS[dblNode.cat] || dblNode.cat}
            onClose={() => setDblNode(null)}
          />
        )}
        {selectedTerm ? (
          <div
            ref={infoPanelRef}
            className="w-full bg-white border-t border-gray-100 p-6"
            style={{ animation: 'rsSlideUp 0.2s ease-out' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: getCatColors(selectedTerm.cat).stripe }} />
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    {CAT_LABELS[selectedTerm.cat] || 'Kategori'}
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 leading-tight">{selectedTerm.abbr}</h4>
                <p className="text-sm font-medium text-gray-500 mt-1">{selectedTerm.sub}</p>
                <div className="h-px bg-gray-100 my-3" />
                <div className="text-sm text-gray-600 leading-relaxed font-normal italic" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedTerm.desc || <span className="text-gray-400 not-italic">Açıklama yakında eklenecektir.</span>}
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                aria-label="Kapat"
              >
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
