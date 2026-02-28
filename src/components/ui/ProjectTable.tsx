"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/lib/projects";

// Basic chevron icon component
const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function ProjectTable() {
  const { lang } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[60px_1fr_200px_200px_50px] gap-4 p-5 lg:p-6 bg-surface-secondary border-b border-border text-xs font-semibold uppercase tracking-wider text-ink-muted">
        <div>#</div>
        <div>{lang === "tr" ? "Şirket / Proje" : "Company / Project"}</div>
        <div>{lang === "tr" ? "Kategori" : "Category"}</div>
        <div>{lang === "tr" ? "Ana Sonuç" : "Main Result"}</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {projects.map((project, index) => {
          const isOpen = openId === project.id;
          const title = lang === "tr" ? project.titleTR : project.titleEN;
          const category = lang === "tr" ? project.categoryTR : project.categoryEN;
          const result = lang === "tr" ? project.resultTR : project.resultEN;
          const problem = lang === "tr" ? project.problemTR : project.problemEN;
          const solution = lang === "tr" ? project.solutionTR : project.solutionEN;

          return (
            <div key={project.id} className="flex flex-col border-b border-border last:border-b-0">
              {/* Row Header */}
              <div
                className={`grid grid-cols-1 md:grid-cols-[60px_1fr_200px_200px_50px] gap-4 p-5 lg:p-6 items-center cursor-pointer transition-colors ${
                  isOpen ? "bg-surface-secondary" : "hover:bg-surface-secondary"
                }`}
                onClick={() => toggle(project.id)}
              >
                <div className="hidden md:block text-xl font-bold text-accent">
                  {index + 1}
                </div>

                <div className="flex items-center gap-3">
                  {/* Fake Logo */}
                  <div className="w-12 h-12 rounded-lg bg-orange/10 flex items-center justify-center text-orange font-bold text-xl overflow-hidden shrink-0">
                    {project.company.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-ink leading-tight">
                      {project.company}
                    </span>
                    <span className="text-sm font-medium text-ink-muted md:hidden">
                      {title}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
                    {category}
                  </span>
                </div>

                <div className="font-bold text-ink hidden md:block">{result}</div>

                <div className="flex items-center justify-between md:justify-end">
                  <span className="font-bold text-accent md:hidden">{result}</span>
                  <ChevronDown
                    className={`text-ink-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-accent" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-5 lg:p-8 bg-surface-secondary/50 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Problem */}
                    <div>
                      <h4 className="text-sm font-bold text-orange uppercase tracking-wider mb-2">
                        Problem
                      </h4>
                      <p className="text-ink-secondary leading-relaxed">
                        {problem}
                      </p>
                    </div>
                    {/* Solution */}
                    <div>
                      <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
                        {lang === "tr" ? "Çözüm" : "Solution"}
                      </h4>
                      <p className="text-ink-secondary leading-relaxed">
                        {solution}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-8 py-6 border-y border-border/60 mb-6">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-3xl font-extrabold text-ink bg-clip-text">
                          {metric.value}
                        </span>
                        <span className="text-sm font-medium text-ink-muted">
                          {lang === "tr" ? metric.labelTR : metric.labelEN}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white border border-border px-3 py-1.5 text-xs font-semibold text-ink-secondary shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
