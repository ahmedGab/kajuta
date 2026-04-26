"use client";

import React, { useEffect, useState } from "react";
import * as db from "@/lib/db";
import { Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";
import { ShoppingBag } from "lucide-react";

export default function PacksSection() {
  const [content, setContent] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.packs) {
        setContent(data.packs);
      }
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || !content) {
    return <div className="py-20 bg-background"></div>;
  }

  return (
    <section className="section-padding bg-background relative" id="packs">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-caramel/10 text-caramel font-semibold text-sm mb-4">
            {language === "ar" ? "لإهدا أو للمشاركة" : "Pour Offrir ou Partager"}
          </span>
          <h2 
            className="text-3xl md:text-5xl font-display font-bold text-chocolate mb-6"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {content.title?.[language]}
          </h2>
          {(content.paragraphs?.[language] || []).map((para: string, idx: number) => (
            <p key={idx} className="text-chocolate/70 text-lg max-w-2xl mx-auto" style={{ direction: isRTL ? "rtl" : "ltr" }}>
              {para}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {(content.items || []).map((pack: any) => (
            <div key={pack.id} className="card-premium p-8 relative flex flex-col items-center text-center border border-white hover:border-mint transition-colors">
              <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center text-green mb-6">
                <ShoppingBag size={28} />
              </div>
              
              <h3 className="font-display font-bold text-xl text-chocolate mb-4">
                {language === "ar" ? pack.nameAr : pack.nameFr}
              </h3>
              <p className="text-chocolate/70 text-sm mb-8 flex-grow" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                {language === "ar" ? pack.descriptionAr : pack.descriptionFr}
              </p>
              
              <div className="mb-6">
                {pack.price > 0 ? (
                  <div className="font-display font-bold text-3xl text-caramel">
                    {pack.price} <span className="text-lg text-chocolate/60">TND</span>
                  </div>
                ) : (
                  <div className="font-display font-bold text-xl text-caramel">
                    {language === "ar" ? "حسب الطلب" : "Sur devis"}
                  </div>
                )}
              </div>
              
              <a
                href={`https://wa.me/21650123456?text=${encodeURIComponent(language === "ar" ? `مرحبا، أريد طلب ${pack.nameAr}` : `Bonjour Cajuta, je voudrais commander le ${pack.nameFr}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-secondary py-2 px-4 text-sm bg-white"
              >
                {language === "ar" ? "اطلب" : "Commander"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}