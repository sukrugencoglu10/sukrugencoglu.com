import Image from "next/image";

export default function HowWeWorkPage() {
  return (
    <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-start pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border bg-white">
          <Image
            src="/gemini.jpg"
            alt="How We Work - Our Process"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border bg-white mt-8">
          <Image
            src="/unnamed (1).png"
            alt="How We Work - Our Process 2"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
