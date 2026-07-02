import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import PlusServicesWizard from "@/components/ui/PlusServicesWizard";
import BlogListePage from "@/app/[lang]/blog/page";

const baseUrl = "https://www.sukrugencoglu.com";

export const metadata: Metadata = {
  title: "Blog Posts | Şükrü Gençoğlu",
  description:
    "Get in touch with Şükrü Gençoğlu for a free analysis and proposal.",
  alternates: {
    canonical: `${baseUrl}/en/blog-posts`,
    languages: {
      tr: `${baseUrl}/tr/blog-yazilari`,
      en: `${baseUrl}/en/blog-posts`,
      "x-default": `${baseUrl}/tr/blog-yazilari`,
    },
  },
  openGraph: {
    title: "Blog Posts | Şükrü Gençoğlu",
    description:
      "Get in touch with Şükrü Gençoğlu for a free analysis and proposal.",
    url: `${baseUrl}/en/blog-posts`,
  },
};

export default async function BlogPostsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BlogListePage />
      <ContactSection
        pinnedAnons={
          <div className="flex flex-col gap-6">
            <PlusServicesWizard showContactButton />
          </div>
        }
      />
    </>
  );
}
