import type { Metadata } from "next";
import ServicesSection from "@/components/sections/ServicesSection";
import { BreadcrumbLd, ServiceListLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";

const baseUrl = siteConfig.baseUrl;

const servicesEN = [
  { name: "High-Performance Websites", description: "Ultra-fast web experiences with Next.js, React and Tailwind CSS, optimized for Core Web Vitals and SEO." },
  { name: "Advanced Data Tracking & Data Architecture", description: "Server-Side GTM setup to send data to Facebook CAPI and Google Ads with 100% accuracy." },
  { name: "Business Intelligence & Data Dashboards", description: "Transparent reporting dashboards combining GA4 and Google Ads data in Looker Studio." },
  { name: "Marketing Automation (n8n & AI)", description: "Lead management and data flow automation powered by n8n and AI tools." },
  { name: "SEO", description: "Technical SEO audit, content optimization and authority management for organic visibility growth." },
  { name: "Google & Meta Ads Management", description: "Conversion-focused Google Ads and Meta Ads campaign management." },
];

export const metadata: Metadata = {
  title: "Services | Şükrü Gençoğlu",
  description:
    "Google & Meta Ads management, server-side tracking, web development, and growth consulting services.",
  alternates: {
    canonical: `${baseUrl}/en/services`,
    languages: {
      tr: `${baseUrl}/tr/hizmetler`,
      en: `${baseUrl}/en/services`,
      "x-default": `${baseUrl}/tr/hizmetler`,
    },
  },
  openGraph: {
    title: "Services | Şükrü Gençoğlu",
    description:
      "Google & Meta Ads management, server-side tracking, web development, and growth consulting services.",
    url: `${baseUrl}/en/services`,
  },
};

export default function ServicesPage() {
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/en` },
    { name: "Services", url: `${baseUrl}/en/services` },
  ];

  return (
    <>
      <BreadcrumbLd items={breadcrumbs} />
      <ServiceListLd items={servicesEN} lang="en" />
      <ServicesSection />
    </>
  );
}
