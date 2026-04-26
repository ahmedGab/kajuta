"use client";

import React, { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { FAQItem, Language } from "@/lib/types";
import { Plus, Trash2, Save, X, Edit2 } from "lucide-react";

export default function AdminFAQEditor() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>("fr");

  useEffect(() => {
    db.getFAQ().then((data) => {
      setFaqs(data);
      setLoading(false);
    });
  }, []);

  const syncAndSave = async (newFaqs: FAQItem[]) => {
    setFaqs(newFaqs);
    await db.saveFAQ(newFaqs);
  };

  const handleAdd = () => {
    setEditingFAQ({ id: `faq-${Date.now()}`, questionFr: "", questionAr: "", answerFr: "", answerAr: "" });
  };

  const handleSave = () => {
    if (!editingFAQ) return;
    if ((selectedLang === "fr" && !editingFAQ.questionFr.trim()) || (selectedLang === "ar" && !editingFAQ.questionAr.trim())) {
      return;
    }
    
    const existingIndex = faqs.findIndex(f => f.id === editingFAQ.id);
    let newFaqs;
    
    if (existingIndex >= 0) {
      newFaqs = [...faqs];
      newFaqs[existingIndex] = editingFAQ;
    } else {
      newFaqs = [...faqs, editingFAQ];
    }
    
    syncAndSave(newFaqs);
    setEditingFAQ(null);
  };

  const getQuestion = (faq: FAQItem) => selectedLang === "ar" ? faq.questionAr : faq.questionFr;
  const getAnswer = (faq: FAQItem) => selectedLang === "ar" ? faq.answerAr : faq.answerFr;

return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : (
        <>
          <div className="bg-green/5 p-4 rounded-xl border border-green/20">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Langue d&apos;affichage :</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLang("fr")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedLang === "fr"
                      ? "bg-green text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => setSelectedLang("ar")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedLang === "ar"
                      ? "bg-green text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>

          {editingFAQ ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold">Éditer question FAQ</h3>
                <button onClick={() => setEditingFAQ(null)}><X /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green">Français</label>
                  <input type="text" className="w-full p-2 border rounded mb-2" value={editingFAQ.questionFr} onChange={(e) => setEditingFAQ({...editingFAQ, questionFr: e.target.value})} placeholder="Question (FR)" />
                  <textarea className="w-full p-2 border rounded h-20" value={editingFAQ.answerFr} onChange={(e) => setEditingFAQ({...editingFAQ, answerFr: e.target.value})} placeholder="Réponse (FR)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green">العربية</label>
                  <input type="text" className="w-full p-2 border rounded mb-2" value={editingFAQ.questionAr} onChange={(e) => setEditingFAQ({...editingFAQ, questionAr: e.target.value})} placeholder="السؤال (AR)" dir="rtl" />
                  <textarea className="w-full p-2 border rounded h-20" value={editingFAQ.answerAr} onChange={(e) => setEditingFAQ({...editingFAQ, answerAr: e.target.value})} placeholder="الجواب (AR)" dir="rtl" />
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary py-2 px-4 flex items-center gap-2 mt-4">
                <Save size={16}/> Sauvegarder
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2 mb-6">
                <Plus size={16} /> Ajouter une question FAQ
              </button>
              <div className="space-y-4">
                {faqs.map(faq => (
                  <div key={faq.id} className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold mb-1 block" dir={selectedLang === "ar" ? "rtl" : "ltr"}>{getQuestion(faq)}</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap" dir={selectedLang === "ar" ? "rtl" : "ltr"}>{getAnswer(faq)}</p>
                      </div>
                      <div className="flex shrink-0">
                        <button onClick={() => setEditingFAQ(faq)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                        <button onClick={() => syncAndSave(faqs.filter(f => f.id !== faq.id))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}