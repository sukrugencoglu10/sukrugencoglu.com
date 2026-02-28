"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";

const NAV_LINKS = [
  { key: "home" as const, href: "/" },
  { key: "work" as const, href: "/#work" },
  { key: "process" as const, href: "/#process" },
  { key: "services" as const, href: "/services" },
  { key: "about" as const, href: "/about" },
  { key: "contact" as const, href: "/#contact" },
];

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    pathname === "/about" ? "about" : pathname === "/services" ? "services" : "home"
  );

  useEffect(() => {
    if (pathname === "/about") {
      setActiveSection("about");
      return;
    }
    if (pathname === "/services") {
      setActiveSection("services");
      return;
    }
    
    // For other paths, rely on intersection observer or standard hash
    setActiveSection("home");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    ["home", "work", "process", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      style={{
        borderBottom: "1px solid #eaeaea",
        backgroundColor: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 5%",
          maxWidth: "1440px",
          margin: "0 auto",
          height: "78px",
        }}
      >
        {/* Logo container - Mobil'de tam orta, Masaüstü'nde sol */}
        <div className="md:static absolute left-1/2 md:left-auto transform -translate-x-[50%] md:translate-x-0 ml-[-20px] md:ml-10 z-20">
          <Link
            href="/"
            className="brand-link"
          >
            <Image
              src="/ff.svg"
              alt="Şükrü Gençoğlu"
              width={45}
              height={45}
              className="w-[45px] h-[45px] object-cover"
              style={{ borderRadius: "50%" }}
              priority
            />
            <span className="brand-name">
              Şükrü Gençoğlu
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex" style={{ gap: "32px", alignItems: "center" }}>
          {NAV_LINKS.map(({ key, href }) => {
            const isTab = true;
            const isActive = activeSection === key;
            if (isTab) {
              return (
                <Link
                  key={key}
                  href={href}
                  className={`nav-tab${isActive ? " active" : ""}`}
                >
                  {t.nav[key]}
                  <span className="nav-tab-dot" />
                </Link>
              );
            }
            return (
              <Link
                key={key}
                href={href}
                style={{
                  textDecoration: "none",
                  color: isActive ? "#12b347" : "#666666",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.color = "#111111";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    isActive ? "#12b347" : "#666666";
                }}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "16px" }}
        >
          {/* btn-orange */}
          <Link
            href="/#contact"
            style={{
              backgroundColor: "#ff5f00",
              color: "white",
              border: "1px solid #ff5f00",
              padding: "9px 19px", /* padding 1px azaltıldı ki border eklenince boyutu aynı kalsın */
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.3s ease",
              boxShadow: "0 0 0 rgba(255, 95, 0, 0)",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLAnchorElement;
              target.style.backgroundColor = "#ff7a33";
              target.style.boxShadow = "0 0 15px 5px rgba(255, 95, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLAnchorElement;
              target.style.backgroundColor = "#ff5f00";
              target.style.boxShadow = "0 0 0 rgba(255, 95, 0, 0)";
            }}
          >
            {t.nav.cta}
          </Link>
          <LanguageToggle />
        </div>

        {/* Mobile: Language + Hamburger - Sağ tarafta kalması için */}
        <div className="flex md:hidden ml-auto" style={{ alignItems: "center", gap: "8px", position: "relative", zIndex: 10 }}>
          <LanguageToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", color: "#111" }}
            aria-label="Menü"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "20px" }}>
              <span style={{ display: "block", height: "2px", background: "currentColor", borderRadius: "9999px", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "" }} />
              <span style={{ display: "block", height: "2px", background: "currentColor", borderRadius: "9999px", transition: "all 0.2s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: "block", height: "2px", background: "currentColor", borderRadius: "9999px", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "" }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ borderTop: "1px solid #eaeaea", backgroundColor: "#fff", padding: "16px 5% 20px" }}
        >
          {NAV_LINKS.map(({ key, href }) => {
            const isTab = true;
            const isActive = activeSection === key;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  color: isActive
                    ? isTab ? "#e879a0" : "#12b347"
                    : "#666666",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                {t.nav[key]}
                {isTab && isActive && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: "#e879a0",
                      marginLeft: "6px",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </Link>
            );
          })}
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              style={{ display: "block", textAlign: "center", padding: "9px", border: "1px solid #ff5f00", backgroundColor: "#ff5f00", borderRadius: "4px", color: "white", textDecoration: "none", fontWeight: 600, transition: "all 0.3s ease", boxShadow: "0 0 0 rgba(255, 95, 0, 0)" }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.backgroundColor = "#ff7a33";
                target.style.boxShadow = "0 0 15px 5px rgba(255, 95, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.backgroundColor = "#ff5f00";
                target.style.boxShadow = "0 0 0 rgba(255, 95, 0, 0)";
              }}
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
