"use client";

import React, { useEffect, useState } from "react";
import { Leaf, Award, HeartHandshake, CheckCircle } from "lucide-react";
import { getLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";

export default function WhyChooseUs() {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  const isRTL = language === "ar";

  const reasons = [
    {
      icon: <Award size={32} />,
      title: {
        fr: "Qualité Premium",
        ar: "جودة فاخرة"
      },
      description: {
        fr: "Sélection rigoureuse des meilleurs calibres de fruits secs.",
        ar: "اختيار صارم لأفضل أحجام الفواكة الجافة."
      }
    },
    {
      icon: <CheckCircle size={32} />,
      title: {
        fr: "Croquant Parfait",
        ar: "قرمشة مثالية"
      },
      description: {
        fr: "Caramélisation maîtrisée pour un équilibre sucre/fruit optimal.",
        ar: "كراميل متحكم ل équilibre مثالي بين الحلاوة والفاكهة."
      }
    },
    {
      icon: <Leaf size={32} />,
      title: {
        fr: "100% Naturel",
        ar: "100% طبيعي"
      },
      description: {
        fr: "Sans conservateurs artificiels, juste l'essentiel et de la passion.",
        ar: "بدون مواد حافظة اصطناعية، فقط الجوهر والشغف."
      }
    },
    {
      icon: <HeartHandshake size={32} />,
      title: {
        fr: "Savoir-faire",
        ar: "حرفة"
      },
      description: {
        fr: "Des artisans tunisiens au service de votre gourmandise.",
        ar: "حرفيون توانسة في خدمة لذيتكم."
      }
    }
  ];

  return (
    <section className="section-padding bg-white relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-olive/10 text-olive font-semibold text-sm mb-4">
            {isRTL ? "تميز كاجوتا" : "L'Excellence Cajuta"}
          </span>
          <h2 
            className="text-3xl md:text-4xl font-display font-bold text-chocolate"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {isRTL ? "لماذا تختارنا؟" : "Pourquoi nous choisir ?"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, idx) => (
             <div key={idx} className="bg-cream p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300">
               <div className="w-16 h-16 mx-auto rounded-2xl bg-white text-green shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 {reason.icon}
               </div>
               <h3 className="font-bold text-lg text-chocolate mb-3" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                 {reason.title[language]}
               </h3>
               <p className="text-chocolate/70 text-sm leading-relaxed" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                 {reason.description[language]}
               </p>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}