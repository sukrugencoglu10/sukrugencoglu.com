import Image from "next/image";

export const metadata = {
  title: "Nasıl Çalışırız - Şükrü Gençoğlu",
  description: "Şükrü Gençoğlu'nun çalışma süreci ve metodolojisi.",
};

export default function ProcessPage() {
  return (
    <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-start pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border bg-white">
          <Image
            src="/gemini.jpg"
            alt="Nasıl Çalışırız - İş Süreci"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border bg-white mt-8">
          <Image
            src="/unnamed (1).png"
            alt="Nasıl Çalışırız - İş Süreci 2"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
