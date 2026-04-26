"use client";

import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import * as db from "@/lib/db";
import { Testimonial as TestimonialType, Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getTestimonials().then((data) => {
      setTestimonials(data || []);
    });
  }, []);

  if (!mounted || testimonials.length === 0) return <div className="py-20 bg-green"></div>;

  const isRTL = language === "ar";

  return (
    <section className="section-padding bg-green relative overflow-hidden">
      <div className={`absolute top-0 w-96 h-96 bg-olive/30 rounded-full blur-3xl -z-0 ${isRTL ? 'left-0' : 'right-0'}`}></div>
      <div className={`absolute bottom-0 w-96 h-96 bg-caramel/20 rounded-full blur-3xl -z-0 ${isRTL ? 'right-0' : 'left-0'}`}></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-mint font-semibold text-sm mb-4">
            {isRTL ? "آراء العملاء" : "Avis Clients"}
          </span>
          <h2 
            className="text-3xl md:text-5xl font-display font-bold text-white"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {isRTL ? "لقد ذاقوا" : "Ils ont craqué"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl relative">
              <Quote className={`absolute top-6 text-mint/30 ${isRTL ? 'left-6 right-auto' : 'right-6'}`} size={48} />
              
              <div className={`flex gap-1 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < t.rating ? "text-honey fill-honey" : "text-white/30"} 
                  />
                ))}
              </div>
              
              <p className="text-white/90 leading-relaxed mb-6 italic" style={{ direction: isRTL ? "rtl" : "ltr" }}>"{t.comment}"</p>
              
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-caramel flex items-center justify-center text-white font-bold font-display">
                  {t.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{t.firstName}</h4>
                  <p className="text-sm text-mint/80">{t.city}, {isRTL ? "تونس" : "Tunisie"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}