"use client";

import React, { useState } from "react";
import { getSiteContent, saveSiteContent } from "@/lib/storage";
import { BilingualPack } from "@/lib/types";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function AdminPacksEditor() {
  const content = getSiteContent();
  const [packs, setPacks] = useState<BilingualPack[]>(content.packs.items);
  const [editingPack, setEditingPack] = useState<BilingualPack | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSave = () => {
    const newContent = { ...content };
    newContent.packs.items = packs;
    saveSiteContent(newContent);
    showNotification("Packs sauvegardés avec succès !");
    setEditingPack(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingPack({
      id: `pack-${Date.now()}`,
      nameFr: "",
      nameAr: "",
      descriptionFr: "",
      descriptionAr: "",
      price: 0,
      products: [],
    });
    setIsAdding(true);
  };

  const handleEdit = (pack: BilingualPack) => {
    setEditingPack({ ...pack });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce pack ?")) {
      const newPacks = packs.filter(p => p.id !== id);
      setPacks(newPacks);
      const newContent = { ...content };
      newContent.packs.items = newPacks;
      saveSiteContent(newContent);
      showNotification("Pack supprimé !");
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-green/10 text-green px-4 py-3 rounded-lg border border-green/20 font-medium">
          {notification}
        </div>
      )}

      {editingPack ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">{isAdding ? "Ajouter un Pack" : "Modifier le Pack"}</h3>
            <button onClick={() => { setEditingPack(null); setIsAdding(false); }} className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h4 className="font-semibold text-sm text-green mb-3">Français</h4>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Nom (FR)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingPack.nameFr} onChange={(e) => setEditingPack({ ...editingPack, nameFr: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Prix (TND)</label>
              <input type="number" className="w-full p-2 border rounded" value={editingPack.price} onChange={(e) => setEditingPack({ ...editingPack, price: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description (FR)</label>
              <textarea className="w-full p-2 border rounded h-20" value={editingPack.descriptionFr} onChange={(e) => setEditingPack({ ...editingPack, descriptionFr: e.target.value })} />
            </div>

            <div className="md:col-span-2 mt-4">
              <h4 className="font-semibold text-sm text-green mb-3">العربية</h4>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Nom (AR)</label>
              <input type="text" className="w-full p-2 border rounded" value={editingPack.nameAr} onChange={(e) => setEditingPack({ ...editingPack, nameAr: e.target.value })} dir="rtl" />
            </div>
            <div></div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description (AR)</label>
              <textarea className="w-full p-2 border rounded h-20" value={editingPack.descriptionAr} onChange={(e) => setEditingPack({ ...editingPack, descriptionAr: e.target.value })} dir="rtl" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => { setEditingPack(null); setIsAdding(false); }} className="btn-secondary py-2 px-4">Annuler</button>
            <button onClick={handleSave} className="btn-primary py-2 px-4 flex items-center gap-2">
              <Save size={18} /> Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Packs & Offres ({packs.length})</h3>
            <button onClick={handleAdd} className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2 text-sm">
              <Plus size={16} /> Ajouter Pack
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packs.map(pack => (
              <div key={pack.id} className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-green">{pack.nameFr}</h4>
                    <p className="text-sm text-gray-500" dir="rtl">{pack.nameAr}</p>
                  </div>
                  <span className="text-caramel font-bold">{pack.price} TND</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{pack.descriptionFr}</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleEdit(pack)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(pack.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}