"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLangChange = (newLang: Lang) => {
    const newPath = pathname.replace(/^\/(tr|en)/, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface-secondary p-0.5">
      {(["tr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => handleLangChange(l)}
          className={[
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-200 cursor-pointer",
            lang === l
              ? "bg-red-600 text-white shadow-sm"
              : "text-ink-muted hover:text-ink",
          ].join(" ")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
