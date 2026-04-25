"use client";

import React, { useEffect, useState } from "react";
import { getLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
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

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
      {children}
    </div>
  );
}