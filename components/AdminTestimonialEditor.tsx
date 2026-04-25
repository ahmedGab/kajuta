"use client";

import React, { useState } from "react";
import { getTestimonials, saveTestimonials } from "@/lib/storage";
import { Testimonial } from "@/lib/types";
import { Plus, Trash2, Save, X, Edit2, Star } from "lucide-react";

export default function AdminTestimonialEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getTestimonials());
  const [editingT, setEditingT] = useState<Testimonial | null>(null);

  const syncAndSave = (newData: Testimonial[]) => {
    setTestimonials(newData);
    saveTestimonials(newData);
  };

  const handleAdd = () => {
    setEditingT({ id: `t-${Date.now()}`, firstName: "", city: "", rating: 5, comment: "" });
  };

  const handleSave = () => {
    if (!editingT || !editingT.firstName.trim()) return;
    
    const existingIndex = testimonials.findIndex(t => t.id === editingT.id);
    let newTs;
    
    if (existingIndex >= 0) {
      newTs = [...testimonials];
      newTs[existingIndex] = editingT;
    } else {
      newTs = [...testimonials, editingT];
    }
    
    syncAndSave(newTs);
    setEditingT(null);
  };

  return (
    <div className="space-y-6">
      {editingT ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">Éditer l&apos;avis</h3>
            <button onClick={() => setEditingT(null)}><X /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Prénom</label>
              <input type="text" className="w-full p-2 border rounded" value={editingT.firstName} onChange={(e) => setEditingT({...editingT, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Ville</label>
              <input type="text" className="w-full p-2 border rounded" value={editingT.city} onChange={(e) => setEditingT({...editingT, city: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Note (1-5)</label>
              <input type="number" min="1" max="5" className="w-full p-2 border rounded" value={editingT.rating} onChange={(e) => setEditingT({...editingT, rating: Number(e.target.value)})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Commentaire</label>
              <textarea className="w-full p-2 border rounded h-24" value={editingT.comment} onChange={(e) => setEditingT({...editingT, comment: e.target.value})} />
            </div>
            <div className="col-span-2 mt-2">
              <button onClick={handleSave} className="btn-primary py-2 px-4 flex items-center gap-2"><Save size={16}/> Sauvegarder</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2 mb-6">
            <Plus size={16} /> Ajouter un avis
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-honey mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < t.rating ? "fill-honey" : "text-gray-300"}/>)}
                    </div>
                    <p className="text-gray-800 text-sm italic mb-2">&quot;{t.comment}&quot;</p>
                    <h4 className="font-bold text-sm block">{t.firstName} - {t.city}</h4>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button onClick={() => setEditingT(t)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                    <button onClick={() => syncAndSave(testimonials.filter(x => x.id !== t.id))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
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
