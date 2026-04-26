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

  useEffect(() => {
    setLanguage(getLanguage());
    db.getSiteContent().then((data) => {
      setContent(data);
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
            <Link href="/" className={`font-medium hover:text-caramel transition-colors ${isScrolled ? "text-chocolate" : "text-chocolate"} ${pathname === "/" ? "text-caramel" : ""}`}>
              {language === "ar" ? "الرئيسية" : "Accueil"}
            </Link>
            <Link href="/produits" className={`font-medium hover:text-caramel transition-colors ${isScrolled ? "text-chocolate" : "text-chocolate"} ${pathname === "/produits" ? "text-caramel" : ""}`}>
              {language === "ar" ? "منتجاتنا" : "Nos Produits"}
            </Link>
            <Link href="/a-propos" className={`font-medium hover:text-caramel transition-colors ${isScrolled ? "text-chocolate" : "text-chocolate"} ${pathname === "/a-propos" ? "text-caramel" : ""}`}>
              {language === "ar" ? "قصتنا" : "Notre Histoire"}
            </Link>
            <Link href="/faq" className={`font-medium hover:text-caramel transition-colors ${isScrolled ? "text-chocolate" : "text-chocolate"} ${pathname === "/faq" ? "text-caramel" : ""}`}>
              {language === "ar" ? "الأسئلة" : "FAQ"}
            </Link>
          </nav>

          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageSwitcher />
            <a href="https://wa.me/21650123456" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 bg-green text-white px-4 py-2 rounded-full hover:bg-olive transition-colors">
              <ShoppingBag size={18} />
              <span className="text-sm font-medium">{language === "ar" ? "اطلب" : "Commander"}</span>
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
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`block py-2 font-medium ${isRTL ? "text-right" : ""} ${pathname === "/" ? "text-caramel" : "text-chocolate"}`}>
              {language === "ar" ? "الرئيسية" : "Accueil"}
            </Link>
            <Link href="/produits" onClick={() => setMobileMenuOpen(false)} className={`block py-2 font-medium ${isRTL ? "text-right" : ""} ${pathname === "/produits" ? "text-caramel" : "text-chocolate"}`}>
              {language === "ar" ? "منتجاتنا" : "Nos Produits"}
            </Link>
            <Link href="/a-propos" onClick={() => setMobileMenuOpen(false)} className={`block py-2 font-medium ${isRTL ? "text-right" : ""} ${pathname === "/a-propos" ? "text-caramel" : "text-chocolate"}`}>
              {language === "ar" ? "قصتنا" : "Notre Histoire"}
            </Link>
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className={`block py-2 font-medium ${isRTL ? "text-right" : ""} ${pathname === "/faq" ? "text-caramel" : "text-chocolate"}`}>
              {language === "ar" ? "الأسئلة" : "FAQ"}
            </Link>
            <a href="https://wa.me/21650123456" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green text-white px-4 py-3 rounded-full">
              <ShoppingBag size={18} />
              <span className="font-medium">{language === "ar" ? "اطلب عبر واتساب" : "Commander sur WhatsApp"}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}