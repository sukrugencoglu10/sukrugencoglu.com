"use client";

import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/Badge";
import GrowthDashboard from "@/components/ui/GrowthDashboard";
import type { ReactNode } from "react";

export default function MantikhHaritasiSection({ belowDashboard }: { belowDashboard?: ReactNode }) {
  const { t } = useLanguage();
  const mh = t.mantikhHaritasi;

  return (
    <section id="mantik-haritasi" className="section-padding" style={{ backgroundColor: "rgba(30, 98, 150, 0.06)" }}>
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge color="blue">{mh.badge}</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            {mh.title}{" "}
            <span className="text-[#1e6296]">{mh.title_accent}</span>
          </h2>
          <p className="text-ink-muted max-w-lg">{mh.subtitle}</p>
        </div>

        {/* Content: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Numbered steps (3/5) — mobilde ikinci sıraya */}
          <div className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1">
            {mh.items.map((item, index) => {
              const isHighlight = index === 1;
              return (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-xl border transition-colors ${
                    isHighlight
                      ? "bg-[#1e6296] border-[#1e6296] shadow-[0_4px_20px_rgba(30,98,150,0.25)]"
                      : "bg-white border-[#1e6296]/15 hover:border-[#1e6296]/30"
                  }`}
                >
                  {/* Number badge */}
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isHighlight ? "bg-white/20 text-white" : "bg-[#1e6296]/10 text-[#1e6296]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p
                      className={`font-semibold leading-snug ${
                        isHighlight
                          ? "text-white text-base uppercase tracking-wide"
                          : "text-ink text-sm"
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.subs.length > 0 && (
                      <ul className="flex flex-col gap-1 mt-0.5">
                        {item.subs.map((sub, si) => (
                          <li
                            key={si}
                            className={`flex items-center gap-2 text-xs ${
                              isHighlight ? "text-white/75" : "text-ink-muted"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                isHighlight ? "bg-white/50" : "bg-[#1e6296]/40"
                              }`}
                            />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Growth Dashboard (2/5) — mobilde birinci sıraya */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-8">
            <GrowthDashboard />
            {belowDashboard && <div className="hidden lg:block">{belowDashboard}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
