"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { getLanguage as getStoredLanguage, saveLanguage as saveStoredLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lang = getStoredLanguage();
    setLanguageState(lang);
    applyLanguage(lang);
  }, []);

  const applyLanguage = useCallback((lang: Language) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.body.classList.remove("ltr", "rtl");
      document.body.classList.add(lang === "ar" ? "rtl" : "ltr");
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveStoredLanguage(lang);
    applyLanguage(lang);
  }, [applyLanguage]);

  const value = {
    language,
    isRTL: language === "ar",
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "fr" as Language,
      isRTL: false,
      setLanguage: () => {},
    };
  }
  return context;
}