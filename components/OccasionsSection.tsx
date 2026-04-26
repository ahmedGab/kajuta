"use client";

import React, { useEffect, useState } from "react";
import * as db from "@/lib/db";
import { Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function OccasionsSection() {
  const [content, setContent] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.occasions) {
        setContent(data.occasions);
      }
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || !content) {
    return <div className="py-20 bg-cream"></div>;
  }

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom text-center max-w-4xl">
        <span className="inline-block px-4 py-1.5 rounded-full bg-honey/20 text-caramel font-semibold text-sm mb-6">
          {language === "ar" ? "لحظات المشاركة" : "Moments de Partage"}
        </span>
        <h2 
          className="text-3xl md:text-5xl font-display font-bold text-chocolate mb-10"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {content.title?.[language]}
        </h2>
        <div className="space-y-6 text-lg md:text-xl text-chocolate/80 leading-relaxed text-balance">
          {(content.paragraphs?.[language] || []).map((para: string, index: number) => (
            <p key={index} style={{ direction: isRTL ? "rtl" : "ltr" }}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}