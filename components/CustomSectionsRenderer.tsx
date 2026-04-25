"use client";

import React from "react";
import { getSiteContent, getLanguage } from "@/lib/storage";
import { CustomSection } from "@/lib/types";

const backgroundClasses: Record<CustomSection["background"], string> = {
  background: "bg-background",
  cream: "bg-cream",
  white: "bg-white",
  green: "bg-green text-white",
  caramel: "bg-caramel text-white",
};

export default function CustomSectionsRenderer() {
  const content = getSiteContent();
  const lang = getLanguage();
  const sections = (content.customSections || []).sort((a, b) => a.order - b.order);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.filter(s => s.enabled).map((section) => {
        const gridClass = {
          1: "grid-cols-1",
          2: "grid-cols-1 md:grid-cols-2",
          3: "grid-cols-1 md:grid-cols-3",
          4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        }[section.columns];

        return (
          <section
            key={section.id}
            className={`section-padding ${backgroundClasses[section.background]}`}
          >
            <div className="container-custom">
              {section.titleFr && (
                <h2
                  className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
                  style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                >
                  {lang === "ar" ? section.titleAr : section.titleFr}
                </h2>
              )}
              <div className={`grid ${gridClass} gap-8`}>
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-white shadow-soft text-center"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {item.contentFr && (
                      <p className="text-chocolate/80">
                        {lang === "ar" ? item.contentAr : item.contentFr}
                      </p>
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