"use client";

import React, { useEffect, useState } from "react";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";
import { getSiteContent, getLanguage } from "@/lib/storage";
import { SiteContent, Language } from "@/lib/types";
import { defaultSiteContent } from "@/data/siteContent";

export default function DeliverySection() {
  const [content, setContent] = useState<SiteContent["delivery"]>(defaultSiteContent.delivery);
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    setContent(getSiteContent().delivery);
    setLanguage(getLanguage());
  }, []);

  const isRTL = language === "ar";

  return (
    <section className="section-padding bg-mint/30 border-y border-mint">
      <div className="container-custom">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isRTL ? 'lg:grid-flow-col' : ''}`}>
          <div className={isRTL ? "lg:text-right" : "lg:text-left"}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green/10 text-green font-semibold text-sm mb-6">
              {language === "ar" ? "توصيل" : "Livraison"}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-display font-bold text-chocolate mb-8"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {content.title[language]}
            </h2>
            
            <div className="space-y-6 text-lg text-chocolate/80 mb-10">
              {content.paragraphs[language].map((para, idx) => (
                <p key={idx} style={{ direction: isRTL ? "rtl" : "ltr" }}>{para}</p>
              ))}
            </div>

            <div className={`grid grid-cols-2 gap-6 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-green flex-shrink-0">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-chocolate mb-1">{language === "ar" ? "سريع" : "Rapide"}</h4>
                  <p className="text-sm text-chocolate/70">{language === "ar" ? "شحن خلال 24س" : "Expédition sous 24h"}</p>
                </div>
              </div>
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-green flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-chocolate mb-1">{language === "ar" ? "آمن" : "Sécurisé"}</h4>
                  <p className="text-sm text-chocolate/70">{language === "ar" ? "دفع عند الاستلام" : "Paiement à la livraison"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4 pt-12">
                <div className="card-premium p-6 border border-mint/50">
                  <MapPin className="text-caramel mb-3" size={28} />
                  <h4 className="font-bold text-chocolate mb-1">{language === "ar" ? "تونس الكبرى" : "Grand Tunis"}</h4>
                  <p className="text-xs text-chocolate/60">{language === "ar" ? "توصيل سريع" : "Livraison express"}</p>
                </div>
                <div className="card-premium p-6 border border-mint/50">
                  <MapPin className="text-caramel mb-3" size={28} />
                  <h4 className="font-bold text-chocolate mb-1">{language === "ar" ? "صفاقس والجنوب" : "Sfax & Sud"}</h4>
                  <p className="text-xs text-chocolate/60">{language === "ar" ? "توصيل في 48س" : "Livraison en 48h"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="card-premium p-6 border border-mint/50">
                  <MapPin className="text-caramel mb-3" size={28} />
                  <h4 className="font-bold text-chocolate mb-1">{language === "ar" ? "الكاب" : "Cap Bon"}</h4>
                  <p className="text-xs text-chocolate/60">{language === "ar" ? "توصيل في 24س" : "Livraison en 24h"}</p>
                </div>
                <div className="card-premium p-6 border border-mint/50">
                  <MapPin className="text-caramel mb-3" size={28} />
                  <h4 className="font-bold text-chocolate mb-1">{language === "ar" ? "الساحل" : "Sahel"}</h4>
                  <p className="text-xs text-chocolate/60">{language === "ar" ? "توصيل 24-48س" : "Livraison en 24-48h"}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}