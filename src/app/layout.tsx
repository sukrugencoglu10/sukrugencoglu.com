import type { Metadata } from "next";
import { Outfit, Alex_Brush } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { OrganizationLd, WebSiteLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import "./globals.css";

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
  metadataBase: new URL(siteConfig.baseUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/g.svg" },
  verification: siteConfig.searchConsoleVerification
    ? { google: siteConfig.searchConsoleVerification }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const h = await headers();
  const lang = h.get("x-lang") ?? "tr";

  return (
    <html lang={lang} className={`${inter.variable} ${signature.variable}`}>
      <body className="bg-white text-ink font-sans antialiased">
        {/* Google Tag Manager — afterInteractive ile yüklenir, LCP'yi bloklamaz */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KB82ZWW7');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KB82ZWW7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <OrganizationLd />
        <WebSiteLd />
        {children}
      </body>
    </html>
  );
}
