"use client";

import React, { useEffect, useState } from "react";
import * as db from "@/lib/db";
import { Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function TrustBar() {
  const [content, setContent] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getSiteContent().then((data) => {
      if (data && data.trust) {
        setContent(data.trust);
      }
    });
  }, []);

  const isRTL = language === "ar";

  if (!mounted || !content) {
    return <div className="bg-green text-white py-4 shadow-green relative z-30"></div>;
  }

  const items = content.items?.[language] || [];

  return (
    <div className="bg-green text-white py-4 shadow-green relative z-30">
      <div className="container-custom text-center">
        <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm md:text-base font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
          {items.map((item: string, index: number) => (
            <div key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span style={{ direction: isRTL ? "rtl" : "ltr" }}>{item}</span>
              {index < items.length - 1 && (
                <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-honey/50 mx-2"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}