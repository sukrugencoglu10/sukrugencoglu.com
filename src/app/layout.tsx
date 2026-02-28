import type { Metadata } from "next";
import { Outfit, Alex_Brush } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

const inter = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const signature = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Şükrü Gençoğlu — Web Geliştirici & Dijital Pazarlamacı",
  description:
    "Türkiye merkezli full-stack web geliştirici ve dijital pazarlama uzmanı. Yüksek performanslı web siteleri, Google/Meta Ads yönetimi ve CRO hizmetleri.",
  keywords: [
    "web geliştirici",
    "dijital pazarlama",
    "Next.js",
    "Google Ads",
    "Meta Ads",
    "CRO",
    "SEO",
    "Türkiye",
  ],
  openGraph: {
    type: "website",
    url: "https://sukrugencoglu.com",
    title: "Şükrü Gençoğlu — Web Geliştirici & Dijital Pazarlamacı",
    description:
      "Full-stack web developer and digital marketing specialist based in Turkey.",
    siteName: "Şükrü Gençoğlu",
  },
  metadataBase: new URL("https://sukrugencoglu.com"),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/g.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${signature.variable}`}>
      <body className="bg-white text-ink font-sans antialiased">
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}
