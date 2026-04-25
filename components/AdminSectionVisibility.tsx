"use client";

import React, { useState } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { SectionVisibility } from "@/lib/types";
import { Save, Eye, EyeOff } from "lucide-react";

const sectionsList = [
  { key: "hero" as const, label: "Hero (Bannière principale)", description: "La section d'accueil avec image et boutons" },
  { key: "trustBar" as const, label: "Barre de Confiance", description: "Les icônes : Artisanal, Premium, Livraison..." },
  { key: "products" as const, label: "Section Produits", description: "Grille des produits avec filtres" },
  { key: "whyChooseUs" as const, label: "Pourquoi Nous Choisir", description: "Les raisons de choisir Cajuta" },
  { key: "story" as const, label: "Notre Histoire", description: "L'histoire de la marque avec image" },
  { key: "occasions" as const, label: "Occasions", description: "Pour toutes vos occasions" },
  { key: "packs" as const, label: "Packs & Offres", description: "Les coffrets et offres spéciales" },
  { key: "testimonials" as const, label: "Témoignages Clients", description: "Avis et étoiles" },
  { key: "delivery" as const, label: "Livraison", description: "Informations de livraison" },
  { key: "faq" as const, label: "FAQ", description: "Questions fréquentes" },
  { key: "cta" as const, label: "CTA Final", description: "Bouton de commande WhatsApp" },
];

export default function AdminSectionVisibility() {
  const content = getSiteContent();
  const [notification, setNotification] = useState("");
  const [visibility, setVisibility] = useState<SectionVisibility>(content.visibility || {
    hero: true,
    trustBar: true,
    products: true,
    whyChooseUs: true,
    story: true,
    occasions: true,
    packs: true,
    testimonials: true,
    delivery: true,
    faq: true,
    cta: true,
  });

  const handleToggle = (key: keyof SectionVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const newContent = { ...content, visibility };
    saveSiteContent(newContent);
    setNotification("Visibilité des sections sauvegardée !");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleEnableAll = () => {
    const allTrue: SectionVisibility = {
      hero: true,
      trustBar: true,
      products: true,
      whyChooseUs: true,
      story: true,
      occasions: true,
      packs: true,
      testimonials: true,
      delivery: true,
      faq: true,
      cta: true,
    };
    setVisibility(allTrue);
    setNotification("Toutes les sections activées.");
    setTimeout(() => setNotification(""), 3000);
  };

  const visibleCount = Object.values(visibility).filter(Boolean).length;
  const totalCount = Object.keys(visibility).length;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-lg">Visibilité des Sections</h3>
            <p className="text-gray-500 text-sm">{visibleCount}/{totalCount} sections visibles sur le site</p>
          </div>
          <button 
            onClick={handleEnableAll}
            className="btn-secondary py-2 px-4 text-sm"
          >
            Tout activer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionsList.map(({ key, label, description }) => (
            <div 
              key={key}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                visibility[key] 
                  ? "border-green bg-green/5" 
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
              onClick={() => handleToggle(key)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1.5 rounded-lg ${visibility[key] ? "bg-green text-white" : "bg-gray-300 text-white"}`}>
                    {visibility[key] ? <Eye size={16} /> : <EyeOff size={16} />}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${visibility[key] ? "text-green" : "text-gray-500"}`}>
                      {label}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${
                  visibility[key] ? "bg-green" : "bg-gray-300"
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    visibility[key] ? "left-7" : "left-1"
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-cream p-4 rounded-xl border border-gray-200">
        <h4 className="font-semibold text-sm mb-2">Aperçu de l&apos;ordre des sections</h4>
        <div className="flex flex-wrap gap-2">
          {sectionsList.map(({ key, label }) => (
            <span 
              key={key}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                visibility[key] 
                  ? "bg-green text-white" 
                  : "bg-gray-200 text-gray-500 line-through"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
        <Save size={18} /> Sauvegarder la visibilité
      </button>
    </div>
  );
}