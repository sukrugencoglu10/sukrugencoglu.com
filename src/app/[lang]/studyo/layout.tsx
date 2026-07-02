import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stüdyo | Şükrü Gençoğlu",
  robots: { index: false, follow: false, nocache: true },
};

export default function StudyoLangLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
