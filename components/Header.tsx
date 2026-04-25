"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { getLanguage, getSiteContent } from "@/lib/storage";
import { Language } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("fr");
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    setLanguage(getLanguage());
    setContent(getSiteContent());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isRTL = language === "ar";

  const navLinks = [
    { name: language === "ar" ? "الرئيسية" : "Accueil", href: "/" },
    { name: language === "ar" ? "المنتجات" : "Produits", href: "/produits" },
    { name: language === "ar" ? "من نحن" : "À propos", href: "/a-propos" },
    { name: language === "ar" ? "الأسئلة الشائعة" : "FAQ", href: "/faq" },
    { name: language === "ar" ? "اتصل بنا" : "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-soft py-3" : "bg-background py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" dir="ltr">
          {content.logo ? (
            <img src={content.logo} alt="Cajuta" className="h-10 object-contain" />
          ) : (
            <span className="font-display font-bold text-2xl text-green tracking-tight">
              CAJUTA<span className="text-caramel">.</span>
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))
                  ? "text-green font-bold"
                  : "text-chocolate hover:text-caramel"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="https://wa.me/21650123456?text=Bonjour%20Cajuta!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 px-5 text-sm"
            dir="ltr"
          >
            <ShoppingBag className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {language === "ar" ? "اطلب" : "Commander"}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-chocolate"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-soft border-t border-gray-100 flex flex-col py-4 px-4 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium py-2 border-b border-gray-50 ${
                pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))
                  ? "text-green font-bold"
                  : "text-chocolate hover:text-caramel"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="py-2">
            <LanguageSwitcher />
          </div>
          <a
            href="https://wa.me/21650123456?text=Bonjour%20Cajuta!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
            {language === "ar" ? "اطلب عبر واتساب" : "Commander sur WhatsApp"}
          </a>
        </div>
      )}
    </header>
  );
}