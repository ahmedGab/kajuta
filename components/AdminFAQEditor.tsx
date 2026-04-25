"use client";

import React, { useState } from "react";
import { getFAQ, saveFAQ } from "@/lib/storage";
import { FAQItem } from "@/lib/types";
import { Plus, Trash2, Save, X, Edit2 } from "lucide-react";

export default function AdminFAQEditor() {
  const [faqs, setFaqs] = useState<FAQItem[]>(getFAQ());
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);

  const syncAndSave = (newFaqs: FAQItem[]) => {
    setFaqs(newFaqs);
    saveFAQ(newFaqs);
  };

  const handleAdd = () => {
    setEditingFAQ({ id: `faq-${Date.now()}`, question: "", answer: "" });
  };

  const handleSave = () => {
    if (!editingFAQ || !editingFAQ.question.trim()) return;
    
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

  return (
    <div className="space-y-6">
      {editingFAQ ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">Éditer question</h3>
            <button onClick={() => setEditingFAQ(null)}><X /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Question</label>
              <input type="text" className="w-full p-2 border rounded" value={editingFAQ.question} onChange={(e) => setEditingFAQ({...editingFAQ, question: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Réponse</label>
              <textarea className="w-full p-2 border rounded h-24" value={editingFAQ.answer} onChange={(e) => setEditingFAQ({...editingFAQ, answer: e.target.value})} />
            </div>
            <button onClick={handleSave} className="btn-primary py-2 px-4 flex items-center gap-2"><Save size={16}/> Sauvegarder</button>
          </div>
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
                    <h4 className="font-bold mb-1 block">{faq.question}</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{faq.answer}</p>
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
    </div>
  );
}
