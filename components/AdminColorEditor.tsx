"use client";

import React, { useState, useEffect } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { Save } from "lucide-react";

const defaultColors = {
  green: "#2F6B4F",
  olive: "#6B7D3C",
  caramel: "#C9822B",
  honey: "#E7A83E",
  chocolate: "#3A2114",
  mint: "#DDEAD1",
  background: "#F8F5EA",
  cream: "#FFF8EC",
};

export default function AdminColorEditor() {
  const content = getSiteContent();
  const [notification, setNotification] = useState("");
  const [colors, setColors] = useState<Record<string, string>>(
    (content as any).customColors || defaultColors
  );

  const colorFields = [
    { key: "green", label: "Vert Principal", description: "Couleur primaire de la marque" },
    { key: "olive", label: "Vert Olive", description: "Variante verte" },
    { key: "caramel", label: "Caramel", description: "Couleur chaude" },
    { key: "honey", label: " Miel", description: "Accent doré" },
    { key: "chocolate", label: "Chocolat", description: "Texte sombre" },
    { key: "mint", label: "Mint", description: "Fond vert clair" },
    { key: "background", label: "Fond Principal", description: "Arrière-plan du site" },
    { key: "cream", label: "Crème", description: "Fond clair" },
  ];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [colors]);

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const newContent = { ...content, customColors: colors };
    saveSiteContent(newContent);
    setNotification("Couleurs sauvegardées !");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleReset = () => {
    if (confirm("Remettre les couleurs par défaut ?")) {
      setColors(defaultColors);
      const newContent = { ...content, customColors: defaultColors };
      saveSiteContent(newContent);
      setNotification("Couleurs remises par défaut.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-2">Couleurs du Site</h3>
        <p className="text-gray-500 text-sm mb-6">Personnalisez les couleurs de votre site. Cliquez sur une couleur pour la modifier.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colorFields.map(({ key, label, description }) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-semibold">{label}</label>
              <p className="text-xs text-gray-400">{description}</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                    style={{ padding: 0 }}
                  />
                </div>
                <input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 p-2 border rounded-lg font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <div 
                className="h-8 rounded-lg border border-gray-200" 
                style={{ backgroundColor: colors[key] }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Aperçu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
            <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: colors.green }} />
            <span className="text-xs">Vert Principal</span>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
            <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: colors.caramel }} />
            <span className="text-xs">Caramel</span>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
            <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: colors.honey }} />
            <span className="text-xs">Miel</span>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
            <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: colors.chocolate }} />
            <span className="text-xs">Chocolat</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
          <Save size={18} /> Sauvegarder les couleurs
        </button>
        <button onClick={handleReset} className="btn-secondary py-2 px-6">
          Réinitialiser
        </button>
      </div>
    </div>
  );
}