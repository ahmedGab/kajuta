"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { Language, SiteContent } from "@/lib/types";
import { Plus, Trash2, Save, GripVertical, Link } from "lucide-react";

type NavLink = { label: { fr: string; ar: string }; href: string; sectionId?: string };

const sectionsList = [
  { id: "#produits", name: { fr: "Section Produits", ar: "قسم المنتجات" } },
  { id: "#packs", name: { fr: "Section Packs", ar: "قسم العروض" } },
  { id: "#faq", name: { fr: "Section FAQ", ar: "قسم الأسئلة" } },
  { id: "/", name: { fr: "Page Accueil", ar: "صفحة الرئيسية" } },
  { id: "/produits", name: { fr: "Page Produits", ar: "صفحة المنتجات" } },
  { id: "/a-propos", name: { fr: "Page À propos", ar: "صفحة من نحن" } },
  { id: "/faq", name: { fr: "Page FAQ", ar: "صفحة الأسئلة" } },
  { id: "/contact", name: { fr: "Page Contact", ar: "صفحة اتصل بنا" } },
];

export default function AdminHeaderEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [selectedLang, setSelectedLang] = useState<Language>("fr");

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  const navLinks = (content?.header?.navLinks || []) as NavLink[];
  const ctaButton = (content?.header?.ctaButton || { fr: "Commander", ar: "اطلب" }) as { fr: string; ar: string };

  const handleAddLink = () => {
    if (!content) return;
    const newLinks: NavLink[] = [...navLinks, { label: { fr: "Nouveau lien", ar: "رابط جديد" }, href: "/" }];
    setContent({ ...content, header: { ...content.header, navLinks: newLinks } });
  };

  const handleLabelChange = (index: number, lang: Language, value: string) => {
    if (!content) return;
    const newLinks = [...navLinks];
    newLinks[index] = {
      ...newLinks[index],
      label: { ...newLinks[index].label, [lang]: value }
    };
    setContent({ ...content, header: { ...content.header, navLinks: newLinks } });
  };

  const handleHrefChange = (index: number, value: string, isSection: boolean) => {
    if (!content) return;
    const newLinks = [...navLinks];
    newLinks[index] = { 
      ...newLinks[index], 
      href: value,
      sectionId: isSection ? value : undefined
    };
    setContent({ ...content, header: { ...content.header, navLinks: newLinks } });
  };

  const handleSectionSelect = (index: number, value: string) => {
    if (!content) return;
    const newLinks = [...navLinks];
    newLinks[index] = { 
      ...newLinks[index], 
      href: value,
      sectionId: value
    };
    setContent({ ...content, header: { ...content.header, navLinks: newLinks } });
  };

  const handleDeleteLink = (index: number) => {
    if (!content) return;
    const newLinks = navLinks.filter((_, i) => i !== index);
    setContent({ ...content, header: { ...content.header, navLinks: newLinks } });
  };

  const handleCtaButtonChange = (lang: Language, value: string) => {
    if (!content) return;
    setContent({ 
      ...content, 
      header: { 
        ...content.header, 
        ctaButton: { ...ctaButton, [lang]: value }
      } 
    });
  };

  const handleSave = async () => {
    if (!content) return;
    await db.saveSiteContent(content);
    setNotification("Header sauvegardé !");
    setTimeout(() => setNotification(""), 3000);
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      {/* CTA Button */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Bouton CTA (Header)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Français</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded" 
              value={ctaButton.fr} 
              onChange={(e) => handleCtaButtonChange("fr", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">العربية</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded" 
              value={ctaButton.ar} 
              onChange={(e) => handleCtaButtonChange("ar", e.target.value)}
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Liens de navigation</h3>
          <button onClick={handleAddLink} className="btn-primary py-2 px-4 flex items-center gap-2">
            <Plus size={16} /> Ajouter un lien
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedLang("fr")}
            className={`px-3 py-1 rounded text-sm ${selectedLang === "fr" ? "bg-green text-white" : "bg-gray-100"}`}
          >
            Français
          </button>
          <button
            onClick={() => setSelectedLang("ar")}
            className={`px-3 py-1 rounded text-sm ${selectedLang === "ar" ? "bg-green text-white" : "bg-gray-100"}`}
          >
            العربية
          </button>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-500">
          <div className="col-span-1"></div>
          <div className="col-span-3">Nom du lien</div>
          <div className="col-span-4">Lien (URL)</div>
          <div className="col-span-3">Section rapide</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-3">
          {navLinks.map((link, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
              <div className="col-span-1">
                <GripVertical className="text-gray-300 cursor-move" size={20} />
              </div>
              
              <div className="col-span-3">
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  value={link.label[selectedLang]} 
                  onChange={(e) => handleLabelChange(idx, selectedLang, e.target.value)}
                  placeholder={selectedLang === "fr" ? "Nom du lien" : "اسم الرابط"}
                />
              </div>

              <div className="col-span-4 flex items-center gap-2">
                <Link size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  className="w-full p-2 border rounded text-sm" 
                  value={link.href} 
                  onChange={(e) => handleHrefChange(idx, e.target.value, false)}
                  placeholder="/page ou #section"
                />
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <select 
                  className="w-full p-2 border rounded text-sm"
                  value={link.sectionId || ""}
                  onChange={(e) => handleSectionSelect(idx, e.target.value)}
                >
                  <option value="">Sélectionner...</option>
                  {sectionsList.map(sec => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name[selectedLang]}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-1 flex justify-end">
                <button 
                  onClick={() => handleDeleteLink(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {navLinks.length === 0 && (
          <p className="text-gray-500 text-center py-4">Aucun lien. Cliquez sur "Ajouter un lien".</p>
        )}
      </div>

      <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
        <Save size={18} /> Sauvegarder
      </button>
    </div>
  );
}