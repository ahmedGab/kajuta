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
    { key: "honey", label: "Miel", description: "Accent doré" },
    { key: "chocolate", label: "Chocolat", description: "Texte sombre" },
    { key: "mint", label: "Mint", description: "Fond vert clair" },
    { key: "background", label: "Fond Principal", description: "Arrière-plan du site" },
    { key: "cream", label: "Crème", description: "Fond clair" },
  ];

  useEffect(() => {
    const styleId = "cajuta-dynamic-colors";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    const cssVars = Object.entries(colors)
      .map(([key, value]) => `  --color-${key}: ${value};`)
      .join("\n");
    
    styleEl.textContent = `
      :root {
${cssVars}
      }
      .bg-green { background-color: ${colors.green} !important; }
      .text-green { color: ${colors.green} !important; }
      .border-green { border-color: ${colors.green} !important; }
      .bg-olive { background-color: ${colors.olive} !important; }
      .text-olive { color: ${colors.olive} !important; }
      .bg-caramel { background-color: ${colors.caramel} !important; }
      .text-caramel { color: ${colors.caramel} !important; }
      .bg-honey { background-color: ${colors.honey} !important; }
      .text-honey { color: ${colors.honey} !important; }
      .bg-chocolate { background-color: ${colors.chocolate} !important; }
      .text-chocolate { color: ${colors.chocolate} !important; }
      .bg-mint { background-color: ${colors.mint} !important; }
      .text-mint { color: ${colors.mint} !important; }
      .bg-background { background-color: ${colors.background} !important; }
      .bg-cream { background-color: ${colors.cream} !important; }
      .text-honey\\/80 { color: ${colors.honey}cc !important; }
      .text-mint\\/80 { color: ${colors.mint}cc !important; }
      .text-mint\\/50 { color: ${colors.mint}80 !important; }
      .bg-olive\\/50 { background-color: ${colors.olive}80 !important; }
      .text-chocolate\\/60 { color: ${colors.chocolate}99 !important; }
      .text-chocolate\\/70 { color: ${colors.chocolate}b3 !important; }
      .text-chocolate\\/80 { color: ${colors.chocolate}cc !important; }
      .text-gray-500 { color: #6b7280 !important; }
      .text-gray-600 { color: #4b5563 !important; }
      .border-mint\\/50 { border-color: ${colors.mint}80 !important; }
      .border-caramel\\/10 { border-color: ${colors.caramel}1a !important; }
      .hover:border-green\\/50:hover { border-color: ${colors.green}80 !important; }
      .hover:text-honey:hover { color: ${colors.honey} !important; }
      .hover:bg-green\\/10:hover { background-color: ${colors.green}1a !important; }
      .hover:bg-green\\/20:hover { background-color: ${colors.green}33 !important; }
      .hover:bg-caramel\\/10:hover { background-color: ${colors.caramel}1a !important; }
      .hover:bg-amber-50:hover { background-color: #fffbeb !important; }
      .hover:bg-blue-50:hover { background-color: #eff6ff !important; }
      .hover:bg-red-50:hover { background-color: #fef2f2 !important; }
      .text-green\\/10 { color: ${colors.green}1a !important; }
      .text-green\\/20 { color: ${colors.green}33 !important; }
      .bg-green\\/10 { background-color: ${colors.green}1a !important; }
      .bg-mint\\/10 { background-color: ${colors.mint}1a !important; }
      .hover:border-mint:hover { border-color: ${colors.mint} !important; }
      .border-mint { border-color: ${colors.mint} !important; }
      .border-green\\/20 { border-color: ${colors.green}33 !important; }
      .shadow-premium { --tw-shadow-color: ${colors.green}26 !important; box-shadow: 0 10px 30px -10px ${colors.green}26 !important; }
      .shadow-green { --tw-shadow-color: ${colors.green}4d !important; box-shadow: 0 8px 25px -8px ${colors.green}4d !important; }
      .shadow-soft { --tw-shadow-color: ${colors.chocolate}0d !important; box-shadow: 0 4px 20px -5px ${colors.chocolate}0d !important; }
      .btn-primary { background-color: ${colors.green} !important; }
      .btn-primary:hover { background-color: ${colors.olive} !important; }
      .btn-secondary { border-color: ${colors.green} !important; color: ${colors.green} !important; }
      .btn-secondary:hover { background-color: ${colors.green} !important; color: white !important; }
      .btn-caramel { background-color: ${colors.caramel} !important; }
      .btn-caramel:hover { background-color: ${colors.honey} !important; }
      .shadow-caramel { --tw-shadow-color: ${colors.caramel}26 !important; }
      .border-caramel\\/10 { border-color: ${colors.caramel}1a !important; }
    `;
  }, [colors]);

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const newContent = { ...content, customColors: colors };
    saveSiteContent(newContent);
    setNotification("Couleurs sauvegardées ! La page va refléter les changements.");
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
        <p className="text-gray-500 text-sm mb-6">Personnalisez les couleurs. Les changements sont appliqués instantanément sur le site.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colorFields.map(({ key, label, description }) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-semibold">{label}</label>
              <p className="text-xs text-gray-400">{description}</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  style={{ padding: 0 }}
                />
                <input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 p-2 border rounded-lg font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <div 
                className="h-8 rounded-lg border border-gray-200 transition-all duration-300" 
                style={{ backgroundColor: colors[key] }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Aperçu en temps réel</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorFields.map(({ key, label }) => (
            <div key={key} className="text-center p-4 rounded-xl border border-gray-200">
              <div 
                className="w-full h-12 rounded-lg mb-2 transition-all duration-300" 
                style={{ backgroundColor: colors[key] }} 
              />
              <span className="text-xs font-medium">{label}</span>
              <p className="text-xs text-gray-400 mt-1">{colors[key]}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
          <p className="text-sm mb-2" style={{ color: colors.chocolate }}>Exemple de texte sur fond principal</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm text-white" style={{ backgroundColor: colors.green }}>Bouton Principal</span>
            <span className="px-3 py-1 rounded-full text-sm border-2" style={{ borderColor: colors.green, color: colors.green }}>Bouton Secondaire</span>
            <span className="px-3 py-1 rounded-full text-sm text-white" style={{ backgroundColor: colors.caramel }}>Bouton Caramel</span>
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