"use client";

import React, { useState, useRef, useEffect } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { SectionVisibility } from "@/lib/types";
import { Save, ChevronUp, ChevronDown, Grip, Layers } from "lucide-react";

const baseSections = [
  { key: "hero", label: "Hero (Bannière)" },
  { key: "trustBar", label: "Barre de Confiance" },
  { key: "products", label: "Produits" },
  { key: "whyChooseUs", label: "Pourquoi Nous" },
  { key: "story", label: "Notre Histoire" },
  { key: "occasions", label: "Occasions" },
  { key: "packs", label: "Packs & Offres" },
  { key: "testimonials", label: "Témoignages" },
  { key: "delivery", label: "Livraison" },
  { key: "faq", label: "FAQ" },
  { key: "cta", label: "CTA Final" },
];

type SectionOrderItem = {
  key: string;
  label: string;
  customId?: string;
  isCustom?: boolean;
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

  const [sectionOrder, setSectionOrder] = useState<SectionOrderItem[]>(() => {
    const stored = content.sectionOrder as SectionOrderItem[] | undefined;
    if (stored && stored.length > 0) {
      return stored;
    }
    const base = baseSections.map(s => ({ key: s.key, label: s.label, isCustom: false }));
    const customItems = customSections.map(s => ({ 
      key: `custom-${s.id}`, 
      label: s.titleFr || "Sans titre", 
      customId: s.id,
      isCustom: true 
    }));
    return [...base, ...customItems];
  });

  const [customEnabled, setCustomEnabled] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    customSections.forEach(s => { map[s.id] = s.enabled; });
    return map;
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  useEffect(() => {
    const customItems = customSections.map(s => ({ 
      key: `custom-${s.id}`, 
      label: s.titleFr || "Sans titre", 
      customId: s.id,
      isCustom: true 
    }));
    const base = baseSections.map(s => ({ key: s.key, label: s.label, isCustom: false }));
    
    setSectionOrder(prev => {
      const nonCustom = prev.filter(item => !item.isCustom);
      const updatedCustom = customSections.map(s => ({ 
        key: `custom-${s.id}`, 
        label: s.titleFr || "Sans titre", 
        customId: s.id,
        isCustom: true 
      }));
      return [...nonCustom, ...updatedCustom];
    });
  }, [customSections.length, customSections.map(s => s.titleFr).join(",")]);

  const handleToggle = (key: keyof SectionVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleCustomSection = (sectionId: string) => {
    const newEnabled = !customEnabled[sectionId];
    setCustomEnabled(prev => ({ ...prev, [sectionId]: newEnabled }));
    const updatedSections = customSections.map(s => 
      s.id === sectionId ? { ...s, enabled: newEnabled } : s
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
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionOrder];
    if (direction === "up" && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === "down" && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setSectionOrder(newOrder);
  };

  const handleSave = () => {
    const newContent = { ...content, visibility, sectionOrder };
    saveSiteContent(newContent);
    setNotification("Configuration sauvegardée !");
    setTimeout(() => {
      setNotification("");
      window.location.reload();
    }, 1500);
  };

  const getVisibility = (section: SectionOrderItem) => {
    if (section.isCustom && section.customId) {
      return customEnabled[section.customId] ?? true;
    }
    return visibility[section.key as keyof SectionVisibility] ?? true;
  };

  const getToggleHandler = (section: SectionOrderItem) => {
    if (section.isCustom && section.customId) {
      return () => handleToggleCustomSection(section.customId);
    }
    return () => handleToggle(section.key as keyof SectionVisibility);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-2">Ordre des Sections</h3>
        <p className="text-gray-500 text-sm mb-4">Glissez les sections pour les réorganiser. Les sections personnalisées sont marquées avec <Layers size={14} className="inline text-caramel" />.</p>
        
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
          {sectionOrder.map((section, idx) => {
            const isEnabled = getVisibility(section);
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
                      ? "border-caramel bg-caramel/10" 
                      : isEnabled 
                        ? section.isCustom 
                          ? "border-caramel/30 bg-caramel/5 hover:border-caramel/50" 
                          : "border-green/30 bg-white hover:border-green/50" 
                        : "border-gray-200 bg-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-400">
                  <Grip size={18} />
                </div>
                <span className="text-gray-400 font-mono text-sm w-6 text-center bg-gray-100 py-1 rounded">{idx + 1}</span>
                <div className="flex items-center gap-2 flex-1">
                  {section.isCustom && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-caramel/10 text-caramel text-xs font-semibold rounded-full">
                      <Layers size={12} /> Personnalisé
                    </span>
                  )}
                  <span className={`font-semibold text-sm ${isEnabled ? "text-chocolate" : "text-gray-400"}`}>
                    {section.label}
                  </span>
                </div>
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
                <div 
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isEnabled ? "bg-green" : "bg-gray-300"
                  }`} 
                  onClick={(e) => { e.stopPropagation(); getToggleHandler(section)(); }}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isEnabled ? "left-7" : "left-1"
                  }`}></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Grip size={14} /> Glisser pour réorganiser</span>
          <span>|</span>
          <span>{baseSections.length} sections fixes + {customSections.length} personnalisées</span>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2 w-full justify-center">
        <Save size={18} /> Sauvegarder l&apos;ordre des sections
      </button>
    </div>
  );
}