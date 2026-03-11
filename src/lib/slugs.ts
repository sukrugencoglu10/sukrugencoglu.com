import type { Lang } from "@/context/LanguageContext";

export const PAGE_SLUGS: Record<Lang, Record<string, string>> = {
  tr: {
    services: "hizmetler",
    about: "hakkimda",
    process: "nasil-calisiriz",
  },
  en: {
    services: "services",
    about: "about",
    process: "how-we-work",
  },
};

export function getSlug(lang: Lang, page: string): string {
  return PAGE_SLUGS[lang][page] ?? page;
}
