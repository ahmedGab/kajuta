"use client";

import React, { useState } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { SectionVisibility } from "@/lib/types";
import { Save, Eye, EyeOff, ChevronUp, ChevronDown, GripVertical, Layers } from "lucide-react";

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

type SectionOrder = {
  key: keyof SectionVisibility | "custom";
  label: string;
};

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

  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>(() => {
    const stored = content.sectionOrder;
    if (stored && stored.length === sectionsList.length) {
      return stored;
    }
    return sectionsList.map(s => ({ key: s.key, label: s.label }));
  });

  const customSectionsCount = (content.customSections || []).filter(s => s.enabled).length;

  const handleToggle = (key: keyof SectionVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setSectionOrder(newOrder);
    } else if (direction === "down" && index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSectionOrder(newOrder);
    }
  };

  const handleSave = () => {
    const newContent = { ...content, visibility, sectionOrder };
    saveSiteContent(newContent);
    setNotification("Configuration sauvegardée ! La page va se mettre à jour...");
    setTimeout(() => {
      setNotification("");
      window.location.reload();
    }, 1500);
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

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      {/* Ordre des Sections */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Ordre des Sections</h3>
        <p className="text-gray-500 text-sm mb-4">Cliquez sur les flèches pour changer l&apos;ordre d&apos;affichage des sections.</p>
        
        <div className="space-y-2">
          {sectionOrder.map((section, idx) => {
            const isCustom = section.key === "custom";
            const isVisible = !isCustom && visibility[section.key as keyof SectionVisibility];
            
            return (
              <div 
                key={`${section.key}-${idx}`}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isVisible 
                    ? "border-green/30 bg-green/5" 
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <span className="text-gray-400 font-mono text-sm w-6 text-center">{idx + 1}</span>
                <div className="cursor-grab text-gray-400">
                  <GripVertical size={18} />
                </div>
                <button
                  onClick={() => handleMoveSection(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-gray-500 hover:text-green disabled:opacity-30"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  onClick={() => handleMoveSection(idx, "down")}
                  disabled={idx === sectionOrder.length - 1}
                  className="p-1 text-gray-500 hover:text-green disabled:opacity-30"
                >
                  <ChevronDown size={18} />
                </button>
                <span className={`flex-1 font-medium ${isVisible ? "text-chocolate" : "text-gray-400"}`}>
                  {isCustom ? (
                    <span className="flex items-center gap-2">
                      <Layers size={16} />
                      Sections Personnalisées ({customSectionsCount})
                    </span>
                  ) : (
                    section.label
                  )}
                </span>
                {!isCustom && (
                  <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    isVisible ? "bg-green" : "bg-gray-300"
                  }`} onClick={() => handleToggle(section.key as keyof SectionVisibility)}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      isVisible ? "left-5" : "left-0.5"
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visibilité rapide */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-lg">Visibilité Rápide</h3>
            <p className="text-gray-500 text-sm">{visibleCount}/{sectionsList.length} sections actives</p>
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

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
        <Save size={18} /> Sauvegarder la configuration
      </button>
    </div>
  );
}