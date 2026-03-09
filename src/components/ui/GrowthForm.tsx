"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: 1, title: "Odak Noktası", subtitle: "Hangi alanda büyümek istiyorsunuz?" },
  { id: 2, title: "Kapasite", subtitle: "Tahmini aylık reklam bütçeniz nedir?" },
  { id: 3, title: "İletişim", subtitle: "Analiz raporunuzu nereye gönderelim?" },
];

const SECTORS = ["Google'da Üstte Görülme", "WhatsApp & Telefon Araması", "Form Doldurulması", "Diğer"];
const BUDGETS = ["10.000₺ – 20.000₺", "20.000₺ – 50.000₺", "50.000₺ – 150.000₺+", "Belirtmek İstemiyorum"];

export default function GrowthForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ sector: "", budget: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));

  const handleSubmit = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "B2B Müşteri Adayı",
          email: formData.email,
          message: `Sektör: ${formData.sector}\nAylık Reklam Bütçesi: ${formData.budget}`,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
      } else {
        setError(data.error || "Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 shadow-[var(--shadow-card)] flex flex-col items-center justify-center gap-4 text-center min-h-[340px]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-16 h-16 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-[#a855f7] text-2xl"
        >
          ✓
        </motion.div>
        <h3 className="text-xl font-semibold text-ink">Analiz Talebiniz Alındı!</h3>
        <p className="text-ink-muted text-sm max-w-xs">
          En kısa sürede size özel büyüme raporuyla geri döneceğiz.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[var(--shadow-card)]">

      {/* Form Başlık */}
      <div className="mb-6 pb-5 border-b border-border">
        <p className="text-[10px] uppercase tracking-[0.25em] text-ink-subtle mb-1">Ücretsiz Analiz</p>
        <h3 className="text-lg font-bold text-ink">Büyüme Potansiyelinizi Keşfedin</h3>
      </div>

      {/* Progress */}
      <div className="flex justify-between mb-8 gap-2">
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`h-1 w-full rounded-full transition-all duration-500 ${
                currentStep >= step.id
                  ? "bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  : "bg-border"
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-widest transition-colors ${
                currentStep === step.id ? "text-[#a855f7]" : "text-ink-subtle"
              }`}
            >
              0{step.id}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-semibold text-ink mb-1">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-ink-muted text-sm mb-6">
            {STEPS[currentStep - 1].subtitle}
          </p>

          {/* Step 1: Sector */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-2">
              {SECTORS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, sector: opt });
                    nextStep();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all ${
                    formData.sector === opt
                      ? "border-[#a855f7]/50 bg-[#a855f7]/8 text-[#a855f7]"
                      : "border-border bg-surface text-ink hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-2">
              {BUDGETS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, budget: opt });
                    nextStep();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all ${
                    formData.budget === opt
                      ? "border-[#a855f7]/50 bg-[#a855f7]/8 text-[#a855f7]"
                      : "border-border bg-surface text-ink hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-1"
              >
                ← Geri Dön
              </button>
            </div>
          )}

          {/* Step 3: Email */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="E-posta Adresiniz"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full p-3.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-subtle text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all"
              />
              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#c084fc] hover:bg-[#a855f7] text-white font-medium text-sm shadow-[0_4px_16px_rgba(192,132,252,0.35)] hover:shadow-[0_4px_20px_rgba(168,85,247,0.45)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  "Analizi Başlat"
                )}
              </button>

              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-1"
              >
                ← Geri Dön
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
