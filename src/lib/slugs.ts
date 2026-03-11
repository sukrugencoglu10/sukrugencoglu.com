import type { Lang } from "@/context/LanguageContext";

export const PAGE_SLUGS: Record<Lang, Record<string, string>> = {
  tr: {
    services: "hizmetler",
    about: "hakkimda",
    process: "nasil-calisiriz",
    work: "calisimalar",
    contact: "iletisim",
  },
  en: {
    services: "services",
    about: "about",
    process: "how-we-work",
    work: "work",
    contact: "contact",
  },
};

export function getSlug(lang: Lang, page: string): string {
  return PAGE_SLUGS[lang][page] ?? page;
}
