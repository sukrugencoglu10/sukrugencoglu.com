import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Lang } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

const validLangs: Lang[] = ["tr", "en"];

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!validLangs.includes(lang as Lang)) {
    notFound();
  }

  return (
    <LanguageProvider initialLang={lang as Lang}>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </LanguageProvider>
  );
}
