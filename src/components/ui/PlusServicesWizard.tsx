"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import { getSlug } from "@/lib/slugs";
import { trackFormSubmissionPlus, trackWhatsAppClick } from "@/lib/gtm";

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function PlusServicesWizard({ showContactButton = false }: { showContactButton?: boolean }) {
  const { t, lang } = useLanguage();
  const ps = t.plusServices;

  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [selected, setSelected]       = useState("");
  const [description, setDescription] = useState("");
  const [name, setName]               = useState("");
  const [surname, setSurname]         = useState("");
  const [phone, setPhone]             = useState("");
  const [website, setWebsite]         = useState("");
  const [email, setEmail]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [sent, setSent]               = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const namedCategories = ps.categories.slice(0, -1);
  const otherLabel      = ps.categories[ps.categories.length - 1];

  const handleSelect = (cat: string) => { setSelected(cat); setStep(2); };
  const handleBack   = (toStep: 1 | 2) => { setStep(toStep); setError(null); };

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(ps.error_invalid_email);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name} ${surname}`.trim() || "Müşteri",
          email,
          message: [
            `+Plus Hizmet Talebi`,
            `Hizmet: ${selected}`,
            description ? `Açıklama: ${description}` : null,
            phone ? `Telefon: ${phone}` : null,
            website ? `Website: ${website}` : null,
          ].filter(Boolean).join("\n"),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        trackFormSubmissionPlus({
          email,
          phone: phone || undefined,
          service: selected,
          website: website || undefined,
          form_destination: window.location.pathname,
        });
        setSent(true);
      }
      else         { setError(data.error || ps.error_generic); }
    } catch {
      setError(ps.error_generic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Başlık — kartın DIŞINDA (sol kolonla birebir aynı yapı) ── */}
      <Badge color="orange">{ps.badge}</Badge>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
        {ps.title}
      </h2>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-ink-subtle mb-1">{ps.form_label}</p>
        <h3 className="text-lg font-bold text-ink">{ps.form_subtitle}</h3>
      </div>

      {/* ── Kart ── */}
      {sent ? (
        <div className="bg-white rounded-2xl border border-border p-8 shadow-[var(--shadow-card)] flex flex-col items-center text-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h3 className="text-lg font-bold text-ink">{ps.success_title}</h3>
          <p className="text-sm text-ink-muted">{ps.success_desc}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[var(--shadow-card)]">

          {/* Progress bar (3 segment) */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((n) => (
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

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── ADIM 1: Kategori ── */}
              {step === 1 && (
                <>
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
                  <button
                    onClick={() => handleSelect(otherLabel)}
                    className="w-full p-3.5 rounded-xl border border-dashed text-left text-sm transition-all
                      border-border text-ink-muted hover:border-orange/40 hover:text-orange"
                  >
                    + {otherLabel}
                  </button>

                  <Link
                    href={`/${lang}/${getSlug(lang, "contact")}`}
                    className="mt-3 w-full py-3 rounded-xl bg-[#ff6b00] text-white text-sm font-semibold text-center block hover:bg-[#e56000] transition-colors"
                  >
                    {t.nav.cta}
                  </Link>
                </>
              )}

              {/* ── ADIM 2: Açıklama ── */}
              {step === 2 && (
                <>
                  <h3 className="text-base font-semibold text-ink mb-1">{ps.step2_title}</h3>
                  <p className="text-sm text-ink-muted mb-4">{ps.step2_subtitle}</p>

                  <div className="mb-4 px-4 py-2.5 rounded-xl bg-orange/10 border border-orange/30 text-orange text-sm font-medium">
                    {selected}
                  </div>

                  <textarea
                    rows={4}
                    placeholder={ps.description_placeholder}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-border bg-surface text-ink
                      placeholder:text-ink-subtle text-sm resize-none mb-5
                      focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all"
                  />

                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#e56000] text-white
                      font-medium text-sm transition-all
                      shadow-[0_4px_16px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,107,0,0.45)]"
                  >
                    {ps.next}
                  </button>

                  <button onClick={() => handleBack(1)} className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-3 w-full">
                    {ps.back}
                  </button>
                </>
              )}

              {/* ── ADIM 3: İletişim ── */}
              {step === 3 && (
                <>
                  <h3 className="text-base font-semibold text-ink mb-1">{ps.step3_title}</h3>
                  <p className="text-sm text-ink-muted mb-4">{ps.step3_subtitle}</p>

                  <div className="flex gap-3 mb-3">
                    <input type="text" placeholder={ps.name_placeholder} value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 p-3 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all" />
                    <input type="text" placeholder={ps.surname_placeholder} value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="flex-1 p-3 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all" />
                  </div>

                  <input type="tel" placeholder={ps.phone_placeholder} value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-subtle mb-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all" />

                  <input type="url" placeholder={ps.website_placeholder} value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-subtle mb-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all" />

                  <input type="email" placeholder={ps.email_placeholder} value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-subtle mb-5 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 focus:border-[#ff6b00] transition-all" />

                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                  <button onClick={handleSubmit} disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#e56000] text-white font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,107,0,0.45)]">
                    {isLoading ? ps.sending : ps.submit}
                  </button>

                  <button onClick={() => handleBack(2)} className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-3 w-full">
                    {ps.back}
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── WhatsApp butonu ── */}
      {showContactButton && (
        <>
          <a
            href={`https://wa.me/905324072694?text=${encodeURIComponent(t.contact.whatsapp_message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({
              click_location: "plus_services_widget",
              click_text: ps.whatsapp_cta,
              service_interest: selected,
            })}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
              bg-[#ff6b00] hover:bg-[#e56000] text-white font-medium text-sm transition-all
              shadow-[0_4px_16px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,107,0,0.45)]"
          >
            {WA_ICON}
            {ps.whatsapp_cta}
          </a>

          {/* Sadece mobilde görünür — sol kolondaki sosyal bağlantılar */}
          <div className="lg:hidden flex flex-col gap-4 pt-2">
            <p className="text-ink-muted leading-relaxed text-sm">{t.contact.subtitle}</p>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                {t.contact.or_reach}
              </p>
              {[
                {
                  href: "https://linkedin.com/in/sukrugencoglu10",
                  label: "linkedin.com/in/sukrugencoglu10",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  href: "https://wa.me/905324072694",
                  label: "+90 532 407 26 94",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  href: "mailto:sukrugencoglu10@gmail.com",
                  label: "sukrugencoglu10@gmail.com",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group text-ink-secondary hover:text-[#a855f7] transition-colors"
                >
                  <span className="p-2 rounded-lg bg-surface border border-border group-hover:bg-[#a855f7]/10 group-hover:border-[#a855f7]/30 transition-all">
                    {s.icon}
                  </span>
                  <span className="text-sm font-medium">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
