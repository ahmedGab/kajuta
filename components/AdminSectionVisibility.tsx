"use client";

import React, { useState, useRef } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { SectionVisibility } from "@/lib/types";
import { Save, Eye, EyeOff, ChevronUp, ChevronDown, GripVertical, Layers, Grip, EyeOff as DisableIcon } from "lucide-react";

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

type SectionOrderItem = {
  key: string;
  label: string;
  customId?: string;
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

  const customSections = content.customSections || [];
  const enabledCustomCount = customSections.filter(s => s.enabled).length;
  const disabledCustomCount = customSections.filter(s => !s.enabled).length;

  const [sectionOrder, setSectionOrder] = useState<SectionOrderItem[]>(() => {
    const stored = content.sectionOrder as SectionOrderItem[] | undefined;
    if (stored && stored.length > 0) {
      return stored;
    }
    const base = sectionsList.map(s => ({ key: s.key, label: s.label }));
    return [...base, { key: "custom", label: "Sections Personnalisées" }];
  });

  const [customEnabled, setCustomEnabled] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    customSections.forEach(s => { map[s.id] = s.enabled; });
    return map;
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const customSectionsCount = (content.customSections || []).filter(s => s.enabled).length;
  const totalCustomCount = customSections.length;

  const handleToggle = (key: keyof SectionVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleCustomSection = (sectionId: string) => {
    setCustomEnabled(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    const updatedSections = customSections.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    const newContent = { ...content, customSections: updatedSections };
    saveSiteContent(newContent);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.opacity = 0.5;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragItem.current === null) return;
    
    const newOrder = [...sectionOrder];
    const dragIndex = dragItem.current;
    
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setSectionOrder(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
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

      {/* Ordre des Sections avec Drag & Drop */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-2">Ordre des Sections</h3>
        <p className="text-gray-500 text-sm mb-4">Glissez et déposez les sections pour changer leur ordre d&apos;affichage.</p>
        
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
          {sectionOrder.map((section, idx) => {
            const isCustom = section.key === "custom";
            const isVisible = !isCustom && visibility[section.key as keyof SectionVisibility];
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx;
            
            return (
              <div 
                key={`${section.key}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 mb-2 transition-all cursor-grab active:cursor-grabbing ${
                  isDragging 
                    ? "border-green bg-green/20 opacity-70 scale-105 shadow-lg" 
                    : isDragOver 
                      ? "border-caramel bg-caramel/10 scale-102" 
                      : isVisible 
                        ? "border-green/30 bg-white hover:border-green/50 hover:shadow-sm" 
                        : "border-gray-200 bg-gray-100 opacity-60"
                }`}
                style={{
                  transform: isDragOver && draggedIndex !== idx ? `translateY(${draggedIndex! > idx ? '8px' : '-8px'})` : 'none'
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200">
                  <Grip size={18} />
                </div>
                <span className="text-gray-400 font-mono text-sm w-6 text-center bg-gray-100 py-1 rounded">{idx + 1}</span>
                <span className={`flex-1 font-semibold text-sm ${isVisible ? "text-chocolate" : "text-gray-400"}`}>
                  {section.label}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, "up"); }}
                    disabled={idx === 0}
                    className="p-1.5 text-gray-400 hover:text-green hover:bg-green/10 rounded disabled:opacity-30"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, "down"); }}
                    disabled={idx === sectionOrder.length - 1}
                    className="p-1.5 text-gray-400 hover:text-green hover:bg-green/10 rounded disabled:opacity-30"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
                {!isCustom && (
                  <div 
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      isVisible ? "bg-green" : "bg-gray-300"
                    }`} 
                    onClick={(e) => { e.stopPropagation(); handleToggle(section.key as keyof SectionVisibility); }}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      isVisible ? "left-7" : "left-1"
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <p className="text-xs text-gray-400 mt-3 text-center">
          <Grip size={14} className="inline mr-1" />
          Glissez les sections pour les réorganiser
        </p>
      </div>

      {/* Sections Personnalisées */}
      {customSections.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Layers size={20} className="text-caramel" />
            Sections Personnalisées ({enabledCustomCount}/{totalCustomCount})
          </h3>
          <div className="space-y-2">
            {customSections.map((section) => {
              const isEnabled = customEnabled[section.id] ?? section.enabled;
              return (
                <div key={section.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                  isEnabled ? "border-green/30 bg-green/5" : "border-gray-200 bg-gray-50 opacity-60"
                }`}>
                  <span className="flex-1 font-medium text-sm">{section.titleFr || "Sans titre"}</span>
                  <div 
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      isEnabled ? "bg-green" : "bg-gray-300"
                    }`} 
                    onClick={() => handleToggleCustomSection(section.id)}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? "left-5" : "left-0.5"
                    }`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2 w-full justify-center">
        <Save size={18} /> Sauvegarder l&apos;ordre des sections
      </button>
    </div>
  );
}