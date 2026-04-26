"use client";

import React, { useEffect, useState } from "react";
import * as db from "@/lib/db";
import { Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const [content, setContent] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.finalCta) {
        setContent(data.finalCta);
      }
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || !content) {
    return <div className="py-20 bg-background"></div>;
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container-custom">
        <div className="bg-cream rounded-3xl p-10 md:p-16 text-center border border-mint relative overflow-hidden max-w-5xl mx-auto shadow-premium">
          <div className={`absolute -top-24 w-64 h-64 bg-green/10 rounded-full blur-3xl ${isRTL ? '-left-24 right-auto' : '-right-24 left-auto'}`}></div>
          <div className={`absolute -bottom-24 w-64 h-64 bg-caramel/10 rounded-full blur-3xl ${isRTL ? '-right-24 left-auto' : '-left-24 right-auto'}`}></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 
              className="text-3xl md:text-5xl font-display font-bold text-chocolate mb-6"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {content.title?.[language]}
            </h2>
            <p 
              className="text-lg text-chocolate/80 mb-10"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {content.text?.[language]}
            </p>
            <a
              href="https://wa.me/21650123456"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-caramel py-4 px-10 text-lg shadow-premium w-full sm:w-auto inline-flex items-center justify-center"
            >
              {language === "ar" ? "اطلب عبر واتساب" : "Commander sur WhatsApp"}
              <ArrowRight className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}