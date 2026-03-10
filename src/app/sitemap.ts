import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sukrugencoglu.com";
  const lastModified = new Date();

  const sharedPages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const trPages = [
    ...sharedPages,
    { path: "/nasil-calisiriz", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const enPages = [
    ...sharedPages,
    { path: "/how-we-work", priority: 0.7, changeFrequency: "monthly" as const },
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
