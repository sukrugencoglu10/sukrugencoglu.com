"use client";

import { useEffect, useState } from "react";
import type { Paket } from "./PaketCard";

type Props = {
  paket: Paket;
  selectedAddons: string[];
  open: boolean;
  onClose: () => void;
  endpoint?: string;
  title?: string;
};

export default function PaketTeklifModal({
  paket,
  selectedAddons,
  open,
  onClose,
  endpoint = "/api/paket-teklif",
  title = "Teklif İste",
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const addonObjs = (paket.addons || []).filter((a) =>
    selectedAddons.includes(a.id)
  );

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Ad ve e-posta zorunludur.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paketSlug: paket.slug,
          paketTitle: paket.title,
          name,
          email,
          phone,
          company,
          note,
          addons: addonObjs,
          pricing: paket.pricing || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gönderilemedi");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-secondary text-ink-secondary text-xl flex items-center justify-center"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">✉️</div>
            <h4 className="text-lg font-bold text-ink mb-2">
              Talebiniz alındı
            </h4>
            <p className="text-sm text-ink-secondary mb-6">
              En kısa sürede e-posta ile dönüş yapılacak.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-ink text-white rounded-lg text-sm font-semibold"
            >
              Kapat
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="text-xs text-ink-secondary bg-surface-secondary/50 rounded-lg p-3">
              <div className="font-semibold text-ink">{paket.title}</div>
              {addonObjs.length > 0 && (
                <div className="mt-2">
                  Seçili add-on:{" "}
                  {addonObjs.map((a) => a.title).join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ad Soyad *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-orange"
              />
              <input
                type="email"
                placeholder="E-posta *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-orange"
              />
              <input
                type="tel"
                placeholder="Telefon (opsiyonel)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-orange"
              />
              <input
                type="text"
                placeholder="Şirket / Web sitesi (opsiyonel)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-orange"
              />
              <textarea
                placeholder="Not (opsiyonel)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-orange resize-none"
              />
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-orange text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Gönderiliyor..." : "Teklif Talebini Gönder"}
            </button>

            <p className="text-[11px] text-ink-secondary text-center">
              Online ödeme yok. Onay sonrası fatura + EFT ile ilerlenir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
