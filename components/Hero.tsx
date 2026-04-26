"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as db from "@/lib/db";
import { Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function Hero() {
  const [content, setContent] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.hero) {
        setContent(data.hero);
      }
      if (data?.footer?.socialLinks?.whatsapp?.display) {
        const phone = data.footer.socialLinks.whatsapp.phone.replace(/\D/g, "");
        setWhatsappUrl(`https://wa.me/${phone}`);
      }
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || !content) {
    return <div className="min-h-[90vh] bg-cream"></div>;
  }

  return (
    <section className="relative bg-cream overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent z-10 ${isRTL ? 'lg:bg-gradient-to-l' : 'lg:bg-gradient-to-r'} w-full lg:w-2/3 h-full`}></div>
        <Image
          src={content.image || "https://images.unsplash.com/photo-1599598425947-33004bb15286?auto=format&fit=crop&q=80&w=1200"}
          alt={language === "ar" ? "فواكة جافة مكرملة" : "Fruits secs caramélisés"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container-custom relative z-20">
        <div className={`max-w-2xl pt-20 pb-24 md:pt-32 md:pb-36 ${isRTL ? 'lg:mr-auto lg:ml-0' : 'lg:ml-0'}`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey/10 text-caramel text-sm font-medium mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="w-2 h-2 rounded-full bg-caramel"></span>
            {language === "ar" ? "جودة حرفية تونسية" : "Qualité Artisanale Tunisienne"}
          </div>
          <h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-display font-bold text-chocolate leading-tight mb-6 ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {content.title?.[language]}
          </h1>
          <p 
            className={`text-lg md:text-xl text-chocolate/80 mb-10 max-w-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {content.subtitle?.[language]}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href="/produits" className="btn-primary py-4 px-8 text-lg text-center">
              {content.primaryButton?.[language]}
            </a>
            <a href={whatsappUrl || "#"} target="_blank" rel="noopener noreferrer" className="btn-secondary py-4 px-8 text-lg bg-white/50 backdrop-blur-sm text-center">
              {content.secondaryButton?.[language]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}