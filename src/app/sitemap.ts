import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sukrugencoglu.com";
  const lastModified = new Date();

  const trPages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/calismalar", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/hakkimda", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/hizmetler", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/nasil-calisiriz", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/iletisim", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const enPages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/how-we-work", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const trUrls = trPages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}/tr${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const enUrls = enPages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}/en${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  return [...trUrls, ...enUrls];
}
