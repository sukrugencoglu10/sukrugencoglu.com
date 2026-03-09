export const en = {
  nav: {
    home: "Home",
    work: "Work",
    process: "How We Work",
    services: "Services",
    about: "About",
    contact: "Contact",
    cta: "Let's Work Together",
  },
  hero: {
    eyebrow: "With us, customers come to you",
    headline_start: "Reach the",
    word1: "right",
    word2: "new",
    headline_end: "potential customers <br /> with Google & Meta Ads",
    cta_primary: "Get Started",
    cta_secondary: "+Plus Services",
  },
  work: {
    badge: "Case Studies",
    title: "Not Just \"Doing\",",
    title_accent: "\"Got Results\"",
    subtitle: "Real projects. Real results.",
  },
  services: {
    badge: "Services",
    title: "Building AI-Powered",
    title_accent: "Software Infrastructures",
    items: [
      {
        title: "High-Performance Web Development",
        desc: "I know that speed is conversion. Using Next.js, React, and Tailwind CSS, I build ultra-fast web experiences that pass Google Core Web Vitals, are SEO-friendly, and persuade users to convert."
      },
      {
        title: "Ghost Tracking & Data Architecture",
        desc: "With iOS 14+ restrictions and the death of cookies, 30% of data remains in the dark. With Server-Side GTM setups, I collect data directly from the server (Stape/Google Cloud) instead of the browser, passing it to ad platforms (Facebook CAPI, Google Ads) with 100% accuracy."
      },
      {
        title: "Business Intelligence & Dashboards",
        desc: "I don't let you get lost among complex data panels. By combining Google Analytics 4 and Google Ads data on Looker Studio; I provide transparent reports where you can see your ad spend, conversion costs, and profitability in seconds."
      },
      {
        title: "Marketing Automation (n8n & AI)",
        desc: "I eliminate manual tasks from your operations. Using n8n and AI tools, I instantly transfer incoming leads to your CRM system, automate notifications, and free your data flow from human error."
      }
    ]
  },
  about: {
    badge: "About Me",
    title: "Digital Architecture Built with Data,",
    title_accent: "Growth with Performance",
    bio: "Hi, I'm Şükrü Gençoğlu. I position myself as a \"Growth Engineer\" in the digital world. I combine my Computer Engineering background and Graphic Design vision with modern marketing technologies to write measurable success stories for businesses.",
    bio2: "What sets me apart from an ordinary developer is that I don't just write code; I calculate the conversion (ROI) that code will bring. What sets me apart from an ordinary advertiser is that I personally build the data kitchen, server-side tracking, and automation architecture.",
    bio3: "To me, a website is not just an interface; it's a growth engine that optimizes SEO with its speed and your ad budget with its data structure.",
    skills_title: "Skills & Tools",
    stat1_number: "50+",
    stat1_label: "Projects Completed",
    stat2_number: "30+",
    stat2_label: "Happy Clients",
    stat3_number: "5+",
    stat3_label: "Years Experience",
  },
  contact: {
    badge: "Get In Touch",
    title: "Let's work",
    title_accent: "together",
    subtitle:
      "Have a project in mind? Let's talk about how I can help you grow.",
    name_label: "Your Name",
    email_label: "Email Address",
    message_label: "Your Message",
    message_placeholder: "Tell me about your project...",
    cta: "Send Message",
    or_reach: "Or reach me directly",
    whatsapp_message: "Hello Şükrü, I'd like to get more information about your services.",
    whatsapp_tooltip: "Chat on WhatsApp",
  },
  footer: {
    tagline: "Building the web, one project at a time.",
    nav_title: "Navigation",
    contact_title: "Social Media",
    copyright: "© 2025 Şükrü Gençoğlu. All rights reserved.",
  },
  mantikhHaritasi: {
    badge: "Logic Map",
    title: "The Right Strategy in",
    title_accent: "Ad Management",
    subtitle: "A systematic approach to running ads that convert — every step, every decision.",
    cta_label: "Get a Free Consultation",
    card_title: "Conversion-Focused Ad Management",
    card_desc: "Measurable results at every step. Strategic decisions in every campaign.",
    items: [
      {
        title: "What is our goal, intention, and target for advertising?",
        subs: ["First page on Google", "Phone calls", "WhatsApp clicks", "Contact form"],
      },
      {
        title: "Ads are not just running — they are managed",
        subs: [],
      },
      {
        title: "Reaching the right audience with the right campaign for the right goal",
        subs: ["Strategic campaign setup for niche audiences", "Custom optimization"],
      },
      {
        title: "Ad optimization",
        subs: ["Tracking", "Analyzing incoming calls", "Blocking unnecessary clicks"],
      },
      { title: "Professional ad management", subs: [] },
      { title: "Conversion-focused — not every click is a customer", subs: [] },
      { title: "Measurable success and visibility", subs: [] },
      { title: "Gaining more sales and customers through trust", subs: [] },
      { title: "Reporting", subs: [] },
    ],
  },
};

export interface Translations {
  nav: {
    home: string;
    work: string;
    process: string;
    services: string;
    about: string;
    contact: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    headline_start: string;
    word1: string;
    word2: string;
    headline_end: string;
    cta_primary: string;
    cta_secondary: string;
  };
  work: {
    badge: string;
    title: string;
    title_accent: string;
    subtitle: string;
  };
  services: {
    badge: string;
    title: string;
    title_accent: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  about: {
    badge: string;
    title: string;
    title_accent: string;
    bio: string;
    bio2: string;
    bio3?: string;
    skills_title: string;
    stat1_number: string;
    stat1_label: string;
    stat2_number: string;
    stat2_label: string;
    stat3_number: string;
    stat3_label: string;
  };
  contact: {
    badge: string;
    title: string;
    title_accent: string;
    subtitle: string;
    name_label: string;
    email_label: string;
    message_label: string;
    message_placeholder: string;
    cta: string;
    or_reach: string;
    whatsapp_message: string;
    whatsapp_tooltip: string;
  };
  footer: {
    tagline: string;
    nav_title: string;
    contact_title: string;
    copyright: string;
  };
  mantikhHaritasi: {
    badge: string;
    title: string;
    title_accent: string;
    subtitle: string;
    cta_label: string;
    card_title: string;
    card_desc: string;
    items: {
      title: string;
      subs: string[];
    }[];
  };
}
