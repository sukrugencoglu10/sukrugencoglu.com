"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";

const skills = [
  "Next.js", "React", "TypeScript", "Node.js",
  "Tailwind CSS", "Google Ads", "Meta Ads",
  "Google Analytics 4", "GTM", "Looker Studio",
  "CRO", "SEO", "Figma",
];

function StatCounter({
  target,
  label,
  inView,
}: {
  target: string;
  label: string;
  inView: boolean;
}) {
  const numericPart = parseInt(target.replace(/\D/g, ""), 10);
  const suffix = target.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(numericPart / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericPart) {
        setCount(numericPart);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, numericPart]);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-4xl font-extrabold text-[#1e6296]">
        {inView ? count : 0}
        {suffix}
      </span>
      <span className="text-sm text-ink-muted font-medium">{label}</span>
    </div>
  );
}

export default function AboutSection() {
  const { t } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { target: t.about.stat1_number, label: t.about.stat1_label },
    { target: t.about.stat2_number, label: t.about.stat2_label },
    { target: t.about.stat3_number, label: t.about.stat3_label },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Sol: Metin */}
          <div className="flex flex-col gap-6">
            <Badge color="blue">{t.about.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {t.about.title}{" "}
              <span className="text-[#1e6296]">{t.about.title_accent}</span>
            </h2>
            <p className="text-ink-muted leading-relaxed">
              {t.about.bio.split("Şükrü Gençoğlu").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="text-[#1e6296] font-semibold">Şükrü Gençoğlu</span>}
                </span>
              ))}
            </p>
            <p className="text-ink-muted leading-relaxed">{t.about.bio2}</p>
            {t.about.bio3 && <p className="text-ink-muted leading-relaxed">{t.about.bio3}</p>}

            {/* Beceriler */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                {t.about.skills_title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-ink-secondary hover:border-[#1e6296] hover:text-[#1e6296] transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ: Logo + İstatistikler */}
          <div className="flex flex-col items-center gap-10">
            {/* İkinci Logo */}
            <div className="flex justify-center">
              <Image
                src="/g.svg"
                alt="Şükrü Gençoğlu"
                width={160}
                height={224}
                className="object-contain opacity-90"
              />
            </div>

            {/* İstatistikler */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 w-full max-w-sm"
            >
              {stats.map((s) => (
                <StatCounter
                  key={s.label}
                  target={s.target}
                  label={s.label}
                  inView={inView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
