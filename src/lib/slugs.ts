import type { Lang } from "@/context/LanguageContext";

export const PAGE_SLUGS: Record<Lang, Record<string, string>> = {
  tr: {
    services: "hizmetler",
    about: "hakkimda",
    process: "studyo",
    work: "calismalar",
    contact: "blog-yazilari",
  },
  en: {
    services: "services",
    about: "about",
    process: "studyo",
    work: "work",
    contact: "blog-posts",
  },
};

export function getSlug(lang: Lang, page: string): string {
  return PAGE_SLUGS[lang][page] ?? page;
}
