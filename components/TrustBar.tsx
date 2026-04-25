"use client";

import React, { useEffect, useState } from "react";
import { getSiteContent, getLanguage } from "@/lib/storage";
import { SiteContent, Language, LocalizedParagraphs } from "@/lib/types";
import { defaultSiteContent } from "@/data/siteContent";

export default function TrustBar() {
  const [content, setContent] = useState<SiteContent["trust"]>(defaultSiteContent.trust);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const siteContent = getSiteContent();
    setContent(siteContent.trust);
    setLanguage(getLanguage());
  }, []);

  const isRTL = language === "ar";

  if (!mounted) {
    return <div className="bg-green text-white py-4 shadow-green relative z-30"></div>;
  }

  // Handle both old format (string[]) and new format ({ fr: string[], ar: string[] })
  const items = content.items && typeof content.items === 'object' && 'fr' in content.items 
    ? (content.items as LocalizedParagraphs)[language] 
    : (content.items as string[]);

  if (!items || !Array.isArray(items)) {
    return <div className="bg-green text-white py-4 shadow-green relative z-30"></div>;
  }

  return (
    <div className="bg-green text-white py-4 shadow-green relative z-30">
      <div className="container-custom text-center">
        <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm md:text-base font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
          {items.map((item, index) => (
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