"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/sukrugencoglu10",
    label: "linkedin.com/in/sukrugencoglu10",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/905324072694",
    label: "+90 532 407 26 94",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:sukrugencoglu10@gmail.com",
    label: "sukrugencoglu10@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form gönderimi — gerçek backend veya Formspree ile entegre edilebilir
    setSent(true);
  };

  return (
    <section id="contact" className="section-padding bg-surface-secondary">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Sol: Başlık + Sosyal */}
          <div className="flex flex-col gap-6">
            <Badge color="purple">{t.contact.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {t.contact.title}{" "}
              <span className="text-[#a855f7]">{t.contact.title_accent}</span>
            </h2>
            <p className="text-ink-muted leading-relaxed max-w-md">
              {t.contact.subtitle}
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                {t.contact.or_reach}
              </p>
              {socialLinks.map((s) => (
                <a
                  key={s.name}
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

          {/* Sağ: Form */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-[var(--shadow-card)]">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-ink">
                  {t.contact.cta === "Send Message"
                    ? "Message sent!"
                    : "Mesaj gönderildi!"}
                </h3>
                <p className="text-ink-muted text-sm">
                  {t.contact.cta === "Send Message"
                    ? "I'll get back to you soon."
                    : "En kısa sürede geri döneceğim."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    {t.contact.name_label}
                  </label>
                  <input
                    type="text"
                    required
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all"
                    placeholder="Şükrü Gençoğlu"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    {t.contact.email_label}
                  </label>
                  <input
                    type="email"
                    required
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all"
                    placeholder="ornek@mail.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">
                    {t.contact.message_label}
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 focus:border-[#a855f7] transition-all resize-none"
                    placeholder={t.contact.message_placeholder}
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="mt-1 !bg-[#c084fc] hover:!bg-[#a855f7] hover:shadow-[0_4px_16px_rgba(192,132,252,0.45)] text-white">
                  {t.contact.cta}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
