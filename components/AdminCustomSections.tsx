"use client";

import React, { useState } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { CustomSection, CustomSectionItem, Language } from "@/lib/types";
import { Plus, Trash2, Save, X, Edit2, GripVertical, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";

const backgroundOptions = [
  { value: "background" as const, label: "Fond Principal", color: "bg-background" },
  { value: "cream" as const, label: "Crème", color: "bg-cream" },
  { value: "white" as const, label: "Blanc", color: "bg-white" },
  { value: "green" as const, label: "Vert", color: "bg-green text-white" },
  { value: "caramel" as const, label: "Caramel", color: "bg-caramel text-white" },
];

const columnOptions = [
  { value: 1 as const, label: "1 colonne", grid: "grid-cols-1" },
  { value: 2 as const, label: "2 colonnes", grid: "grid-cols-1 md:grid-cols-2" },
  { value: 3 as const, label: "3 colonnes", grid: "grid-cols-1 md:grid-cols-3" },
  { value: 4 as const, label: "4 colonnes", grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" },
];

export default function AdminCustomSections() {
  const content = getSiteContent();
  const [sections, setSections] = useState<CustomSection[]>(content.customSections || []);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAdd = () => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      enabled: true,
      titleFr: "",
      titleAr: "",
      columns: 3,
      background: "background",
      items: [],
      order: sections.length,
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
  };

  const handleSave = () => {
    const newContent = { ...content, customSections: sections };
    saveSiteContent(newContent);
    showNotification("Sections personnalisées sauvegardées !");
    setEditingSection(null);
    window.location.reload();
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette section ?")) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === id);
    if (direction === "up" && idx > 0) {
      const newSections = [...sections];
      [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
      setSections(newSections.map((s, i) => ({ ...s, order: i })));
    } else if (direction === "down" && idx < sections.length - 1) {
      const newSections = [...sections];
      [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
      setSections(newSections.map((s, i) => ({ ...s, order: i })));
    }
  };

  const handleAddItem = () => {
    if (!editingSection) return;
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      contentFr: "",
      contentAr: "",
    };
    setEditingSection({ ...editingSection, items: [...editingSection.items, newItem] });
  };

  const handleUpdateItem = (itemId: string, field: keyof CustomSectionItem, value: string) => {
    if (!editingSection) return;
    const newItems = editingSection.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setEditingSection({ ...editingSection, items: newItems });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      items: editingSection.items.filter(item => item.id !== itemId),
    });
  };

  const handleUpdateSection = (field: keyof CustomSection, value: any) => {
    if (!editingSection) return;
    setEditingSection({ ...editingSection, [field]: value });
  };

  if (editingSection) {
    return (
      <div className="space-y-6">
        {notification && (
          <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
            {notification}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">Modifier la Section</h3>
            <button onClick={() => setEditingSection(null)} className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-green">Titre (Français)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editingSection.titleFr}
                onChange={(e) => handleUpdateSection("titleFr", e.target.value)}
                placeholder="Titre de la section"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-green">العنوان (عربي)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editingSection.titleAr}
                onChange={(e) => handleUpdateSection("titleAr", e.target.value)}
                placeholder="عنوان القسم"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Nombre de colonnes</label>
              <select
                className="w-full p-2 border rounded"
                value={editingSection.columns}
                onChange={(e) => handleUpdateSection("columns", Number(e.target.value) as 1 | 2 | 3 | 4)}
              >
                {columnOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Couleur de fond</label>
              <select
                className="w-full p-2 border rounded"
                value={editingSection.background}
                onChange={(e) => handleUpdateSection("background", e.target.value)}
              >
                {backgroundOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Éléments de la section ({editingSection.items.length})</h4>
              <button onClick={handleAddItem} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                <Plus size={16} /> Ajouter un élément
              </button>
            </div>

            <div className={`grid ${columnOptions.find(c => c.value === editingSection.columns)?.grid} gap-4`}>
              {editingSection.items.map((item, idx) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-500">Élément {idx + 1}</span>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Français</label>
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        value={item.contentFr}
                        onChange={(e) => handleUpdateItem(item.id, "contentFr", e.target.value)}
                        placeholder="Contenu en français..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">عربي</label>
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        value={item.contentAr}
                        onChange={(e) => handleUpdateItem(item.id, "contentAr", e.target.value)}
                        placeholder="المحتوى بالعربية..."
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingSection.items.length === 0 && (
              <p className="text-gray-400 text-center py-8">Aucun élément. Cliquez sur "Ajouter un élément" pour commencer.</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setEditingSection(null)} className="btn-secondary py-2 px-4">Annuler</button>
            <button onClick={handleSave} className="btn-primary py-2 px-4 flex items-center gap-2">
              <Save size={18} /> Sauvegarder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Sections Personnalisées ({sections.length})</h3>
          <p className="text-gray-500 text-sm">Créez vos propres sections avec le nombre de colonnes souhaité</p>
        </div>
        <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2 text-sm">
          <Plus size={16} /> Nouvelle Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Aucune section personnalisée</h4>
          <p className="text-gray-500 mb-4">Créez vos propres sections avec le nombre de colonnes, texte et ordre souhaités.</p>
          <button onClick={handleAdd} className="btn-primary py-2 px-6 inline-flex items-center gap-2">
            <Plus size={18} /> Créer une section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={section.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="text-gray-400 cursor-grab">
                <GripVertical size={20} />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleMove(section.id, "up")}
                  disabled={idx === 0}
                  className="p-1 text-gray-500 hover:text-green disabled:opacity-30"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  onClick={() => handleMove(section.id, "down")}
                  disabled={idx === sections.length - 1}
                  className="p-1 text-gray-500 hover:text-green disabled:opacity-30"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{section.titleFr || "Sans titre"}</h4>
                <p className="text-sm text-gray-500">
                  {columnOptions.find(c => c.value === section.columns)?.label} • 
                  {backgroundOptions.find(b => b.value === section.background)?.label} • 
                  {section.items.length} élément(s)
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${section.enabled ? "bg-green/10 text-green" : "bg-gray-100 text-gray-500"}`}>
                {section.enabled ? "Actif" : "Inactif"}
              </span>
              <button
                onClick={() => setEditingSection(section)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(section.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}