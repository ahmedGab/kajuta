"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { getLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";
import * as db from "@/lib/db";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("fr");
  const [content, setContent] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    const cached = localStorage.getItem("cajuta_header_cache");
    if (cached) {
      try {
        setContent(JSON.parse(cached));
      } catch (e) {}
    }
    
    db.getSiteContent().then((data) => {
      if (data) {
        setContent(data);
        localStorage.setItem("cajuta_header_cache", JSON.stringify(data));
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isRTL = language === "ar";

  const navLinks = mounted && content?.header?.navLinks ? content.header.navLinks : [];
  const ctaButton = mounted && content?.header?.ctaButton ? content.header.ctaButton : { fr: "Commander", ar: "اطلب" };

  const isActiveLink = (linkHref: string) => {
    if (!linkHref) return false;
    if (linkHref.startsWith("#")) {
      return false;
    }
    return pathname === linkHref;
  };

  if (!mounted || navLinks.length === 0) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-soft">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <span className="font-display font-bold text-2xl tracking-tight text-green">
                CAJUTA<span className="text-caramel">.</span>
              </span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-soft" : "bg-transparent"}`}>
      <div className="container-custom">
        <div className={`flex items-center justify-between h-20 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/" className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`font-display font-bold text-2xl tracking-tight ${isScrolled ? "text-green" : "text-green"}`}>
              CAJUTA<span className="text-caramel">.</span>
            </span>
          </Link>

          <nav className={`hidden lg:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            {navLinks.map((link: any, idx: number) => (
              <Link 
                key={idx} 
                href={link.sectionId || link.href}
                className={`font-medium transition-colors ${isScrolled ? "text-chocolate" : "text-chocolate"} ${isActiveLink(link.sectionId || link.href) ? "text-caramel font-bold" : "hover:text-caramel"}`}
              >
                {link.label?.[language] || link.label}
              </Link>
            ))}
          </nav>

          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
            <a href="https://wa.me/21650123456" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 bg-green text-white px-4 py-2 rounded-full hover:bg-olive transition-colors">
              <ShoppingBag size={18} />
              <span className="text-sm font-medium">{ctaButton?.[language]}</span>
            </a>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden ${isScrolled ? "text-chocolate" : "text-chocolate"}`}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-soft">
          <div className="container-custom py-4 space-y-4">
            {navLinks.map((link: any, idx: number) => (
              <Link 
                key={idx} 
                href={link.sectionId || link.href}
                onClick={() => setMobileMenuOpen(false)} 
                className={`block py-2 font-medium ${isRTL ? "text-right" : ""} ${isActiveLink(link.sectionId || link.href) ? "text-caramel font-bold" : "text-chocolate"}`}
              >
                {link.label?.[language] || link.label}
              </Link>
            ))}
            <a href="https://wa.me/21650123456" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green text-white px-4 py-3 rounded-full">
              <ShoppingBag size={18} />
              <span className="font-medium">{ctaButton?.[language]}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}