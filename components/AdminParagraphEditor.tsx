"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { Language, SectionKey, SiteContent } from "@/lib/types";
import { ArrowUp, ArrowDown, Trash2, Edit2, Plus, Save, Eye, Globe } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AdminParagraphEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<SectionKey>("story");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("fr");
  const [previewLanguage, setPreviewLanguage] = useState<Language>("fr");
  const [newParagraph, setNewParagraph] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    db.getSiteContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  const sections: { id: SectionKey; name: string }[] = [
    { id: "story", name: "Histoire" },
    { id: "delivery", name: "Livraison" },
    { id: "occasions", name: "Occasions" },
    { id: "about", name: "À propos" },
    { id: "packs", name: "Packs (intro)" },
    { id: "footer", name: "Footer" },
  ];

  const currentParagraphs = content?.[selectedSection]?.paragraphs?.[selectedLanguage] || [];

  const handleAdd = async () => {
    if (!newParagraph.trim() || !content) return;
    const updatedParagraphs = [...(content[selectedSection].paragraphs[selectedLanguage]), newParagraph];
    const newContent = {
      ...content,
      [selectedSection]: {
        ...content[selectedSection],
        paragraphs: {
          ...content[selectedSection].paragraphs,
          [selectedLanguage]: updatedParagraphs,
        },
      },
    };
    setContent(newContent);
    setNewParagraph("");
    await db.saveSiteContent(newContent);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(currentParagraphs[index]);
  };

  const handleSaveEdit = async (index: number) => {
    if (!editingText.trim() || !content) return;
    const newParagraphs = [...content[selectedSection].paragraphs[selectedLanguage]];
    newParagraphs[index] = editingText;
    const newContent = {
      ...content,
      [selectedSection]: {
        ...content[selectedSection],
        paragraphs: {
          ...content[selectedSection].paragraphs,
          [selectedLanguage]: newParagraphs,
        },
      },
    };
    setContent(newContent);
    setEditingIndex(null);
    await db.saveSiteContent(newContent);
  };

  const handleDelete = async (index: number) => {
    if (!content || !confirm("Êtes-vous sûr de vouloir supprimer ce paragraphe ?")) return;
    const newParagraphs = content[selectedSection].paragraphs[selectedLanguage].filter((_, i) => i !== index);
    const newContent = {
      ...content,
      [selectedSection]: {
        ...content[selectedSection],
        paragraphs: {
          ...content[selectedSection].paragraphs,
          [selectedLanguage]: newParagraphs,
        },
      },
    };
    setContent(newContent);
    await db.saveSiteContent(newContent);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!content) return;
    const paragraphs = [...content[selectedSection].paragraphs[selectedLanguage]];
    if (direction === "up" && index > 0) {
      [paragraphs[index - 1], paragraphs[index]] = [paragraphs[index], paragraphs[index - 1]];
    } else if (direction === "down" && index < paragraphs.length - 1) {
      [paragraphs[index], paragraphs[index + 1]] = [paragraphs[index + 1], paragraphs[index]];
    } else {
      return;
    }
    const newContent = {
      ...content,
      [selectedSection]: {
        ...content[selectedSection],
        paragraphs: {
          ...content[selectedSection].paragraphs,
          [selectedLanguage]: paragraphs,
        },
      },
    };
    setContent(newContent);
    await db.saveSiteContent(newContent);
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : (
        <React.Fragment>
      {/* Language Selector for Editing */}
      <div className="bg-green/5 p-4 rounded-xl border border-green/20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="text-green w-5 h-5" />
            <span className="font-semibold text-gray-700">Langue à modifier :</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage("fr")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedLanguage === "fr"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Français
            </button>
            <button
              onClick={() => setSelectedLanguage("ar")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedLanguage === "ar"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Arabe
            </button>
          </div>
        </div>
      </div>

      {/* Section Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSection(sec.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              selectedSection === sec.id
                ? "bg-green text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {sec.name}
          </button>
        ))}
      </div>

      {/* Add Paragraph Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">
          Ajouter un paragraphe ({selectedLanguage === "fr" ? "Français" : "Arabe"})
        </h3>
        <textarea
          value={newParagraph}
          onChange={(e) => setNewParagraph(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green outline-none min-h-[100px] mb-4"
          placeholder={`Ajouter un paragraphe en ${selectedLanguage === "fr" ? "français" : "arabe"}...`}
          dir={selectedLanguage === "ar" ? "rtl" : "ltr"}
        />
        <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {/* Existing Paragraphs */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">
          Paragraphes existants ({currentParagraphs.length}) - {selectedLanguage === "fr" ? "Français" : "Arabe"}
        </h3>
        {currentParagraphs.length === 0 && (
          <p className="text-gray-500 italic">Aucun paragraphe pour cette section dans cette langue.</p>
        )}
        
        {currentParagraphs.map((para, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
            {editingIndex === idx ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-3 border border-green rounded-lg focus:ring-2 focus:ring-mint outline-none min-h-[100px]"
                  dir={selectedLanguage === "ar" ? "rtl" : "ltr"}
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(idx)} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1">
                    <Save size={16} /> Sauvegarder
                  </button>
                  <button onClick={() => setEditingIndex(null)} className="btn-secondary py-1.5 px-3 text-sm bg-white">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
               <div className="flex justify-between items-start gap-4">
                <p className="text-gray-700" dir={selectedLanguage === "ar" ? "rtl" : "ltr"}>{para}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => handleMove(idx, "up")} 
                    disabled={idx === 0}
                    className="p-1.5 text-gray-500 hover:text-green hover:bg-green/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => handleMove(idx, "down")} 
                    disabled={idx === currentParagraphs.length - 1}
                    className="p-1.5 text-gray-500 hover:text-green hover:bg-green/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button 
                    onClick={() => handleStartEdit(idx)}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded mx-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-green/5 p-4 rounded-xl border border-green/20">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="text-green w-5 h-5" />
            <span className="font-semibold text-gray-700">Prévisualisation :</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewLanguage("fr")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                previewLanguage === "fr"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              onClick={() => setPreviewLanguage("ar")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                previewLanguage === "ar"
                  ? "bg-green text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              🇸🇦 Arabe
            </button>
          </div>
        </div>
        
        <div 
          className="bg-white p-6 rounded-xl border border-gray-200"
          dir={previewLanguage === "ar" ? "rtl" : "ltr"}
        >
          <h4 className="font-bold text-lg mb-4">{sections.find(s => s.id === selectedSection)?.name}</h4>
          <div className="space-y-4">
            {content && content[selectedSection]?.paragraphs?.[previewLanguage]?.length === 0 ? (
              <p className="text-gray-500 italic">Aucun paragraphe.</p>
            ) : content && (
              content[selectedSection].paragraphs[previewLanguage].map((para: string, idx: number) => (
                <p key={idx} className="text-gray-700" dir={previewLanguage === "ar" ? "rtl" : "ltr"}>
                  {para}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
        </React.Fragment>
      )}
    </div>
  );
}