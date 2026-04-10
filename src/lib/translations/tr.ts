import type { Translations } from "./en";

export const tr: Translations = {
  nav: {
    home: "Ana Sayfa",
    work: "Çalışmalar",
    process: "Stüdyo",
    services: "Hizmetlerimiz",
    about: "Hakkımda",
    contact: "İletişim",
    cta: "Birlikte Çalışalım",
  },
  hero: {
    eyebrow: "Bizimle müşteri size gelir",
    headline_start: "Google & Meta Ads ile",
    word1: "doğru",
    word2: "yeni",
    headline_end: "potansiyel müşterilere ulaşın",
    cta_primary: "Hemen Başlayın",
    cta_secondary: "+Plus Hizmetlerimiz",
  },
  work: {
    badge: "Vaka Çalışmaları",
    title: "Sadece \"Yapıyorum\" Değil,",
    title_accent: "\"Sonuç Aldım\"",
    subtitle: "Gerçek projeler. Gerçek sonuçlar.",
  },
  services: {
    badge: "+Plus Hizmetlerimiz",
    cta: "İletişime Geçiniz",
    title: "Aİ Destekli İhtiyaca Uygun Yazılım Altyapıları",
    title_accent: "Kuruyoruz",
    items: [
      {
        title: "Yüksek Performanslı Web Geliştirme",
        desc: "Hızın dönüşüm demek olduğunu biliyorum. Next.js, React ve Tailwind CSS kullanarak, Google Core Web Vitals skorları yeşil yanan, SEO uyumlu ve kullanıcıyı satışa ikna eden ultra hızlı web deneyimleri inşa ediyorum."
      },
      {
        title: "Gelişmiş Veri Takibi & Veri Mimarisi",
        desc: "iOS 14+ kısıtlamaları ve çerezlerin ölümüyle verinin %30'u karanlıkta kalıyor. Sunucu Taraflı GTM (Google Tag Manager) kurulumları ile veriyi tarayıcıdan değil, doğrudan sunucudan (Stape/Google Cloud) alarak reklam platformlarına (Facebook CAPI, Google Ads) %100 doğrulukla iletiyorum."
      },
      {
        title: "İş Zekası & Veri Panelleri",
        desc: "Karmaşık veri panelleri arasında kaybolmanıza izin vermiyorum. Google Analytics 4 ve Google Ads verilerini Looker Studio üzerinde birleştirerek; reklam harcamalarınızı, dönüşüm maliyetlerinizi ve karlılığınızı saniyeler içinde görebileceğiniz şeffaf raporlar sunuyorum."
      },
      {
        title: "Pazarlama Otomasyonu (n8n & Yapay Zeka)",
        desc: "Manuel işleri operasyonunuzdan çıkarıyorum. n8n ve yapay zeka araçlarıyla; gelen potansiyel müşterileri anında CRM sisteminize aktarıyor, bildirimleri otomatize ediyor ve veri akışını insan hatasından arındırıyorum."
      }
    ]
  },
  about: {
    badge: "Hakkımda",
    title: "Veriyle İnşa Edilen,",
    title_accent: "Performansla Büyüyen Dijital Mimari",
    bio: "Merhaba, ben Şükrü Gençoğlu. Dijital dünyada \"Growth Engineer\" (Büyüme Mühendisi) olarak konumlanıyorum. Bilgisayar Mühendisliği altyapımı ve Grafik Tasarım vizyonumu, modern pazarlama teknolojileriyle birleştirerek işletmeler için ölçülebilir başarı hikayeleri yazıyorum.",
    bio2: "Sıradan bir yazılımcıdan farkım; sadece kod yazmam, o kodun getireceği dönüşümü (ROI) hesaplarım. Sıradan bir reklamcıdan farkım ise; verinin mutfağını, sunucu taraflı takibi (Server-Side) ve otomasyon mimarisini bizzat kurmamdır.",
    bio3: "Benim için bir web sitesi sadece bir arayüz değil; hızıyla SEO’yu, veri kurgusuyla reklam bütçenizi optimize eden bir büyüme motorudur.",
    skills_title: "Beceriler & Araçlar",
    stat1_number: "50+",
    stat1_label: "Tamamlanan Proje",
    stat2_number: "30+",
    stat2_label: "Mutlu Müşteri",
    stat3_number: "5+",
    stat3_label: "Yıl Deneyim",
  },
  contact: {
    badge: "İletişime Geç",
    title: "Birlikte",
    title_accent: "çalışalım",
    subtitle:
      "Aklınızda bir proje mi var? Büyümenize nasıl yardımcı olabileceğimi konuşalım.",
    name_label: "Adınız",
    email_label: "E-posta Adresi",
    message_label: "Mesajınız",
    message_placeholder: "Projeniz hakkında anlatın...",
    cta: "Mesaj Gönder",
    or_reach: "Ya da doğrudan ulaşın",
    whatsapp_message: "Merhaba Şükrü Bey, hizmetleriniz hakkında bilgi alabilir miyim?",
    whatsapp_tooltip: "WhatsApp'tan Bize Sorun",
    free_analysis_label: "Ücretsiz Analiz",
    form_title: "Büyüme Potansiyelinizi Keşfedin",
  },
  growthForm: {
    steps: [
      { title: "Odak Noktası", subtitle: "Hangi alanda büyümek istiyorsunuz?" },
      { title: "Sektör", subtitle: "Hangi sektörde faaliyet gösteriyorsunuz?" },
      { title: "Kapasite", subtitle: "Tahmini aylık reklam bütçeniz nedir?" },
      { title: "İletişim", subtitle: "Analiz raporunuzu nereye gönderelim?" },
    ],
    goals: ["Google'da Üstte Görülme", "WhatsApp & Telefon Araması", "Form Doldurulması", "Diğer"],
    industries: ["E-Ticaret", "İnşaat & Gayrimenkul", "Sağlık & Estetik", "Hukuk & Danışmanlık", "Eğitim", "Diğer"],
    budgets: ["10.000₺ – 20.000₺", "20.000₺ – 50.000₺", "50.000₺ – 150.000₺+", "Belirtmek İstemiyorum"],
    email_placeholder: "E-posta Adresiniz",
    submit: "Analizi Başlat",
    sending: "Gönderiliyor...",
    back: "← Geri Dön",
    success_title: "Analiz Talebiniz Alındı!",
    success_desc: "En kısa sürede size özel büyüme raporuyla geri döneceğiz.",
    error_invalid_email: "Lütfen geçerli bir e-posta adresi girin.",
    error_generic: "Bir hata oluştu, lütfen tekrar deneyin.",
    error_connection: "Bağlantı hatası. Lütfen tekrar deneyin.",
  },
  footer: {
    tagline: "Web'i, bir proje bir proje inşa ediyorum.",
    nav_title: "Navigasyon",
    contact_title: "Sosyal Medya",
    copyright: "© 2025 Şükrü Gençoğlu. Tüm hakları saklıdır.",
  },
  mantikhHaritasi: {
    badge: "Mantık Haritası",
    title: "Reklam Yönetiminde",
    title_accent: "Doğru Strateji",
    subtitle: "Dönüşüm sağlayan reklamlar için sistematik bir yaklaşım — her adımda, her kararla.",
    cta_label: "Ücretsiz Görüşme Al",
    card_title: "Dönüşüm Odaklı Reklam Yönetimi",
    card_desc: "Her adımda ölçülebilir sonuçlar. Her kampanyada stratejik kararlar.",
    items: [
      {
        title: "Reklam verme ve çıkma amacımız, niyetimiz, hedefimiz nedir?",
        subs: ["Google'da ilk sayfada çıkma", "Telefon aramaları", "WhatsApp tıklanmaları", "Form"],
      },
      {
        title: "Reklam yayında kalmaz, yönetilir",
        subs: [],
      },
      {
        title: "Doğru reklam kampanyası ile doğru amaca hizmet ederek doğru hedef kitleye ulaşma",
        subs: ["Niş hedef kitleye stratejik kampanya kurulumu", "Özel optimizasyon"],
      },
      {
        title: "Reklamların optimize edilmesi",
        subs: ["Takip edilmesi", "Gelen aramalar incelenmesi", "Gereksiz tıklamaların kapatılması"],
      },
      { title: "Profesyonel reklam yönetimi", subs: [] },
      { title: "Dönüşüm odaklı olmalı, her tıklama müşteri değildir", subs: [] },
      { title: "Ölçülebilir başarı ve görünürlük", subs: [] },
      { title: "Güven vererek daha fazla satış ve müşteri kazanma", subs: [] },
      { title: "Raporlama", subs: [] },
    ],
  },
  plusServices: {
    badge: "+Plus Hizmetlerimiz",
    title: "Hangi sisteme ihtiyacınız var?",
    subtitle: "En yakın seçeneği seçin — WhatsApp üzerinden iletişime geçelim.",
    categories: [
      "Randevu & Rezervasyon Sistemi",
      "İş Akışı & Süreç Otomasyonu",
      "Fatura & Ödeme Yönetimi",
      "Müşteri Yönetimi (CRM)",
      "Stok & Depo Takibi",
      "Raporlama & Analitik Paneli",
      "Diğer",
    ],
    other_placeholder: "İhtiyacınızı kısaca açıklayın...",
    whatsapp_cta: "WhatsApp'ta Devam Et",
    whatsapp_message_prefix: "Merhaba Şükrü Bey, +Plus hizmetinizle ilgili bilgi almak istiyorum:",
    whatsapp_other_prefix: "Merhaba Şükrü Bey, özel bir yazılım ihtiyacım var:",
    back: "← Geri Dön",
  },
};
