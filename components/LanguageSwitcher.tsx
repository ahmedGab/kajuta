"use client";

import React, { useState, useEffect } from "react";
import { getLanguage, saveLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lang = getLanguage();
    setLanguage(lang);
    applyLanguage(lang);
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
    window.location.reload();
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-white text-gray-400">
          FR
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-gray-400">
          AR
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-cream rounded-lg p-1" role="group" aria-label="Language switcher">
      <button
        onClick={() => handleLanguageChange("fr")}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
          language === "fr"
            ? "bg-green text-white shadow-sm"
            : "text-chocolate hover:text-green hover:bg-green/5"
        }`}
        aria-label="Switch to French"
        aria-pressed={language === "fr"}
      >
        FR
      </button>
      <button
        onClick={() => handleLanguageChange("ar")}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
          language === "ar"
            ? "bg-green text-white shadow-sm"
            : "text-chocolate hover:text-green hover:bg-green/5"
        }`}
        aria-label="Switch to Arabic"
        aria-pressed={language === "ar"}
      >
        AR
      </button>
    </div>
  );
}