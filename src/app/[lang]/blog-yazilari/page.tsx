import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";
import BlogListePage from "@/app/[lang]/blog/page";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Blog Yazıları | Şükrü Gençoğlu",
  description: "Ücretsiz analiz ve teklif için Şükrü Gençoğlu ile iletişime geçin.",
  alternates: {
    canonical: `${baseUrl}/tr/blog-yazilari`,
    languages: {
      tr: `${baseUrl}/tr/blog-yazilari`,
      en: `${baseUrl}/en/blog-posts`,
      "x-default": `${baseUrl}/tr/blog-yazilari`,
    },
  },
  openGraph: {
    title: "Blog Yazıları | Şükrü Gençoğlu",
    description: "Ücretsiz analiz ve teklif için Şükrü Gençoğlu ile iletişime geçin.",
    url: `${baseUrl}/tr/blog-yazilari`,
  },
};

export default async function BlogYazilariPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BlogListePage />
      <ContactSection
        pinnedAnons={
          <div className="flex flex-col gap-6">
            <PlusServicesWizard />
          </div>
        }
      />
    </>
  );
}
