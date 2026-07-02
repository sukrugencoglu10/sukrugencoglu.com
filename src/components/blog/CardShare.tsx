"use client";

import { useState, useRef, useEffect } from "react";

interface CardShareProps {
  url: string;
  title: string;
  lang: string;
}

export default function CardShare({ url, title, lang }: CardShareProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const copyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
    } catch {}
  };

  return (
    <div ref={ref} style={{ position: "relative" }} onClick={stop}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        title={lang === "tr" ? "Paylaş" : "Share"}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 8,
          background: open ? "#f0f0f0" : "transparent",
          border: "1px solid #e8e8e8",
          cursor: "pointer", color: "#999",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0"; (e.currentTarget as HTMLButtonElement).style.color = "#555"; }}
        onMouseLeave={e => { if (!open) { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#999"; } }}
      >
        <ShareIcon />
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", right: 0,
          background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          padding: "6px", display: "flex", flexDirection: "column", gap: 2,
          minWidth: 140, zIndex: 100,
        }}>
          <ShareItem
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`}
            color="#0A66C2" icon={<LinkedInIcon />} label="LinkedIn"
          />
          <ShareItem
            href={`https://x.com/intent/tweet?url=${enc}&text=${encTitle}`}
            color="#000" icon={<XIcon />} label="X"
          />
          <ShareItem
            href={`https://wa.me/?text=${encTitle}%20${enc}`}
            color="#25D366" icon={<WhatsAppIcon />} label="WhatsApp"
          />
          <button
            onClick={copyLink}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 10px", borderRadius: 6, border: "none",
              background: copied ? "#e8f8f2" : "transparent",
              color: copied ? "#1D9E75" : "#444",
              fontSize: 12, fontWeight: 500, cursor: "pointer", width: "100%",
              transition: "background 0.15s",
            }}
          >
            {copied ? <CheckIcon /> : <LinkIcon />}
            {copied ? (lang === "tr" ? "Kopyalandı!" : "Copied!") : (lang === "tr" ? "Bağlantıyı kopyala" : "Copy link")}
          </button>
        </div>
      )}
    </div>
  );
}

function ShareItem({ href, color, icon, label }: { href: string; color: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 10px", borderRadius: 6,
        color: "#444", fontSize: 12, fontWeight: 500,
        textDecoration: "none", transition: "background 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = color + "12"; (e.currentTarget as HTMLAnchorElement).style.color = color; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#444"; }}
    >
      {icon}
      {label}
    </a>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function LinkedInIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

function WhatsAppIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}

function LinkIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
}

function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
