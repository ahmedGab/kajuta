"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as db from "@/lib/db";
import { FAQItem, Language } from "@/lib/types";
import { getLanguage } from "@/lib/storage";

export default function FAQSection() {
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguage(getLanguage());
    
    db.getFAQ().then((data) => {
      setFaq(data || []);
      if (data && data.length > 0) {
        setOpenId(data[0].id);
      }
    });
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const isRTL = language === "ar";

  const getQuestion = (item: FAQItem) => language === "ar" ? item.questionAr : item.questionFr;
  const getAnswer = (item: FAQItem) => language === "ar" ? item.answerAr : item.answerFr;

  if (!mounted || faq.length === 0) {
    return <div className="py-20 bg-white"></div>;
  }

  return (
    <section className="section-padding bg-white" id="faq">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-mint text-green font-semibold text-sm mb-4">
            {isRTL ? "مساعدة والدعم" : "Aide & Support"}
          </span>
          <h2 
            className="text-3xl md:text-4xl font-display font-bold text-chocolate"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {isRTL ? "الأسئلة الشائعة" : "Questions Fréquentes"}
          </h2>
        </div>

        <div className="space-y-4">
          {faq.map((item) => (
             <div 
              key={item.id} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openId === item.id ? "border-green shadow-soft" : "border-mint/50 hover:border-green/50"
              }`}
            >
              <button
                className={`w-full px-6 py-5 text-left flex items-center justify-between font-semibold text-chocolate bg-white ${isRTL ? 'text-right flex-row-reverse' : ''}`}
                onClick={() => toggleFAQ(item.id)}
              >
                <span style={{ direction: isRTL ? "rtl" : "ltr" }}>{getQuestion(item)}</span>
                {openId === item.id ? (
                  <ChevronUp className="text-green flex-shrink-0" />
                ) : (
                  <ChevronDown className="text-chocolate/40 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 bg-background/50 ${
                  openId === item.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 py-5 text-chocolate/70 leading-relaxed" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                  {getAnswer(item)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}