'use client';

import { useLanguage } from '@/context/LanguageContext';
import MasonryGallery from '@/components/ui/MasonryGallery';
import Link from 'next/link';

export default function HeroSection() {
  const { t, lang } = useLanguage();

  return (
    <section
      id='home'
      className="flex flex-row items-center justify-between gap-4"
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 5%',
        height: 'calc(100vh / 0.67 - 65px)',
        overflow: 'hidden',
      }}
    >
      {/* Sol: Metin */}
      <div className={`${lang === 'en' ? 'w-[65%] lg:w-[55%]' : 'w-[50%] lg:w-[42%]'} z-10 relative flex flex-col items-start text-left shrink-0`}>
        <p
          className="text-[0.72rem] font-bold text-[#999] tracking-[1.5px] uppercase mb-6 block"
        >
          {t.hero.eyebrow}
        </p>

        <h1
          className="font-extrabold leading-[1.1] tracking-tight mb-8 text-[#111]"
          style={{
            fontSize: 'clamp(1.875rem, 3.5vw, 3.375rem)',
          }}
        >
          <span className={lang === 'tr' ? "md:whitespace-nowrap" : ""}>
            {t.hero.headline_start}{" "}
            <span className="scrolling-words text-[#f4c724]">
              <span className="word">{t.hero.word1}</span>
              <span className="word">{t.hero.word2}</span>
              <span className="word">{t.hero.word1}</span>
            </span>
          </span>
          {lang === 'tr' ? (
            <>
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
            </>
          ) : (
            " "
          )}
          {t.hero.headline_end.includes('<br />') ? (
            <span dangerouslySetInnerHTML={{ __html: t.hero.headline_end }} />
          ) : (
            t.hero.headline_end
          )}
        </h1>

        <div className="flex items-center justify-start gap-4 lg:gap-6 flex-wrap">
          <a
            href={`https://wa.me/905324072694?text=${encodeURIComponent(t.contact.whatsapp_message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#12b347] text-white py-[13px] px-[26px] rounded-[4px] no-underline font-semibold text-[0.9rem] inline-block transition-all duration-200 hover:bg-[#0e933a] hover:-translate-y-[2px]"
          >
            {t.hero.cta_primary}
          </a>

          <Link
            href='/#work'
            className="text-[#666] underline text-[0.85rem] font-medium transition-colors duration-200 hover:text-[#111]"
          >
            {t.hero.cta_secondary}
          </Link>
        </div>
      </div>

      {/* Sağ: Görsel kolaj — mobil için de görünür, biraz küçültülmüş */}
      <div className={`w-[50%] lg:w-[52%] flex justify-center lg:block origin-center ${lang === 'en' ? 'scale-[1.38] sm:scale-[1.15]' : 'scale-[1.20] sm:scale-100'} -ml-16 pr-8 sm:ml-0 sm:pr-0`}>
        <div className="w-full">
          <MasonryGallery />
        </div>
      </div>
    </section>
  );
}
