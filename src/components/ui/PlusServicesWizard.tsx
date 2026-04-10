"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";

export default function PlusServicesWizard({ showContactButton = false }: { showContactButton?: boolean }) {
  const { t } = useLanguage();
  const ps = t.plusServices;

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");

  const isOther = selected === ps.categories[ps.categories.length - 1];

  const buildUrl = () => {
    const msg = isOther
      ? `${ps.whatsapp_other_prefix} ${otherText}`
      : `${ps.whatsapp_message_prefix} ${selected}`;
    return `https://wa.me/905324072694?text=${encodeURIComponent(msg)}`;
  };

  const handleSelect = (cat: string) => {
    setSelected(cat);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelected("");
    setOtherText("");
  };

  const namedCategories = ps.categories.slice(0, -1);
  const otherLabel = ps.categories[ps.categories.length - 1];
  const ctaDisabled = isOther && !otherText.trim();

  return (
    <>
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[var(--shadow-card)]">

      {/* Badge + başlık */}
      <div className="flex flex-col gap-2 mb-6">
        <Badge color="orange">{ps.badge}</Badge>
        <h2 className="text-xl font-semibold text-ink">{ps.title}</h2>
        <p className="text-sm text-ink-muted">{ps.subtitle}</p>
      </div>

      {/* Progress bar (2 segment) */}
      <div className="flex gap-2 mb-8">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-col items-center gap-2 flex-1">
            <div
              className="h-1 w-full rounded-full transition-all duration-500"
              style={
                step >= n
                  ? { backgroundColor: "#ff6b00", boxShadow: "0 0 8px rgba(255,107,0,0.4)" }
                  : { backgroundColor: "var(--color-border)" }
              }
            />
            <span
              className="text-[10px] uppercase tracking-widest transition-colors"
              style={{ color: step === n ? "#ff6b00" : "var(--color-ink-subtle)" }}
            >
              0{n}
            </span>
          </div>
        ))}
      </div>

      {/* Adım içeriği */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <>
              {/* 6 kategori — 2 sütun */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {namedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className="p-3.5 rounded-xl border text-left text-sm font-medium transition-all
                      border-border bg-surface text-ink
                      hover:border-orange/30 hover:bg-orange/5 hover:text-orange"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* "Diğer" — tam genişlik, dashed */}
              <button
                onClick={() => handleSelect(otherLabel)}
                className="w-full p-3.5 rounded-xl border border-dashed text-left text-sm transition-all
                  border-border text-ink-muted
                  hover:border-orange/40 hover:text-orange"
              >
                + {otherLabel}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Seçilen kategori chip (sadece named) */}
              {!isOther && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-orange/10 border border-orange/30 text-orange text-sm font-medium">
                  {selected}
                </div>
              )}

              {/* "Diğer" textarea */}
              {isOther && (
                <textarea
                  rows={3}
                  placeholder={ps.other_placeholder}
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border bg-surface text-ink
                    placeholder:text-ink-subtle text-sm resize-none mb-5
                    focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all"
                />
              )}

              {/* WhatsApp CTA */}
              <a
                href={buildUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (ctaDisabled) e.preventDefault(); }}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                  text-white font-medium text-sm transition-all
                  ${ctaDisabled
                    ? "pointer-events-none opacity-50 bg-[#ff6b00]"
                    : "bg-[#ff6b00] hover:bg-[#e56000] shadow-[0_4px_16px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,107,0,0.45)]"
                  }`}
              >
                {/* WhatsApp icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {ps.whatsapp_cta}
              </a>

              {/* Geri dön */}
              <button
                onClick={handleBack}
                className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-3 w-full"
              >
                {ps.back}
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>

    {showContactButton && (
      <a
        href={`https://wa.me/905324072694?text=${encodeURIComponent(t.contact.whatsapp_message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-orange bg-white text-ink text-sm font-semibold hover:text-orange transition-colors duration-200"
      >
        {t.services.cta}
      </a>
    )}
  </>
  );
}
