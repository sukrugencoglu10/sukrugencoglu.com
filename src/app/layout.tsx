import type { Metadata } from "next";
import { Outfit, Alex_Brush } from "next/font/google";
import { headers } from "next/headers";
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
  metadataBase: new URL("https://www.sukrugencoglu.com"),
  robots: { index: true, follow: true },
  icons: { icon: "/g.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const h = await headers();
  const lang = h.get("x-lang") ?? "tr";

  return (
    <html lang={lang} className={`${inter.variable} ${signature.variable}`}>
      <body className="bg-white text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
