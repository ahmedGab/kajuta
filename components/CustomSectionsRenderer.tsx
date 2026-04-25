"use client";

import React from "react";
import { getSiteContent, getLanguage } from "@/lib/storage";
import { CustomSection } from "@/lib/types";

const backgroundClasses: Record<string, string> = {
  background: "bg-background",
  cream: "bg-cream",
  white: "bg-white",
  green: "bg-green text-white",
  "green-light": "bg-mint",
  caramel: "bg-caramel text-white",
};

const textColors: Record<string, string> = {
  background: "text-chocolate",
  cream: "text-chocolate",
  white: "text-chocolate",
  green: "text-white",
  "green-light": "text-green",
  caramel: "text-white",
};

export default function CustomSectionsRenderer() {
  const content = getSiteContent();
  const lang = getLanguage();
  const sections = (content.customSections || []).sort((a, b) => a.order - b.order);

  return (
    <>
      {sections.filter(s => s.enabled).map((section) => {
        const gridCols = {
          1: "grid-cols-1",
          2: "grid-cols-1 md:grid-cols-2",
          3: "grid-cols-1 md:grid-cols-3",
          4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        }[section.columns] || "grid-cols-1";

        const bgClass = backgroundClasses[section.background] || "bg-background";
        const txtClass = textColors[section.background] || "text-chocolate";

        return (
          <section key={section.id} className={`section-padding ${bgClass} ${txtClass}`}>
            <div className="container-custom">
              {section.titleFr && (
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                  {lang === "ar" ? section.titleAr : section.titleFr}
                </h2>
              )}
              <div className={`grid ${gridCols} gap-8`}>
                {section.items.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white shadow-soft text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
                    {item.image && (
                      <img src={item.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
                    )}
                    {item.contentFr && (
                      <div className="text-left">
                        {item.contentFr.split("\n").map((line, lineIdx) => (
                          <p key={lineIdx} className="text-chocolate/80 whitespace-pre-wrap">{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}