"use client";

import React, { useEffect, useState } from "react";
import FAQSection from "@/components/FAQSection";
import JsonLd from "@/components/JsonLd";
import { getLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";
import * as db from "@/lib/db";
import { FAQItem } from "@/lib/types";

export default function FAQPage() {
  const [language, setLanguage] = useState<Language>("fr");
  const [faqData, setFaqData] = useState<FAQItem[]>([]);

  useEffect(() => {
    setLanguage(getLanguage());
    db.getFAQ().then((data) => {
      setFaqData(data || []);
    });
  }, []);

  const isRTL = language === "ar";

  const texts = {
    title: {
      fr: "Foire Aux Questions",
      ar: "الأسئلة الشائعة"
    },
    subtitle: {
      fr: "Tout ce que vous devez savoir sur Cajuta, nos produits et notre service de livraison en Tunisie.",
      ar: "كل ما يجب معرفته عن كاجوتا ومنتجاتنا وخدمة التوصيل في تونس."
    }
  };

  return (
    <>
      <JsonLd type="FAQPage" faqData={faqData} />
      <div className="bg-background min-h-screen pt-24 pb-20">
        <div className="container-custom">
          <div className={`text-center mb-10 max-w-3xl mx-auto ${isRTL ? 'text-right' : ''}`}>
            <h1 
              className="text-4xl md:text-5xl font-display font-bold text-chocolate mb-6"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {texts.title[language]}
            </h1>
            <p 
              className="text-lg text-chocolate/70"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {texts.subtitle[language]}
            </p>
          </div>
          
          <FAQSection />
        </div>
      </div>
    </>
  );
}