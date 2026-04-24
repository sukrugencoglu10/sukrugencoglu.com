"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { trackFormSubmissionGrowth } from "@/lib/gtm";

export default function GrowthForm() {
  const { t } = useLanguage();
  const gf = t.growthForm;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ goal: "", industry: "", budget: "", name: "", surname: "", phone: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, gf.steps.length));

  const handleSubmit = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(gf.error_invalid_email);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.name} ${formData.surname}`.trim() || "B2B Lead",
          email: formData.email,
          message: [
            `Hedef: ${formData.goal}`,
            `Sektör: ${formData.industry}`,
            `Reklam Bütçesi: ${formData.budget}`,
            formData.phone ? `Telefon: ${formData.phone}` : null,
          ].filter(Boolean).join("\n"),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        trackFormSubmissionGrowth({
          email: formData.email,
          phone: formData.phone || undefined,
          goal: formData.goal,
          industry: formData.industry,
          budget: formData.budget,
          form_destination: window.location.pathname,
        });
        setSent(true);
      } else {
        setError(data.error || gf.error_generic);
      }
    } catch {
      setError(gf.error_connection);
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
        <h3 className="text-xl font-semibold text-ink">{gf.success_title}</h3>
        <p className="text-ink-muted text-sm max-w-xs">
          {gf.success_desc}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[var(--shadow-card)]">

      {/* Progress */}
      <div className="flex justify-between mb-8 gap-2">
        {gf.steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`h-1 w-full rounded-full transition-all duration-500 ${
                currentStep >= i + 1
                  ? "bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  : "bg-border"
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-widest transition-colors ${
                currentStep === i + 1 ? "text-[#a855f7]" : "text-ink-subtle"
              }`}
            >
              0{i + 1}
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
            {gf.steps[currentStep - 1].title}
          </h2>
          <p className="text-ink-muted text-sm mb-6">
            {gf.steps[currentStep - 1].subtitle}
          </p>

          {/* Step 1: Goal */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-2">
              {gf.goals.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, goal: opt });
                    nextStep();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all ${
                    formData.goal === opt
                      ? "border-[#a855f7]/50 bg-[#a855f7]/8 text-[#a855f7]"
                      : "border-border bg-surface text-ink hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => { setFormData({ ...formData, goal: gf.goals[gf.goals.length - 1] }); nextStep(); }}
                className="mt-1 w-full py-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-semibold transition-colors border-none cursor-pointer"
              >
                Ücretsiz Görüşme için Seç ve İlerle →
              </button>
            </div>
          )}

          {/* Step 2: Industry */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-2">
              {gf.industries.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, industry: opt });
                    nextStep();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all ${
                    formData.industry === opt
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
                {gf.back}
              </button>
            </div>
          )}

          {/* Step 3: Budget */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-2">
              {gf.budgets.map((opt) => (
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
                onClick={() => setCurrentStep(2)}
                className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-1"
              >
                {gf.back}
              </button>
            </div>
          )}

          {/* Step 4: İletişim */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={gf.name_placeholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 p-3.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-subtle text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all"
                />
                <input
                  type="text"
                  placeholder={gf.surname_placeholder}
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="flex-1 p-3.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-subtle text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all"
                />
              </div>
              <input
                type="tel"
                placeholder={gf.phone_placeholder}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-subtle text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all"
              />
              <input
                type="email"
                placeholder={gf.email_placeholder}
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
                    {gf.sending}
                  </>
                ) : (
                  gf.submit
                )}
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs text-ink-subtle hover:text-ink-muted transition-colors text-center mt-1"
              >
                {gf.back}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
