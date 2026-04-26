"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as db from "@/lib/db";
import { SiteContent, Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function AboutPage() {
  const [content, setContent] = useState<SiteContent["about"] | null>(null);
  const [storyImage, setStoryImage] = useState<string>("https://images.unsplash.com/photo-1596706927909-66c5a0ec7b98?auto=format&fit=crop&q=80&w=1000");
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.about) {
        setContent(data.about);
      }
      if (data && data.story && data.story.image) {
        setStoryImage(data.story.image);
      }
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || !content) {
    return <div className="bg-white min-h-screen pt-24 pb-20"></div>;
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="container-custom">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isRTL ? 'lg:grid-flow-col' : ''}`}>
          <div className={isRTL ? "lg:text-right" : "lg:text-left"}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-caramel/10 text-caramel font-semibold text-sm mb-6">
              {language === "ar" ? "قصة كاجوتا" : "L'Histoire Cajuta"}
            </span>
            <h1 
              className="text-4xl lg:text-5xl font-display font-bold text-chocolate mb-8"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {content.title?.[language]}
            </h1>
            <div className="space-y-6 text-lg text-chocolate/80 leading-relaxed">
              {(content.paragraphs?.[language] || []).map((p: string, idx: number) => (
                <p key={idx} style={{ direction: isRTL ? "rtl" : "ltr" }}>{p}</p>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-premium">
            <Image
              src={storyImage}
              alt={language === "ar" ? "تحضير كاجوتا" : "Préparation Cajuta"}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}