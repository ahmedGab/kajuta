"use client";

import React, { useState, useEffect, useRef } from "react";
import { getLanguage, saveLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";
import { Globe, ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const lang = getLanguage();
    setLanguage(lang);
    applyLanguage(lang);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyLanguage = (lang: Language) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    saveLanguage(newLang);
    applyLanguage(newLang);
    setIsOpen(false);
    window.location.reload();
  };

  if (!mounted) {
    return (
      <div className="w-20 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
    );
  }

  const languages = [
    { code: "fr" as Language, label: "Français", flag: "🇫🇷" },
    { code: "ar" as Language, label: "العربية", flag: "🇸🇦" },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-cream rounded-lg hover:bg-green/10 transition-colors border border-gray-200"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe size={18} className="text-green" />
        <span className="text-sm font-semibold text-chocolate">{currentLang?.flag} {currentLang?.label}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                language === lang.code
                  ? "bg-green/10 text-green font-semibold"
                  : "text-chocolate hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
              {language === lang.code && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}