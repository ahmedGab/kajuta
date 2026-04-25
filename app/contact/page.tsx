"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { getLanguage } from "@/lib/storage";
import { Language } from "@/lib/types";

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function ContactPage() {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  const isRTL = language === "ar";

  const texts = {
    title: {
      fr: "Contactez-Nous",
      ar: "اتصل بنا"
    },
    subtitle: {
      fr: "Une question ? Une commande spéciale pour un événement ? Notre équipe est à votre disposition pour vous répondre rapidement.",
      ar: "سؤال؟ طلب خاص لمناسبة؟ فريقنا في خدمتك للرد عليك بسرعة."
    },
    coordonnées: {
      fr: "Nos Coordonnées",
      ar: "معلومات الاتصال"
    },
    téléphone: {
      fr: "Téléphone",
      ar: "الهاتف"
    },
    email: {
      fr: "Email",
      ar: "البريد الإلكتروني"
    },
    atelier: {
      fr: "Atelier",
      ar: "الم Workshop"
    },
    instagram: {
      fr: "Instagram",
      ar: "إنستغرام"
    },
    fastest: {
      fr: "Le plus rapide",
      ar: "الأسرع"
    },
    fastestDesc: {
      fr: "Contactez-nous directement sur WhatsApp pour passer commande ou poser vos questions. Nous répondons en quelques minutes !",
      ar: "تواصل معنا مباشرة عبر واتساب لطرح طلبك أو أسئلتك. نرد خلال دقائق!"
    },
    whatsappBtn: {
      fr: "Discuter sur WhatsApp",
      ar: "المحادثة عبر واتساب"
    },
    delivery: {
      fr: "Livraison Partout en Tunisie",
      ar: "توصيل في Seluruh تونس"
    },
    deliveryDesc: {
      fr: "Nous expédions nos boxs de fruits secs caramélisés sur tout le territoire tunisien (Tunis, Sfax, Sousse, Bizerte, Nabeul, etc.) avec paiement à la livraison pour votre sécurité et confort.",
      ar: "نشحن صناديق الفواكة الجافة المكرملة في Seluruh أنحاء تونس (تونس، صفاقس، سوسة، بنزرت، نابل، وغيرها) مع دفع عند الاستلام لأمانكم وراحتكم."
    }
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <div className="container-custom max-w-5xl">
        <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
          <h1 
            className="text-4xl md:text-5xl font-display font-bold text-chocolate mb-6"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {texts.title[language]}
          </h1>
          <p 
            className="text-lg text-chocolate/70 max-w-2xl mx-auto"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {texts.subtitle[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="card-premium p-8">
              <h3 className="font-display font-bold text-2xl text-chocolate mb-6">
                {texts.coordonnées[language]}
              </h3>
              
              <ul className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
                <li className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-green shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-chocolate">{texts.téléphone[language]}</h4>
                    <p className="text-chocolate/70 mt-1">+216 50 123 456</p>
                  </div>
                </li>
                <li className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-green shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-chocolate">{texts.email[language]}</h4>
                    <p className="text-chocolate/70 mt-1">contact@cajuta.tn</p>
                  </div>
                </li>
                <li className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-green shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-chocolate">{texts.atelier[language]}</h4>
                    <p className="text-chocolate/70 mt-1">{language === "ar" ? "تونس العاصمة، تونس" : "Grand Tunis, Tunisie"}</p>
                  </div>
                </li>
                <li className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-green shrink-0">
                    <InstagramIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-chocolate">{texts.instagram[language]}</h4>
                    <a href="#" className="text-honey hover:text-caramel transition-colors mt-1 inline-block">@cajuta_tunisie</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card-premium p-8 border-2 border-green relative overflow-hidden">
              <div className={`absolute top-0 w-32 h-32 bg-mint/50 rounded-bl-full -z-0 ${isRTL ? 'right-0' : 'right-auto'}`}></div>
              
              <div className="relative z-10 text-center py-6">
                <div className="w-20 h-20 bg-[#25D366]/20 rounded-full flex items-center justify-center text-[#25D366] mx-auto mb-6">
                  <MessageCircle size={40} />
                </div>
                <h3 className="font-display font-bold text-2xl text-chocolate mb-4">
                  {texts.fastest[language]}
                </h3>
                <p className="text-chocolate/80 mb-8" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                  {texts.fastestDesc[language]}
                </p>
                <a 
                  href="https://wa.me/21650123456" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full shadow-green inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  {texts.whatsappBtn[language]}
                </a>
              </div>
            </div>
            
            <div className="card-premium p-8">
              <h3 className="font-display font-bold text-xl text-chocolate mb-6">
                {texts.delivery[language]}
              </h3>
              <p className="text-sm text-chocolate/70 leading-relaxed" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                {texts.deliveryDesc[language]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}