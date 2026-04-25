"use client";

import React, { useEffect, useState } from "react";
import { getSiteContent, getLanguage } from "@/lib/storage";
import { SiteContent, Language } from "@/lib/types";
import { defaultSiteContent } from "@/data/siteContent";

export default function StorySection() {
  const [content, setContent] = useState<SiteContent["story"]>(defaultSiteContent.story);
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    setContent(getSiteContent().story);
    setLanguage(getLanguage());
  }, []);

  const isRTL = language === "ar";

  return (
    <section className="section-padding bg-white relative">
      <div className="container-custom">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isRTL ? 'lg:grid-flow-col' : ''}`}>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-cream relative z-10 shadow-premium">
              <img 
                src={content.image || "https://images.unsplash.com/photo-1620063231317-0fcd14c330e7?auto=format&fit=crop&q=80&w=1000"} 
                alt={language === "ar" ? "تحضير حرفي كاجوتا" : "Préparation artisanale cajuta"} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -top-6 -right-6 w-32 h-32 bg-mint rounded-full -z-0 ${isRTL ? '-left-6 -right-auto' : '-right-6'}`}></div>
            <div className={`absolute -bottom-8 w-48 h-48 bg-cream rounded-full -z-0 ${isRTL ? '-right-8 left-auto' : '-left-8'}`}></div>
          </div>
          
          <div className={`max-w-xl ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-green/10 text-green font-semibold text-sm mb-6">
              {language === "ar" ? "حرفة" : "Savoir-Faire"}
            </div>
            <h2 
              className="text-3xl md:text-5xl font-display font-bold text-chocolate mb-8 relative"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {content.title[language]}
              <span className={`absolute -bottom-3 w-20 h-1.5 bg-caramel rounded-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
            </h2>
            
            <div className="space-y-6 text-lg text-chocolate/80">
              {content.paragraphs[language].map((para, i) => (
                <p key={i} className="leading-relaxed" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}