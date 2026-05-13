import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kampanya Stüdyosu | Şükrü Gençoğlu",
  robots: { index: false, follow: false, nocache: true },
};

export default function KampanyaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
