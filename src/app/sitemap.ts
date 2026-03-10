import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sukrugencoglu.com";
  const lastModified = new Date();

  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/nasil-calisiriz", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const langs = ["tr", "en"];

  return langs.flatMap((lang) =>
    pages.map(({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}/${lang}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }))
  );
}
